"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isTokenValid, getToken } from "../utils/token";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!isTokenValid(token)) {
      router.push("/auth/login");
    }
  }, [router]);

  return <>{children}</>;
}
