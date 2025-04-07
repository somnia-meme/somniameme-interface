import { ContainerWrapper } from "@/components/wrapper/container-wrapper";
import { memo } from "react";
import { TokenHeader } from "./token-header";
import { TokenExchanges } from "./token-exchanges";
import { TokenProgress } from "./token-progress";
import { TokenHolders } from "./token-holders";
import { TokenBody } from "./token-body";
import { useMetadata } from "@/hooks/use-token-metadata";
import { TokenActivityTabs } from "./activity";

export const TokenWrapper = memo(({ token }: { token: Token }) => {
  const metadata = useMetadata(token.token_address);

  return (
    <ContainerWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-full">
          <TokenHeader token={token} metadata={metadata.data!} />
        </div>
        <div className="col-span-1 lg:col-span-2 gap-6 flex flex-col">
          <TokenBody token={token} />
          <TokenActivityTabs token={token} />
        </div>
        <div className="col-span-1 gap-6 flex flex-col">
          {metadata.data && (
            <TokenExchanges token={token} metadata={metadata.data!} />
          )}
          <TokenProgress token={token} />
          <TokenHolders token={token} />
        </div>
      </div>
    </ContainerWrapper>
  );
});
