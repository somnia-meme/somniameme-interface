import { motion } from "framer-motion";
import { useState } from "react";
import { ChartComponent } from "./chart-component";

export function TokenBody({ token }: { token: Token }) {
  const [interval, setInterval] = useState("1m");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-lg font-bold text-white">Price Chart</h2>
        <div className="flex gap-2">
          {["1m", "5m", "15m", "1h", "4h", "1d"].map((intervalOption) => (
            <button
              key={intervalOption}
              onClick={() => setInterval(intervalOption)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                interval === intervalOption
                  ? "bg-[var(--primary-dark)] text-white"
                  : "bg-[var(--primary)]/10 text-[var(--primary-lighter)] hover:bg-[var(--primary)]/20"
              }`}
            >
              {intervalOption}
            </button>
          ))}
        </div>
      </div>
      <ChartComponent interval={interval} address={token.token_address} />
    </motion.div>
  );
}
