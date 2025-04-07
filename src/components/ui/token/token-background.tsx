import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import { TokenProgressEffect } from "./token-progress";
import { generateFrameUrl } from "@/lib/utils/generate-image-url";

export const TokenBackground = memo(
  ({
    image_url,
    migration_progress,
    name,
    color_scheme,
    isHovered,
  }: {
    image_url: string;
    migration_progress: number;
    name: string;
    color_scheme: any;
    isHovered: boolean;
  }) => {
    const imageSource = useMemo(() => {
      if (isHovered) {
        return image_url;
      }
      return generateFrameUrl(image_url);
    }, [image_url, isHovered]);

    return (
      <div className="rounded-xl overflow-hidden h-full cursor-pointer backdrop-blur-[1px] absolute inset-0 -z-10">
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <img
            src={imageSource}
            onError={(e: any) => {
              if (e.target.src !== image_url) {
                e.target.src = image_url;
              }
            }}
            className="w-full h-full object-cover opacity-20 scale-110 blur-[1px]"
            loading="lazy"
            decoding="async"
            alt={name}
          />

          <TokenProgressEffect
            value={migration_progress}
            color_scheme={color_scheme}
          />
        </div>
      </div>
    );
  }
);
