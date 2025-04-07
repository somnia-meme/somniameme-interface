import { Input } from "@/components/ui/form/input";
import { Select } from "@/components/ui/form/select";
import { TokenObserverWrapper } from "@/components/wrapper/token-observer-wrapper";
import { getTokens } from "@/lib/api/services/token";
import { useQuery } from "@tanstack/react-query";
import { memo, useState } from "react";
import { FaCoins } from "react-icons/fa6";
import { useDebounceValue } from "usehooks-ts";

const SearchBar = memo((props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <Input
      variant="outline"
      className="w-full h-10"
      inputSize="sm"
      {...props}
      placeholder="Search by token name, symbol, or address"
    />
  );
});

const options = [
  { id: "volume", value: "volume", label: "Volume" },
  {
    id: "migration_progress",
    value: "migration_progress",
    label: "Migration Progress",
  },
  {
    id: "price_change_24h",
    value: "price_change_24h",
    label: "Price Change 24h",
  },
  {
    id: "mcap_change_24h",
    value: "mcap_change_24h",
    label: "Market Cap Change 24h",
  },
  { id: "created_at", value: "created_at", label: "Last created" },
];

const orderOptions = [
  { id: "desc", value: "desc", label: "Descending" },
  { id: "asc", value: "asc", label: "Ascending" },
];

export const TokensList = memo(
  (props: React.HTMLAttributes<HTMLDivElement>) => {
    const [search, setSearch] = useDebounceValue("", 500);
    const [sort, setSort] = useState(options[0]);
    const [order, setOrder] = useState(orderOptions[0]);

    const tokensQuery = useQuery({
      queryKey: ["tokens", search, sort, order],
      queryFn: () =>
        getTokens({
          search,
          sort: sort.value as any,
          order: order.value as any,
        }),
      refetchInterval: 10000,
    });

    if (tokensQuery.isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <section {...props}>
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-lg font-bold text-white flex items-center gap-4">
            <FaCoins />
            Tokens
          </h1>
          <p className="text-white/50 text-sm">
            You can filter tokens by their address, name, or symbol. This will
            help you find the specific token you are looking for.
          </p>
        </div>
        <div className="flex md:flex-row flex-col mb-8 gap-4">
          <SearchBar
            defaultValue={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            variant="outline"
            className="w-full md:w-64"
            buttonClassName="!h-10"
            selectSize="sm"
            options={options}
            value={sort}
            onChange={setSort as any}
          />
          <Select
            variant="outline"
            className="w-full md:w-48"
            buttonClassName="!h-10"
            selectSize="sm"
            options={orderOptions}
            value={order}
            onChange={setOrder as any}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tokensQuery.data?.map((token) => (
            <TokenObserverWrapper key={token.token_address} token={token} />
          ))}
        </div>
      </section>
    );
  }
);
