import { HTMLAttributes, memo, useMemo, useState } from "react";
import { TokenBackground } from "./token-background";
import { TokenInfo } from "./token-info";
import { useMetadata } from "@/hooks/use-token-metadata";
import { useNavigate } from "react-router";

const COLOR_SCHEMES = [
  // Gold-Amber tones (Luxury style)
  {
    gradientColors: [
      "linear-gradient(90deg, rgba(245, 158, 11, 0.5) 0%, rgba(251, 191, 36, 0.5) 100%)",
      "linear-gradient(90deg, rgba(251, 191, 36, 0.5) 0%, rgba(217, 119, 6, 0.5) 100%)",
      "linear-gradient(90deg, rgba(217, 119, 6, 0.5) 0%, rgba(245, 158, 11, 0.5) 100%)",
      "linear-gradient(90deg, rgba(245, 158, 11, 0.5) 0%, rgba(251, 191, 36, 0.5) 100%)",
    ],
    glowColor: "rgba(251, 191, 36, 0.7)",
    edgeColor: "rgba(251, 191, 36, 0.8)",
    progressGradient: "from-amber-500 to-yellow-500",
    borderGlow:
      "0 0 10px rgba(251, 191, 36, 0.5), inset 0 0 5px rgba(251, 191, 36, 0.3)",
    particleColor: "rgba(251, 191, 36, 0.9)",
  },
  // Neo Navy-Blue tones (Modern style)
  {
    gradientColors: [
      "linear-gradient(90deg, rgba(79, 70, 229, 0.5) 0%, rgba(129, 140, 248, 0.5) 100%)",
      "linear-gradient(90deg, rgba(129, 140, 248, 0.5) 0%, rgba(67, 56, 202, 0.5) 100%)",
      "linear-gradient(90deg, rgba(67, 56, 202, 0.5) 0%, rgba(99, 102, 241, 0.5) 100%)",
      "linear-gradient(90deg, rgba(99, 102, 241, 0.5) 0%, rgba(79, 70, 229, 0.5) 100%)",
    ],
    glowColor: "rgba(99, 102, 241, 0.7)",
    edgeColor: "rgba(99, 102, 241, 0.8)",
    progressGradient: "from-indigo-600 to-blue-500",
    borderGlow:
      "0 0 10px rgba(99, 102, 241, 0.5), inset 0 0 5px rgba(99, 102, 241, 0.3)",
    particleColor: "rgba(129, 140, 248, 0.9)",
  },
  // Neon Red-Orange tones (Energy-filled style)
  {
    gradientColors: [
      "linear-gradient(90deg, rgba(239, 68, 68, 0.5) 0%, rgba(249, 115, 22, 0.5) 100%)",
      "linear-gradient(90deg, rgba(249, 115, 22, 0.5) 0%, rgba(220, 38, 38, 0.5) 100%)",
      "linear-gradient(90deg, rgba(220, 38, 38, 0.5) 0%, rgba(239, 68, 68, 0.5) 100%)",
      "linear-gradient(90deg, rgba(239, 68, 68, 0.5) 0%, rgba(249, 115, 22, 0.5) 100%)",
    ],
    glowColor: "rgba(239, 68, 68, 0.7)",
    edgeColor: "rgba(239, 68, 68, 0.8)",
    progressGradient: "from-red-600 to-orange-500",
    borderGlow:
      "0 0 10px rgba(239, 68, 68, 0.5), inset 0 0 5px rgba(239, 68, 68, 0.3)",
    particleColor: "rgba(249, 115, 22, 0.9)",
  },
  // Neon Turquoise-Green tones (Fresh style)
  {
    gradientColors: [
      "linear-gradient(90deg, rgba(16, 185, 129, 0.5) 0%, rgba(6, 182, 212, 0.5) 100%)",
      "linear-gradient(90deg, rgba(6, 182, 212, 0.5) 0%, rgba(5, 150, 105, 0.5) 100%)",
      "linear-gradient(90deg, rgba(5, 150, 105, 0.5) 0%, rgba(14, 165, 233, 0.5) 100%)",
      "linear-gradient(90deg, rgba(14, 165, 233, 0.5) 0%, rgba(16, 185, 129, 0.5) 100%)",
    ],
    glowColor: "rgba(16, 185, 129, 0.7)",
    edgeColor: "rgba(16, 185, 129, 0.8)",
    progressGradient: "from-emerald-500 to-cyan-500",
    borderGlow:
      "0 0 10px rgba(16, 185, 129, 0.5), inset 0 0 5px rgba(16, 185, 129, 0.3)",
    particleColor: "rgba(6, 182, 212, 0.9)",
  },
];

export const TokenWithMetadata = memo(({ token }: { token: Token }) => {
  const metadata = useMetadata(token.token_address);

  if (metadata.isLoading) return null;

  return <Token token={token} metadata={metadata.data!} />;
});

export const Token = memo(
  ({
    token,
    metadata,
    ...props
  }: {
    token: Token;
    metadata: TokenMetadata;
  } & HTMLAttributes<HTMLDivElement>) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const colorScheme = useMemo(() => {
      return COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)];
    }, []);

    return (
      <div
        className="relative group cursor-pointer h-full"
        {...props}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/token/${token.token_address}`)}
      >
        {/** Background */}
        <TokenBackground
          image_url={metadata.image_url}
          migration_progress={token.migration_progress as number}
          name={metadata.name}
          color_scheme={colorScheme}
          isHovered={isHovered}
        />

        {/** Token Info */}
        <TokenInfo token={token} metadata={metadata} isHovered={isHovered} />
      </div>
    );
  }
);
