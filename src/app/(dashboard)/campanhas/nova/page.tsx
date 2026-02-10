"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NovaCampanhaRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/campanhas"); }, [router]);
  return null;
}