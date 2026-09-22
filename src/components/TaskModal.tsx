import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, UploadCloud, FileText, AlertCircle, Calendar, Sparkles, CheckSquare } from 'lucide-react';
import { TaskItem, PriorityLevel, DocumentAttachment, User } from '../types';
import { DEPARTMENTS } from '../lib/initialData';
import { validateFileUpload } from '../lib/storageService';
import { LaoEmblem } from './LaoEmblem';

interface TaskModalProps {
  currentUser: User;
  allUsers: User[];
  onClose: () => void;
  onSave: (task: TaskItem) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  currentUser,
  allUsers,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('ດ່ວນ');
  const [assigneeType, setAssigneeType] = useState<'department' | 'user'>('department');
  const [assigneeName, setAssigneeName] = useState(DEPARTMENTS[1]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [attachments, setAttachments] = useState<DocumentAttachment[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const validation = validateFileUpload(file);
    if (!validation.valid) {
      setFileError(validation.error || 'ຟາຍບໍ່ຖືກຕ້ອງ');
      return;
    }

    const newAttachment: DocumentAttachment = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setAttachments([...attachments, newAttachment]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('ກະລຸນາປ້ອນຫົວຂໍ້ ແລະ ລາຍລະອຽດການມອບໝາຍວຽກ');
      return;
    }

    const newTask: TaskItem = {
      id: `tsk_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      priority: priority,
      assigneeType: assigneeType,
      assigneeName: assigneeName,
      startDate: startDate,
      dueDate: dueDate,
      status: 'assigned',
      createdBy: currentUser.fullName,
      creatorDepartment: currentUser.department,
      attachments: attachments,
      createdAt: new Date().toISOString()
    };

    onSave(newTask);
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
          className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl modal-window-shadow overflow-hidden border border-white/20 z-10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-amber-400/25">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shadow-xs">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  ມອບໝາຍວຽກງານ ແລະ ຕິດຕາມກຳນົດເວລາ
                </h3>
                <p className="text-xs text-blue-200/90 font-medium">
                  ລະບົບມອບໝາຍວຽກທາງການ • ຫ້ອງວ່າການແຂວງຫົວພັນ
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ຫົວຂໍ້ວຽກທີ່ມອບໝາຍ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ໃສ່ຫົວຂໍ້ການມອບໝາຍວຽກ..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Priority & Assignee Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ລະດັບຄວາມດ່ວນ (Priority)
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-semibold"
              >
                <option value="ທຳມະດາ">ທຳມະດາ (Normal)</option>
                <option value="ດ່ວນ" className="text-amber-700">ດ່ວນ (Urgent)</option>
                <option value="ດ່ວນທີ່ສຸດ" className="text-red-600 font-bold">ດ່ວນທີ່ສຸດ (Most Urgent)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ປະເພດຜູ້ຮັບມອບໝາຍ
              </label>
              <div className="flex items-center gap-3 mt-1.5 text-xs font-semibold">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="assigneeType"
                    checked={assigneeType === 'department'}
                    onChange={() => {
                      setAssigneeType('department');
                      setAssigneeName(DEPARTMENTS[1]);
                    }}
                    className="text-blue-600"
                  />
                  <span>ຂະແໜງການ (Department)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="assigneeType"
                    checked={assigneeType === 'user'}
                    onChange={() => {
                      setAssigneeType('user');
                      setAssigneeName(allUsers[0]?.fullName || '');
                    }}
                    className="text-blue-600"
                  />
                  <span>ບຸກຄົນ (Individual)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Dynamic Assignee Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {assigneeType === 'department' ? 'ເລືອກຂະແໜງການທີ່ຮັບຜິດຊອບ' : 'ເລືອກບຸກຄົນທີ່ຮັບຜິດຊອບ'}
            </label>
            {assigneeType === 'department' ? (
              <select
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            ) : (
              <select
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.fullName}>
                    {u.fullName} - {u.title} ({u.department})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-700" />
                <span>ວັນທີເລີ່ມຕົ້ນ</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-red-600" />
                <span>ກຳນົດສົ່ງ (Due Date / Deadline)</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-red-950 font-bold"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ລາຍລະອຽດການມອບໝາຍວຽກ <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ລະບຸເນື້ອໃນວຽກ, ເປົ້າໝາຍ, ແລະ ຄຳແນະນຳລະອຽດ..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ຟາຍເອກະສານຄັດຕິດ (PDF, Word, Excel &lt; 20MB)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-3 text-center bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center">
                <UploadCloud className="w-6 h-6 text-blue-600 mb-1" />
                <p className="text-xs font-semibold text-slate-700">
                  ກົດເລືອກຟາຍຄັດຕິດ
                </p>
                <p className="text-[10px] text-slate-400">
                  ຮອງຮັບຟາຍ Word, Excel, PDF ບໍ່ເກີນ 20MB
                </p>
              </div>
            </div>

            {fileError && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </p>
            )}

            {attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-700" />
                      <span className="font-semibold text-blue-950 truncate max-w-xs">{att.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              id="btn-save-task"
              className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-950/20 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer border border-amber-300"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>ບັນທຶກການມອບໝາຍວຽກ</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  </AnimatePresence>
  );
};
