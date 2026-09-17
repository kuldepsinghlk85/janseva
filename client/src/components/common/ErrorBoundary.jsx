import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL REACT RUNTIME ERROR CAUGHT BY ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    try {
      localStorage.setItem('janseva_last_error', JSON.stringify({
        message: error?.message || 'Unknown error',
        stack: error?.stack || '',
        time: new Date().toISOString()
      }));
    } catch (e) {}
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-base font-black text-white">तकनीकी समस्या उत्पन्न हुई</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                एप्लिकेशन लोड करने में अस्थायी त्रुटि आई है। नीचे दिए गए बटन से पुनः प्रयास करें।
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-left text-[11px] font-mono text-rose-300 max-h-32 overflow-y-auto break-all">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition cursor-pointer shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>पुनः लोड करें</span>
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>होम पर जाएं</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
