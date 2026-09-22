import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Trash2, UserCheck, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import { RegistrationRequest } from '../types';

interface PendingApprovalsModalProps {
  requests: RegistrationRequest[];
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const PendingApprovalsModal: React.FC<PendingApprovalsModalProps> = ({
  requests,
  onClose,
  onApprove,
  onReject
}) => {
  const pendingOnly = requests.filter(r => r.status === 'pending');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto modal-glass-backdrop flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop click dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl modal-window-shadow overflow-hidden border border-white/20 z-10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-amber-400/25">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
                <UserCheck className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>ຄຳຮ້ອງຂໍເປີດບັນຊີໃໝ່ ທີ່ລໍຖ້າການອະນຸມັດ</span>
                  <span className="text-xs bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                    {pendingOnly.length}
                  </span>
                </h3>
                <p className="text-xs text-blue-200/90 font-medium">
                  ກວດກາ ແລະ ຢືນຢັນສິດທິການເຂົ້າເຖິງລະບົບ e-Office ຫ້ອງວ່າການແຂວງຫົວພັນ
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition border border-transparent hover:border-white/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {pendingOnly.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <ShieldAlert className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">ບໍ່ມີຄຳຮ້ອງຂໍເປີດບັນຊີຄ້າງໃນລະບົບ</p>
              <p className="text-slate-400 mt-1">ທຸກຄຳຮ້ອງໄດ້ຮັບການອະນຸມັດຮຽບຮ້ອຍແລ້ວ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOnly.map((req) => (
                <div
                  key={req.id}
                  className="p-4 border border-slate-200 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{req.fullName}</span>
                      <span className="font-mono text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        @{req.username}
                      </span>
                      <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                        {req.requestedRole}
                      </span>
                    </div>

                    <p className="text-blue-900 font-medium">{req.department}</p>
                    <p className="text-slate-600">
                      ໂທ: <span className="font-mono text-slate-900">{req.phone}</span> | ອີເມວ: {req.email}
                    </p>

                    {req.reason && (
                      <p className="text-slate-500 italic bg-white p-2 rounded border border-slate-200 text-[11px] mt-1">
                        "{req.reason}"
                      </p>
                    )}

                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>ວັນທີສົ່ງຄຳຮ້ອງ: {new Date(req.createdAt).toLocaleString('lo-LA')}</span>
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 shrink-0">
                    <button
                      id={`btn-approve-${req.id}`}
                      onClick={() => onApprove(req.id)}
                      className="w-full px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>ອະນຸມັດບັນຊີ</span>
                    </button>
                    <button
                      id={`btn-reject-${req.id}`}
                      onClick={() => onReject(req.id)}
                      className="w-full px-4 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs rounded-lg border border-rose-200 transition flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ປະຕິເສດ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            ປິດໜ້າຕ່າງ
          </button>
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
  );
};
