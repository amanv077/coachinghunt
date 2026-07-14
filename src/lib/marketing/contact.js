/**
 * Public contact channels for trust / support CTAs.
 * Override WhatsApp with NEXT_PUBLIC_WHATSAPP_NUMBER (digits only, with country code).
 */
export const CONTACT = {
  email: "support@coachinghunt.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
  whatsappMessage: "Hi CoachingHunt, I have a question about finding / listing a coaching.",
};

export function getWhatsAppHref() {
  const text = encodeURIComponent(CONTACT.whatsappMessage);
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${text}`;
}
