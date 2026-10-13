"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ChatWidgetClient from "./ChatWidgetClient";

interface ChatWidgetPortalProps {
  apiUrl: string;
}

export default function ChatWidgetPortal({ apiUrl }: ChatWidgetPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const el = document.getElementById("chat-widget-portal");
    if (el) {
      setContainer(el);
    } else {
      const newEl = document.createElement("div");
      newEl.id = "chat-widget-portal";
      document.body.appendChild(newEl);
      setContainer(newEl);
      return () => {
        if (document.body.contains(newEl)) {
          document.body.removeChild(newEl);
        }
      };
    }
  }, []);

  if (!mounted || !container) return null;

  return createPortal(<ChatWidgetClient apiUrl={apiUrl} />, container);
}