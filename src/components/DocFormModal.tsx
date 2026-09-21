import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { 
  DocumentItem, 
  DocumentType, 
  DocumentCategory, 
  PriorityLevel, 
  DocumentAttachment,
  User
} from '../types';
import { DEPARTMENTS, STORAGE_BOXES, DOCUMENT_CATEGORIES } from '../lib/initialData';
import { validateFileUpload } from '../lib/storageService';

interface DocFormModalProps {
  type: DocumentType;
  currentUser: User;
  onClose: () => void;
  onSave: (doc: DocumentItem) => void;
  categoriesList?: string[];
  storageBoxesList?: string[];
  departmentsList?: string[];
  categoryDefaultBoxMap?: Record<string, string>;
}

export const DocFormModal: React.FC<DocFormModalProps> = ({
  type,
  currentUser,
  onClose,
  onSave,
  categoriesList = [...DOCUMENT_CATEGORIES],
  storageBoxesList = [...STORAGE_BOXES],
  departmentsList = [...DEPARTMENTS],
  categoryDefaultBoxMap
}) => {
  const [docNumber, setDocNumber] = useState(() => {
    const prefix = type === 'incoming'
      ? (localStorage.getItem('eoffice_numbering_incoming_prefix') || '/ຫຂ.ຫພ')
      : (localStorage.getItem('eoffice_numbering_outgoing_prefix') || '/ຂພ.ຫພ');
    const randomNum = String(Math.floor(100 + Math.random() * 900));
    return `${randomNum}${prefix}`;
  });
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>(categoriesList[0] || 'ແຈ້ງການ');
  const [priority, setPriority] = useState<PriorityLevel>('ທຳມະດາ');
  const [originDepartment, setOriginDepartment] = useState(
    type === 'incoming' ? 'ຫ້ອງວ່າການສຳນັກງານນາຍົກລັດຖະມົນຕີ' : (departmentsList[0] || 'ຫ້ອງວ່າການແຂວງຫົວພັນ')
  );
  const [recipientDepartment, setRecipientDepartment] = useState(
    type === 'incoming' ? (departmentsList[0] || 'ຫ້ອງວ່າການແຂວງ (ການນຳ)') : 'ບັນດາພະແນກການ ແລະ 10 ຕົວເມືອງທົ່ວແຂວງ'
  );
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [actionDate, setActionDate] = useState(new Date().toISOString().split('T')[0]);
  const [storageBox, setStorageBox] = useState(storageBoxesList[0] || 'ຕູ້ແຈ້ງການ (Notice Box)');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([currentUser.fullName]);
  const [summary, setSummary] = useState('');
  const [attachments, setAttachments] = useState<DocumentAttachment[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  // Auto-map Storage Box when Category changes
  const handleCategoryChange = (newCat: DocumentCategory) => {
    setCategory(newCat);
    if (categoryDefaultBoxMap && categoryDefaultBoxMap[newCat]) {
      setStorageBox(categoryDefaultBoxMap[newCat]);
    } else if (newCat === 'ແຈ້ງການ') setStorageBox('ຕູ້ແຈ້ງການ (Notice Box)');
    else if (newCat === 'ດຳລັດ') setStorageBox('ຕູ້ດຳລັດ (Decree Box)');
    else if (newCat === 'ຂໍ້ຕົກລົງ') setStorageBox('ຕູ້ຂໍ້ຕົກລົງ (Resolution Box)');
    else if (newCat === 'ຄຳສັ່ງ') setStorageBox('ຕູ້ຄຳສັ່ງ (Order Box)');
    else if (newCat === 'ໜັງສືສະເໜີ') setStorageBox('ຕູ້ໜັງສືສະເໜີ (Proposal Box)');
    else if (newCat === 'ບົດລາຍງານ') setStorageBox('ຕູ້ບົດລາຍງານ (Report Box)');
    else if (newCat === 'ສັນຍາ') setStorageBox('ຕູ້ສັນຍາ ແລະ ບົດບັນທຶກ (Contract Box)');
  };

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
    if (!docNumber.trim() || !title.trim()) {
      alert('ກະລຸນາປ້ອນເລກທີເອກະສານ ແລະ ເນື້ອໃນຫຍໍ້ໃຫ້ຄົບຖ້ວນ');
      return;
    }

    const now = new Date();
    const formattedTimestamp = now.toLocaleString('lo-LA');

    const newDoc: DocumentItem = {
      id: `doc_${type}_${Date.now()}`,
      docNumber: docNumber.trim(),
      title: title.trim(),
      type: type,
      category: category,
      priority: priority,
      status: 'ກຳລັງດຳເນີນການ',
      originDepartment: originDepartment.trim(),
      recipientDepartment: recipientDepartment.trim(),
      issueDate: issueDate,
      receivedDate: type === 'incoming' ? actionDate : undefined,
      dispatchDate: type === 'outgoing' ? actionDate : undefined,
      storageBox: storageBox,
      assignees: selectedAssignees,
      currentHolder: selectedAssignees[0] || currentUser.department,
      summary: summary.trim(),
      attachments: attachments,
      auditTrail: [
        {
          id: `trail_${Date.now()}`,
          timestamp: formattedTimestamp,
          user: currentUser.fullName,
          action: type === 'incoming' ? 'ລົງທະບຽນຮັບເອກະສານຂາເຂົ້າ' : 'ອອກເລກທີເອກະສານຂາອອກ',
          status: 'ກຳລັງດຳເນີນການ',
          department: currentUser.department,
          note: 'ບັນທຶກເຂົ້າສູ່ລະບົບ e-Office ຫ້ອງວ່າການແຂວງຫົວພັນ'
        }
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    onSave(newDoc);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{type === 'incoming' ? 'ລົງທະບຽນເອກະສານຂາເຂົ້າ' : 'ອອກເລກທີເອກະສານຂາອອກ'}</span>
              <span className="text-xs bg-amber-400 text-blue-950 font-bold px-2 py-0.5 rounded">
                ຫ້ອງວ່າການແຂວງຫົວພັນ
              </span>
            </h3>
            <p className="text-xs text-blue-200 mt-0.5">
              ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຖືກຕ້ອງຕາມມາດຕະຖານການບັນທຶກເອກະສານທາງລັດຖະການ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Doc Number, Category, Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ເລກທີເອກະສານ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder={type === 'incoming' ? 'ຕົວຢ່າງ: 158/ຫສນຍ' : 'ຕົວຢ່າງ: 95/ຫຂ.ຫພ'}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ປະເພດເອກະສານ
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as DocumentCategory)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ລະດັບຄວາມດ່ວນ
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
          </div>

          {/* Row 2: Title / Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ເນື້ອໃນຫຍໍ້ເອກະສານ / ຫົວຂໍ້ <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ໃສ່ເນື້ອໃນຫຍໍ້ຂອງເອກະສານທາງການ..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Row 3: Origin & Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {type === 'incoming' ? 'ມາຈາກພາກສ່ວນ / ອົງການຈັດຕັ້ງ' : 'ພາກສ່ວນຕົ້ນທາງ'}
              </label>
              <input
                type="text"
                required
                value={originDepartment}
                onChange={(e) => setOriginDepartment(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {type === 'incoming' ? 'ສົ່ງເຖິງ (ພາຍໃນຫ້ອງວ່າການ)' : 'ສົ່ງເຖິງພາກສ່ວນ / ອົງການຈັດຕັ້ງ'}
              </label>
              <input
                type="text"
                required
                value={recipientDepartment}
                onChange={(e) => setRecipientDepartment(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Dates & Storage Box Auto Mapping */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ລົງວັນທີ (Issue Date)
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {type === 'incoming' ? 'ວັນທີຮັບເຂົ້າ (Receipt Date)' : 'ວັນທີສົ່ງອອກ (Dispatch Date)'}
              </label>
              <input
                type="date"
                required
                value={actionDate}
                onChange={(e) => setActionDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ຕູ້ຈັດເກັບ (Storage Box Mapping)
              </label>
              <select
                value={storageBox}
                onChange={(e) => setStorageBox(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-blue-50 font-semibold text-blue-900"
              >
                {storageBoxesList.map((box) => (
                  <option key={box} value={box}>{box}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Assignees / Departments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ມອບໝາຍໃຫ້ຂະແໜງການ / ບຸກຄົນຮັບຜິດຊອບ
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs max-h-32 overflow-y-auto">
              {DEPARTMENTS.map((dept) => {
                const checked = selectedAssignees.includes(dept);
                return (
                  <label key={dept} className="flex items-center gap-2 cursor-pointer hover:text-blue-800">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAssignees([...selectedAssignees, dept]);
                        } else {
                          setSelectedAssignees(selectedAssignees.filter(a => a !== dept));
                        }
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="truncate">{dept}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Row 6: Attachments (<20MB validation) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ຟາຍເອກະສານຄັດຕິດ (PDF, Word, Excel &lt; 20MB)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center">
                <UploadCloud className="w-8 h-8 text-blue-600 mb-1" />
                <p className="text-xs font-semibold text-slate-700">
                  ກົດເລືອກຟາຍ ຫຼື ລາກຟາຍມາໃສ່ບ່ອນນີ້
                </p>
                <p className="text-[11px] text-slate-400">
                  ຮອງຮັບຟາຍ .pdf, .doc, .docx, .xls, .xlsx (ຂະໜາດສູງສຸດ 20MB)
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
                      <span className="text-[10px] text-slate-500">({(att.size / 1024 / 1024).toFixed(2)} MB)</span>
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

          {/* Form Footer */}
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
              id="btn-save-doc"
              className="px-6 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ບັນທຶກ ແລະ ອອກໃບຕິດຕາມ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
