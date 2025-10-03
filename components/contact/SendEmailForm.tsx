"use client";

import { useRef, useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { motion } from "framer-motion";

import InputField from "./InputField";
import StatusMessage from "./StatusMessage";

interface Props {
  setMailStatus: (status: "success" | "error" | null) => void;
  setHasErrors: (value: boolean) => void;
}

interface FieldError {
  name: string;
  message: string;
}

export default function SendEmailForm({ setMailStatus, setHasErrors }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [localStatus, setLocalStatus] = useState<"success" | "error" | null>(null);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const getError = (name: string) => errors.find((err) => err.name === name)?.message;

  const handleInputChange = (name: string) => {
    setErrors((prev) => prev.filter((err) => err.name !== name));
    setHasErrors(false);
  };

  const validateForm = () => {
    if (!formRef.current) return false;
    const newErrors: FieldError[] = [];

    const { from_name, from_email, subject, message } = formRef.current;

    if (!from_name.value.trim()) newErrors.push({ name: "from_name", message: "Please enter your name." });
    if (!from_email.value.trim()) newErrors.push({ name: "from_email", message: "Please enter your email address." });
    else if (!from_email.value.includes("@")) newErrors.push({ name: "from_email", message: "Enter a valid email" });
    if (!subject.value.trim()) newErrors.push({ name: "subject", message: "Please provide a subject." });
    if (!message.value.trim()) newErrors.push({ name: "message", message: "Please write your message." });

    setErrors(newErrors);
    setHasErrors(newErrors.length > 0);

    return newErrors.length === 0;
  };

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm() || !formRef.current) return;

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      .then(
        () => {
          setLocalStatus("success");
          setMailStatus("success");
          formRef.current?.reset();
          setErrors([]);
          setHasErrors(false);
        },
        () => {
          setLocalStatus("error");
          setMailStatus("error");
        }
      );
  };

  useEffect(() => {
    if (localStatus) {
      const timer = setTimeout(() => setLocalStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [localStatus]);

  return (
    <form ref={formRef} onSubmit={sendEmail} className="space-y-6 relative" noValidate>
      <StatusMessage status={localStatus} />

      <motion.div animate={{ y: localStatus ? 20 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField name="from_name" placeholder="Your Name" error={getError("from_name")} onChange={() => handleInputChange("from_name")} />
          <InputField name="from_email" type="email" placeholder="Your Email" error={getError("from_email")} onChange={() => handleInputChange("from_email")} />
        </div>

        <InputField name="subject" placeholder="Subject" error={getError("subject")} onChange={() => handleInputChange("subject")} />
        <InputField name="message" type="textarea" placeholder="Your Message" error={getError("message")} onChange={() => handleInputChange("message")} />

        <button type="submit" className="w-full md:w-auto px-8 py-3 rounded-full bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition self-center md:self-start">
          Send Message
        </button>
      </motion.div>
    </form>
  );
}
