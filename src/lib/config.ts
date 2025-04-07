import LiquidityPoolABI from "@/assets/LiquidityPool.json";
import TokenFactoryABI from "@/assets/TokenFactory.json"

export const baseUrl = import.meta.env.VITE_API_URL;
export const TOKEN_FACTORY_ADDRESS =
    import.meta.env.VITE_TOKEN_FACTORY_ADDRESS;
export const BURN_CHALLENGE_ADDRESS =
    import.meta.env.VITE_BURN_CHALLENGE_ADDRESS;
export const TOKEN_FACTORY_FEE = import.meta.env.VITE_TOKEN_FACTORY_FEE;
export const TOTAL_SUPPLY = Number(import.meta.env.VITE_TOKEN_TOTAL_SUPPLY);
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
export const RPC_URL = import.meta.env.VITE_RPC_URL as string || "https://rpc.ankr.com/somnia_testnet";
export const SCAN_URL = import.meta.env.VITE_SCAN_URL as string || "https://shannon-explorer.somnia.network";
export const SWAP_URL = import.meta.env.SWAP_URL as string || "https://somniaswap.com/#/swap";

export {
    LiquidityPoolABI,
    TokenFactoryABI
}