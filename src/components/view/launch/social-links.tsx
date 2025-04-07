import { FC } from "react";
import { TokenFormData } from "@/hooks/useTokenCreationForm";

interface SocialLinksProps {
  formData: TokenFormData;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  websiteLinkRef: React.RefObject<HTMLInputElement>;
  telegramLinkRef: React.RefObject<HTMLInputElement>;
  twitterLinkRef: React.RefObject<HTMLInputElement>;
  discordLinkRef: React.RefObject<HTMLInputElement>;
}

export const SocialLinks: FC<SocialLinksProps> = ({
  formData,
  errors,
  handleChange,
  websiteLinkRef,
  telegramLinkRef,
  twitterLinkRef,
  discordLinkRef,
}) => {
  return (
    <div
      className="backdrop-blur-md rounded-2xl border border-indigo-500/20 p-6"
      style={{ background: "var(--surface)" }}
    >
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        Social Links
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-indigo-300 mb-2">
            Website URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </div>
            <input
              type="text"
              name="websiteLink"
              value={formData.websiteLink}
              onChange={handleChange}
              ref={websiteLinkRef}
              className={`w-full pl-10 pr-4 py-3 bg-indigo-900/30 border ${
                errors.websiteLink ? "border-pink-500" : "border-indigo-500/30"
              } rounded-lg text-white placeholder-indigo-300/50 focus:border-indigo-500 
              focus:ring-2 focus:ring-indigo-500/20 transition duration-200`}
              placeholder="https://yourwebsite.com"
            />
          </div>
          {errors.websiteLink && (
            <p className="mt-1 text-sm text-pink-500">{errors.websiteLink}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-300 mb-2">
            Telegram URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <input
              type="text"
              name="telegramLink"
              value={formData.telegramLink}
              onChange={handleChange}
              ref={telegramLinkRef}
              className={`w-full pl-10 pr-4 py-3 bg-indigo-900/30 border ${
                errors.telegramLink ? "border-pink-500" : "border-indigo-500/30"
              } rounded-lg text-white placeholder-indigo-300/50 focus:border-indigo-500 
              focus:ring-2 focus:ring-indigo-500/20 transition duration-200`}
              placeholder="https://t.me/yourgroup"
            />
          </div>
          {errors.telegramLink && (
            <p className="mt-1 text-sm text-pink-500">{errors.telegramLink}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-300 mb-2">
            Twitter URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                />
              </svg>
            </div>
            <input
              type="text"
              name="twitterLink"
              value={formData.twitterLink}
              onChange={handleChange}
              ref={twitterLinkRef}
              className={`w-full pl-10 pr-4 py-3 bg-indigo-900/30 border ${
                errors.twitterLink ? "border-pink-500" : "border-indigo-500/30"
              } rounded-lg text-white placeholder-indigo-300/50 focus:border-indigo-500 
              focus:ring-2 focus:ring-indigo-500/20 transition duration-200`}
              placeholder="https://twitter.com/yourusername"
            />
          </div>
          {errors.twitterLink && (
            <p className="mt-1 text-sm text-pink-500">{errors.twitterLink}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-300 mb-2">
            Discord URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="discordLink"
              value={formData.discordLink}
              onChange={handleChange}
              ref={discordLinkRef}
              className={`w-full pl-10 pr-4 py-3 bg-indigo-900/30 border ${
                errors.discordLink ? "border-pink-500" : "border-indigo-500/30"
              } rounded-lg text-white placeholder-indigo-300/50 focus:border-indigo-500 
              focus:ring-2 focus:ring-indigo-500/20 transition duration-200`}
              placeholder="https://discord.gg/yourserver"
            />
          </div>
          {errors.discordLink && (
            <p className="mt-1 text-sm text-pink-500">{errors.discordLink}</p>
          )}
        </div>
      </div>
    </div>
  );
}; 