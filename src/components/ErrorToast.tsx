import React, { useEffect } from 'react';
import { AlertCircle, X, Volume2 } from 'lucide-react';

interface ErrorToastProps {
  message: string | null;
  onClose: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-shake">
      <div className="bg-rose-950/90 border border-rose-500/60 text-white p-4 rounded-xl shadow-2xl backdrop-blur-md flex items-start gap-3">
        <div className="p-1.5 bg-rose-900/60 rounded-lg text-rose-300 shrink-0">
          <AlertCircle className="w-5 h-5 text-rose-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
              Unexpected Action / Input Error
            </h4>
            <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Audio Alert Played
            </span>
          </div>
          <p className="text-xs text-rose-100 mt-1 leading-relaxed">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="text-rose-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
