import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Globe, 
  Palette, 
  LogOut, 
  UserCheck, 
  ChevronDown, 
  ShieldCheck,
  Building2,
  FileCheck,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Award,
  Sliders,
  Briefcase
} from 'lucide-react';
import { LaoEmblem } from './LaoEmblem';
import { User, ThemeName, LanguageCode } from '../types';
import { translations } from '../locales/translations';
import { THEMES } from '../lib/theme';
import { soundEffects } from '../lib/soundEffects';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  onSwitchUser: (user: User) => void;
  allUsers: User[];
  pendingRegistrationsCount: number;
  urgentDocsCount: number;
  unreadNotificationsCount?: number;
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  currentLang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
  onOpenPendingModal: () => void;
  onOpenNotificationDrawer?: () => void;
  onOpenUserManagement?: () => void;
  onOpenSystemManagement?: (tab?: 'boxes' | 'categories' | 'departments' | 'backup') => void;
  onOpenMyWork?: () => void;
  myWorkCount?: number;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onSwitchUser,
  allUsers,
  pendingRegistrationsCount,
  urgentDocsCount,
  unreadNotificationsCount,
  currentTheme,
  onThemeChange,
  currentLang,
  onLangChange,
  onOpenPendingModal,
  onOpenNotificationDrawer,
  onOpenUserManagement,
  onOpenSystemManagement,
  onOpenMyWork,
  myWorkCount,
  soundEnabled = true,
  onToggleSound
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const t = translations[currentLang];
  const theme = THEMES[currentTheme];

  const totalAlerts = unreadNotificationsCount !== undefined 
    ? unreadNotificationsCount 
    : (pendingRegistrationsCount + urgentDocsCount);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setShowLangMenu(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(target)) {
        setShowThemeMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full shadow-lg z-40 sticky top-0">
      {/* Redesigned Modern Executive Header with NO outer overflow-hidden */}
      <div className={`relative ${theme.primaryHeader} text-white border-b border-white/10 transition-colors duration-300 backdrop-blur-md`}>
        {/* Ambient Lighting strictly clipped inside its own container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
          <div className="absolute -top-16 -left-16 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 sm:py-3 relative z-10 flex items-center justify-between gap-3">
          {/* Left: Lao Emblem & Provincial Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Authentic National Emblem Medallion */}
            <LaoEmblem size={52} variant="medallion" showHalo={true} />

            {/* Typography & Official Hierarchy */}
            <div className="flex flex-col justify-center">
              {/* Main Official Title */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-white drop-shadow-xs">
                  {t.provincialOfficeTitle}
                </h1>
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400/25 to-amber-500/15 text-amber-300 border border-amber-400/35 shadow-xs shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>e-Office v2.5</span>
                </span>
              </div>

              {/* System Subtitle */}
              <p className="text-[11px] sm:text-xs text-blue-100/85 font-medium tracking-wide mt-0.5 hidden sm:block">
                {t.appTitle} ({t.appSubtitle})
              </p>
            </div>
          </div>

          {/* Right: Quick Controls, Alerts, Theme, Language & User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* My Work Quick Access in Menu Bar */}
            {onOpenMyWork && (
              <button
                id="btn-my-work-topbar"
                onClick={() => {
                  soundEffects.playClickTick();
                  onOpenMyWork();
                }}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 hover:to-amber-600/40 text-amber-200 hover:text-amber-100 border border-amber-400/40 text-xs font-bold transition shadow-xs cursor-pointer"
                title={currentLang === 'lo' ? 'ວຽກຂອງຂ້ອຍ (My Assigned Work)' : 'My Assigned Work'}
              >
                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span className="hidden md:inline">{currentLang === 'lo' ? 'ວຽກຂອງຂ້ອຍ' : 'My Tasks'}</span>
                {myWorkCount !== undefined && myWorkCount > 0 && (
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center shadow-xs">
                    {myWorkCount}
                  </span>
                )}
              </button>
            )}

            {/* Sound Alert Toggle */}
            {onToggleSound && (
              <button
                id="btn-sound-toggle"
                onClick={() => {
                  soundEffects.playClickTick();
                  onToggleSound();
                }}
                className={`p-2 rounded-xl transition border cursor-pointer ${
                  soundEnabled 
                    ? 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border-amber-400/35 shadow-xs' 
                    : 'bg-white/10 hover:bg-white/20 text-white/60 border-white/15'
                }`}
                title={
                  currentLang === 'lo'
                    ? soundEnabled ? 'ສຽງແຈ້ງເຕືອນ: ເປີດ (ກົດເພື່ອປິດ)' : 'ສຽງແຈ້ງເຕືອນ: ປິດ (ກົດເພື່ອເປີດ)'
                    : soundEnabled ? 'Audio Alerts: ON (click to mute)' : 'Audio Alerts: OFF (click to unmute)'
                }
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300" /> : <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white/60" />}
              </button>
            )}

            {/* Notifications Drawer Button */}
            <div className="relative">
              <button
                id="btn-notifications-toggle"
                onClick={() => {
                  soundEffects.playClickTick();
                  if (onOpenNotificationDrawer) {
                    onOpenNotificationDrawer();
                  }
                }}
                className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white border border-white/15 cursor-pointer"
                title={
                  currentLang === 'lo'
                    ? `ສູນແຈ້ງເຕືອນ & ວຽກດ່ວນ (${totalAlerts} ລາຍການ)`
                    : `Notification Center (${totalAlerts} items)`
                }
              >
                <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {totalAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-[10px] min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center animate-pulse shadow-md border-2 border-slate-900">
                    {totalAlerts > 99 ? '99+' : totalAlerts}
                  </span>
                )}
              </button>
            </div>

            {/* Language Switcher */}
            <div className="relative" ref={langMenuRef}>
              <button
                id="btn-lang-toggle"
                onClick={() => {
                  soundEffects.playClickTick();
                  setShowLangMenu(!showLangMenu);
                  setShowThemeMenu(false);
                  setShowUserMenu(false);
                }}
                className={`px-2.5 py-1.5 rounded-xl transition text-xs font-semibold flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                  showLangMenu
                    ? 'bg-white/25 text-white border-amber-400/50'
                    : 'bg-white/10 hover:bg-white/20 text-white/95 border-white/15'
                }`}
                title={currentLang === 'lo' ? 'ປ່ຽນພາສາ (Language)' : 'Change Language'}
              >
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentLang === 'lo' ? 'ລາວ' : 'EN'}</span>
                <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-200 ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {currentLang === 'lo' ? 'ເລືອກພາສາ / Language' : 'Select Language'}
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => {
                        soundEffects.playClickTick();
                        onLangChange('lo');
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl font-medium flex items-center justify-between transition cursor-pointer ${
                        currentLang === 'lo' ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200/80 shadow-2xs' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">🇱🇦</span>
                        <span>ພາສາລາວ (Lao)</span>
                      </span>
                      {currentLang === 'lo' && <Check className="w-4 h-4 text-blue-700" />}
                    </button>
                    <button
                      onClick={() => {
                        soundEffects.playClickTick();
                        onLangChange('en');
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl font-medium flex items-center justify-between transition cursor-pointer ${
                        currentLang === 'en' ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200/80 shadow-2xs' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">🇬🇧</span>
                        <span>English (ອັງກິດ)</span>
                      </span>
                      {currentLang === 'en' && <Check className="w-4 h-4 text-blue-700" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Switcher */}
            <div className="relative" ref={themeMenuRef}>
              <button
                id="btn-theme-toggle"
                onClick={() => {
                  soundEffects.playClickTick();
                  setShowThemeMenu(!showThemeMenu);
                  setShowLangMenu(false);
                  setShowUserMenu(false);
                }}
                className={`p-2 rounded-xl transition border shadow-xs cursor-pointer ${
                  showThemeMenu
                    ? 'bg-amber-400/25 text-amber-300 border-amber-400/50'
                    : 'bg-white/10 hover:bg-white/20 text-amber-300 border-white/15'
                }`}
                title={currentLang === 'lo' ? 'ປ່ຽນສີຮູບແບບ (Themes)' : 'Change Color Theme'}
              >
                <Palette className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-68 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.themeSelector}
                  </div>
                  <div className="space-y-1.5 mt-1.5">
                    {(Object.keys(THEMES) as ThemeName[]).map((themeKey) => {
                      const cfg = THEMES[themeKey];
                      return (
                        <button
                          key={themeKey}
                          onClick={() => {
                            soundEffects.playClickTick();
                            onThemeChange(themeKey);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-xl font-medium flex items-center justify-between transition cursor-pointer ${
                            currentTheme === themeKey ? 'bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-300 shadow-2xs' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-4 h-4 rounded-full ring-2 ring-white shadow-xs shrink-0 ${
                                themeKey === 'royal_blue'
                                  ? 'bg-blue-800'
                                  : themeKey === 'emerald_green'
                                  ? 'bg-emerald-800'
                                  : themeKey === 'slate_dark'
                                  ? 'bg-slate-900'
                                  : themeKey === 'crimson_gold'
                                  ? 'bg-rose-900'
                                  : 'bg-amber-800'
                              }`}
                            />
                            <span className="truncate">{currentLang === 'lo' ? cfg.nameLo : cfg.nameEn}</span>
                          </div>
                          {currentTheme === themeKey && <Check className="w-4 h-4 text-blue-700 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Executive User Profile & Quick Switcher */}
            <div className="relative" ref={userMenuRef}>
              <button
                id="btn-user-profile"
                onClick={() => {
                  soundEffects.playClickTick();
                  setShowUserMenu(!showUserMenu);
                  setShowThemeMenu(false);
                  setShowLangMenu(false);
                }}
                className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl transition border shadow-xs cursor-pointer ${
                  showUserMenu
                    ? 'bg-white/25 border-amber-400/50'
                    : 'bg-white/10 hover:bg-white/20 border-white/20'
                }`}
                title="ຂໍ້ມູນຜູ້ໃຊ້ ແລະ ສະຫຼັບບັນຊີ"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.fullName.slice(0, 2)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight truncate max-w-[130px] text-white">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-amber-300 font-medium truncate max-w-[130px]">
                    {currentUser.role === 'leadership' ? 'ການນຳຫ້ອງວ່າການ' : currentUser.role === 'admin' ? 'Admin ລະບົບ' : 'ວິຊາການ'}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-76 sm:w-80 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Bio Card */}
                  <div className="pb-3 border-b border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-800 text-amber-300 flex items-center justify-center font-black text-sm shadow-xs">
                        {currentUser.fullName.slice(0, 2)}
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>{currentUser.role === 'leadership' ? 'ການນຳຫ້ອງວ່າການ' : currentUser.role === 'admin' ? 'Admin ລະບົບ' : 'ວິຊາການ'}</span>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-slate-900 mt-2">{currentUser.fullName}</p>
                    <p className="text-xs text-blue-800 font-semibold mt-0.5">{currentUser.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{currentUser.department}</p>
                  </div>

                  {/* Quick Account Switch for demo / testing */}
                  <div className="mt-3">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide px-1 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {t.quickDemoLogin}
                      </span>
                      <span className="text-[10px] font-normal text-slate-400">({allUsers.length} ບັນຊີ)</span>
                    </p>
                    <div className="space-y-1 max-h-52 overflow-y-auto pr-0.5 divide-y divide-slate-50">
                      {allUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            soundEffects.playClickTick();
                            onSwitchUser(u);
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs transition flex items-center justify-between cursor-pointer ${
                            u.id === currentUser.id
                              ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200/80 shadow-2xs'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="font-semibold truncate">{u.fullName}</p>
                            <p className="text-[10px] text-slate-500 truncate">{u.title} • {u.department}</p>
                          </div>
                          {u.id === currentUser.id && <Check className="w-3.5 h-3.5 text-blue-700 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions: User Management + Logout */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1">
                    {onOpenUserManagement && (currentUser.role === 'admin' || currentUser.role === 'leadership') && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenUserManagement();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-xl transition flex items-center gap-2 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        <span>ຄຸ້ມຄອງຂໍ້ມູນບັນຊີຜູ້ໃຊ້ (User Management)</span>
                      </button>
                    )}

                    {onOpenSystemManagement && (currentUser.role === 'admin' || currentUser.role === 'leadership') && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenSystemManagement('boxes');
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 rounded-xl transition flex items-center gap-2 cursor-pointer"
                      >
                        <Sliders className="w-4 h-4 text-purple-600" />
                        <span>ຄຸ້ມຄອງກ່ອງ, ປະເພດ & ລະບົບ (System Admin)</span>
                      </button>
                    )}

                    <button
                      id="btn-logout"
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
