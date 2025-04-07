import api from "@/lib/api";
import { Button } from "../ui/form/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useUserStore } from "@/store/user-store";

export function SignMessageModal({ closeModal }: { closeModal?: () => void }) {
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const userStore = useUserStore();
  const { signMessageAsync } = useSignMessage();

  async function generateSignature() {
    const signMessageResponse = await api.get("/user/nonce");

    const nonce = signMessageResponse.data.nonce;

    const message = `Welcome to our platform!
    
    Please sign this message to verify your wallet ownership.
    This signature does not initiate a blockchain transaction or cost any gas fees.
    
    Wallet address: ${account.address}
    Nonce: ${nonce}
    Date: ${new Date().toISOString()}`;

    const signature = await signMessageAsync({
      message: message,
    });

    return {
      signature: signature,
      message: message,
    };
  }

  const handleSignMessage = async () => {
    setIsLoading(true);

    try {
      const { signature, message } = await generateSignature();
      await userStore.generateToken(signature, message);
      const user = await userStore.getUser();
      userStore.login(user as any);

      closeModal?.();
    } catch (error) {
      console.log(error);
      userStore.logout();
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-[var(--surface-dark)] border border-indigo-500/30 rounded-xl w-full overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-md mr-3 bg-indigo-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Wallet Verification
            </h3>
            <p className="text-xs text-indigo-300">
              One-time signature required
            </p>
          </div>
        </div>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-900/40 hover:bg-indigo-900/60 text-white transition-colors"
          onClick={() => closeModal?.()}
        >
          ✕
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-indigo-300">Connected Address</span>
            <span className="text-sm text-white font-medium px-3 py-2 bg-indigo-900/30 border border-indigo-500/30 rounded-lg truncate">
              {account.address}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-indigo-300 mb-2">
            Message to Sign
          </label>
          <p className="mt-2 text-xs text-indigo-300">
            Signing this message is free and doesn't cost any gas fees. This
            helps us verify that you own this wallet.
          </p>
        </div>

        <Button
          onClick={handleSignMessage}
          disabled={isLoading || !account.isConnected}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold transition-colors"
        >
          {isLoading ? "Waiting for signature..." : "Sign Message"}
        </Button>

        <p className="mt-4 text-center text-xs text-indigo-300">
          You can skip this step, but some features may be limited.
        </p>
      </div>
    </motion.div>
  );
}
