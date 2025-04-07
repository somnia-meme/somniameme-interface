import { useInView } from "react-intersection-observer";
import { Token } from "../ui/token";
import { memo } from "react";
import { getTokenMetadata } from "@/lib/api/services/token";
import { useQuery } from "@tanstack/react-query";

export const TokenObserverWrapper = memo(function TokenObserverWrapper({
  token,
}: {
  token: Token;
}) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: "200px",
  });

  const metadataQuery = useQuery({
    queryKey: ["token-metadata", token.token_address],
    queryFn: () => getTokenMetadata(token.token_address),
    enabled: inView,
  });

  return (
    <div ref={ref} className="h-full">
      {inView && metadataQuery.isFetched && (
        <Token token={token} metadata={metadataQuery.data!} />
      )}
    </div>
  );
});
