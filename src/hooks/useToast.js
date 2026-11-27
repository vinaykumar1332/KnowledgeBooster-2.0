import { useContext } from "react";
import { ToastContext } from "../components/toast/toastContext";

/** Returns { success, error, info, dismiss }. Must be used inside <ToastProvider>. */
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}

export default useToast;
