import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./useToast";
import { UI_CONFIG } from "../config/ui.config";

/** Returns a function that clears the session, tells the app, and goes to the login page. */
export function useSignOut() {
    const navigate = useNavigate();
    const toast = useToast();

    return useCallback(() => {
        try {
            sessionStorage.removeItem("auth");
        } catch {
            // storage unavailable: the authChange event below still signs the user out of the UI
        }
        window.dispatchEvent(new Event("authChange"));
        toast.info(UI_CONFIG.NAV.SIGNED_OUT);
        navigate("/login", { replace: true });
    }, [navigate, toast]);
}

export default useSignOut;
