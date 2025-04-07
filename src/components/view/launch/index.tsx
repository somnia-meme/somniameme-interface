import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { TokenInfoForm } from "@/components/view/launch/token-info-form";
import { ImageUpload } from "@/components/view/launch/image-upload";
import { SocialLinks } from "@/components/view/launch/social-links";
import { SuccessModal } from "@/components/view/launch/success-modal";
import { SubmitButton } from "@/components/view/launch/submit-button";
import { useTokenCreationForm } from "@/hooks/useTokenCreationForm";
import { memo } from "react";
import { CosmicBackground } from "@/components/view/token/swap/cosmic-background";
import { useUserStore } from "@/store/user-store";
import { useAppKit } from "@reown/appkit/react";
import { ContainerWrapper } from "@/components/wrapper/container-wrapper";

export const LaunchView = memo(() => {
  const account = useAccount();
  const user = useUserStore();
  const { open } = useAppKit();

  const {
    formData,
    errors,
    successModal,
    isLoading,
    imagePreview,
    nameRef,
    tickerRef,
    descriptionRef,
    imageRef,
    websiteLinkRef,
    telegramLinkRef,
    twitterLinkRef,
    discordLinkRef,
    handleChange,
    handleSubmit,
    closeSuccessModal,
  } = useTokenCreationForm();

  if (!account.isConnected || !user.isLoggedIn) {
    return (
      <ContainerWrapper>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-screen-2xl w-full mx-auto p-8 backdrop-blur-md rounded-2xl border border-indigo-500/20 text-center"
          style={{ background: "var(--surface)" }}
        >
          <div className="mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-20 h-20 rounded-full mx-auto flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Connect Wallet to Create Token
          </h1>
          <p className="text-indigo-300 mb-8">
            Connect your wallet to launch your token and join the cosmic
            community.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => open()}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-bold shadow-lg hover:shadow-indigo-900/25 transition-all duration-300"
          >
            Connect Wallet
          </motion.button>
        </motion.div>
      </ContainerWrapper>
    );
  }

  return (
    <ContainerWrapper>
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent"
        >
          Launch Your Cosmic Token
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-indigo-300 mt-4 max-w-2xl mx-auto"
        >
          Create your own token on the Somnia network and join the cosmic
          economy. Complete the form below to launch your stellar token!
        </motion.p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TokenInfoForm
            formData={formData}
            errors={errors as any}
            handleChange={handleChange}
            nameRef={nameRef as any}
            tickerRef={tickerRef as any}
            descriptionRef={descriptionRef as any}
          />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <ImageUpload
              imagePreview={imagePreview}
              errors={errors as any}
              handleChange={handleChange}
              imageRef={imageRef as any}
            />

            <SocialLinks
              formData={formData}
              errors={errors as any}
              handleChange={handleChange}
              websiteLinkRef={websiteLinkRef as any}
              telegramLinkRef={telegramLinkRef as any}
              twitterLinkRef={twitterLinkRef as any}
              discordLinkRef={discordLinkRef as any}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <SubmitButton isLoading={isLoading} />
        </motion.div>
      </form>

      <SuccessModal
        isOpen={successModal.isOpen}
        tokenAddress={successModal.tokenAddress}
        transactionHash={successModal.transactionHash}
        blockNumber={successModal.blockNumber}
        onClose={closeSuccessModal}
      />
    </ContainerWrapper>
  );
});
