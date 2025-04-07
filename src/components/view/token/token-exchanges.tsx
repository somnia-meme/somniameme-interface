import { SwapInterface } from "./swap";
export function TokenExchanges({
  token,
  metadata,
}: {
  token: Token;
  metadata: TokenMetadata;
}) {
  return (
    <>
      <SwapInterface token={token} metadata={metadata} />
    </>
  );
}
