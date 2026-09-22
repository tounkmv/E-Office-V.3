import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { UserRole, RegistrationRequest } from '../types';
import { DEPARTMENTS } from '../lib/initialData';

interface RegisterModalProps {
  onClose: () => void;
  onSubmitRequest: (req: RegistrationRequest) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onSubmitRequest }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[1]);
  const [requestedRole, setRequestedRole] = useState<UserRole>('staff');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !phone.trim()) {
      alert('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ');
      return;
    }

    const req: RegistrationRequest = {
      id: `reg_${Date.now()}`,
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      phone: phone.trim(),
      email: email.trim() || `${username.trim().toLowerCase()}@houaphanh.gov.la`,
      department: department,
      requestedRole: requestedRole,
      reason: reason.trim() || 'ຂໍເປີດບັນຊີເພື່ອປະຕິບັດວຽກງານເອກະສານ',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onSubmitRequest(req);
    setSubmitted(true);
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
          className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl modal-window-shadow overflow-hidden border border-white/20 z-10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-amber-400/25">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
                <UserPlus className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  ລົງທະບຽນຂໍເປີດບັນຊີໃໝ່
                </h3>
                <p className="text-xs text-blue-200/90 font-medium">
                  ຫ້ອງວ່າການແຂວງຫົວພັນ • e-Office Account Request
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

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                ສົ່ງຄຳຮ້ອງຂໍບັນຊີສຳເລັດແລ້ວ!
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                ລະບົບໄດ້ສົ່ງການແຈ້ງເຕືອນຫາ ຜູ້ຄຸ້ມຄອງລະບົບ (Admin Dashboard) ແລ້ວ.<br />
                ບັນຊີຂອງທ່ານຈະສາມາດເຂົ້າໃຊ້ງານໄດ້ ພາຍຫຼັງໄດ້ຮັບການອະນຸມັດຈາກ Admin.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-800 text-white text-xs font-bold rounded-lg shadow hover:bg-blue-700 transition"
            >
              ຮັບຊາບ ແລະ ປິດໜ້າຕ່າງ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ຊື່ ແລະ ນາມສະກຸນ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ຕົວຢ່າງ: ທ່ານ ສົມຫວັງ ໄຊສົມບັດ"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ຊື່ຜູ້ໃຊ້ (Username) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="somvang.x"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ເບີໂທຕິດຕໍ່ <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="020 5xxx xxxx"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ອີເມວທາງການ (Email)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@houaphanh.gov.la"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ພາລະບົດບາດ / ສິດທິ
                </label>
                <select
                  value={requestedRole}
                  onChange={(e) => setRequestedRole(e.target.value as UserRole)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
                >
                  <option value="staff">ວິຊາການ / ພະນັກງານ (Staff)</option>
                  <option value="department_head">ຫົວໜ້າຂະແໜງ (Head of Division)</option>
                  <option value="clerk">ວິຊາການ ຂາເຂົ້າ-ຂາອອກ (Clerk)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ສັງກັດຂະແໜງການ / ພາກສ່ວນ
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ເຫດຜົນໃນການສະເໜີຂໍນຳໃຊ້ລະບົບ
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="ລະບຸເຫດຜົນຄວາມຈຳເປັນໃນການເຂົ້າເຖິງລະບົບເອກະສານ..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                id="btn-submit-registration"
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-950/20 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer border border-amber-300"
              >
                <UserPlus className="w-4 h-4 text-slate-950" />
                <span>ສົ່ງຄຳຮ້ອງຂໍເປີດບັນຊີ</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  </AnimatePresence>
  );
};
