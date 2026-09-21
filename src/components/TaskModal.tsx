import React, { useState } from 'react';
import { X, CheckCircle2, UploadCloud, FileText, AlertCircle, Calendar } from 'lucide-react';
import { TaskItem, PriorityLevel, DocumentAttachment, User } from '../types';
import { DEPARTMENTS } from '../lib/initialData';
import { validateFileUpload } from '../lib/storageService';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              ມອບໝາຍວຽກງານ ແລະ ຕິດຕາມກຳນົດເວລາ
            </h3>
            <p className="text-xs text-blue-200">
              ລະບົບມອບໝາຍວຽກທາງການ ຫ້ອງວ່າການແຂວງຫົວພັນ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
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
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              id="btn-save-task"
              className="px-6 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ບັນທຶກການມອບໝາຍວຽກ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
