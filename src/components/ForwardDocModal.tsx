import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { DocumentItem, User } from '../types';
import { DEPARTMENTS } from '../lib/initialData';
import { LaoEmblem } from './LaoEmblem';

interface ForwardDocModalProps {
  document: DocumentItem | null;
  currentUser: User;
  allUsers: User[];
  onClose: () => void;
  onForwardComplete: (updatedDoc: DocumentItem) => void;
}

export const ForwardDocModal: React.FC<ForwardDocModalProps> = ({
  document,
  currentUser,
  allUsers,
  onClose,
  onForwardComplete
}) => {
  const [forwardToType, setForwardToType] = useState<'department' | 'user'>('department');
  const [targetName, setTargetName] = useState(DEPARTMENTS[2]);
  const [forwardNote, setForwardNote] = useState('ສົ່ງຕໍ່ໃຫ້ຂະແໜງການກ່ຽວຂ້ອງ ຄົ້ນຄວ້າ ແລະ ດຳເນີນການຕາມພາລະບົດບາດ');
  const [newStatus, setNewStatus] = useState<'ສົ່ງຕໍ່ແລ້ວ' | 'ກຳລັງດຳເນີນການ' | 'ລໍຖ້າລົງລາຍເຊັນ'>('ສົ່ງຕໍ່ແລ້ວ');

  if (!document) return null;

  const handleForward = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('lo-LA');

    const targetUserObj = allUsers.find(u => u.fullName === targetName);
    const targetDept = forwardToType === 'department' ? targetName : (targetUserObj?.department || currentUser.department);

    const updatedDoc: DocumentItem = {
      ...document,
      currentHolder: targetName,
      currentHolderDepartment: targetDept,
      status: newStatus,
      isReadByCurrentHolder: false, // Marked as unread until new recipient acknowledges
      assignees: Array.from(new Set([...document.assignees, targetName])),
      auditTrail: [
        ...document.auditTrail,
        {
          id: `trail_${Date.now()}`,
          timestamp: formattedTimestamp,
          user: currentUser.fullName,
          action: `ສົ່ງຕໍ່ເອກະສານໃຫ້ ${targetName}`,
          status: newStatus,
          department: currentUser.department,
          note: forwardNote,
          readStatus: 'unread',
          targetRecipient: targetName,
          targetDepartment: targetDept,
          timeSpent: 'ລໍຖ້າການເປີດອ່ານ'
        }
      ],
      updatedAt: now.toISOString()
    };

    onForwardComplete(updatedDoc);
  };

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
          className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl modal-window-shadow overflow-hidden border border-white/20 z-10"
        >
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-amber-400/25">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/30 text-amber-300 border border-blue-400/30 flex items-center justify-center shadow-xs">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>ສົ່ງຕໍ່ເອກະສານທາງການ (Forward Document)</span>
                </h3>
                <p className="text-xs text-blue-200/90 font-medium">
                  ບັນທຶກເສັ້ນທາງການສົ່ງຕໍ່ ແລະ ອັບເດດຜູ້ຖືເອກະສານ
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

          <form onSubmit={handleForward} className="p-5 sm:p-6 space-y-4">
            <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-3.5 rounded-2xl border border-blue-200/80 text-xs shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-blue-900 font-mono text-sm">ເລກທີ: {document.docNumber}</span>
                <span className="text-[11px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-md">
                  {document.category}
                </span>
              </div>
              <p className="font-bold text-slate-800 mt-1.5 line-clamp-2 leading-relaxed">{document.title}</p>
              <p className="text-slate-600 text-[11px] mt-1.5 pt-1.5 border-t border-blue-200/60 flex items-center justify-between">
                <span>ຜູ້ຖືເອກະສານປະຈຸບັນ:</span>
                <span className="font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300/60">{document.currentHolder}</span>
              </p>
            </div>

            <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ສົ່ງຕໍ່ເຖິງ (Recipient Type)
            </label>
            <div className="flex items-center gap-4 text-xs font-semibold mb-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="forwardType"
                  checked={forwardToType === 'department'}
                  onChange={() => {
                    setForwardToType('department');
                    setTargetName(DEPARTMENTS[2]);
                  }}
                />
                <span>ຂະແໜງການ</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="forwardType"
                  checked={forwardToType === 'user'}
                  onChange={() => {
                    setForwardToType('user');
                    setTargetName(allUsers[1]?.fullName || allUsers[0]?.fullName);
                  }}
                />
                <span>ບຸກຄົນ / ການນຳ</span>
              </label>
            </div>

            {forwardToType === 'department' ? (
              <select
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            ) : (
              <select
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.fullName}>
                    {u.fullName} - {u.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ສະຖານະໃໝ່ຫຼັງສົ່ງຕໍ່
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
            >
              <option value="ສົ່ງຕໍ່ແລ້ວ">ສົ່ງຕໍ່ແລ້ວ (Forwarded)</option>
              <option value="ກຳລັງດຳເນີນການ">ກຳລັງດຳເນີນການ (In Progress)</option>
              <option value="ລໍຖ້າລົງລາຍເຊັນ">ລໍຖ້າລົງລາຍເຊັນ (Pending Signature)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ເນື້ອໃນຄຳແນະນຳ ຫຼື ຈຸດປະສົງໃນການສົ່ງຕໍ່
            </label>
            <textarea
              rows={3}
              value={forwardNote}
              onChange={(e) => setForwardNote(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="ໃສ່ຄຳແນະນຳໃນການດຳເນີນງານ..."
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              id="btn-confirm-forward"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-950/20 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer border border-amber-300"
            >
              <span>ຢືນຢັນການສົ່ງຕໍ່</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  </AnimatePresence>
  );
};
