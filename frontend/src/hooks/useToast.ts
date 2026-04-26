import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'celebration';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

type ToastOptions = Omit<ToastProps, 'id' | 'type'>;

class ToastManager {
  private toasts: ToastProps[] = [];
  private listeners: ((toasts: ToastProps[]) => void)[] = [];

  subscribe(listener: (toasts: ToastProps[]) => void) {
    this.listeners.push(listener);
    listener(this.toasts);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  add(type: ToastType, title: string, options?: ToastOptions) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastProps = {
      id,
      type,
      title,
      duration: 4000,
      ...options,
    };
    
    // Add to top of stack, keep max 5
    this.toasts = [newToast, ...this.toasts].slice(0, 5);
    this.emit();

    if (newToast.duration !== Infinity) {
      setTimeout(() => {
        this.remove(id);
      }, newToast.duration);
    }
    
    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.emit();
  }
}

const toastManager = new ToastManager();

export const toast = {
  success: (title: string, options?: ToastOptions) => toastManager.add('success', title, options),
  error: (title: string, options?: ToastOptions) => toastManager.add('error', title, options),
  warning: (title: string, options?: ToastOptions) => toastManager.add('warning', title, options),
  info: (title: string, options?: ToastOptions) => toastManager.add('info', title, options),
  celebration: (title: string, options?: ToastOptions) => toastManager.add('celebration', title, options),
  dismiss: (id: string) => toastManager.remove(id),
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    return toastManager.subscribe(setToasts);
  }, []);

  return { toasts, dismiss: toast.dismiss };
}
