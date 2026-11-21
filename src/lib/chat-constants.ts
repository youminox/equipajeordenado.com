export const CHAT_ENDPOINT =
  "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/equipajeordenado-chat";

export const OPEN_CHAT_EVENT = "equipajeordenado:open-chat";

export function openEquipajeChat(prompt?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(OPEN_CHAT_EVENT, { detail: prompt ? { prompt } : undefined })
    );
  }
}
