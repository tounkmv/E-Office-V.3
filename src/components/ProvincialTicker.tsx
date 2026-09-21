import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  FileCheck, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { soundEffects } from '../lib/soundEffects';
import { LanguageCode } from '../types';

interface ProvincialTickerProps {
  urgentCount?: number;
  pendingSignCount?: number;
  totalDocsCount?: number;
  onInspectUrgent?: () => void;
  onInspectSign?: () => void;
  currentLang?: LanguageCode;
}

export const ProvincialTicker: React.FC<ProvincialTickerProps> = ({
  urgentCount = 0,
  pendingSignCount = 0,
  totalDocsCount,
  onInspectUrgent,
  onInspectSign,
  currentLang = 'lo'
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}:${seconds}`);

      if (currentLang === 'en') {
        const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        setDateStr(`${daysEn[now.getDay()]}, ${now.getDate()} ${monthsEn[now.getMonth()]} ${now.getFullYear()}`);
      } else {
        const days = ['ວັນອາທິດ', 'ວັນຈັນ', 'ວັນອັງຄານ', 'ວັນພຸດ', 'ວັນພະຫັດ', 'ວັນສຸກ', 'ວັນເສົາ'];
        const months = [
          'ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ',
          'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'
        ];
        const dayName = days[now.getDay()];
        const dayNum = now.getDate();
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();
        setDateStr(`${dayName}, ທີ ${dayNum} ${monthName} ${year}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentLang]);

  const hasUrgentWork = urgentCount > 0 || pendingSignCount > 0;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs transition-all duration-200">
      {/* Left: Official Live Clock, Date & Readiness */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center md:justify-start w-full md:w-auto">
        {/* Date Display */}
        <div className="flex items-center gap-1.5 text-slate-700 font-semibold bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          <span>{dateStr}</span>
        </div>

        {/* Digital Time Badge */}
        <div className="flex items-center gap-1.5 bg-blue-900 text-white px-2.5 py-1.5 rounded-xl shadow-xs font-mono font-bold text-[12px] tracking-wider">
          <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>{timeStr}</span>
        </div>

        {/* System Ready Status */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentLang === 'lo' ? 'ລະບົບພ້ອມໃຊ້ງານ' : 'System Online'}</span>
        </div>
      </div>

      {/* Right: Integrated Smart Action Center (Urgent Docs & E-Sign) */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center md:justify-end w-full md:w-auto">
        {hasUrgentWork ? (
          <>
            {urgentCount > 0 && onInspectUrgent && (
              <button
                onClick={() => {
                  soundEffects.playClickTick();
                  onInspectUrgent();
                }}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-900 border border-red-200/80 font-bold text-xs transition shadow-2xs cursor-pointer"
                title={currentLang === 'lo' ? 'ກວດກາເອກະສານດ່ວນທີ່ສຸດ' : 'Inspect urgent documents'}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span>
                  {currentLang === 'lo' ? 'ເອກະສານດ່ວນທີ່ສຸດ:' : 'Urgent Docs:'}{' '}
                  <strong className="text-red-700 font-extrabold text-sm ml-0.5">{urgentCount}</strong>{' '}
                  {currentLang === 'lo' ? 'ສະບັບ' : 'items'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-red-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {pendingSignCount > 0 && onInspectSign && (
              <button
                onClick={() => {
                  soundEffects.playClickTick();
                  onInspectSign();
                }}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-950 border border-amber-200/80 font-bold text-xs transition shadow-2xs cursor-pointer"
                title={currentLang === 'lo' ? 'ໄປໜ້າລົງລາຍເຊັນເອເລັກໂຕຣນິກ' : 'Go to E-Signature'}
              >
                <FileCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>
                  {currentLang === 'lo' ? 'ລໍຖ້າລົງລາຍເຊັນ:' : 'Pending Sign:'}{' '}
                  <strong className="text-amber-800 font-extrabold text-sm ml-0.5">{pendingSignCount}</strong>{' '}
                  {currentLang === 'lo' ? 'ສະບັບ' : 'items'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-xs bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentLang === 'lo' ? 'ບໍ່ມີເອກະສານຄ້າງດ່ວນ' : 'No urgent documents pending'}</span>
            </div>

            {totalDocsCount !== undefined && (
              <span className="text-[11px] text-slate-500 bg-slate-100/90 font-medium px-2 py-0.5 rounded-lg border border-slate-200/70">
                {totalDocsCount} {currentLang === 'lo' ? 'ເອກະສານທັງໝົດ' : 'Total Docs'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
