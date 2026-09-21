import React, { useState } from 'react';
import { X, Send, ArrowRight } from 'lucide-react';
import { DocumentItem, User } from '../types';
import { DEPARTMENTS } from '../lib/initialData';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-300" />
              <span>ສົ່ງຕໍ່ເອກະສານທາງການ (Forward Document)</span>
            </h3>
            <p className="text-xs text-blue-200">
              ບັນທຶກເສັ້ນທາງການສົ່ງຕໍ່ ແລະ ອັບເດດຜູ້ຖືເອກະສານ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleForward} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-blue-900">ເລກທີ: {document.docNumber}</span>
            <p className="font-semibold text-slate-800 mt-1 line-clamp-2">{document.title}</p>
            <p className="text-slate-500 text-[11px] mt-1">
              ຜູ້ຖືເອກະສານປະຈຸບັນ: <span className="font-bold text-slate-700">{document.currentHolder}</span>
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
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              id="btn-confirm-forward"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <span>ຢືນຢັນການສົ່ງຕໍ່</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
