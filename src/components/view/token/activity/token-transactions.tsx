import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  FiArrowUpRight,
  FiArrowDownRight,
  FiExternalLink,
} from "react-icons/fi";
import { SCAN_URL } from "@/lib/config";
import { formatAddress } from "@/lib/utils/format-address";

export function Trade({ trade, symbol }: { trade: any; symbol: string }) {
  return (
    <motion.div
      key={trade.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[var(--primary-darker)]/20 backdrop-blur-sm rounded-xl p-4 border border-[var(--primary)]/20 cursor-pointer hover:bg-[var(--primary-darker)]/30 transition-all duration-300 relative overflow-hidden group"
      onClick={() => (window.location.href = `${SCAN_URL}/tx/${trade.tx_hash}`)}
    >
      {/* Animated gradient background that appears on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-[var(--secondary)]/20 to-[var(--primary)]/20 -z-10" />

      {/* Sparkle effect in the corner */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <FiExternalLink className="text-[var(--primary-lighter)] h-4 w-4" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`rounded-full p-1.5 ${
              trade.is_buy ? "bg-[var(--primary)]/20" : "bg-[var(--secondary)]/20"
            }`}
          >
            {trade.is_buy ? (
              <FiArrowUpRight className="h-3.5 w-3.5 text-[var(--primary-light)]" />
            ) : (
              <FiArrowDownRight className="h-3.5 w-3.5 text-[var(--secondary-light)]" />
            )}
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm font-medium ${
                trade.is_buy ? "text-[var(--primary-light)]" : "text-[var(--secondary-light)]"
              }`}
            >
              {trade.is_buy ? "Buy" : "Sell"}
            </span>
            <span className="text-[var(--primary-light)] text-xs">
              {formatAddress(trade.sender)}
            </span>
          </div>
        </div>
        <span className="text-[var(--primary-lighter)]/80 text-xs">
          {new Date(trade.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="mt-3 p-2 rounded-lg bg-[var(--primary-darker)]/30 border border-[var(--primary)]/10">
        <div className="flex lg:flex-row flex-col justify-between lg:items-center">
          <div className="text-sm">
            <span className="text-[var(--primary-lighter)]">Amount:</span>
            <span className="ml-2 text-white font-medium">
              {trade.is_buy
                ? trade.token_amount_out.toLocaleString(undefined, {
                    maximumSignificantDigits: 3,
                  })
                : trade.token_amount_in.toLocaleString(undefined, {
                    maximumSignificantDigits: 3,
                  })}{" "}
              {symbol}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-[var(--primary-lighter)]">Value:</span>
            <span className="ml-2 text-white font-medium">
              {trade.is_buy
                ? trade.eth_amount_in.toLocaleString(undefined, {
                    maximumSignificantDigits: 3,
                  })
                : trade.eth_amount_out.toLocaleString(undefined, {
                    maximumSignificantDigits: 3,
                  })}{" "}
              STT
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TradesSection({
  address,
  symbol,
}: {
  address: string;
  symbol: string;
}) {
  const tradesQuery = useQuery({
    queryKey: ["trades", address],
    queryFn: async () =>
      await api.get(`/tokens/${address}/swaps`).then((res) => res.data),
    initialData: [],
    enabled: !!address,
    refetchInterval: 5000,
  });

  if (tradesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[var(--primary)] animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-[var(--secondary)] animate-spin animate-delay-150"></div>
          <div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-[var(--primary-lighter)] animate-spin animate-delay-300"></div>
        </div>
      </div>
    );
  }

  if (tradesQuery.data?.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex rounded-full bg-[var(--primary-darker)]/30 p-3 mb-4">
          <div className="rounded-full bg-[var(--primary)]/20 p-2">
            <FiArrowUpRight className="h-5 w-5 text-[var(--primary-light)]" />
          </div>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No Trades Yet</h3>
        <p className="text-[var(--primary-lighter)] max-w-md mx-auto">
          Be the first to trade this cosmic token. Your transaction will appear
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tradesQuery.data?.map((trade: any) => (
        <Trade key={trade.id} trade={trade} symbol={symbol} />
      ))}
    </div>
  );
}

export function TokenTransactions({ token }: { token: Token }) {
  return <TradesSection address={token.token_address} symbol={token.symbol} />;
}
