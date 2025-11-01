import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-error-600" />
            </div>
            
            {/* Error Title */}
            <h1 className="text-rural-xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            
            {/* Error Description */}
            <p className="text-rural-base text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            {/* Error Details (in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-mono text-gray-800 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={this.handleReload}
                className="w-full btn-rural-primary flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Reload Page</span>
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="w-full btn-rural-secondary"
              >
                Go Back
              </button>
            </div>
            
            {/* Help Text */}
            <p className="text-sm text-gray-500 mt-6">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
