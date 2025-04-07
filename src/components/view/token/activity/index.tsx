import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { motion } from "framer-motion";
import { memo } from "react";
import { TokenComments } from "./token-comments";
import { TokenTransactions } from "./token-transactions";

export const TokenActivityTabs = memo(({ token }: { token: Token }) => {
  const [tab, setTab] = useState("comments");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div
        className="rounded-lg backdrop-blur-md overflow-hidden border border-[var(--primary)]/20"
        style={{ background: "var(--surface)" }}
      >
        <div className="flex border-b border-[var(--primary)]/20">
          <button
            onClick={() => setTab("comments")}
            className={`flex-1 py-4 font-medium transition-colors relative text-sm ${
              tab === "comments"
                ? "text-white"
                : "text-[var(--primary-lighter)] hover:text-white"
            }`}
          >
            Comments
            {tab === "comments" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
              />
            )}
          </button>
          <button
            onClick={() => setTab("trades")}
            className={`flex-1 py-4 font-medium transition-colors relative text-sm ${
              tab === "trades"
                ? "text-white"
                : "text-[var(--primary-lighter)] hover:text-white"
            }`}
          >
            Trades
            {tab === "trades" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
              />
            )}
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tab === "comments" ? (
                <TokenComments token={token} />
              ) : (
                <TokenTransactions token={token} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});
