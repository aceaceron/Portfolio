"use client";

import ContactCard from "./ContactCard";
import { ContactItem } from "./ContactData";

export default function ContactGrid({
  contacts,
  colsClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
}: {
  contacts: ContactItem[];
  colsClass?: string;
}) {
  return (
    <div className={`grid ${colsClass} gap-8 mb-8`}>
      {contacts.map((contact) => (
        <ContactCard key={contact.name} contact={contact} />
      ))}
    </div>
  );
}
