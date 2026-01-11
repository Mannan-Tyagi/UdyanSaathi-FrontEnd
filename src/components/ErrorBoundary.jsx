import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-canvas">
          <div className="text-center p-8 bg-surface backdrop-blur rounded-card border border-mist shadow-card max-w-md mx-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-ink mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-metal mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="text-left mb-6 p-4 bg-canvas rounded-card text-xs text-metal overflow-auto max-h-40">
                <summary className="cursor-pointer font-semibold mb-2 text-ink">Error Details</summary>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-button transition"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-canvas hover:bg-mist text-ink rounded-button transition border border-mist"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
