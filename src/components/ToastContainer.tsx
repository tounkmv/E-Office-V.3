import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ToastMessage } from '../types/notifications';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  onToastAction?: (toast: ToastMessage) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  onToastAction
}) => {
  return (
    <div 
      className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none"
      style={{ perspective: 1000 }}
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <ToastItemCard 
            key={toast.id} 
            toast={toast} 
            onDismiss={onDismiss} 
            onAction={onToastAction} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemCardProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  onAction?: (toast: ToastMessage) => void;
}

const ToastItemCard: React.FC<ToastItemCardProps> = ({ toast, onDismiss, onAction }) => {
  const duration = toast.duration || 4500;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  // Color config based on alert type
  const config = {
    success: {
      bg: 'bg-gradient-to-br from-emerald-950/95 to-slate-950/95 border-emerald-500/80 text-white shadow-emerald-950/40',
      badge: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40 font-bold',
      icon: (
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-xs">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      ),
      bar: 'bg-gradient-to-r from-emerald-400 to-teal-300',
      tag: '✓ ສຳເລັດ (Success)'
    },
    urgent: {
      bg: 'bg-gradient-to-br from-red-950/98 to-rose-950/98 border-red-500/90 text-white shadow-red-950/50 animate-glow-red',
      badge: 'bg-red-500/30 text-amber-300 border-amber-400/40 font-black',
      icon: (
        <div className="w-8 h-8 rounded-xl bg-red-600/30 text-red-400 border border-red-400/40 flex items-center justify-center shrink-0 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-300 animate-pulse" />
        </div>
      ),
      bar: 'bg-gradient-to-r from-red-500 to-amber-400',
      tag: '🔥 ດ່ວນທີ່ສຸດ (Urgent)'
    },
    warning: {
      bg: 'bg-gradient-to-br from-amber-950/95 to-slate-950/95 border-amber-500/80 text-white shadow-amber-950/40 animate-glow-amber',
      badge: 'bg-amber-500/25 text-amber-300 border-amber-400/40 font-bold',
      icon: (
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-xs">
          <AlertTriangle className="w-5 h-5" />
        </div>
      ),
      bar: 'bg-gradient-to-r from-amber-400 to-yellow-300',
      tag: '⚠ ແຈ້ງເຕືອນ (Warning)'
    },
    info: {
      bg: 'bg-gradient-to-br from-blue-950/95 to-slate-950/95 border-blue-500/80 text-white shadow-blue-950/40',
      badge: 'bg-blue-500/25 text-blue-300 border-blue-400/40 font-bold',
      icon: (
        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0 shadow-xs">
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
      ),
      bar: 'bg-gradient-to-r from-blue-400 to-indigo-300',
      tag: 'ℹ ແຈ້ງການ (Notice)'
    }
  }[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88, x: 50 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`pointer-events-auto rounded-2xl p-4 shadow-2xl border-2 backdrop-blur-xl relative overflow-hidden ${config.bg}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-0.5">{config.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${config.badge}`}>
                {config.tag}
              </span>
              {toast.docNumber && (
                <span className="text-[11px] font-mono text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-md border border-amber-400/30 font-bold shadow-2xs">
                  {toast.docNumber}
                </span>
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white leading-snug break-words">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed break-words">
                {toast.description}
              </p>
            )}

            {onAction && toast.docNumber && (
              <button
                onClick={() => onAction(toast)}
                className="mt-2.5 px-3 py-1 bg-white/15 hover:bg-white/25 text-amber-300 hover:text-amber-200 text-[11px] font-bold rounded-lg border border-white/20 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <span>ກວດເບິ່ງເອກະສານນີ້</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80" />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition shrink-0 cursor-pointer border border-transparent hover:border-white/20"
          title="ປິດການແຈ້ງເຕືອນ"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Animated timer bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-1.5 ${config.bar}`}
      />
    </motion.div>
  );
};
