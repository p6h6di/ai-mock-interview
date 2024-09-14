"use client";

import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { InterviewProps } from "@/validator/interview.schema";

interface FormInputProps {
  id: keyof InterviewProps;
  label: string;
  type?: string;
  register: UseFormRegister<InterviewProps>;
  errors?: FieldError;
}

const FormInput = ({
  id,
  label,
  register,
  errors,
  type = "text",
}: FormInputProps) => {
  const baseInputClassName =
    "peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:border-purple-600 focus:outline-none";

  const numberInputClassName =
    type === "number"
      ? "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
      : "";

  const inputClassName = `${baseInputClassName} ${numberInputClassName}`;

  const labelClassName =
    "absolute left-0 -top-3.5 text-sm sm:text-base text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-purple-600";

  return (
    <div className="relative mt-6">
      <input
        type={type}
        id={id}
        {...register(id, type === "number" ? { valueAsNumber: true } : {})}
        className={inputClassName}
        placeholder=" "
        autoComplete="off"
      />
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      {errors && errors.message && (
        <p className="mt-1.5 flex items-center space-x-2 text-sm text-red-500">
          <span>{errors.message === "Required" ? "" : errors.message}</span>
        </p>
      )}
    </div>
  );
};

export default FormInput;
