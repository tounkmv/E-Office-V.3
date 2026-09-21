import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                ລົງທະບຽນຂໍເປີດບັນຊີໃໝ່
              </h3>
              <p className="text-xs text-blue-200">
                ຫ້ອງວ່າການແຂວງຫົວພັນ (e-Office Account Request)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
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
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                ຍົກເລີກ
              </button>
              <button
                type="submit"
                id="btn-submit-registration"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>ສົ່ງຄຳຮ້ອງຂໍເປີດບັນຊີ</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
