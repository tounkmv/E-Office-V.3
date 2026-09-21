import { ThemeName } from '../types';

export interface ThemeConfig {
  id: ThemeName;
  nameLo: string;
  nameEn: string;
  primaryBg: string;
  primaryHeader: string;
  primaryAccent: string;
  badgeClass: string;
  activeSidebarClass: string;
  borderClass: string;
  buttonPrimary: string;
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  royal_blue: {
    id: 'royal_blue',
    nameLo: 'Royal Blue (ສີຟ້າລາດຊະການ)',
    nameEn: 'Royal Blue (Government Standard)',
    primaryBg: 'bg-slate-900',
    primaryHeader: 'bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950',
    primaryAccent: 'text-amber-400',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    activeSidebarClass: 'bg-blue-800/80 text-white shadow-sm border-l-4 border-amber-400',
    borderClass: 'border-blue-900/20',
    buttonPrimary: 'bg-blue-800 hover:bg-blue-700 text-white shadow-sm'
  },
  emerald_green: {
    id: 'emerald_green',
    nameLo: 'Emerald Green (ສີຂຽວມໍລະກົດ)',
    nameEn: 'Emerald Green',
    primaryBg: 'bg-emerald-950',
    primaryHeader: 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950',
    primaryAccent: 'text-amber-300',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    activeSidebarClass: 'bg-emerald-800/80 text-white shadow-sm border-l-4 border-amber-300',
    borderClass: 'border-emerald-900/20',
    buttonPrimary: 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-sm'
  },
  slate_dark: {
    id: 'slate_dark',
    nameLo: 'Slate Dark (ສີເທົາເຂັ້ມທັນສະໄໝ)',
    nameEn: 'Slate Dark (Executive Modern)',
    primaryBg: 'bg-slate-950',
    primaryHeader: 'bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-900',
    primaryAccent: 'text-amber-400',
    badgeClass: 'bg-slate-200 text-slate-800 border-slate-300',
    activeSidebarClass: 'bg-slate-800 text-white shadow-sm border-l-4 border-amber-400',
    borderClass: 'border-slate-800',
    buttonPrimary: 'bg-slate-800 hover:bg-slate-700 text-white shadow-sm'
  },
  crimson_gold: {
    id: 'crimson_gold',
    nameLo: 'Crimson Gold (ສີແດງ-ຄຳ ສະຫງ່າງາມ)',
    nameEn: 'Crimson Gold (Ceremonial)',
    primaryBg: 'bg-rose-950',
    primaryHeader: 'bg-gradient-to-r from-rose-950 via-red-900 to-amber-950',
    primaryAccent: 'text-yellow-300',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    activeSidebarClass: 'bg-rose-900/90 text-white shadow-sm border-l-4 border-yellow-400',
    borderClass: 'border-rose-900/20',
    buttonPrimary: 'bg-rose-900 hover:bg-rose-800 text-white shadow-sm'
  },
  golden_amber: {
    id: 'golden_amber',
    nameLo: 'Golden Amber (ສີຄຳອຳພັນ)',
    nameEn: 'Golden Amber',
    primaryBg: 'bg-amber-950',
    primaryHeader: 'bg-gradient-to-r from-amber-950 via-amber-900 to-yellow-950',
    primaryAccent: 'text-yellow-200',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    activeSidebarClass: 'bg-amber-800/80 text-white shadow-sm border-l-4 border-yellow-300',
    borderClass: 'border-amber-900/20',
    buttonPrimary: 'bg-amber-800 hover:bg-amber-700 text-white shadow-sm'
  }
};
