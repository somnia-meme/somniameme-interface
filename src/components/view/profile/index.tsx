import { useQueries } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { TokenWithMetadata } from "@/components/ui/token";
import { useState, memo } from "react";
import { FiUser, FiBox, FiPackage, FiStar } from "react-icons/fi";
import { parseToken } from "@/lib/api/helpers";
import { formatAddress } from "@/lib/utils/format-address";

const ProfileView = () => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("holder");

  const [createdTokensQuery, holderTokensQuery] = useQueries({
    queries: [
      {
        queryKey: ["createdTokens", address],
        queryFn: () =>
          api
            .get(`/tokens/user/${address}/created`)
            .then((res) => res.data.map((x: any) => parseToken(x)) as Token[]),
        enabled: !!address,
      },
      {
        queryKey: ["holderTokens", address],
        queryFn: () =>
          api
            .get(`/tokens/user/${address}/holder`)
            .then((res) => res.data.map((x: any) => parseToken(x)) as Token[]),
        enabled: !!address,
      },
    ],
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="text-center max-w-md mx-auto p-8 backdrop-blur-md rounded-2xl border border-indigo-500/20"
          style={{ background: "var(--surface)" }}
        >
          <div className="rounded-full bg-indigo-500/20 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <FiUser className="h-10 w-10 text-indigo-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-indigo-300 mb-6">
            Please connect your wallet to view your cosmic portfolio
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  const isLoading = createdTokensQuery.isLoading || holderTokensQuery.isLoading;
  const createdTokens = createdTokensQuery.data;
  const holderTokens = holderTokensQuery.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-purple-500 animate-spin animate-delay-150"></div>
          <div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-indigo-300 animate-spin animate-delay-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Cosmic background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 -right-1/3 w-[900px] h-[900px] rounded-full bg-indigo-600/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 -left-1/3 w-[900px] h-[900px] rounded-full bg-purple-700/5 blur-3xl"></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8 relative z-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div
            className="backdrop-blur-md rounded-2xl border border-indigo-500/20 overflow-hidden p-8"
            style={{ background: "var(--surface)" }}
          >
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-sm"></div>
                <div className="w-20 h-20 rounded-full bg-indigo-900/50 relative flex items-center justify-center border-2 border-indigo-500/30">
                  <FiUser className="h-10 w-10 text-indigo-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-white">
                    Cosmic Profile
                  </h1>
                  <div className="px-3 py-1 rounded-full text-sm bg-indigo-500/20 text-indigo-300 font-medium">
                    {formatAddress(address as string)}
                  </div>
                </div>
                <p className="text-indigo-300">
                  Manage your tokens across the Somnia universe
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <FiPackage className="h-4 w-4 text-indigo-400" />
                  <p className="text-sm text-indigo-300">Created Tokens</p>
                </div>
                <p className="text-2xl font-bold text-white">
                  {createdTokens?.length || 0}
                </p>
              </div>
              <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <FiStar className="h-4 w-4 text-indigo-400" />
                  <p className="text-sm text-indigo-300">Held Tokens</p>
                </div>
                <p className="text-2xl font-bold text-white">
                  {holderTokens?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tokens Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">My Tokens</h2>
              <p className="text-indigo-300">Explore your cosmic collection</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-indigo-900/30 p-1 rounded-xl mb-6 border border-indigo-500/20">
            <button
              onClick={() => setActiveTab("holder")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                ${
                  activeTab === "holder"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "text-indigo-300 hover:text-white"
                }`}
            >
              <FiStar
                className={`h-4 w-4 ${
                  activeTab === "holder" ? "text-white" : "text-indigo-400"
                }`}
              />
              Holder Tokens
            </button>
            <button
              onClick={() => setActiveTab("created")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                ${
                  activeTab === "created"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "text-indigo-300 hover:text-white"
                }`}
            >
              <FiPackage
                className={`h-4 w-4 ${
                  activeTab === "created" ? "text-white" : "text-indigo-400"
                }`}
              />
              Created Tokens
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-purple-500 animate-spin animate-delay-150"></div>
                <div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-indigo-300 animate-spin animate-delay-300"></div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "holder" ? (
                <motion.div
                  key="holder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {holderTokens?.length === 0 ? (
                    <div
                      className="text-center py-12 backdrop-blur-md rounded-2xl border border-indigo-500/20"
                      style={{ background: "var(--surface)" }}
                    >
                      <div className="rounded-full bg-indigo-500/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <FiStar className="h-8 w-8 text-indigo-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No Tokens Found
                      </h3>
                      <p className="text-indigo-300 mb-6 max-w-md mx-auto">
                        You don't hold any tokens yet. Start your cosmic journey
                        by discovering new tokens.
                      </p>
                      <motion.a
                        href="/"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                                rounded-lg text-white font-semibold shadow-lg hover:shadow-indigo-900/25 
                                transition-all duration-300"
                      >
                        Discover Tokens
                      </motion.a>
                    </div>
                  ) : (
                    <motion.div
                      layout
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white"
                    >
                      {holderTokens?.map((token: any, i: number) => (
                        <motion.div
                          key={token.address}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <TokenWithMetadata token={token} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="created"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {createdTokens?.length === 0 ? (
                    <div
                      className="text-center py-12 backdrop-blur-md rounded-2xl border border-indigo-500/20"
                      style={{ background: "var(--surface)" }}
                    >
                      <div className="rounded-full bg-indigo-500/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <FiBox className="h-8 w-8 text-indigo-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No Tokens Created
                      </h3>
                      <p className="text-indigo-300 mb-6 max-w-md mx-auto">
                        You haven't created any tokens yet. Launch your own
                        cosmic token to start your journey.
                      </p>
                      <motion.a
                        href="/create"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                                rounded-lg text-white font-semibold shadow-lg hover:shadow-indigo-900/25 
                                transition-all duration-300"
                      >
                        Create Your First Token
                      </motion.a>
                    </div>
                  ) : (
                    <motion.div
                      layout
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white"
                    >
                      {createdTokens?.map((token: any, i: number) => (
                        <motion.div
                          key={token.address}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <TokenWithMetadata token={token} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProfilePage = memo(ProfileView);
