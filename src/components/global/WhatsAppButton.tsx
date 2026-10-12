import { Icon } from "@iconify/react";

const WHATSAPP_NUMBER = "917309367692";
const MESSAGE = "Hi! I'd like to know more about your services. Could you help me with that?";
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      data-cursor-hover
      className="group fixed bottom-20 right-4.5 z-50 inline-flex items-center gap-0 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-all duration-300 hover:gap-2 hover:pr-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      <Icon icon="mdi:whatsapp" width={26} height={26} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap font-nunito text-sm font-semibold leading-none opacity-0 transition-all duration-300 group-hover:max-w-[9rem] group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}