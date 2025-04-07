import { memo, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useMetadata } from "@/hooks/use-token-metadata";

const TokenDisplay = memo(
  ({ tokenAddress, symbol }: { tokenAddress: string; symbol: string }) => {
    const { data: metadata } = useMetadata(tokenAddress);

    return (
      <>
        <div className="relative w-4 h-4">
          <img
            src={metadata?.image_url}
            alt={symbol}
            className="w-4 h-4 rounded-full object-contain"
            onError={(e) => {
              (
                e.target as HTMLImageElement
              ).src = `https://placehold.co/32x32/814bf9/white?text=${
                symbol?.[0] || "?"
              }`;
            }}
          />
        </div>
        <span className="font-medium text-xs">{metadata?.name || symbol}</span>
      </>
    );
  }
);

export const NavbarTransactions = memo(() => {
  const [mounted, setMounted] = useState(false);
  const [newTxIds, setNewTxIds] = useState<Set<string>>(new Set());
  const [seenTransactions, setSeenTransactions] = useState<Set<string>>(
    new Set()
  );

  const { data: latestSwaps = [] } = useQuery({
    queryKey: ["latest-swaps"],
    queryFn: async () => {
      const response = await api
        .get("/tokens/latest-swaps")
        .then((res) => res.data);
      return response || [];
    },
    refetchInterval: 5000,
    initialData: [],
  });

  const transactions = latestSwaps.map((swap: any) => ({
    id: swap.id,
    type: swap.is_buy ? "buy" : "sell",
    token: swap.token_symbol || "Unknown",
    amount: swap.is_buy
      ? Number(swap.token_amount_out)
      : Number(swap.token_amount_in),
    address: formatAddress(swap.sender),
    token_address: swap.token_address,
    timestamp: swap.timestamp,
  }));

  function formatAddress(address: string): string {
    if (!address || address.length < 10) return address || "";
    return `${address.substring(0, 5)}...${address.substring(
      address.length - 4
    )}`;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (transactions.length === 0) return;

    const newTxs = transactions.filter((tx) => !seenTransactions.has(tx.id));

    if (newTxs.length > 0) {
      const updatedSeen = new Set(seenTransactions);
      const updatedNew = new Set(newTxIds);

      newTxs.forEach((tx) => {
        updatedSeen.add(tx.id);
        updatedNew.add(tx.id);

        setTimeout(() => {
          setNewTxIds((current) => {
            const next = new Set(current);
            next.delete(tx.id);
            return next;
          });
        }, 3000);
      });

      setSeenTransactions(updatedSeen);
      setNewTxIds(updatedNew);
    }
  }, [transactions, seenTransactions]);

  if (!mounted) return null;

  const displayTransactions = transactions;

  return (
    <div className="w-full bg-black/40 backdrop-blur-sm py-1.5 border-b border-white/5">
      <div className="container mx-auto">
        <div className="flex items-center gap-4">
          <div className="text-xs text-white/50 whitespace-nowrap flex items-center">
            <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full animate-pulse mr-1.5">
              LIVE
            </span>
            Transactions:
          </div>

          <div className="flex-1 overflow-hidden">
            <Swiper
              spaceBetween={24}
              slidesPerView="auto"
              loop={false}
              className="w-full transactions-swiper"
            >
              {displayTransactions.map((tx) => (
                <SwiperSlide key={tx.id} className="!w-auto">
                  <div
                    className={`flex items-center gap-2 whitespace-nowrap px-1 py-0.5 hover:bg-white/5 rounded-md transition-colors cursor-pointer ${
                      newTxIds.has(tx.id) ? "new-transaction" : ""
                    }`}
                  >
                    <TokenDisplay
                      tokenAddress={tx.token_address}
                      symbol={tx.token}
                    />
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs ${
                          tx.type === "buy"
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {tx.type === "buy" ? "+" : "-"}
                        {tx.amount.toLocaleString()}
                      </span>
                      {newTxIds.has(tx.id) && (
                        <span className="px-1 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[8px] animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-white/40">
                      {tx.address}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
});
