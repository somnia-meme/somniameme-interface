import { getTokenMetadata } from "@/lib/api/services/token";
import { useQuery } from "@tanstack/react-query";

export function useMetadata(address: string) {
    const query = useQuery({
        queryKey: ["metadata", address],
        queryFn: () => {
            return getTokenMetadata(address);
        },
        select: (data) => {
            if (!data) {
                return {
                    image_url: "/logo_placeholder.png"
                } as TokenMetadata;
            }

            return data;
        }
    });

    return query;
}

