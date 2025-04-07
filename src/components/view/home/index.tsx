import { ContainerWrapper } from "@/components/wrapper/container-wrapper";
import { TokensList } from "./tokens-list";
import { TokenNewLaunches } from "./new-launches-list";
import { FeaturedTokensList } from "./featured-tokens";

function HomePage() {
  return (
    <>
      <ContainerWrapper>
        <FeaturedTokensList />
        <TokenNewLaunches />
        <TokensList />
      </ContainerWrapper>
    </>
  );
}

export default HomePage;
