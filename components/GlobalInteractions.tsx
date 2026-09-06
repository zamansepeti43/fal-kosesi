"use client";

import { useEffect } from "react";

export default function GlobalInteractions() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const notificationButton = target?.closest<HTMLElement>('[aria-label="Bildirimler"]');
      if (notificationButton) {
        event.preventDefault();
        window.location.href = "/bildirimler";
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
