import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangleIcon, RotateCcwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangleIcon className="h-6 w-6 text-destructive" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">
              Что-то пошло не так
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Произошла неожиданная ошибка. Попробуйте перезагрузить страницу.
            </p>
            {this.state.error ? (
              <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-muted/50 p-3 text-left text-xs text-muted-foreground">
                {this.state.error.message}
              </pre>
            ) : null}
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={this.handleReset}>
                <RotateCcwIcon className="h-4 w-4" />
                Попробовать снова
              </Button>
              <Button
                size="sm"
                onClick={() => window.location.reload()}
              >
                Перезагрузить
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
