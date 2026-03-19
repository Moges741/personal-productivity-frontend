"use client";

import { Button } from "@/components/ui/button";

export function GoogleAuthButton() {
  const handleGoogle = () => {
    // Backend-driven OAuth recommended:
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <Button type="button" variant="outline" className="w-full rounded-xl" onClick={handleGoogle}>
      Continue with Google
    </Button>
  );
}