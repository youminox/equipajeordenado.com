"use client";

import { openEquipajeChat } from "@/lib/chat-constants";

export default function OpenChatButton({
  label = "Consultar al Asesor IA 💬",
  prompt,
  className = "btn btn-buy",
}: {
  label?: string;
  prompt?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openEquipajeChat(prompt)}
      className={`cursor-pointer ${className}`}
      data-magnetic
    >
      {label}
    </button>
  );
}
