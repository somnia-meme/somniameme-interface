import { motion } from "framer-motion";
import { ContainerWrapper } from "@/components/wrapper/container-wrapper";

export function TokenSkeleton() {
  return (
    <ContainerWrapper>
      <div className="grid grid-cols-3 gap-6">
        {/* Header Skeleton */}
        <div className="col-span-full">
          <SkeletonHeader />
        </div>

        {/* Left Column */}
        <div className="col-span-1 gap-6 flex flex-col">
          <SkeletonExchanges />
          <SkeletonProgress />
          <SkeletonHolders />
        </div>

        {/* Right Column */}
        <div className="col-span-2 gap-6 flex flex-col">
          <SkeletonBody />
          <SkeletonActivityTabs />
        </div>
      </div>
    </ContainerWrapper>
  );
}

// Header skeleton component
function SkeletonHeader() {
  return (
    <div className="relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-md rounded-2xl border border-indigo-500/20 overflow-hidden"
        style={{ background: "var(--surface)" }}
      >
        {/* Top section with token image and name */}
        <div className="p-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Token image and name */}
            <div className="flex items-center">
              <div className="w-16 h-16 bg-indigo-500/20 animate-pulse rounded-lg mr-4"></div>
              <div className="flex-1">
                <div className="h-6 w-48 bg-indigo-500/20 animate-pulse rounded-md mb-2"></div>
                <div className="h-4 w-20 bg-indigo-500/20 animate-pulse rounded-md"></div>
              </div>
            </div>

            {/* Price info and social links */}
            <div className="flex-1 md:ml-auto flex flex-col md:flex-row items-start md:items-center md:justify-end gap-4">
              <div className="flex flex-col items-end">
                <div className="h-7 w-32 bg-indigo-500/20 animate-pulse rounded-md mb-2"></div>
                <div className="h-4 w-24 bg-indigo-500/20 animate-pulse rounded-md"></div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 animate-pulse"></div>
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 animate-pulse"></div>
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Token description */}
        <div className="px-6 pb-6">
          <div className="p-4 bg-indigo-900/20 rounded-xl">
            <div className="h-4 bg-indigo-500/20 animate-pulse rounded-md mb-2 w-full"></div>
            <div className="h-4 bg-indigo-500/20 animate-pulse rounded-md mb-2 w-full"></div>
            <div className="h-4 bg-indigo-500/20 animate-pulse rounded-md w-3/4"></div>

            <div className="mt-3 pt-3 border-t border-indigo-500/20 flex items-center justify-between">
              <div className="h-4 w-48 bg-indigo-500/20 animate-pulse rounded-md"></div>
              <div className="h-4 w-32 bg-indigo-500/20 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-indigo-500/20">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 flex flex-col items-center justify-center border-r border-indigo-500/20 last:border-r-0"
            >
              <div className="h-4 w-24 bg-indigo-500/20 animate-pulse rounded-md mb-2"></div>
              <div className="h-6 w-32 bg-indigo-500/20 animate-pulse rounded-md"></div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Exchanges skeleton component
function SkeletonExchanges() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md rounded-2xl border border-indigo-500/20 overflow-hidden h-48"
      style={{ background: "var(--surface)" }}
    >
      <div className="p-4">
        <div className="h-6 w-36 bg-indigo-500/20 animate-pulse rounded-md mb-4"></div>
        <div className="space-y-4">
          <div className="h-16 bg-indigo-500/20 animate-pulse rounded-xl"></div>
          <div className="h-16 bg-indigo-500/20 animate-pulse rounded-xl"></div>
        </div>
      </div>
    </motion.div>
  );
}

// Progress skeleton component
function SkeletonProgress() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md rounded-2xl border border-indigo-500/20 overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-5 h-5 bg-indigo-500/20 animate-pulse rounded-md mr-2"></div>
          <div className="h-6 w-48 bg-indigo-500/20 animate-pulse rounded-md"></div>
        </div>

        <div className="mt-4">
          <div className="h-16 bg-indigo-500/20 animate-pulse rounded-xl mb-4"></div>

          <div className="mt-4 flex justify-between relative">
            <div className="absolute top-3 left-0 right-0 h-px bg-indigo-500/20"></div>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="relative flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-indigo-900/50"></div>
                <div className="h-3 w-6 bg-indigo-500/20 animate-pulse rounded-md mt-1"></div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="h-4 bg-indigo-500/20 animate-pulse rounded-md mb-1 w-full"></div>
            <div className="h-4 bg-indigo-500/20 animate-pulse rounded-md w-3/4"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Holders skeleton component
function SkeletonHolders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md rounded-2xl border border-indigo-500/20 overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-5 h-5 bg-indigo-500/20 animate-pulse rounded-md mr-2"></div>
          <div className="h-6 w-36 bg-indigo-500/20 animate-pulse rounded-md"></div>
        </div>

        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-indigo-500/20 p-2 w-8 h-8 animate-pulse"></div>
                  <div className="h-4 w-32 bg-indigo-500/20 animate-pulse rounded-md"></div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="h-4 w-20 bg-indigo-500/20 animate-pulse rounded-md mb-1"></div>
                  <div className="flex items-center mt-1">
                    <div className="w-16 h-1.5 bg-indigo-900/50 rounded-full mr-2"></div>
                    <div className="h-3 w-8 bg-indigo-500/20 animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Body skeleton component (with price chart)
function SkeletonBody() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md rounded-2xl border border-indigo-500/20 overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      <div className="p-4">
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="h-7 w-40 bg-indigo-500/20 animate-pulse rounded-md"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-10 h-8 bg-indigo-500/20 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        </div>

        <div className="h-80 bg-indigo-500/10 animate-pulse rounded-xl flex items-center justify-center">
          <div className="text-indigo-300 text-opacity-50">
            Chart Loading...
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Activity tabs skeleton component
function SkeletonActivityTabs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md rounded-2xl border border-[var(--primary)]/20 overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      <div className="flex border-b border-[var(--primary)]/20">
        <div className="flex-1 py-4 font-medium text-white relative">
          <div className="h-5 w-24 bg-[var(--primary)]/20 animate-pulse rounded-md mx-auto"></div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"></div>
        </div>
        <div className="flex-1 py-4 font-medium text-[var(--primary-lighter)] relative">
          <div className="h-5 w-24 bg-[var(--primary)]/20 animate-pulse rounded-md mx-auto"></div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/20 blur-md -z-10"></div>
            <div className="flex items-center rounded-xl overflow-hidden border border-[var(--primary)]/30 bg-[var(--primary-darker)]/30 backdrop-blur-sm">
              <div className="w-full h-11 bg-[var(--primary)]/10 animate-pulse rounded-xl"></div>
            </div>
          </div>

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--primary-darker)]/20 backdrop-blur-sm rounded-xl p-4 border border-[var(--primary)]/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-[var(--primary)]/20 p-1.5 w-7 h-7 animate-pulse"></div>
                  <div className="h-4 w-28 bg-[var(--primary)]/20 animate-pulse rounded-md"></div>
                </div>
                <div className="h-3 w-32 bg-[var(--primary)]/20 animate-pulse rounded-md ml-auto"></div>
              </div>

              <div className="pl-7 mt-1">
                <div className="h-4 bg-[var(--primary)]/20 animate-pulse rounded-md w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
