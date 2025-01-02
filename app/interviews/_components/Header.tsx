"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UserAvatar from "@/components/UserAvatar";
import { Icons } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
  },
};

const Header = () => {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting("Good Morning");
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error("Error signing out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0"
    >
      <div className="flex items-center space-x-4">
        <UserAvatar avatar={session?.user?.image} sizes="size-12 sm:size-14" />
        <div className="space-y-0.5 sm:space-y-0">
          <h1 className="font-playfair text-2xl font-bold leading-tight text-gray-800 sm:text-3xl md:text-4xl">
            {greeting},
          </h1>
          <p className="font-playfair text-lg font-bold leading-tight text-gray-600 sm:text-xl">
            {session?.user?.name}
          </p>
        </div>
      </div>
      <motion.div
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="w-full sm:w-auto"
      >
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full border border-gray-300 text-black transition duration-300  hover:bg-gray-100 sm:w-auto"
        >
          {isLoading ? (
            <Spinner className="mr-2 size-4" />
          ) : (
            <Icons.logout className="mr-2 size-4" />
          )}
          {isLoading ? "Signing out..." : "Logout"}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Header;
