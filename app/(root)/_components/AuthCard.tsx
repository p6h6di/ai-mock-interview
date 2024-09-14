"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Checkbox from "./Checkbox";
import GoogleButton from "./GoogleButton";

const AuthenticationCard = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  return (
    <>
      <div className="absolute inset-0 -skew-y-6 bg-gradient-to-r from-purple-400 to-orange-500 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl" />
      <div className="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
        <div className="mx-auto max-w-md">
          <div className="space-y-2.5 text-center">
            <h1 className="font-playfair text-3xl font-bold  text-gray-800 sm:text-4xl">
              Join AI Mock Interview
            </h1>
            <p className="text-base font-normal text-gray-400">
              Prepare for your next interview with our AI-powered mock interview
            </p>
          </div>
          <div className="my-8 w-full space-y-4">
            <motion.div
              whileHover={isChecked ? { scale: 1.02 } : {}}
              whileTap={isChecked ? { scale: 0.98 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <GoogleButton isChecked={isChecked} />
            </motion.div>
            <div className="flex items-start space-x-3 leading-none">
              <Checkbox
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <p className="text-sm leading-5 text-gray-700">
                By signing in, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthenticationCard;
