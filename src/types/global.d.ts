declare global {
    export interface Token {
        name: string;
        symbol: string;
        volume: number;
        owner: string;
        token_address: string;
        liquidity_pool: string;
        token_id: number;
        bonus_tokens: number;
        is_migrated: boolean;
        created_at: Date;
        updated_at: Date;
        mcap: number;
        price: number;
        old_price: number;
        migration_progress: number;
        price_change_24h: number;
        mcap_change_24h: number;
        circulation: number;
        last_tx_timestamp: Date;
        token0_reserve: number;
        token1_reserve: number;
    }

    export interface TokenMetadata {
        token_address: string;
        owner: string | null;
        name: string;
        symbol: string;
        description: string;
        image_url: string;
        telegram_url: string;
        twitter_url: string;
        discord_url: string;
        website_url: string;
    }
}

export { };
