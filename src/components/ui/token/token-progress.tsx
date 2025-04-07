import { motion } from "framer-motion";
import { memo } from "react";

export const TokenProgressEffect = memo(
  ({ value, color_scheme }: { value: number; color_scheme: any }) => {
    return (
      <>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1 }}
          className="absolute bottom-0 left-0 h-full backdrop-blur-[2px] opacity-70"
          style={{
            boxShadow: `inset 0 0 20px rgba(0,0,0,0.3)`,
          }}
        >
          <motion.div
            className="absolute top-0 h-full right-0 w-[2px]"
            animate={{
              boxShadow: [
                `0 0 8px 3px ${color_scheme.edgeColor}`,
                `0 0 15px 5px ${color_scheme.edgeColor}`,
                `0 0 8px 3px ${color_scheme.edgeColor}`,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              animate={{
                background: color_scheme.gradientColors,
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <motion.div
              className="absolute"
              initial={{ x: "50%", y: "50%", opacity: 0 }}
              animate={{
                x: ["30%", "70%", "40%", "60%", "50%"],
                y: ["30%", "60%", "70%", "40%", "50%"],
                opacity: [0, 0.6, 0.4, 0.5, 0],
                scale: [0.8, 1.5, 1.2, 1.8, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color_scheme.glowColor} 0%, transparent 70%)`,
                filter: "blur(8px)",
                mixBlendMode: "overlay",
                transform: "translate(-50%, -50%)",
              }}
            />

            <motion.div
              className="absolute inset-0"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${color_scheme.glowColor} 50%, transparent 100%)`,
                backgroundSize: "200% 100%",
                mixBlendMode: "overlay",
                opacity: 0.4,
              }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-30"></div>
        </motion.div>
      </>
    );
  }
);
