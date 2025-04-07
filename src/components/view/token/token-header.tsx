import { FaDiscord, FaGlobe, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";
import { SCAN_URL, TOTAL_SUPPLY } from "@/lib/config";
import { formatAddress } from "@/lib/utils/format-address";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

export function TokenHeader({
  token,
  metadata,
}: {
  token: Token;
  metadata: TokenMetadata;
}) {
  const PriceChangeIndicator = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    return (
      <div
        className={`flex items-center gap-1 ${
          isPositive ? "text-[var(--primary-light)]" : "text-[var(--danger)]"
        }`}
      >
        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
        <span className="font-medium text-xs">
          {Math.abs(value || 0).toLocaleString()}%
        </span>
      </div>
    );
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-[var(--primary)]/20 overflow-hidden"
        style={{ background: "var(--surface)" }}
      >
        {/* Top section with token image and name */}
        <div className="p-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Token image and name */}
            <div className="flex items-center gap-4">
              <img
                src={metadata?.image_url}
                alt={token.name}
                decoding="async"
                loading="lazy"
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-lg font-bold text-white">{token.name}</h1>
                  <div className="px-3 py-1 rounded-full text-sm bg-[var(--primary)]/20 text-[var(--primary-lighter)] font-medium">
                    {token.symbol}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-[var(--primary-lighter)] hover:text-[var(--primary-light)] transition-colors">
                    <span className="text-xs font-mono">
                      {formatAddress(token.token_address)}
                    </span>
                    <FiCopy className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`${SCAN_URL}/address/${token.token_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary-lighter)] hover:text-[var(--primary-light)] transition-colors"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Price info and social links */}
            <div className="flex flex-col md:flex-row md:ml-auto gap-6 w-full md:w-auto">
              {/* Price info */}
              <div className="bg-white/5 rounded-xl p-4 border border-[var(--primary)]/20 w-full md:w-auto">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-[var(--primary-lighter)] text-xs mb-1">
                      Current Price
                    </p>
                    <div className="flex md:flex-row flex-col md:items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {token.price.toLocaleString(undefined, {
                          maximumSignificantDigits: 3,
                        })}{" "}
                        STT
                      </span>
                      {token.price_change_24h !== undefined && (
                        <PriceChangeIndicator value={token.price_change_24h} />
                      )}
                    </div>
                  </div>

                  <div className="h-10 w-px bg-[var(--primary)]/20"></div>

                  <div>
                    <p className="text-[var(--primary-lighter)] text-xs mb-1">
                      Market Cap
                    </p>
                    <div className="flex md:flex-row flex-col md:items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {token.mcap.toLocaleString(undefined, {
                          maximumSignificantDigits: 3,
                        })}{" "}
                        STT
                      </span>
                      {token.mcap_change_24h !== undefined && (
                        <PriceChangeIndicator value={token.mcap_change_24h} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {metadata?.website_url && (
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={metadata.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[var(--primary)]/20 rounded-lg text-[var(--primary-lighter)] hover:text-white hover:bg-[var(--primary)]/30 transition-colors"
                  >
                    <FaGlobe className="w-5 h-5" />
                  </motion.a>
                )}
                {metadata?.telegram_url && (
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={metadata.telegram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[var(--primary)]/20 rounded-lg text-[var(--primary-lighter)] hover:text-white hover:bg-[var(--primary)]/30 transition-colors"
                  >
                    <FaTelegramPlane className="w-5 h-5" />
                  </motion.a>
                )}
                {metadata?.twitter_url && (
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={metadata.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[var(--primary)]/20 rounded-lg text-[var(--primary-lighter)] hover:text-white hover:bg-[var(--primary)]/30 transition-colors"
                  >
                    <FaTwitter className="w-5 h-5" />
                  </motion.a>
                )}
                {metadata?.discord_url && (
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={metadata.discord_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[var(--primary)]/20 rounded-lg text-[var(--primary-lighter)] hover:text-white hover:bg-[var(--primary)]/30 transition-colors"
                  >
                    <FaDiscord className="w-5 h-5" />
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Token description */}
        <div className="px-6 pb-6">
          <div className="p-4 bg-[var(--primary-darker)]/20 rounded-lg">
            <p className="text-[var(--primary-light)] text-xs leading-relaxed">
              {metadata?.description ||
                "No description available for this token."}
            </p>
            <div className="mt-3 pt-3 border-t border-[var(--primary)]/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[var(--primary-lighter)]">
                <span>Created by:</span>
                <a
                  href={`${SCAN_URL}/address/${token.owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary-light)] underline-offset-2 hover:underline"
                >
                  {formatAddress(token.owner)}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-[var(--primary)]/20">
          <motion.div
            whileHover={{ backgroundColor: "var(--overlay-indigo)" }}
            className="p-4 flex flex-col items-center justify-center border-r border-[var(--primary)]/20 transition-colors"
          >
            <p className="text-[var(--primary-lighter)] text-xs mb-1">
              Total Supply
            </p>
            <p className="text-sm font-semibold text-white">
              {TOTAL_SUPPLY.toLocaleString()} {token.symbol}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ backgroundColor: "var(--overlay-indigo)" }}
            className="p-4 flex flex-col items-center justify-center sm:border-r border-[var(--primary)]/20 transition-colors"
          >
            <p className="text-[var(--primary-lighter)] text-xs mb-1">
              Initial Buy
            </p>
            <p className="text-sm font-semibold text-white">
              {token.bonus_tokens.toLocaleString()} {token.symbol}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ backgroundColor: "var(--overlay-indigo)" }}
            className="p-4 flex flex-col items-center justify-center border-t sm:border-t-0 border-r border-[var(--primary)]/20 transition-colors"
          >
            <p className="text-[var(--primary-lighter)] text-xs mb-1">
              24h MCap Change
            </p>
            <div
              className={`text-sm font-semibold ${
                (token.mcap_change_24h || 0) >= 0
                  ? "text-[var(--primary-light)]"
                  : "text-[var(--danger)]"
              }`}
            >
              {(token.mcap_change_24h || 0) >= 0 ? "+" : ""}
              {token.mcap_change_24h.toLocaleString()}%
            </div>
          </motion.div>

          <motion.div
            whileHover={{ backgroundColor: "var(--overlay-indigo)" }}
            className="p-4 flex flex-col items-center justify-center border-t sm:border-t-0 border-[var(--primary)]/20 transition-colors"
          >
            <p className="text-[var(--primary-lighter)] text-xs mb-1">
              Migration Progress
            </p>
            <div className="w-full">
              <p className="text-sm font-semibold text-white text-center mb-1">
                {token.migration_progress.toLocaleString()}%
              </p>
              <div className="h-2 w-full bg-[var(--primary-darker)]/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                  style={{ width: `${token.migration_progress || 0}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
