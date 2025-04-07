import { FC, RefObject } from 'react';
import { motion } from 'framer-motion';
import { TokenFormData } from '@/hooks/useTokenCreationForm';

interface TokenInfoFormProps {
  formData: TokenFormData;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nameRef: RefObject<HTMLInputElement>;
  tickerRef: RefObject<HTMLInputElement>;
  descriptionRef: RefObject<HTMLTextAreaElement>;
}

export const TokenInfoForm: FC<TokenInfoFormProps> = ({
  formData,
  errors,
  handleChange,
  nameRef,
  tickerRef,
  descriptionRef
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 backdrop-blur-md rounded-2xl border border-indigo-500/20 p-6"
      style={{ background: "var(--surface)" }}
    >
      <h2 className="text-xl font-semibold text-white flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Basic Information
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-indigo-300 mb-2">
            Token Name*
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            ref={nameRef}
            className={`w-full px-4 py-3 bg-indigo-900/30 border ${
              errors.name ? "border-pink-500" : "border-indigo-500/30"
            } rounded-lg text-white placeholder-indigo-300/50 focus:border-indigo-500 
            focus:ring-2 focus:ring-indigo-500/20 transition duration-200`}
            placeholder="e.g. Cosmic Token"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-pink-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-300 mb-2">
            Token Symbol*
          </label>
          <input
            type="text"
            name="ticker"
            value={formData.ticker}
            onChange={handleChange}
            ref={tickerRef}
            className={`w-full px-4 py-3 bg-indigo-900/30 border ${
              errors.ticker ? "border-pink-500" : "border-indigo-500/30"
            } rounded-lg text-white placeholder-indigo-300/50 focus:border-indigo-500 
            focus:ring-2 focus:ring-indigo-500/20 transition duration-200`}
            placeholder="e.g. CSM"
          />
          {errors.ticker && (
            <p className="mt-1 text-sm text-pink-500">{errors.ticker}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-300 mb-2">
            Description*
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            ref={descriptionRef}
            rows={4}
            className={`w-full px-4 py-3 bg-indigo-900/30 border ${
              errors.description
                ? "border-pink-500"
                : "border-indigo-500/30"
            } rounded-lg text-white placeholder-indigo-300/50 focus:border-indigo-500 
            focus:ring-2 focus:ring-indigo-500/20 transition duration-200`}
            placeholder="Enter a description of your token project"
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-pink-500">
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-300 mb-2">
            Initial Buy Amount (STT)
          </label>
          <input
            type="text"
            name="initialBuyAmount"
            value={formData.initialBuyAmount}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-indigo-900/30 border border-indigo-500/30
            rounded-lg text-white placeholder-indigo-300/50 focus:border-indigo-500 
            focus:ring-2 focus:ring-indigo-500/20 transition duration-200`}
            placeholder="0.001"
          />
          <p className="mt-1 text-xs text-indigo-300">
            This amount will be added on top of the launch fee. Default:
            0.0001 STT
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-indigo-900/40 border border-indigo-500/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg
            className="h-6 w-6 text-indigo-400 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-indigo-400">
              Important Note
            </h4>
            <p className="mt-1 text-sm text-indigo-300">
              These settings will determine the initial trading parameters
              for your token. Make sure to set appropriate limits to
              prevent price manipulation and ensure fair distribution.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 