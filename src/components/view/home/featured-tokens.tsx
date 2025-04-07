import { useQuery } from "@tanstack/react-query";
import { getFeaturedTokens } from "@/lib/api/services/token";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { TokenObserverWrapper } from "@/components/wrapper/token-observer-wrapper";

export function FeaturedTokensList(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  const query = useQuery({
    queryKey: ["featured-tokens"],
    queryFn: () => getFeaturedTokens(),
    refetchInterval: 10000,
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="relative" {...props}>
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary-dark)]">
              Featured Tokens
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {query.data?.map((token) => (
              <motion.div
                key={token.token_address}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <TokenObserverWrapper token={token} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
