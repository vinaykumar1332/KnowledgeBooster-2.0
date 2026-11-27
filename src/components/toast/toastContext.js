import { createContext } from "react";

/** Holds the toast API ({ success, error, info, dismiss }). Use the useToast() hook instead of this. */
export const ToastContext = createContext(null);
