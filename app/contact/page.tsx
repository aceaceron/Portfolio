"use client";

import ContactHeader from "../../components/contact/ContactHeader";
import ContactGrid from "../../components/contact/ContactGrid";
import SendMessageSection from "../../components/contact/SendMessageSection";
import { mainContacts, specialContacts } from "../../components/contact/ContactData";

export default function ContactPage() {
  return (
    <div className="md:ml-64 px-8">
      <div className="max-w-7xl mx-auto">
        <ContactHeader />
        <ContactGrid contacts={mainContacts} />
        <ContactGrid contacts={specialContacts} colsClass="grid-cols-1 md:grid-cols-2" />
        <hr className="border-[#FFD700] mb-8 mx-auto md:mx-0" />
        <SendMessageSection />
      </div>
    </div>
  );
}