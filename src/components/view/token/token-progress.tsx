import { useMemo } from "react";
import { motion } from "framer-motion";

const getStatusInfo = (progress: number) => {
  if (progress >= 100) return { text: "Complete" };
  if (progress >= 75) return { text: "Almost There" };
  if (progress >= 50) return { text: "Halfway" };
  if (progress >= 25) return { text: "Growing" };
  return { text: "Just Started" };
};

export function TokenProgress({ token }: { token: Token }) {
  const {
    is_migrated,
    token0_reserve: totalRaised,
    migration_progress,
  } = token;

  const targetAmount = 10;

  const progress = useMemo(() => {
    if (is_migrated) return 100;
    return migration_progress;
  }, [is_migrated, migration_progress]);

  const { text } = getStatusInfo(progress);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md rounded-lg border border-[var(--primary)]/20 overflow-hidden relative"
      style={{ background: "var(--surface)" }}
    >
      <div className="p-5 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-white">Progress</span>

          <div className="px-2 py-0.5 bg-[var(--primary)]/20 rounded-full text-xs text-[var(--primary-lighter)]">
            {text}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-[var(--primary-lighter)]">
            Migration Progress:{" "}
            <span className="text-white font-medium">
              {progress.toLocaleString()}%
            </span>
          </span>
          <span className="text-[var(--primary-lighter)]">
            <span className="font-medium text-white">
              {totalRaised.toLocaleString()}
            </span>{" "}
            / {targetAmount.toLocaleString()} STT
          </span>
        </div>

        {/* Progress tracker */}
        <div className="w-full h-4 bg-[var(--primary-darker)]/30 rounded-full overflow-hidden p-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full relative overflow-hidden"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--secondary)]"></div>

            {/* Shimmering effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>

        {/* Journey tracker */}
        <div className="mt-4 flex justify-between relative">
          <div className="absolute top-3 left-0 right-0 h-px bg-[var(--primary)]/20"></div>
          {[0, 25, 50, 75, 100].map((milestone) => (
            <div
              key={milestone}
              className="relative flex flex-col items-center"
            >
              <div
                className={`w-2 h-2 rounded-full z-10 ${
                  progress >= milestone
                    ? "bg-[var(--primary)]"
                    : "bg-[var(--primary-darker)]/50"
                }`}
              ></div>
              <span
                className={`text-xs mt-1 ${
                  progress >= milestone
                    ? "text-[var(--primary-lighter)]"
                    : "text-[var(--primary-lighter)]/50"
                }`}
              >
                {milestone}%
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-[var(--primary-lighter)]/80">
          <p>
            Join the cosmic journey as this token bridges dimensions. Each
            milestone unlocks new possibilities in the Somnia ecosystem.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
