import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Volume2, 
  VolumeX, 
  AlertCircle, 
  Award, 
  CheckSquare, 
  Clock, 
  ChevronRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { NotificationItem, NotificationCategory } from '../types/notifications';
import { soundEffects } from '../lib/soundEffects';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (item: NotificationItem) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
  soundEnabled,
  onToggleSound
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (selectedCategory === 'all') return true;
    return n.category === selectedCategory;
  });

  const handleTestSound = () => {
    soundEffects.playUrgentAlertChime();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-400/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold shadow-md">
                    <Bell className="w-5 h-5" />
                  </div>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-blue-950 animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <span>ສູນແຈ້ງເຕືອນ & ວຽກດ່ວນ</span>
                  </h3>
                  <p className="text-[11px] text-blue-200">
                    ຫ້ອງວ່າການແຂວງຫົວພັນ • {unreadCount} ລາຍການໃໝ່
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Audio chime toggle */}
                <button
                  onClick={onToggleSound}
                  className={`p-2 rounded-xl transition ${
                    soundEnabled 
                      ? 'bg-amber-400/20 text-amber-300 hover:bg-amber-400/30' 
                      : 'bg-white/10 text-slate-400 hover:bg-white/20'
                  }`}
                  title={soundEnabled ? 'ສຽງເຕືອນ: ເປີດຢູ່ (ກົດເພື່ອປິດ)' : 'ສຽງເຕືອນ: ປິດຢູ່ (ກົດເພື່ອເປີດ)'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Close Drawer */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition"
                  title="ປິດໜ້າຕ່າງ"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sound Test & Action Bar */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestSound}
                  className="text-[11px] font-semibold text-blue-800 hover:text-blue-900 bg-blue-100/60 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>ທົດສອບສຽງເຕືອນ</span>
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-[11px] font-semibold text-slate-600 hover:text-blue-800 flex items-center gap-1 transition"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-blue-700" />
                  <span>ໝາຍວ່າອ່ານແລ້ວທັງໝົດ</span>
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="p-3 border-b border-slate-100 bg-white">
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { key: 'all', label: 'ທັງໝົດ' },
                  { key: 'urgent', label: 'ດ່ວນທີ່ສຸດ' },
                  { key: 'signature', label: 'ລໍຖ້າລົງລາຍເຊັນ' },
                  { key: 'task', label: 'ວຽກມອບໝາຍ' },
                  { key: 'system', label: 'ລະບົບ' }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => {
                      soundEffects.playClickTick();
                      setSelectedCategory(cat.key as NotificationCategory);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition text-xs ${
                      selectedCategory === cat.key
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50">
              {filteredNotifications.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-sm">ບໍ່ມີການແຈ້ງເຕືອນຄ້າງ</p>
                    <p className="text-xs text-slate-400 mt-1">
                      ເອກະສານ ແລະ ວຽກງານທັງໝົດຢູ່ໃນສະຖານະປົກກະຕິ
                    </p>
                  </div>
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const isUrgent = item.category === 'urgent';
                  const isSign = item.category === 'signature';
                  const isTask = item.category === 'task';

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        soundEffects.playClickTick();
                        onNotificationClick(item);
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer relative shadow-xs hover:shadow-md ${
                        !item.read
                          ? isUrgent
                            ? 'bg-red-50/90 border-red-200 hover:border-red-300'
                            : isSign
                            ? 'bg-amber-50/90 border-amber-200 hover:border-amber-300'
                            : 'bg-blue-50/90 border-blue-200 hover:border-blue-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Priority Dot */}
                      {!item.read && (
                        <span className={`absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full ${
                          isUrgent ? 'bg-red-600 animate-pulse' : 'bg-blue-600'
                        }`} />
                      )}

                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isUrgent 
                            ? 'bg-red-100 text-red-700' 
                            : isSign 
                            ? 'bg-amber-100 text-amber-700' 
                            : isTask 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {isUrgent && <AlertCircle className="w-4 h-4" />}
                          {isSign && <Award className="w-4 h-4" />}
                          {isTask && <CheckSquare className="w-4 h-4" />}
                          {!isUrgent && !isSign && !isTask && <Bell className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                              isUrgent 
                                ? 'bg-red-200/60 text-red-800 border-red-300' 
                                : isSign 
                                ? 'bg-amber-200/60 text-amber-800 border-amber-300' 
                                : isTask 
                                ? 'bg-emerald-200/60 text-emerald-800 border-emerald-300' 
                                : 'bg-slate-200 text-slate-700 border-slate-300'
                            }`}>
                              {isUrgent ? 'ດ່ວນທີ່ສຸດ' : isSign ? 'ລົງລາຍເຊັນ' : isTask ? 'ວຽກມອບໝາຍ' : 'ລະບົບ'}
                            </span>

                            {item.docNumber && (
                              <span className="text-[10px] font-mono font-bold text-blue-900 bg-white px-1.5 py-0.2 rounded border border-blue-200">
                                {item.docNumber}
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            {item.message}
                          </p>

                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{item.timestamp}</span>
                            </span>
                            <span className="text-blue-700 font-semibold flex items-center gap-0.5 hover:underline">
                              <span>ກວດກາດ່ວນ</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Bottom Footer Info */}
            <div className="p-3 bg-white border-t border-slate-200 text-center text-[11px] text-slate-500">
              ລະບົບແຈ້ງເຕືອນອັດຕະໂນມັດ ຫ້ອງວ່າການແຂວງຫົວພັນ
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
