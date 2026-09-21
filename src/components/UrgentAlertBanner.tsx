import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  ChevronRight, 
  X, 
  Award, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { soundEffects } from '../lib/soundEffects';

interface UrgentAlertBannerProps {
  urgentCount: number;
  pendingSignCount: number;
  onInspectUrgent: () => void;
  onInspectSign: () => void;
}

export const UrgentAlertBanner: React.FC<UrgentAlertBannerProps> = ({
  urgentCount,
  pendingSignCount,
  onInspectUrgent,
  onInspectSign
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || (urgentCount === 0 && pendingSignCount === 0)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ type: 'spring', damping: 24, stiffness: 320 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-red-900 to-rose-950 text-white p-4 sm:p-4.5 shadow-2xl border-2 border-red-500/80 animate-glow-red"
    >
      {/* Ambient background glow & radial highlights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/25 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-64 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Left: Indicator & Message */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center shadow-lg shadow-red-900/50 border border-red-300/40">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-90"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 shadow-xs"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10.5px] font-black uppercase tracking-wider bg-red-800/90 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/40 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
                <span>ແຈ້ງເຕືອນດ່ວນທາງລັດຖະການ (Urgent Alert)</span>
              </span>
              <span className="text-xs text-red-200/90 font-medium">
                ຫ້ອງວ່າການແຂວງຫົວພັນ
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-white mt-1.5 flex items-center gap-2 flex-wrap">
              {urgentCount > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-red-950/60 border border-red-500/40 px-2.5 py-0.5 rounded-lg">
                  <span className="text-red-200">ເອກະສານດ່ວນທີ່ສຸດ:</span>
                  <span className="text-amber-300 font-black text-sm px-1.5 py-0.2 rounded bg-red-900/80 shadow-xs">{urgentCount} ສະບັບ</span>
                </span>
              )}
              {pendingSignCount > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-rose-950/60 border border-rose-500/40 px-2.5 py-0.5 rounded-lg">
                  <span className="text-rose-200">ລໍຖ້າລົງລາຍເຊັນ:</span>
                  <span className="text-amber-300 font-black text-sm px-1.5 py-0.2 rounded bg-rose-900/80 shadow-xs">{pendingSignCount} ສະບັບ</span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
          {urgentCount > 0 && (
            <button
              onClick={() => {
                soundEffects.playUrgentAlertChime();
                onInspectUrgent();
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-950/30 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer border border-amber-300"
            >
              <AlertCircle className="w-4 h-4 text-red-950" />
              <span>ກວດກາເອກະສານດ່ວນ</span>
              <ChevronRight className="w-4 h-4 text-slate-900" />
            </button>
          )}

          {pendingSignCount > 0 && (
            <button
              onClick={() => {
                soundEffects.playClickTick();
                onInspectSign();
              }}
              className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/30 backdrop-blur-md transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>ໄປໜ້າລົງລາຍເຊັນ</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 rounded-xl text-red-300 hover:text-white hover:bg-red-800/80 transition cursor-pointer border border-transparent hover:border-red-400/30"
            title="ປິດແຈ້ງເຕືອນ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
