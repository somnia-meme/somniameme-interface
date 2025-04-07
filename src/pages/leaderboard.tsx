import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQueries } from "@tanstack/react-query";
import { useMetadata } from "@/hooks/use-token-metadata";
import { getTokens } from "@/lib/api/services/token";
import { FaChartLine, FaClock } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { ContainerWrapper } from "@/components/wrapper/container-wrapper";

const LaunchingSoonToken = memo(
  ({ token, index }: { token: Token; index: number }) => {
    const metadata = useMetadata(token.token_address);
    const navigate = useNavigate();

    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 hover:bg-[var(--primary)]/10 transition-colors cursor-pointer border-b border-[var(--primary)]/20 last:border-b-0"
          onClick={() => navigate(`/token/${token.token_address}`)}
        >
          <div className="flex md:flex-row flex-col items-center justify-between">
            <div className="flex w-full items-center gap-3">
              <span className="text-[var(--primary-light)] mr-2">
                {index + 1}
              </span>
              <img
                src={metadata.data?.image_url}
                alt={token.name}
                className="size-10 rounded-lg border border-[var(--primary)]/20 z-10 shrink-0"
              />
              <div>
                <h3 className="font-medium text-white text-sm">
                  {token.name}
                  <span className="text-[var(--primary-lighter)] ml-1">
                    (${token.symbol})
                  </span>
                </h3>
                <p className="text-xs text-[var(--primary-lighter)]">
                  +{token.mcap.toLocaleString()} mcap
                </p>
              </div>
            </div>
            <div className="md:w-32 w-full md:mt-0 mt-4">
              <div className="h-2 bg-[var(--primary-darker)]/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Number(token.migration_progress)}%`,
                  }}
                  className="h-full bg-gradient-to-r from-[var(--primary-dark)] to-[var(--secondary)]"
                />
              </div>
              <p className="text-right text-xs text-[var(--primary-lighter)] mt-1">
                {token.migration_progress.toLocaleString()}%
              </p>
            </div>
          </div>
        </motion.div>
      </>
    );
  }
);

const MarketCapRankingToken = memo(
  ({ token, index }: { token: Token; index: number }) => {
    const navigate = useNavigate();
    const metadata = useMetadata(token.token_address);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        className="p-4 hover:bg-[var(--primary)]/10 transition-colors cursor-pointer border-b border-[var(--primary)]/20 last:border-b-0"
        onClick={() => navigate(`/token/${token.token_address}`)}
      >
        <div className="flex md:flex-row flex-col items-center justify-between">
          <div className="flex w-full items-center gap-3">
            <span className="text-[var(--primary-light)] mr-2">
              {index + 1}
            </span>
            <img
              src={metadata.data?.image_url}
              alt={token.name}
              className="size-10 rounded-lg border border-[var(--primary)]/20 z-10 shrink-0"
            />
            <div>
              <h3 className="font-medium text-white text-sm">
                {token.name}
                <span className="text-[var(--primary-lighter)] ml-1">
                  (${token.symbol})
                </span>
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--primary-lighter)]">
                  {token.mcap.toLocaleString()} STT
                </span>
                <span
                  className={`${
                    Number(token.mcap_change_24h) >= 0
                      ? "text-[var(--primary-light)]"
                      : "text-[var(--danger)]"
                  }`}
                >
                  {Number(token.mcap_change_24h) > 0 && "+"}
                  {token.mcap_change_24h.toLocaleString()}%
                </span>
              </div>
            </div>
          </div>
          <div className="md:text-right w-full text-center md:mt-0 mt-4">
            <p className="flex items-center justify-end gap-1.5">
              <span className="text-[var(--primary-lighter)] text-xs">
                Vol:
              </span>
              <span className="text-white font-medium text-sm">
                {token.volume.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
);

const Ranking = () => {
  const [launching_soon_query, market_cap_ranking_query] = useQueries({
    queries: [
      {
        queryKey: ["launching_soon"],
        queryFn: async () =>
          getTokens({
            sort: "migration_progress",
            order: "desc",
            limit: 10,
          }),
      },
      {
        queryKey: ["market_cap_ranking"],
        queryFn: async () =>
          getTokens({
            sort: "mcap",
            order: "desc",
            limit: 10,
          }),
      },
    ],
  });

  if (launching_soon_query.isLoading || market_cap_ranking_query.isLoading)
    return <div>Loading...</div>;

  if (launching_soon_query.isError || market_cap_ranking_query.isError)
    return <div>Error</div>;

  const market_cap_ranking = market_cap_ranking_query.data || [];
  const launching_soon = launching_soon_query.data || [];

  return (
    <ContainerWrapper>
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary-light)] to-[var(--secondary)] bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-[var(--primary-lighter)] mt-4 text-sm max-w-2xl mx-auto">
          Discover the most popular tokens in the Somnia universe. Watch their
          cosmic journey unfold.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Launching Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md rounded-2xl border border-[var(--primary)]/20 overflow-hidden"
          style={{ background: "var(--surface)" }}
        >
          <div className="p-4 border-b border-[var(--primary)]/20 flex items-center">
            <div className="p-2 bg-[var(--primary)]/20 rounded-lg mr-3">
              <FaClock />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Launching Soon</h2>
              <p className="text-sm text-[var(--primary-lighter)]">
                Progress reaches 100%, token deploys automatically
              </p>
            </div>
          </div>

          {launching_soon && (
            <div>
              {launching_soon.map((token: Token, index: number) => (
                <LaunchingSoonToken
                  key={token.token_address}
                  token={token}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Market Cap Ranking Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md rounded-2xl border border-[var(--primary)]/20 overflow-hidden"
          style={{ background: "var(--surface)" }}
        >
          <div className="p-4 border-b border-[var(--primary)]/20 flex items-center">
            <div className="p-2 bg-[var(--primary)]/20 rounded-lg mr-3">
              <FaChartLine />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Market Cap Ranking
              </h2>
              <p className="text-sm text-[var(--primary-lighter)]">
                Top performing tokens by market cap
              </p>
            </div>
          </div>

          <div>
            {market_cap_ranking.map((token: Token, index: number) => (
              <MarketCapRankingToken
                key={token.token_address}
                token={token}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </ContainerWrapper>
  );
};

export default function Leaderboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Ranking />;
}
