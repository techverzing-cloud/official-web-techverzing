"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(
  () => import("@joseantonionuevo/ai-chat-widget").then((mod) => mod.ChatWidget),
  {
    ssr: false,
    loading: () => null,
  }
);

interface ChatWidgetClientProps {
  apiUrl: string;
}

export default function ChatWidgetClient({ apiUrl }: ChatWidgetClientProps) {
  return (
    <ChatWidget
      apiUrl={apiUrl}
      lang="en"
      position="bottom-right"
      title="Techverzing Assistant"
      greeting="Hi! How can I help you?"
      theme="midnight"
      zIndex={40}
      width="380px"
      height="500px"
    />
  );
}