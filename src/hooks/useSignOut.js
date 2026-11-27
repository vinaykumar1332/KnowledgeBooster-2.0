import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./useToast";
import { UI_CONFIG } from "../config/ui.config";
import { ROUTES, STORAGE_KEYS, EVENTS } from "../constants";

/** Returns a function that clears the session, tells the app, and goes to the login page. */
export function useSignOut() {
    const navigate = useNavigate();
    const toast = useToast();

    return useCallback(() => {
        try {
            sessionStorage.removeItem(STORAGE_KEYS.AUTH);
        } catch {
            // storage unavailable: the authChange event still signs the user out of the UI
        }
        window.dispatchEvent(new Event(EVENTS.AUTH_CHANGE));
        toast.info(UI_CONFIG.NAV.SIGNED_OUT);
        navigate(ROUTES.LOGIN, { replace: true });
    }, [navigate, toast]);
}

export default useSignOut;
