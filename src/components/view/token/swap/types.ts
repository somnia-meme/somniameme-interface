export interface TokenInfo {
  address: string;
  ticker: string;
  name: string;
  logoUrl: string;
  decimals: number;
}

export interface TokenPair {
  0: TokenInfo; // Native or base token
  1: TokenInfo; // Project token
}

export interface TokenAmount {
  raw?: string | number;
  formatted?: string;
  parsed?: number;
}

export interface SwapStats {
  priceImpact: string;
  slippageTolerance: string;
}

export interface QueryResult<T> {
  data?: T;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<any>;
} 