import { generateImageUrl } from "@/lib/utils/generate-image-url";
import api from "..";
import { parseToken } from "../helpers";

export function getToken(address: string) {
    return api.get(`/tokens/${address}`).then((res) => parseToken(res.data) as Token);
}

export function getTokenMetadata(address: string) {
    return api.get(`/token-metadata/${address}`).then((res) => {
        const data = res.data as TokenMetadata;
        return {
            ...data,
            image_url: generateImageUrl(data.image_url)
        }
    });
}

export type GetTokensParams = {
    sort?: string;
    order?: "desc" | "asc";
    limit?: number;
    search?: string;
}

export function getTokens(params?: GetTokensParams) {
    return api.get(`/tokens`, { params }).then((res) => res.data.map((x: any) => parseToken(x)) as Token[]);
}

export function getFeaturedTokens() {
    return api.get(`/tokens/ranking`).then((res) => res.data.map((x: any) => parseToken(x)) as Token[]);
}
