import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorScreen } from '../../screens/ErrorScreen';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage?: string;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AppErrorBoundary] Uncaught application error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen
          defaultType="500"
          onResetBoundary={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

