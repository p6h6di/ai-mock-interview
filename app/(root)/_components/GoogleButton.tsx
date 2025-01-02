"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icons } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";
import { signIn } from "next-auth/react";

const GoogleButton = ({ isChecked }: { isChecked: boolean }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn("google", { callbackUrl: "/interviews" });
      if (result?.error) {
        toast.error("Failed to sign in with Google.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      variant="outline"
      size="lg"
      className="w-full space-x-2.5 leading-none text-black"
      disabled={!isChecked}
    >
      {isLoading ? (
        <Spinner className="size-4" />
      ) : (
        <Icons.google className="size-4" />
      )}
      <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
    </Button>
  );
};

export default GoogleButton;
