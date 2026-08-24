import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ModuleErrorBoundaryProps {
  moduleName: string;
  children: ReactNode;
}

interface ModuleErrorBoundaryState {
  failed: boolean;
}

export class ModuleErrorBoundary extends Component<
  ModuleErrorBoundaryProps,
  ModuleErrorBoundaryState
> {
  state: ModuleErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ModuleErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    void error;
    void info;
    // A future observability adapter may emit a sanitized module-failure event.
    // Error objects are deliberately not logged here because they may contain URLs.
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="module-error" role="alert">
          <strong>{this.props.moduleName} unavailable</strong>
          <span>Other command-center modules remain available.</span>
        </div>
      );
    }
    return this.props.children;
  }
}
