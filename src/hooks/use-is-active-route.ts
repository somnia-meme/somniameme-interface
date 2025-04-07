import { useCallback } from "react";
import { useLocation } from "react-router";

export function useIsActiveRoute(path: string) {
    const location = useLocation();
    const isActiveRoute = useCallback(
        (path: string) => {
            return location.pathname === path;
        },
        [location.pathname]
    );

    return isActiveRoute;
}
