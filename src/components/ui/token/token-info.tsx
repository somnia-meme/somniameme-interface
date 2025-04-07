import { generateFrameUrl } from "@/lib/utils/generate-image-url";
import { useMemo } from "react";

export function TokenInfo({
  token,
  metadata,
  isHovered,
}: {
  token: Token;
  metadata: TokenMetadata;
  isHovered: boolean;
}) {
  const imageSource = useMemo(() => {
    if (isHovered) {
      return metadata.image_url;
    }
    return generateFrameUrl(metadata.image_url);
  }, [metadata.image_url, isHovered]);

  return (
    <div className="p-4 relative">
      <div className="flex items-start">
        {/* Token Icon */}
        <div className="relative flex-shrink-0">
          <div className="size-14 rounded-lg overflow-hidden mr-4">
            <img
              src={imageSource}
              onError={(e: any) => {
                if (e.target.src !== metadata.image_url) {
                  e.target.src = metadata.image_url;
                }
              }}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              loading="lazy"
              decoding="async"
              alt={token.name}
            />
          </div>
        </div>

        {/* Token Name & Basic Data */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white mb-0.5 truncate max-w-32 md:max-w-full">
              {token.name}
            </h3>
            <div className="flex items-center gap-2">
              {token.migration_progress && (
                <span className="px-2 py-0.5 bg-indigo-500/20 backdrop-blur-md rounded-lg text-xs font-medium text-indigo-300">
                  {token.migration_progress.toLocaleString()}%
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-indigo-200 mb-2">${token.symbol}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-indigo-300">Volume</span>
              <div className="flex gap-1 items-center">
                <span className="text-xs font-bold text-white">
                  {token.volume.toLocaleString(undefined, {
                    maximumSignificantDigits: 3,
                  })}
                </span>
                <img src="/somnia.png" className="size-3" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-indigo-300">Market Cap</span>
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-xs font-bold text-white">
                  {token.mcap.toLocaleString(undefined, {
                    maximumSignificantDigits: 3,
                  })}
                </span>
                <img src="/somnia.png" className="size-3" />
                {!!token.mcap_change_24h && (
                  <span
                    className={`text-xs ${
                      token.mcap_change_24h >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {token.mcap_change_24h >= 0 ? "↑" : "↓"}
                    {Math.abs(token.mcap_change_24h).toLocaleString()}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
