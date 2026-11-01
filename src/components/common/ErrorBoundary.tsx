import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { translateUi } from '@/lib/localization';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // This boundary sits above the router and providers, so it uses plain
      // anchors and translateUi (cookie based) instead of router/context hooks.
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
          <div
            role="alert"
            className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-8 text-center shadow-layered sm:p-10"
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-brass/70" />
            <p className="font-serif text-sm font-semibold tracking-wide text-brass-strong">Mix Food</p>
            <div className="mx-auto mt-5 grid h-16 w-16 place-items-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/30">
              <TriangleAlert className="h-8 w-8" aria-hidden="true" />
            </div>
            <h1 className="mt-5 font-serif text-2xl font-semibold text-foreground">
              {translateUi('Something went wrong')}
            </h1>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {translateUi('An unexpected error occurred')}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="active:scale-[0.98]" onClick={() => window.location.reload()}>
                <RefreshCw aria-hidden="true" />
                {translateUi('Reload Page')}
              </Button>
              <Button asChild size="lg" variant="outline" className="active:scale-[0.98]">
                <a href="/">{translateUi('Home')}</a>
              </Button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
