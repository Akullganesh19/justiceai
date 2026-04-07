import React from 'react';
import { AlertTriangle, RefreshCw, Bug, FileText } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Log to error reporting service (if configured)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Reload the page if onReset prop is provided
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  handleCopyError = () => {
    const errorText = `Error: ${this.state.error?.toString()}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack}`;
    navigator.clipboard.writeText(errorText).catch(console.error);
  };

  render() {
    if (this.state.hasError) {
      // If fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-void flex items-center justify-center p-6">
          <div className="max-w-2xl w-full p-12 rounded-sm bg-void border-2 border-red/40 space-y-10 shadow-hard-red/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-red/[0.02] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-red animate-pulse" />
            
            {/* Error Icon */}
            <div className="flex justify-center relative z-10">
              <div className="w-20 h-20 rounded-sm bg-red/10 border-2 border-red/40 flex items-center justify-center shadow-hard-red/10">
                <AlertTriangle className="w-10 h-10 text-red" />
              </div>
            </div>
 
            {/* Error Title */}
            <div className="text-center space-y-6 relative z-10">
              <h1 className="text-3xl font-mono font-black text-white uppercase tracking-[0.3em] italic">
                SYSTEM_CRITICAL_EXCEPTION
              </h1>
              <p className="text-[11px] text-text-tertiary font-mono uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed italic opacity-80">
                A NON-RELIABLE_STATE HAS BEEN DETECTED. CORE_LOGS HAVE BEEN CAPTURED FOR AUDIT. NO CITIZEN_DATA AT RISK.
              </p>
            </div>

            {/* Error Details (in development mode) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="p-6 rounded-sm bg-void border-2 border-white/5 space-y-4 relative z-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-red font-extrabold italic">
                    [D_BUG_LOGS_ENABLED]
                  </span>
                  <button
                    onClick={this.handleCopyError}
                    className="text-[10px] text-white hover:text-red transition-all flex items-center gap-2 uppercase font-extrabold tracking-widest italic"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    COPY_TRACE
                  </button>
                </div>
                <pre className="text-xs text-red/80 font-mono whitespace-pre-wrap break-words max-h-40 overflow-y-auto custom-scrollbar uppercase tracking-tight">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-4 group/stack">
                    <summary className="text-[9px] uppercase tracking-[0.4em] text-text-tertiary font-extrabold cursor-pointer hover:text-white transition-all italic list-none flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-sm bg-red/40 group-hover/stack:bg-red group-hover/stack:animate-pulse" />
                      VIEW_COMPONENT_STACK
                    </summary>
                    <pre className="text-[10px] text-text-tertiary/60 font-mono whitespace-pre-wrap break-words mt-4 p-4 border-l-2 border-white/5 bg-void/[0.01] max-h-32 overflow-y-auto custom-scrollbar">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 relative z-10">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-3 bg-red text-white px-8 py-5 rounded-sm font-black uppercase tracking-[0.3em] italic hover:bg-red-dark transition-all active:translate-x-[2px] active:translate-y-[2px] shadow-hard-red"
              >
                <RefreshCw className="w-5 h-5" />
                <span>R_BOOT System</span>
              </button>
 
              <button
                onClick={() => window.history.back()}
                className="flex-1 flex items-center justify-center gap-3 bg-void border-2 border-white/10 text-text-tertiary px-8 py-5 rounded-sm font-black uppercase tracking-[0.3em] italic hover:border-red hover:text-white transition-all shadow-hard active:translate-y-[1px]"
              >
                GO_BACK
              </button>
            </div>

            {/* Help Text */}
            <p className="text-center text-[10px] text-text-tertiary font-body">
              If this problem persists, please report it to our support team.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for convenience
export function withErrorBoundary(WrappedComponent, fallback) {
  return function WithErrorBoundary(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;
