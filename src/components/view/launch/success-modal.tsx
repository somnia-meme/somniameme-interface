import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SCAN_URL } from "@/lib/config";
import { formatAddress } from "@/lib/utils/format-address";

interface SuccessModalProps {
  isOpen: boolean;
  tokenAddress: string;
  transactionHash: string;
  blockNumber: string;
  onClose: () => void;
}

export const SuccessModal: FC<SuccessModalProps> = ({
  isOpen,
  tokenAddress,
  transactionHash,
  blockNumber,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity"
              onClick={onClose}
            >
              <div className="absolute inset-0 bg-black opacity-75" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-transparent backdrop-blur-lg rounded-2xl border border-indigo-500/20 overflow-hidden shadow-2xl transform transition-all w-full max-w-lg p-6 text-left"
              style={{ background: "var(--surface-dark)" }}
            >
              <div>
                <div className="flex justify-center">
                  <div className="relative mx-auto flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse"></div>
                    <div className="relative rounded-full bg-indigo-900/50 flex items-center justify-center h-16 w-16">
                      <span className="text-4xl">🚀</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-2xl font-bold text-white">
                    Token Created Successfully!
                  </h3>
                  <div className="mt-4">
                    <p className="text-indigo-300 mb-3">
                      Your cosmic token has been launched into the Somnia
                      universe!
                    </p>

                    <div className="bg-indigo-900/40 rounded-xl p-4 border border-indigo-500/20 text-left">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-indigo-300 mb-1">
                            Token Address
                          </p>
                          <p className="font-mono text-white flex items-center text-sm truncate">
                            {formatAddress(tokenAddress)}
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(tokenAddress)
                              }
                              className="ml-2 text-indigo-400 hover:text-indigo-300"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-indigo-300 mb-1">
                            Transaction Hash
                          </p>
                          <p className="font-mono text-white flex items-center text-sm truncate">
                            {transactionHash}
                            <a
                              href={`${SCAN_URL}/tx/${transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-indigo-400 hover:text-indigo-300"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-indigo-300 mb-1">
                            Block Number
                          </p>
                          <p className="font-mono text-white text-sm">
                            {blockNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <a
                  href={`/exchange/${tokenAddress}`}
                  className="flex-1 inline-flex justify-center py-3 px-4 border border-transparent shadow-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  View Token Page
                </a>
                <button
                  type="button"
                  className="flex-1 py-3 px-4 border border-indigo-500/30 shadow-sm font-medium rounded-lg text-indigo-300 bg-indigo-900/30 hover:bg-indigo-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
