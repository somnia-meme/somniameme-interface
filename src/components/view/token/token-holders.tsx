import { scanApiInstance } from "@/lib/api/scan-api-instance";
import { TOTAL_SUPPLY } from "@/lib/config";
import { formatAddress } from "@/lib/utils/format-address";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaDroplet, FaShield, FaStar, FaUser, FaUsers } from "react-icons/fa6";
import { TOKEN_FACTORY_ADDRESS } from "@/lib/config";

export function TokenHolders({ token }: { token: Token }) {
  const { liquidity_pool: liquidityPoolAddress, owner: creatorAddress } = token;
  const holdersQuery = useQuery({
    queryKey: ["token-holders", token.token_address],
    queryFn: async () => {
      const holders = await scanApiInstance
        .get(`/tokens/${token.token_address}/holders`)
        .then((x) => x.data.items);

      return holders.map((holder: any) => ({
        address: holder.address.hash,
        token_amount: Number(holder.value) / 10 ** 18,
        symbol: holder.token.symbol,
      }));
    },
    initialData: [],
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-[var(--primary)]/20 overflow-hidden relative"
      style={{ background: "var(--surface)" }}
    >
      <div className="p-5 relative z-10">
        <div className="flex items-center mb-4">
          <FaUsers className="size-5 text-[var(--primary-light)] mr-2" />
          <h3 className="text-sm font-bold">Token Holders</h3>
        </div>

        <div className="space-y-3">
          {holdersQuery.data.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex rounded-full bg-[var(--primary-darker)]/30 p-3 mb-4">
                <div className="rounded-full bg-[var(--primary)]/20 p-2">
                  <FaUser className="size-5 text-[var(--primary-light)]" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-white mb-2">
                No Holders Yet
              </h3>
              <p className="text-[var(--primary-lighter)] max-w-md mx-auto">
                Be the first to hold this cosmic token in your wallet.
              </p>
            </div>
          ) : (
            holdersQuery.data.map((holder: any, index: number) => (
              <motion.div
                key={holder.address}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-[var(--primary-darker)]/20 backdrop-blur-sm rounded-xl p-4 border border-[var(--primary)]/20 relative overflow-hidden group"
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "var(--overlay-indigo)",
                  borderColor: "var(--primary)/30",
                }}
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[var(--primary)]/20 p-2 flex-shrink-0">
                      {holder.address.toLowerCase() ===
                      creatorAddress.toLowerCase() ? (
                        <FaShield className="size-3 text-[var(--primary-light)]" />
                      ) : holder.address.toLowerCase() ===
                        liquidityPoolAddress.toLowerCase() ? (
                        <FaDroplet className="size-3 text-[var(--secondary-light)]" />
                      ) : holder.address.toLowerCase() ==
                        TOKEN_FACTORY_ADDRESS.toLowerCase() ? (
                        <FaStar className="size-3 text-[var(--warning)]" />
                      ) : (
                        <FaUser className="size-3 text-[var(--primary-lighter)]" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      {holder.address.toLowerCase() ===
                        creatorAddress.toLowerCase() && (
                        <span className="text-[var(--primary-light)] text-xs font-medium">
                          Creator
                        </span>
                      )}
                      {holder.address.toLowerCase() ===
                        liquidityPoolAddress.toLowerCase() && (
                        <span className="text-[var(--secondary-light)] text-xs font-medium">
                          Liquidity Pool
                        </span>
                      )}
                      {holder.address.toLowerCase() ===
                        TOKEN_FACTORY_ADDRESS.toLowerCase() && (
                        <span className="text-[var(--warning)] text-xs font-medium">
                          Token Factory
                        </span>
                      )}
                      <span className="text-white font-mono">
                        {formatAddress(holder.address)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-white font-medium text-xs">
                      {holder.token_amount.toLocaleString()} {holder.symbol}
                    </span>
                    <div className="flex items-center mt-1">
                      <div className="w-16 h-1.5 bg-[var(--primary-darker)]/50 rounded-full overflow-hidden mr-2">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                          style={{
                            width: `${Math.min(
                              100,
                              (holder.token_amount / TOTAL_SUPPLY) * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-[var(--primary-lighter)]">
                        {(
                          (holder.token_amount / TOTAL_SUPPLY) *
                          100
                        ).toLocaleString()}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
