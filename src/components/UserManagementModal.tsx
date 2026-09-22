import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Edit3, Trash2, CheckCircle2, Ban, Shield, Phone, Mail, Sparkles } from 'lucide-react';
import { User, UserRole } from '../types';
import { DEPARTMENTS } from '../lib/initialData';

interface UserManagementModalProps {
  users: User[];
  onClose: () => void;
  onSaveUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  users,
  onClose,
  onSaveUser,
  onDeleteUser
}) => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [department, setDepartment] = useState(DEPARTMENTS[1]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const openAddForm = () => {
    setEditingUser(null);
    setFullName('');
    setUsername('');
    setTitle('ວິຊາການ');
    setRole('staff');
    setDepartment(DEPARTMENTS[1]);
    setPhone('020 5xxx xxxx');
    setEmail('');
    setIsAddingNew(true);
  };

  const openEditForm = (u: User) => {
    setEditingUser(u);
    setFullName(u.fullName);
    setUsername(u.username);
    setTitle(u.title);
    setRole(u.role);
    setDepartment(u.department);
    setPhone(u.phone);
    setEmail(u.email);
    setIsAddingNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) {
      alert('ກະລຸນາປ້ອນຊື່ ແລະ ຊື່ຜູ້ໃຊ້ໃຫ້ຄົບຖ້ວນ');
      return;
    }

    const updated: User = {
      id: editingUser ? editingUser.id : `usr_${Date.now()}`,
      username: username.trim().toLowerCase(),
      fullName: fullName.trim(),
      title: title.trim(),
      role: role,
      department: department,
      phone: phone.trim(),
      email: email.trim() || `${username.trim().toLowerCase()}@houaphanh.gov.la`,
      status: editingUser ? editingUser.status : 'active',
      registeredAt: editingUser?.registeredAt || new Date().toISOString()
    };

    onSaveUser(updated);
    setIsAddingNew(false);
    setEditingUser(null);
  };

  const toggleUserStatus = (u: User) => {
    const updated: User = {
      ...u,
      status: u.status === 'active' ? 'suspended' : 'active'
    };
    onSaveUser(updated);
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
          className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl modal-window-shadow overflow-hidden border border-white/20 z-10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-amber-400/25">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
                <Shield className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>ຄຸ້ມຄອງບັນຊີຜູ້ໃຊ້ງານລະບົບ</span>
                  <span className="text-xs bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                    {users.length} ບັນຊີ
                  </span>
                </h3>
                <p className="text-xs text-blue-200/90 font-medium">
                  ເພີ່ມ, ແກ້ໄຂ, ປ່ຽນສະຖານະ, ແລະ ກຳນົດສິດທິພະນັກງານ • ຫ້ອງວ່າການແຂວງຫົວພັນ
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
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {!isAddingNew ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  ບັນຊີຜູ້ໃຊ້ງານທັງໝົດ ({users.length} ບັນຊີ)
                </span>
                <button
                  id="btn-add-new-user"
                  onClick={openAddForm}
                  className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ ເພີ່ມບັນຊີພະນັກງານໃໝ່</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">ຊື່ ແລະ ຕຳແໜ່ງ</th>
                      <th className="p-3">ຂະແໜງການ</th>
                      <th className="p-3">ສິດທິ (Role)</th>
                      <th className="p-3">ຂໍ້ມູນຕິດຕໍ່</th>
                      <th className="p-3 text-center">ສະຖານະ</th>
                      <th className="p-3 text-center">ຈັດການ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{u.fullName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">@{u.username} - {u.title}</p>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">
                          {u.department}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              u.role === 'leadership'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : u.role === 'admin'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 text-[11px] space-y-0.5">
                          <div className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{u.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{u.email}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => toggleUserStatus(u)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 mx-auto ${
                              u.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                            title="ກົດເພື່ອປ່ຽນສະຖານະ"
                          >
                            {u.status === 'active' ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>ເປີດໃຊ້ງານ</span>
                              </>
                            ) : (
                              <>
                                <Ban className="w-3 h-3" />
                                <span>ລະງັບໄວ້</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditForm(u)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="ແກ້ໄຂ"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`ທ່ານຕ້ອງການລຶບບັນຊີ ${u.fullName} ແທ້ບໍ່?`)) {
                                  onDeleteUser(u.id);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="ລຶບ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                {editingUser ? 'ແກ້ໄຂຂໍ້ມູນບັນຊີພະນັກງານ' : 'ເພີ່ມບັນຊີພະນັກງານໃໝ່'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ຊື່ ແລະ ນາມສະກຸນ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ຊື່ຜູ້ໃຊ້ (Username) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ຕຳແໜ່ງ (Title)
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ສິດທິພາລະບົດບາດ (Role)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
                  >
                    <option value="leadership">ການນຳຫ້ອງວ່າການ (Leadership)</option>
                    <option value="department_head">ຫົວໜ້າຂະແໜງ (Department Head)</option>
                    <option value="admin">ຜູ້ຄຸ້ມຄອງລະບົບ (Admin)</option>
                    <option value="clerk">ວິຊາການ ຂາເຂົ້າ-ຂາອອກ (Clerk)</option>
                    <option value="staff">ວິຊາການ / ພະນັກງານ (Staff)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ສັງກັດຂະແໜງການ
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ເບີໂທລະສັບ
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ອີເມວ
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  ກັບຄືນ
                </button>
                <button
                  type="submit"
                  id="btn-save-user-profile"
                  className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-950/20 transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-amber-300"
                >
                  ບັນທຶກຂໍ້ມູນບັນຊີ
                </button>
              </div>
            </form>
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
