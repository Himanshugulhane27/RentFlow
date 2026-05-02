import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-[var(--color-surface-raised)] border border-[hsl(var(--danger-200))] rounded-[var(--radius-lg)] shadow-sm max-w-lg mx-auto mt-8">
          <div className="w-12 h-12 rounded-full bg-[hsl(var(--danger-50))] flex items-center justify-center mb-4 text-[hsl(var(--danger-500))]">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-lg font-semibold text-[hsl(var(--text-primary))] mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-[hsl(var(--text-secondary))] text-center mb-6 max-w-md">
            An unexpected error occurred. Our team has been notified. Please try reloading the page.
          </p>
          <div className="bg-[var(--color-surface)] p-3 rounded text-xs font-mono text-[hsl(var(--text-tertiary))] w-full overflow-x-auto mb-6">
            {this.state.error?.message || 'Unknown error'}
          </div>
          <Button 
            onClick={this.handleReload} 
            icon={<RefreshCw size={16} />}
          >
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
