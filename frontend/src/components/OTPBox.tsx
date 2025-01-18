import React, { useRef } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  className = "",
}) => {
  const otp = value.split(""); // Split the value into an array of individual digits
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Refs for the input fields

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const digit = e.target.value;

    if (/[^0-9]/.test(digit)) return; // Allow only numeric input

    // Update the OTP value
    const newOtp = [...otp];
    newOtp[index] = digit;
    onChange(newOtp.join("")); // Pass the new OTP value to onChange

    // Focus the next input after entering a digit
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className={`flex pb-3 pt-5 space-x-2 justify-center ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)} // Assign refs to inputs
          id={`otp-input-${index}`}
          type="text"
          value={otp[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          maxLength={1}
          className="w-12 h-12 text-center text-2xl border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      ))}
    </div>
  );
};

export default OTPInput;
