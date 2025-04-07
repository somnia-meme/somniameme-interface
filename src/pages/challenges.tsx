import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiFile } from "react-icons/fi";
import { useMetadata } from "@/hooks/use-token-metadata";
import { useQuery } from "@tanstack/react-query";
import { readContract, readContracts } from "wagmi/actions";
import { BURN_CHALLENGE_ADDRESS } from "@/lib/config";
import BurnChallengeABI from "@/assets/BurnChallenge.json";
import { formatEther } from "viem";
import {
  useAccount,
  useClient,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { getToken, getTokens } from "@/lib/api/services/token";
import { Button } from "@/components/ui/form/button";
import { useCountdown } from "usehooks-ts";
import { Input } from "@/components/ui/form/input";
import { simulateContract } from "viem/actions";
import { wagmiAdapter } from "@/providers/appkit-provider";
import { ContainerWrapper } from "@/components/wrapper/container-wrapper";

// Timer component with circular progress
const TimerComponent = ({
  timeRemaining,
  vaultAmount,
}: {
  timeRemaining: number;
  vaultAmount: number;
}) => {
  const [counter, { startCountdown }] = useCountdown({
    countStart: timeRemaining,
    countStop: 0,
    intervalMs: 1000,
    isIncrement: false,
  });
  const progress = counter / 3600; // 1 hour
  const real_progress = 100 - progress * 100;

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  const { writeContractAsync } = useWriteContract();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleCompleteChallenge = async () => {
    try {
      setIsCompleting(true);
      await writeContractAsync({
        address: BURN_CHALLENGE_ADDRESS as any,
        abi: BurnChallengeABI as any,
        functionName: "completeChallenge",
        args: [],
      });
    } catch (error) {
      console.error("Error completing challenge:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  useEffect(() => {
    startCountdown();
  }, []);

  return (
    <div className="flex flex-col items-center w-full mx-auto">
      <div
        className={`w-full rounded-2xl overflow-hidden shadow-2xl relative ${
          counter === 0 ? "border-2 border-[var(--warning)]" : ""
        }`}
      >
        {/* Background pattern with enhanced visual effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary-darker)]/60 to-[var(--primary-darker)]/60 z-0"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,0,240,0.15),transparent_70%)]"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {counter === 0 &&
            Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  opacity: 0,
                }}
                animate={{
                  x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                  y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3 + Math.random() * 3,
                  repeatType: "reverse",
                }}
                className="absolute w-2 h-2 bg-[var(--warning)] rounded-full blur-sm"
              />
            ))}
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-xl md:text-2xl uppercase tracking-wider">
              {counter === 0 ? "Challenge Ready to Complete" : "Burn Challenge"}
            </h3>
            <div
              className={`px-3 py-1 rounded-md text-xs font-semibold 
                          ${
                            counter === 0
                              ? "bg-[var(--warning)] text-black animate-pulse"
                              : "bg-[var(--primary)]/30 text-[var(--primary-lighter)]"
                          }`}
            >
              {counter === 0 ? "COMPLETE NOW" : "LIVE"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Timer display */}
            <div className="flex items-center justify-center md:col-span-1 !h-full">
              <div
                className={`relative flex items-center justify-center 
                              ${
                                counter === 0
                                  ? "bg-gradient-to-r from-[var(--warning)]/30 to-[var(--danger)]/30"
                                  : "bg-[var(--primary)]/20"
                              } 
                              rounded-xl p-6 h-full w-full`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
                <span className="text-4xl font-bold text-white">
                  {counter === 0
                    ? "00:00"
                    : `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
                </span>
                {counter === 0 && (
                  <motion.div
                    className="absolute -inset-0.5 rounded-xl bg-[var(--warning)]/30"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
            </div>

            {/* Prize info */}
            <div className="bg-gradient-to-b from-[var(--primary-darker)]/60 to-[var(--primary-darkest)]/60 p-4 rounded-xl md:col-span-2 flex flex-col md:flex-row justify-between items-center">
              <div>
                <p className="text-sm text-[var(--primary-light)] mb-1 uppercase tracking-wider">
                  Prize Pool
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {vaultAmount}
                  </span>
                  <span className="text-[var(--primary-lighter)] text-sm">
                    STT
                  </span>
                </div>
                <p className="text-xs text-[var(--primary-lighter)] mt-1">
                  Will be burned upon completion
                </p>
              </div>

              <div className="mt-3 md:mt-0 flex flex-col items-center">
                <div className="bg-[var(--primary-dark)]/50 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[var(--warning)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-[var(--primary-lighter)] mt-1">
                  Token Burn
                </span>
              </div>
            </div>
          </div>

          {counter === 0 ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(251, 191, 36, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCompleteChallenge}
              disabled={isCompleting}
              className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-[var(--warning)] to-[var(--warning-dark)]
                          text-white font-bold shadow-lg shadow-[var(--warning)]/20 flex items-center justify-center gap-2
                          relative overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-red-500/10 
                            opacity-0 hover:opacity-100 transition-opacity duration-300"
              ></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-red-500 opacity-30 blur-md"></div>
              <span className="relative z-10 flex items-center text-lg">
                {isCompleting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Challenge Completion...
                  </>
                ) : (
                  <>
                    <span className="text-lg">
                      Complete Challenge & Trigger Token Burn
                    </span>
                    <FiArrowRight className="ml-2 text-xl" />
                  </>
                )}
              </span>
            </motion.button>
          ) : (
            <div className="mt-6">
              <div className="flex justify-between text-xs text-[var(--primary-lighter)] mb-2">
                <span>Progress</span>
                <span>{Math.floor(real_progress)}%</span>
              </div>
              <div className="w-full h-3 bg-[var(--primary-darker)]/60 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    real_progress < 0.2
                      ? "bg-gradient-to-r from-[var(--warning)] to-[var(--danger)]"
                      : "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                  }`}
                  style={{ width: `${real_progress}%` }}
                  animate={{ width: `${real_progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <div className="size-2 rounded-full bg-[var(--primary)] mr-2"></div>
                  <span className="text-xs text-[var(--primary-lighter)]">
                    Started
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="size-2 rounded-full bg-[var(--warning)] mr-2"></div>
                  <span className="text-xs text-[var(--primary-lighter)]">
                    Completion
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[var(--primary-darker)]/30 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[var(--primary)]/10 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[var(--primary-lighter)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-[var(--primary-lighter)]">
                  Winning Token Gets
                </p>
                <p className="text-white font-medium">Supply Reduction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Token Card Component
const TokenCard = ({
  token,
  index,
  votes,
  alreadyVoted,
}: {
  token: Token;
  index: number;
  votes: number;
  alreadyVoted: boolean;
}) => {
  const account = useAccount();
  const metadata = useMetadata(token.token_address);
  const highlighted = index < 2;

  const [errorMessage, setErrorMessage] = useState("");

  const writeContract = useWriteContract();

  const wagmiClient = useClient();

  async function simulateVote() {
    try {
      await simulateContract(wagmiClient as any, {
        address: BURN_CHALLENGE_ADDRESS,
        abi: BurnChallengeABI,
        functionName: "vote",
        args: [token.token_address],
      });

      return true;
    } catch (error: any) {
      console.error("error", error);
      setErrorMessage(
        error.cause?.reason ||
          error.shortMessage ||
          error.message ||
          "Unknown reason"
      );
      return false;
    }
  }

  async function vote() {
    const result = await simulateVote();

    if (result) {
      await writeContract.writeContractAsync({
        address: BURN_CHALLENGE_ADDRESS as any,
        abi: BurnChallengeABI as any,
        functionName: "vote",
        args: [token.token_address],
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`backdrop-blur-md rounded-xl border ${
        highlighted
          ? "border-[var(--warning)]/50"
          : "border-[var(--primary)]/20"
      } overflow-hidden`}
      style={{ background: "var(--surface)" }}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--primary)]/30 to-[var(--secondary)]/30 rounded-full blur-sm"></div>
              <img
                src={metadata?.data?.image_url}
                alt={token.name}
                className="size-14 rounded-lg relative z-10"
              />
            </div>
            <div>
              <h3 className="font-medium text-white">{token.name}</h3>
              <p className="text-sm text-[var(--primary-lighter)]">
                ${token.symbol}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">
              <span className="text-white/50 font-normal text-xs mr-2">
                MCAP
              </span>
              {token.mcap.toLocaleString()} STT
            </p>
            <p
              className={`text-sm ${
                token.mcap_change_24h >= 0
                  ? "text-[var(--success)]"
                  : "text-[var(--danger)]"
              }`}
            >
              {token.mcap_change_24h >= 0 ? "+" : ""}
              {token.mcap_change_24h.toLocaleString()}%
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-[var(--primary-lighter)]">Volume</p>
            <p className="text-white">{token.volume.toLocaleString()} STT</p>
          </div>
          <div>
            <p className="text-sm text-[var(--primary-lighter)]">Votes</p>
            <p className="text-white">{votes.toLocaleString()}</p>
          </div>
        </div>

        {errorMessage && (
          <p className="text-[var(--danger)] text-sm mt-2 mb-2">
            {errorMessage}
          </p>
        )}

        {account.isConnected && (
          <Button
            variant={alreadyVoted ? "secondary" : "gradient"}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-[var(--primary-light)] to-[var(--secondary)] text-white font-medium hover:opacity-90 transition-opacity"
            disabled={alreadyVoted}
            onClick={vote}
          >
            Vote
          </Button>
        )}
      </div>
    </motion.div>
  );
};

// Burn Statistics Card
const BurnStatisticsCard = ({
  vaultAmount,
  lastBurn,
  challengeId,
  challenges,
}: {
  vaultAmount: number;
  lastBurn: number;
  challengeId: number;
  challenges: any[];
}) => {
  const ChallengeItem = ({ challenge }: { challenge: any }) => {
    const winningToken = useMetadata(challenge.winningToken);
    return (
      <div
        key={challenge.challengeId}
        className="flex justify-between items-center p-2 rounded-lg bg-[var(--primary)]/10"
      >
        <div className="flex items-center gap-2">
          <span className="text-[var(--warning)]">
            <FiFile size={14} />
          </span>
          <span className="text-white">
            {winningToken?.data?.name || "No one won"}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-white">{vaultAmount} STT</p>
          <p className="text-xs text-[var(--primary-lighter)]">
            {challenge.startTime.toLocaleString()}
          </p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="backdrop-blur-md rounded-xl border border-[var(--primary)]/20 overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      <div className="p-4 border-b border-[var(--primary)]/20 flex items-center">
        <div className="p-2 bg-[var(--primary)]/20 rounded-lg mr-3">
          <FiFile className="text-[var(--warning)]" />
        </div>
        <h2 className="text-lg font-bold text-white">Burn Statistics</h2>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-[var(--primary-lighter)]">
              Current Vault
            </p>
            <p className="text-white text-lg font-medium">{vaultAmount} STT</p>
          </div>
          <div>
            <p className="text-sm text-[var(--primary-lighter)]">Last Burn</p>
            <p className="text-white text-lg font-medium">
              {lastBurn.toLocaleString()} STT
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--primary-lighter)]">Challenge #</p>
            <p className="text-white text-lg font-medium">{challengeId}</p>
          </div>
        </div>

        <div>
          <h3 className="text-[var(--primary-lighter)] font-medium mb-2">
            Recent Burns
          </h3>
          <div className="space-y-2">
            {challenges.map((challenge) => (
              <ChallengeItem
                key={challenge.challengeId}
                challenge={challenge}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Tab Component
const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "current", label: "Current Challenge" },
    { id: "add", label: "Add Token" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-[var(--primary-light)] to-[var(--secondary)] text-white"
              : "bg-[var(--primary)]/10 text-[var(--primary-lighter)] hover:bg-[var(--primary)]/20"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

function CurrentChallenge({
  challengeId,
  alreadyVoted,
  challengeTokens,
}: {
  challengeId: number;
  alreadyVoted: boolean;
  challengeTokens: any[];
}) {
  const tokensQuery = useQuery({
    queryKey: ["api-challenge-tokens", challengeId],
    queryFn: async () => {
      const _list = challengeTokens;

      const promises = _list.map(async (token: any) => {
        const tokenData = await getToken(token.address);

        return {
          ...tokenData,
          totalVotes: token.totalVotes,
        };
      });

      return await Promise.all(promises);
    },
    enabled: !!challengeId,
    initialData: [],
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tokensQuery.data?.map((token: any, index: number) => (
        <TokenCard
          key={token.token_address}
          token={token}
          index={index}
          votes={token.totalVotes}
          alreadyVoted={alreadyVoted}
        />
      ))}
      {tokensQuery.data?.length === 0 && (
        <div className="col-span-2">
          <p className="text-[var(--primary-lighter)]">No tokens found</p>
        </div>
      )}
    </div>
  );
}

function AddToken({
  tokenList,
  alreadyVoted,
}: {
  tokenList: any[];
  alreadyVoted: boolean;
}) {
  const [search, setSearch] = useState("");

  const tokensQuery = useQuery({
    queryKey: ["api-tokens", search],
    queryFn: async () => {
      const tokens = await getTokens({ search });
      return tokens.filter(
        (token) => !tokenList.some((t) => t.address === token.token_address)
      );
    },
  });

  return (
    <div>
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for a token"
        variant="outline"
        className="w-full"
      />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {tokensQuery.data?.map((token: any) => (
          <TokenCard
            key={token.token_address}
            token={token}
            index={0}
            votes={0}
            alreadyVoted={alreadyVoted}
          />
        ))}
      </div>
    </div>
  );
}

// Main component
export default function Challenges() {
  const account = useAccount();
  const [activeTab, setActiveTab] = useState("current");
  const challengeInfoQuery = useQuery({
    queryKey: ["current-challenge-info"],
    queryFn: async () => {
      const currentChallengeId: any = await readContract(
        wagmiAdapter.wagmiConfig,
        {
          address: BURN_CHALLENGE_ADDRESS,
          abi: BurnChallengeABI,
          functionName: "currentChallengeId",
        }
      );

      const vaultBalance = await readContract(wagmiAdapter.wagmiConfig, {
        address: BURN_CHALLENGE_ADDRESS,
        abi: BurnChallengeABI,
        functionName: "vaultBalance",
      });

      const _challenges = Array.from(
        { length: Math.min(5, Math.max(1, Number(currentChallengeId))) },
        (_, i) => ({
          address: BURN_CHALLENGE_ADDRESS,
          abi: BurnChallengeABI as any,
          functionName: "getChallengeInfo",
          args: [Number(currentChallengeId) - i],
        })
      );

      const [challengeInfo, ...challenges]: any[] = await readContracts(
        wagmiAdapter.wagmiConfig,
        {
          contracts: [
            {
              address: BURN_CHALLENGE_ADDRESS,
              abi: BurnChallengeABI as any,
              functionName: "getChallengeInfo",
              args: [Number(currentChallengeId)],
            },
            ..._challenges,
          ],
          allowFailure: false,
        }
      );

      const previousChallengeInfo = challenges[0];

      challenges.reverse();

      const payload = {
        challengeId: Number(currentChallengeId),
        challengeInfo: {
          startTime: new Date(Number(challengeInfo[0]) * 1000),
          endTime: new Date(Number(challengeInfo[1]) * 1000),
          winningToken: challengeInfo[2],
          vaultAmount: formatEther(challengeInfo[3]),
          executed: challengeInfo[4],
          timeRemaining: Number(challengeInfo[5]),
          totalVotes: Number(challengeInfo[6]),
        },
        previousChallengeInfo: {
          startTime: new Date(Number(previousChallengeInfo[0]) * 1000),
          endTime: new Date(Number(previousChallengeInfo[1]) * 1000),
          winningToken: previousChallengeInfo[2],
          vaultAmount: Number(formatEther(previousChallengeInfo[3])),
        },
        challenges: challenges.map((challenge) => ({
          challengeId: Number(challenge[0]),
          startTime: new Date(Number(challenge[0]) * 1000),
          endTime: new Date(Number(challenge[1]) * 1000),
          winningToken: challenge[2],
          vaultAmount: formatEther(challenge[3]),
          executed: challenge[4],
          timeRemaining: Number(challenge[5]),
          totalVotes: Number(challenge[6]),
        })),
        vaultBalance: Number(formatEther(vaultBalance as any)),
      };

      console.log(payload);

      return payload;
    },

    refetchInterval: 30000,
  });

  const alreadyVotedQuery = useReadContract({
    address: BURN_CHALLENGE_ADDRESS,
    abi: BurnChallengeABI,
    functionName: "challengeHasVoted",
    args: [challengeInfoQuery.data?.challengeId, account.address],
    query: {
      enabled: !!challengeInfoQuery.data?.challengeId && !!account.address,
      refetchInterval: 60000,
    },
  });

  const challengeTokensQuery = useReadContract({
    address: BURN_CHALLENGE_ADDRESS,
    abi: BurnChallengeABI,
    functionName: "getChallengeTokens",
    args: [challengeInfoQuery.data?.challengeId],
    query: {
      enabled: !!challengeInfoQuery.data?.challengeId,
      select(data: any) {
        const tokens = data[0] as any[];
        const totalVotes = data[1] as any[];

        return tokens.map((token, index) => ({
          address: token,
          totalVotes: Number(totalVotes[index]),
        }));
      },
    },
  });

  return (
    <ContainerWrapper>
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold bg-gradient-to-r from-[var(--primary-light)] to-[var(--secondary)] bg-clip-text text-transparent"
        >
          Hourly Burn Challenge
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[var(--primary-lighter)] mt-4 max-w-2xl mx-auto"
        >
          Vote for your favorite token to be burned in the next hourly
          challenge. Tokens with the most votes will have a portion of their
          supply burned, potentially increasing their value.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-center"
        >
          {challengeInfoQuery.isSuccess && (
            <TimerComponent
              timeRemaining={
                challengeInfoQuery.data?.challengeInfo.timeRemaining ?? 0
              }
              vaultAmount={Number(challengeInfoQuery.data?.vaultBalance)}
            />
          )}
          <div className="mt-4 px-4 py-2 rounded-lg bg-[var(--primary)]/10 inline-flex">
            <span className="text-[var(--primary-lighter)]">
              Challenge #{challengeInfoQuery.data?.challengeId}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main content with navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Token cards - 2 columns on medium and 1 column on small */}
        <div className="lg:col-span-2">
          {activeTab === "current" &&
            challengeInfoQuery.data &&
            challengeTokensQuery.data && (
              <CurrentChallenge
                challengeId={challengeInfoQuery.data?.challengeId}
                alreadyVoted={alreadyVotedQuery.data as boolean}
                challengeTokens={challengeTokensQuery.data ?? []}
              />
            )}
          {activeTab === "add" &&
            challengeInfoQuery.data &&
            challengeTokensQuery.data && (
              <AddToken
                alreadyVoted={alreadyVotedQuery.data as boolean}
                tokenList={challengeTokensQuery.data ?? []}
              />
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <BurnStatisticsCard
            vaultAmount={challengeInfoQuery.data?.vaultBalance ?? 0}
            lastBurn={Number(
              challengeInfoQuery.data?.previousChallengeInfo.vaultAmount
            )}
            challengeId={Number(challengeInfoQuery.data?.challengeId)}
            challenges={challengeInfoQuery.data?.challenges ?? []}
          />
        </div>
      </div>
    </ContainerWrapper>
  );
}
