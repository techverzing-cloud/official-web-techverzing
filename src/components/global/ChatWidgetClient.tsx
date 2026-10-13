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

const techverzingTheme = {
  primary: "#FF8C42",
  primaryHover: "#e67e3a",
  background: "#202223",
  surface: "#1e1e1f",
  surfaceHover: "#3a3a2e",
  text: "#e8e6d9",
  textSecondary: "#e8e6d9b3",
  border: "#3a3a2e",
  userBubble: "#FF8C42",
  userBubbleText: "#141415",
  assistantBubble: "#1e1e1f",
  assistantBubbleText: "#e8e6d9",
  error: "#FF8C42",
  errorBg: "#3a3a2e",
};

export default function ChatWidgetClient({ apiUrl }: ChatWidgetClientProps) {
  return (
    <ChatWidget
      apiUrl={apiUrl}
      lang="en"
      position="bottom-right"
      title="Techverzing Assistant"
      greeting="Hi! How can I help you?"
      theme={techverzingTheme}
      zIndex={9999}
      width="380px"
      height="500px"
      className="techverzing-chat-widget"
    />
  );
}