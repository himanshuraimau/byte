import { useCallback, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "info",
  });

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({
      visible: true,
      message,
      type,
    });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      hideToast();
    }, 3000);
  }, [hideToast]);

  return {
    toast,
    showToast,
    hideToast,
  };
}
