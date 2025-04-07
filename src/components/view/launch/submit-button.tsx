import { FC } from "react";
import { motion } from "framer-motion";

interface SubmitButtonProps {
  isLoading: boolean;
}

export const SubmitButton: FC<SubmitButtonProps> = ({ isLoading }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={isLoading}
      className={`w-full py-4 rounded-xl font-bold relative overflow-hidden 
        bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl
        ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/40 to-purple-600/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Creating Token...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Launch Your Cosmic Token
          </>
        )}
      </div>
    </motion.button>
  );
}; 