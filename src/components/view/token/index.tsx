import { useQuery } from "@tanstack/react-query";
import { TokenSkeleton } from "./skeleton";
import { TokenWrapper } from "./wrapper";
import { getToken } from "@/lib/api/services/token";
import { Suspense } from "react";
import { useParams } from "react-router";

export function TokenViewWrapper() {
  const params = useParams();
  const address = params.address;

  const tokenQuery = useQuery({
    queryKey: ["token", address],
    queryFn: () => getToken(address as string),
    refetchInterval: 10000,
    enabled: !!address,
  });

  if (tokenQuery.isLoading) {
    return <TokenSkeleton />;
  }

  if (tokenQuery.isError) {
    return <div>Error</div>;
  }

  if (!tokenQuery.isFetched) {
    return <TokenSkeleton />;
  }

  return (
    <Suspense fallback={<TokenSkeleton />}>
      <TokenWrapper token={tokenQuery.data!} />
    </Suspense>
  );
}
