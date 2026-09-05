"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { canUseFal, getStoredMember, isSignedInMember } from "@/lib/membership";

export function FalAccessGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/fal/premium") {
      return;
    }

    const member = getStoredMember();

    if (!isSignedInMember(member)) {
      router.replace("/giris");
      return;
    }

    if (!canUseFal(member)) {
      router.replace("/fal/premium");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
