import React, { useState } from 'react';
import { 
  X, 
  Archive, 
  Tag, 
  Building2, 
  Hash, 
  Database, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  MapPin, 
  Info, 
  Download, 
  UploadCloud, 
  RefreshCw,
  Palette,
  Globe,
  Sliders,
  Check
} from 'lucide-react';
import { 
  StorageBoxItem, 
  DocumentCategoryItem, 
  DepartmentItem, 
  DocumentItem, 
  ThemeName, 
  LanguageCode 
} from '../types';
import { soundEffects } from '../lib/soundEffects';

export type SystemAdminTab = 'boxes' | 'categories' | 'departments' | 'numbering' | 'backup';

interface SystemManagementModalProps {
  initialTab?: SystemAdminTab;
  storageBoxes: StorageBoxItem[];
  onSaveStorageBox: (box: StorageBoxItem) => void;
  onDeleteStorageBox: (boxId: string) => void;
  categories: DocumentCategoryItem[];
  onSaveCategory: (category: DocumentCategoryItem) => void;
  onDeleteCategory: (categoryId: string) => void;
  departments: DepartmentItem[];
  onSaveDepartment: (dept: DepartmentItem) => void;
  onDeleteDepartment: (deptId: string) => void;
  documents: DocumentItem[];
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

const COLOR_OPTIONS = [
  { value: 'blue', label: 'ສີຟ້າ (Blue)', bg: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'indigo', label: 'ສີຄາມ (Indigo)', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { value: 'emerald', label: 'ສີຂຽວ (Emerald)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { value: 'rose', label: 'ສີແດງກຸຫຼາບ (Rose)', bg: 'bg-rose-100 text-rose-800 border-rose-300' },
  { value: 'amber', label: 'ສີສົ້ມອຳພັນ (Amber)', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'purple', label: 'ສີມ່ວງ (Purple)', bg: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: 'teal', label: 'ສີຂຽວໄຂ່ການົກ (Teal)', bg: 'bg-teal-100 text-teal-800 border-teal-300' },
  { value: 'cyan', label: 'ສີຟ້າສະຫວ່າງ (Cyan)', bg: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  { value: 'slate', label: 'ສີເທົາ (Slate)', bg: 'bg-slate-100 text-slate-800 border-slate-300' }
];

export const SystemManagementModal: React.FC<SystemManagementModalProps> = ({
  initialTab = 'boxes',
  storageBoxes,
  onSaveStorageBox,
  onDeleteStorageBox,
  categories,
  onSaveCategory,
  onDeleteCategory,
  departments,
  onSaveDepartment,
  onDeleteDepartment,
  documents,
  currentTheme,
  onThemeChange,
  currentLanguage,
  onLanguageChange,
  onExportBackup,
  onImportBackup,
  onResetDefaults,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<SystemAdminTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Box State Form
  const [editingBox, setEditingBox] = useState<StorageBoxItem | null>(null);
  const [isAddingBox, setIsAddingBox] = useState(false);
  const [boxCode, setBoxCode] = useState('');
  const [boxName, setBoxName] = useState('');
  const [boxLocation, setBoxLocation] = useState('');
  const [boxCapacity, setBoxCapacity] = useState('500');
  const [boxDescription, setBoxDescription] = useState('');

  // 2. Category State Form
  const [editingCat, setEditingCat] = useState<DocumentCategoryItem | null>(null);
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [catCode, setCatCode] = useState('');
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('blue');
  const [catDefaultBox, setCatDefaultBox] = useState(storageBoxes[0]?.name || '');
  const [catDescription, setCatDescription] = useState('');

  // 3. Department State Form
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptLeader, setDeptLeader] = useState('');
  const [deptPhone, setDeptPhone] = useState('');
  const [deptEmail, setDeptEmail] = useState('');

  // 4. Numbering Format Settings (persisted to localStorage)
  const [incomingPrefix, setIncomingPrefix] = useState(() => {
    return localStorage.getItem('eoffice_numbering_incoming_prefix') || '/ຫຂ.ຫພ';
  });
  const [outgoingPrefix, setOutgoingPrefix] = useState(() => {
    return localStorage.getItem('eoffice_numbering_outgoing_prefix') || '/ຂພ.ຫພ';
  });
  const [currentYear, setCurrentYear] = useState(() => {
    return localStorage.getItem('eoffice_numbering_year') || '2026';
  });
  const [numberingSavedAlert, setNumberingSavedAlert] = useState(false);

  // Success Feedback Toast inside Modal
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionSuccessMsg(msg);
    soundEffects.playSuccessChime();
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // --- STORAGE BOX HANDLERS ---
  const handleOpenAddBox = () => {
    setEditingBox(null);
    setBoxCode(`BOX-${String(storageBoxes.length + 1).padStart(2, '0')}`);
    setBoxName('');
    setBoxLocation('ຕູ້ເກັບມ້ຽນ ຊັ້ນ 1 (ຫ້ອງເກັບມ້ຽນ)');
    setBoxCapacity('500');
    setBoxDescription('');
    setIsAddingBox(true);
    soundEffects.playClickTick();
  };

  const handleOpenEditBox = (b: StorageBoxItem) => {
    setEditingBox(b);
    setBoxCode(b.code);
    setBoxName(b.name);
    setBoxLocation(b.location);
    setBoxCapacity(String(b.capacity || 500));
    setBoxDescription(b.description || '');
    setIsAddingBox(true);
    soundEffects.playClickTick();
  };

  const handleSaveBoxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boxName.trim() || !boxCode.trim()) {
      alert('ກະລຸນາປ້ອນລະຫັດ ແລະ ຊື່ກ່ອງເອກະສານໃຫ້ຄົບຖ້ວນ');
      return;
    }

    const newBox: StorageBoxItem = {
      id: editingBox ? editingBox.id : `box_${Date.now()}`,
      code: boxCode.trim().toUpperCase(),
      name: boxName.trim(),
      location: boxLocation.trim() || 'ຫ້ອງເກັບມ້ຽນເອກະສານ',
      capacity: parseInt(boxCapacity, 10) || 500,
      description: boxDescription.trim(),
      createdAt: editingBox ? editingBox.createdAt : new Date().toISOString()
    };

    onSaveStorageBox(newBox);
    setIsAddingBox(false);
    setEditingBox(null);
    showFeedback(editingBox ? 'ປັບປຸງຂໍ້ມູນກ່ອງເອກະສານສຳເລັດ' : 'ເພີ່ມກ່ອງເອກະສານໃໝ່ສຳເລັດ');
  };

  const handleDeleteBoxConfirm = (box: StorageBoxItem) => {
    const activeDocsCount = documents.filter(d => d.storageBox === box.name).length;
    if (activeDocsCount > 0) {
      const confirmDelete = window.confirm(
        `ແຈ້ງເຕືອນ: ກ່ອງ "${box.name}" ມີເອກະສານບັນຈຸຢູ່ ${activeDocsCount} ສະບັບ!\nທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບກ່ອງເອກະສານນີ້ອອກຈາກລະບົບ?`
      );
      if (!confirmDelete) return;
    } else {
      const confirmDelete = window.confirm(`ທ່ານຕ້ອງການລົບກ່ອງເອກະສານ "${box.name}" ແທ້ຫຼືບໍ່?`);
      if (!confirmDelete) return;
    }

    onDeleteStorageBox(box.id);
    showFeedback(`ລົບກ່ອງເອກະສານ "${box.name}" ອອກແລ້ວ`);
  };

  // --- CATEGORY HANDLERS ---
  const handleOpenAddCat = () => {
    setEditingCat(null);
    setCatCode(`CAT-${String(categories.length + 1).padStart(2, '0')}`);
    setCatName('');
    setCatColor('blue');
    setCatDefaultBox(storageBoxes[0]?.name || '');
    setCatDescription('');
    setIsAddingCat(true);
    soundEffects.playClickTick();
  };

  const handleOpenEditCat = (c: DocumentCategoryItem) => {
    setEditingCat(c);
    setCatCode(c.code);
    setCatName(c.name);
    setCatColor(c.color || 'blue');
    setCatDefaultBox(c.defaultStorageBox || storageBoxes[0]?.name || '');
    setCatDescription(c.description || '');
    setIsAddingCat(true);
    soundEffects.playClickTick();
  };

  const handleSaveCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      alert('ກະລຸນາປ້ອນຊື່ປະເພດເອກະສານ');
      return;
    }

    const newCat: DocumentCategoryItem = {
      id: editingCat ? editingCat.id : `cat_${Date.now()}`,
      code: catCode.trim().toUpperCase() || 'CAT',
      name: catName.trim(),
      color: catColor,
      defaultStorageBox: catDefaultBox,
      description: catDescription.trim(),
      createdAt: editingCat ? editingCat.createdAt : new Date().toISOString()
    };

    onSaveCategory(newCat);
    setIsAddingCat(false);
    setEditingCat(null);
    showFeedback(editingCat ? 'ປັບປຸງປະເພດເອກະສານສຳເລັດ' : 'ເພີ່ມປະເພດເອກະສານໃໝ່ສຳເລັດ');
  };

  const handleDeleteCatConfirm = (cat: DocumentCategoryItem) => {
    const activeDocsCount = documents.filter(d => d.category === cat.name).length;
    if (activeDocsCount > 0) {
      const confirmDelete = window.confirm(
        `ແຈ້ງເຕືອນ: ປະເພດ "${cat.name}" ມີເອກະສານຖືກຈັດເຂົ້າໃນປະເພດນີ້ ${activeDocsCount} ສະບັບ!\nທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບປະເພດເອກະສານນີ້?`
      );
      if (!confirmDelete) return;
    } else {
      const confirmDelete = window.confirm(`ທ່ານຕ້ອງການລົບປະເພດເອກະສານ "${cat.name}" ແທ້ຫຼືບໍ່?`);
      if (!confirmDelete) return;
    }

    onDeleteCategory(cat.id);
    showFeedback(`ລົບປະເພດເອກະສານ "${cat.name}" ອອກແລ້ວ`);
  };

  // --- DEPARTMENT HANDLERS ---
  const handleOpenAddDept = () => {
    setEditingDept(null);
    setDeptCode(`SEC-${String(departments.length + 1).padStart(2, '0')}`);
    setDeptName('');
    setDeptLeader('');
    setDeptPhone('020 ');
    setDeptEmail('');
    setIsAddingDept(true);
    soundEffects.playClickTick();
  };

  const handleOpenEditDept = (d: DepartmentItem) => {
    setEditingDept(d);
    setDeptCode(d.code);
    setDeptName(d.name);
    setDeptLeader(d.leaderName || '');
    setDeptPhone(d.phone || '');
    setDeptEmail(d.email || '');
    setIsAddingDept(true);
    soundEffects.playClickTick();
  };

  const handleSaveDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) {
      alert('ກະລຸນາປ້ອນຊື່ຂະແໜງການ / ພະແນກການ');
      return;
    }

    const newDept: DepartmentItem = {
      id: editingDept ? editingDept.id : `dep_${Date.now()}`,
      code: deptCode.trim().toUpperCase() || 'SEC',
      name: deptName.trim(),
      leaderName: deptLeader.trim(),
      phone: deptPhone.trim(),
      email: deptEmail.trim(),
      createdAt: editingDept ? editingDept.createdAt : new Date().toISOString()
    };

    onSaveDepartment(newDept);
    setIsAddingDept(false);
    setEditingDept(null);
    showFeedback(editingDept ? 'ປັບປຸງຂໍ້ມູນພະແນກການສຳເລັດ' : 'ເພີ່ມພະແນກການໃໝ່ສຳເລັດ');
  };

  const handleDeleteDeptConfirm = (dept: DepartmentItem) => {
    const activeDocsCount = documents.filter(
      d => d.originDepartment === dept.name || d.recipientDepartment === dept.name
    ).length;
    if (activeDocsCount > 0) {
      const confirmDelete = window.confirm(
        `ແຈ້ງເຕືອນ: ພະແນກ/ຂະແໜງການ "${dept.name}" ມີເອກະສານກ່ຽວຂ້ອງ ${activeDocsCount} ສະບັບ!\nທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບ?`
      );
      if (!confirmDelete) return;
    } else {
      const confirmDelete = window.confirm(`ທ່ານຕ້ອງການລົບ "${dept.name}" ແທ້ຫຼືບໍ່?`);
      if (!confirmDelete) return;
    }

    onDeleteDepartment(dept.id);
    showFeedback(`ລົບ "${dept.name}" ອອກແລ້ວ`);
  };

  // --- NUMBERING FORMAT SAVE ---
  const handleSaveNumberingSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('eoffice_numbering_incoming_prefix', incomingPrefix);
    localStorage.setItem('eoffice_numbering_outgoing_prefix', outgoingPrefix);
    localStorage.setItem('eoffice_numbering_year', currentYear);
    setNumberingSavedAlert(true);
    soundEffects.playSuccessChime();
    setTimeout(() => setNumberingSavedAlert(false), 3000);
  };

  // Filtered queries
  const q = searchQuery.toLowerCase().trim();
  const filteredBoxes = storageBoxes.filter(
    b => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q) || b.location.toLowerCase().includes(q)
  );

  const filteredCategories = categories.filter(
    c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q))
  );

  const filteredDepartments = departments.filter(
    d => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || (d.leaderName && d.leaderName.toLowerCase().includes(q))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>ສູນຄຸ້ມຄອງ ແລະ ຕັ້ງຄ່າລະບົບ (System Administration Hub)</span>
              </h2>
              <p className="text-xs text-blue-200">
                ຈັດການກ່ອງເອກະສານ, ປະເພດເອກະສານ, ພະແນກການ ແລະ ຮູບແບບການຈັດເກັບ ຫ້ອງວ່າການແຂວງຫົວພັນ
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playClickTick();
              onClose();
            }}
            className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Feedback Banner */}
        {actionSuccessMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-800 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionSuccessMsg}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 pt-3 flex flex-wrap gap-1.5 shrink-0 overflow-x-auto">
          <button
            id="tab-btn-boxes"
            onClick={() => {
              setActiveTab('boxes');
              setSearchQuery('');
              setIsAddingBox(false);
              soundEffects.playClickTick();
            }}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-2 border-t-2 ${
              activeTab === 'boxes'
                ? 'bg-white text-blue-900 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-transparent'
            }`}
          >
            <Archive className="w-4 h-4 text-blue-600" />
            <span>ກ່ອງເອກະສານ (Storage Boxes)</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {storageBoxes.length}
            </span>
          </button>

          <button
            id="tab-btn-categories"
            onClick={() => {
              setActiveTab('categories');
              setSearchQuery('');
              setIsAddingCat(false);
              soundEffects.playClickTick();
            }}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-2 border-t-2 ${
              activeTab === 'categories'
                ? 'bg-white text-indigo-900 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-transparent'
            }`}
          >
            <Tag className="w-4 h-4 text-indigo-600" />
            <span>ປະເພດເອກະສານ (Categories)</span>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {categories.length}
            </span>
          </button>

          <button
            id="tab-btn-departments"
            onClick={() => {
              setActiveTab('departments');
              setSearchQuery('');
              setIsAddingDept(false);
              soundEffects.playClickTick();
            }}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-2 border-t-2 ${
              activeTab === 'departments'
                ? 'bg-white text-emerald-900 border-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-transparent'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>ພະແນກການ/ຂະແໜງການ (Departments)</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {departments.length}
            </span>
          </button>

          <button
            id="tab-btn-numbering"
            onClick={() => {
              setActiveTab('numbering');
              soundEffects.playClickTick();
            }}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-2 border-t-2 ${
              activeTab === 'numbering'
                ? 'bg-white text-purple-900 border-purple-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-transparent'
            }`}
          >
            <Hash className="w-4 h-4 text-purple-600" />
            <span>ຮູບແບບເລກທີ & ຄວາມດ່ວນ</span>
          </button>

          <button
            id="tab-btn-backup"
            onClick={() => {
              setActiveTab('backup');
              soundEffects.playClickTick();
            }}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-2 border-t-2 ${
              activeTab === 'backup'
                ? 'bg-white text-slate-900 border-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-transparent'
            }`}
          >
            <Database className="w-4 h-4 text-slate-700" />
            <span>ສຳຮອງ & ຕັ້ງຄ່າຖານຂໍ້ມູນ</span>
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 bg-slate-50/50">
          
          {/* ========================================================= */}
          {/* TAB 1: STORAGE BOXES (ກ່ອງເອກະສານ) */}
          {/* ========================================================= */}
          {activeTab === 'boxes' && (
            <div className="space-y-4">
              {/* Actions Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="relative flex-1 w-full sm:w-auto">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ຄົ້ນຫາຊື່ກ່ອງ, ລະຫັດ, ຫຼື ທີ່ຕັ້ງ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <button
                  id="btn-add-new-box"
                  onClick={handleOpenAddBox}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>ເພີ່ມກ່ອງເອກະສານໃໝ່</span>
                </button>
              </div>

              {/* Add / Edit Box Drawer Form */}
              {isAddingBox && (
                <form 
                  onSubmit={handleSaveBoxSubmit}
                  className="bg-blue-50/60 border-2 border-blue-200 rounded-xl p-4 space-y-4 shadow-sm animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                    <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                      <Archive className="w-4 h-4 text-blue-700" />
                      <span>{editingBox ? 'ແກ້ໄຂຂໍ້ມູນກ່ອງເອກະສານ' : 'ເພີ່ມກ່ອງເອກະສານໃໝ່'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingBox(false)}
                      className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>ປິດ</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ລະຫັດກ່ອງ (Box Code) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={boxCode}
                        onChange={(e) => setBoxCode(e.target.value)}
                        placeholder="ຕົວຢ່າງ: BOX-08, A-01"
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ຊື່ກ່ອງເອກະສານ (Storage Box Name) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={boxName}
                        onChange={(e) => setBoxName(e.target.value)}
                        placeholder="ຕົວຢ່າງ: ຕູ້ເອກະສານໂຄງການພິເສດ, ຕູ້ແຈ້ງການທົ່ວໄປ"
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ທີ່ຕັ້ງ / ຕູ້ / ຊັ້ນເກັບມ້ຽນ (Location)
                      </label>
                      <input
                        type="text"
                        value={boxLocation}
                        onChange={(e) => setBoxLocation(e.target.value)}
                        placeholder="ຕົວຢ່າງ: ຕູ້ H - ຊັ້ນ 3 (ຫ້ອງເກັບມ້ຽນ 102)"
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ຄວາມຈຸສູງສຸດ (ສະບັບ)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={boxCapacity}
                        onChange={(e) => setBoxCapacity(e.target.value)}
                        placeholder="500"
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ລາຍລະອຽດ / ເນື້ອໃນເກັບມ້ຽນ (Description)
                      </label>
                      <textarea
                        rows={2}
                        value={boxDescription}
                        onChange={(e) => setBoxDescription(e.target.value)}
                        placeholder="ອະທິບາຍປະເພດເອກະສານ ຫຼື ຂໍ້ຄວນລະວັງໃນການເກັບມ້ຽນ..."
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-200">
                    <button
                      type="button"
                      onClick={() => setIsAddingBox(false)}
                      className="px-4 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 hover:bg-slate-100 font-medium"
                    >
                      ຍົກເລີກ
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingBox ? 'ບັນທຶກການແກ້ໄຂ' : 'ບັນທຶກກ່ອງເອກະສານ'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Boxes List View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredBoxes.map((box) => {
                  const docCount = documents.filter(d => d.storageBox === box.name).length;
                  const capacity = box.capacity || 500;
                  const percent = Math.min(100, Math.round((docCount / capacity) * 100));

                  return (
                    <div
                      key={box.id}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-blue-300 transition flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md font-mono text-[11px] font-bold">
                              {box.code}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">
                              {box.name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditBox(box)}
                              title="ແກ້ໄຂ"
                              className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBoxConfirm(box)}
                              title="ລົບ"
                              className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {box.location && (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{box.location}</span>
                          </p>
                        )}

                        {box.description && (
                          <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 bg-slate-50 p-2 rounded-lg">
                            {box.description}
                          </p>
                        )}
                      </div>

                      {/* Capacity & Real-time Document Count */}
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">ເອກະສານບັນຈຸ:</span>
                          <span className="font-bold text-slate-800">
                            {docCount} <span className="text-slate-400 font-normal">/ {capacity} ສະບັບ ({percent}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percent > 85 ? 'bg-rose-500' : percent > 50 ? 'bg-amber-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredBoxes.length === 0 && (
                  <div className="col-span-full py-10 text-center bg-white rounded-xl border border-slate-200">
                    <Archive className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">ບໍ່ພົບກ່ອງເອກະສານທີ່ຕົງກັບຄຳຄົ້ນຫາ</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: DOCUMENT CATEGORIES (ປະເພດເອກະສານ) */}
          {/* ========================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              {/* Actions Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="relative flex-1 w-full sm:w-auto">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ຄົ້ນຫາປະເພດເອກະສານ, ລະຫັດຫຍໍ້..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <button
                  id="btn-add-new-category"
                  onClick={handleOpenAddCat}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-800 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>ເພີ່ມປະເພດເອກະສານໃໝ່</span>
                </button>
              </div>

              {/* Add / Edit Category Drawer Form */}
              {isAddingCat && (
                <form 
                  onSubmit={handleSaveCatSubmit}
                  className="bg-indigo-50/60 border-2 border-indigo-200 rounded-xl p-4 space-y-4 shadow-sm animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between border-b border-indigo-200 pb-2">
                    <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-indigo-700" />
                      <span>{editingCat ? 'ແກ້ໄຂປະເພດເອກະສານ' : 'ເພີ່ມປະເພດເອກະສານໃໝ່'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingCat(false)}
                      className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>ປິດ</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ລະຫັດຫຍໍ້ (Short Code)
                      </label>
                      <input
                        type="text"
                        value={catCode}
                        onChange={(e) => setCatCode(e.target.value)}
                        placeholder="ຕົວຢ່າງ: NOT, MIN, MOU"
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ຊື່ປະເພດເອກະສານ (Category Name) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        placeholder="ຕົວຢ່າງ: ບົດບັນທຶກກອງປະຊຸມ, ແຈ້ງການ"
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ສີປ້າຍກຳກັບ (Badge Color)
                      </label>
                      <select
                        value={catColor}
                        onChange={(e) => setCatColor(e.target.value)}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        {COLOR_OPTIONS.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ກ່ອງເກັບມ້ຽນເລີ່ມຕົ້ນ (Default Storage Box)
                      </label>
                      <select
                        value={catDefaultBox}
                        onChange={(e) => setCatDefaultBox(e.target.value)}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        {storageBoxes.map(b => (
                          <option key={b.id} value={b.name}>{b.name} ({b.code})</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ລາຍລະອຽດ / ຄຳອະທິບາຍ (Description)
                      </label>
                      <textarea
                        rows={2}
                        value={catDescription}
                        onChange={(e) => setCatDescription(e.target.value)}
                        placeholder="ອະທິບາຍລັກສະນະຂອງປະເພດເອກະສານນີ້..."
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-indigo-200">
                    <button
                      type="button"
                      onClick={() => setIsAddingCat(false)}
                      className="px-4 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 hover:bg-slate-100 font-medium"
                    >
                      ຍົກເລີກ
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 rounded-lg bg-indigo-800 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingCat ? 'ບັນທຶກການແກ້ໄຂ' : 'ບັນທຶກປະເພດເອກະສານ'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Categories Table View */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">ລະຫັດ</th>
                        <th className="py-3 px-4">ຊື່ປະເພດເອກະສານ</th>
                        <th className="py-3 px-4">ກ່ອງເກັບມ້ຽນເລີ່ມຕົ້ນ</th>
                        <th className="py-3 px-4 text-center">ເອກະສານໃນລະບົບ</th>
                        <th className="py-3 px-4">ລາຍລະອຽດ</th>
                        <th className="py-3 px-4 text-right">ຈັດການ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCategories.map((cat) => {
                        const count = documents.filter(d => d.category === cat.name).length;
                        const colTheme = COLOR_OPTIONS.find(c => c.value === cat.color) || COLOR_OPTIONS[0];

                        return (
                          <tr key={cat.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4 font-mono font-bold text-slate-600">
                              {cat.code}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${colTheme.bg}`}>
                                {cat.name}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {cat.defaultStorageBox || '-'}
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-slate-800">
                              <span className="px-2 py-0.5 bg-slate-100 rounded-full">
                                {count} ສະບັບ
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                              {cat.description || '-'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleOpenEditCat(cat)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                                  title="ແກ້ໄຂ"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCatConfirm(cat)}
                                  className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                                  title="ລົບ"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredCategories.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            ບໍ່ພົບປະເພດເອກະສານທີ່ຄົ້ນຫາ
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: DEPARTMENTS (ພະແນກການ / ຂະແໜງການ) */}
          {/* ========================================================= */}
          {activeTab === 'departments' && (
            <div className="space-y-4">
              {/* Actions Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="relative flex-1 w-full sm:w-auto">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ຄົ້ນຫາຊື່ຂະແໜງການ, ຫົວໜ້າຂະແໜງ, ລະຫັດ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <button
                  id="btn-add-new-department"
                  onClick={handleOpenAddDept}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>ເພີ່ມພະແນກ / ຂະແໜງການໃໝ່</span>
                </button>
              </div>

              {/* Add / Edit Department Drawer Form */}
              {isAddingDept && (
                <form 
                  onSubmit={handleSaveDeptSubmit}
                  className="bg-emerald-50/60 border-2 border-emerald-200 rounded-xl p-4 space-y-4 shadow-sm animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                      <span>{editingDept ? 'ແກ້ໄຂຂໍ້ມູນພະແນກ / ຂະແໜງການ' : 'ເພີ່ມພະແນກ / ຂະແໜງການໃໝ່'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingDept(false)}
                      className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>ປິດ</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ລະຫັດຫຍໍ້ (Code)
                      </label>
                      <input
                        type="text"
                        value={deptCode}
                        onChange={(e) => setDeptCode(e.target.value)}
                        placeholder="ຕົວຢ່າງ: SEC-ADM, SEC-FIN"
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ຊື່ພະແນກ / ຂະແໜງການ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={deptName}
                        onChange={(e) => setDeptName(e.target.value)}
                        placeholder="ຕົວຢ່າງ: ຂະແໜງເຕັກໂນໂລຊີ ແລະ ການສື່ສານ"
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ຫົວໜ້າຂະແໜງ / ຜູ້ຊີ້ນຳ
                      </label>
                      <input
                        type="text"
                        value={deptLeader}
                        onChange={(e) => setDeptLeader(e.target.value)}
                        placeholder="ຕົວຢ່າງ: ທ່ານ ບຸນມີ ວົງສາ"
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ເບີໂທລະສັບຕິດຕໍ່
                      </label>
                      <input
                        type="text"
                        value={deptPhone}
                        onChange={(e) => setDeptPhone(e.target.value)}
                        placeholder="020 5541 2899"
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ອີເມວທາງການ
                      </label>
                      <input
                        type="email"
                        value={deptEmail}
                        onChange={(e) => setDeptEmail(e.target.value)}
                        placeholder="contact@houaphanh.gov.la"
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200">
                    <button
                      type="button"
                      onClick={() => setIsAddingDept(false)}
                      className="px-4 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 hover:bg-slate-100 font-medium"
                    >
                      ຍົກເລີກ
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingDept ? 'ບັນທຶກການແກ້ໄຂ' : 'ບັນທຶກພະແນກການ'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Departments Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredDepartments.map((dept) => {
                  const relatedDocs = documents.filter(
                    d => d.originDepartment === dept.name || d.recipientDepartment === dept.name
                  ).length;

                  return (
                    <div
                      key={dept.id}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md font-mono text-[11px] font-bold">
                            {dept.code}
                          </span>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditDept(dept)}
                              className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                              title="ແກ້ໄຂ"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDeptConfirm(dept)}
                              className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                              title="ລົບ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 mt-2 leading-tight">
                          {dept.name}
                        </h4>

                        <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                          {dept.leaderName && (
                            <p className="flex items-center gap-1.5">
                              <span className="text-slate-400">ຫົວໜ້າ:</span>
                              <span className="font-medium text-slate-700">{dept.leaderName}</span>
                            </p>
                          )}
                          {dept.phone && (
                            <p className="flex items-center gap-1.5">
                              <span className="text-slate-400">ໂທ:</span>
                              <span>{dept.phone}</span>
                            </p>
                          )}
                          {dept.email && (
                            <p className="flex items-center gap-1.5 truncate">
                              <span className="text-slate-400">ອີເມວ:</span>
                              <span>{dept.email}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">ເອກະສານກ່ຽວຂ້ອງ:</span>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {relatedDocs} ສະບັບ
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredDepartments.length === 0 && (
                  <div className="col-span-full py-8 text-center bg-white rounded-xl border border-slate-200">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">ບໍ່ພົບພະແນກການທີ່ຕົງກັບຄຳຄົ້ນຫາ</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: NUMBERING SERIES & PRIORITIES (ຮູບແບບເລກທີ & ຄວາມດ່ວນ) */}
          {/* ========================================================= */}
          {activeTab === 'numbering' && (
            <div className="space-y-5">
              <form 
                onSubmit={handleSaveNumberingSettings}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-purple-700" />
                    <span>ກຳນົດຮູບແບບເລກທີເອກະສານທາງການ (Document Numbering Series)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    ຮູບແບບເລກທີຈະຖືກນຳໃຊ້ໃນການແນະນຳລະຫັດເອກະສານອັດຕະໂນມັດ ເວລາລົງທະບຽນເອກະສານຂາເຂົ້າ ແລະ ຂາອອກ
                  </p>
                </div>

                {numberingSavedAlert && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ບັນທຶກການຕັ້ງຄ່າຮູບແບບເລກທີເອກະສານຮຽບຮ້ອຍແລ້ວ</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ຮູບແບບເລກທີຂາເຂົ້າ (Incoming Suffix)
                    </label>
                    <input
                      type="text"
                      value={incomingPrefix}
                      onChange={(e) => setIncomingPrefix(e.target.value)}
                      placeholder="/ຫຂ.ຫພ"
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">ຕົວຢ່າງ: 0142{incomingPrefix}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ຮູບແບບເລກທີຂາອອກ (Outgoing Suffix)
                    </label>
                    <input
                      type="text"
                      value={outgoingPrefix}
                      onChange={(e) => setOutgoingPrefix(e.target.value)}
                      placeholder="/ຂພ.ຫພ"
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">ຕົວຢ່າງ: 0089{outgoingPrefix}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ປີລັດຖະການປະຈຸບັນ (Fiscal Year)
                    </label>
                    <input
                      type="text"
                      value={currentYear}
                      onChange={(e) => setCurrentYear(e.target.value)}
                      placeholder="2026"
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-800 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>ບັນທຶກການຕັ້ງຄ່າເລກທີ</span>
                  </button>
                </div>
              </form>

              {/* Priority Classifications Preview */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>ລະດັບຄວາມດ່ວນມາດຕະຖານ (Standard Priority Levels)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                    <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full">
                      ດ່ວນທີ່ສຸດ (Urgent)
                    </span>
                    <p className="text-xs text-red-950 font-medium pt-1">ກຳນົດແກ້ໄຂພາຍໃນ 24 ຊົ່ວໂມງ</p>
                    <p className="text-[11px] text-red-700">ແຈ້ງເຕືອນສີແດງພ້ອມສຽງສັນຍານດ່ວນໃນ Dashboard</p>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                    <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded-full">
                      ດ່ວນ (High)
                    </span>
                    <p className="text-xs text-amber-950 font-medium pt-1">ກຳນົດແກ້ໄຂພາຍໃນ 3 ວັນລັດຖະການ</p>
                    <p className="text-[11px] text-amber-700">ຕິດຕາມໃນຕາຕະລາງເອກະສານໃກ້ຮອດກຳນົດ</p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                      ທຳມະດາ (Normal)
                    </span>
                    <p className="text-xs text-blue-950 font-medium pt-1">ດຳເນີນການຕາມລະບຽບປົກກະຕິ</p>
                    <p className="text-[11px] text-blue-700">ກຳນົດແກ້ໄຂພາຍໃນ 7 ວັນລັດຖະການ</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: BACKUP & DATABASE (ສຳຮອງ & ຕັ້ງຄ່າຖານຂໍ້ມູນ) */}
          {/* ========================================================= */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Theme Selector */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                    <Palette className="w-4 h-4 text-blue-600" />
                    <span>ປ່ຽນຮູບແບບສີສັນ (Theme Appearance)</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: 'royal_blue', name: 'Royal Blue (ສີຟ້າລາດຊະການ)', color: 'bg-blue-800' },
                      { id: 'emerald_green', name: 'Emerald Green (ສີຂຽວມໍລະກົດ)', color: 'bg-emerald-800' },
                      { id: 'slate_dark', name: 'Slate Dark (ສີເທົາເຂັ້ມທັນສະໄໝ)', color: 'bg-slate-900' },
                      { id: 'crimson_gold', name: 'Crimson Gold (ສີແດງ-ຄຳ ສະຫງ່າງາມ)', color: 'bg-rose-900' },
                      { id: 'golden_amber', name: 'Golden Amber (ສີຄຳອຳພັນ)', color: 'bg-amber-800' }
                    ].map((thm) => (
                      <button
                        key={thm.id}
                        onClick={() => onThemeChange(thm.id as ThemeName)}
                        className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium flex items-center justify-between transition ${
                          currentTheme === thm.id
                            ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full ${thm.color}`} />
                          <span>{thm.name}</span>
                        </div>
                        {currentTheme === thm.id && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Language & Audio Preferences */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs mb-2">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      <span>ພາສາການສະແດງຜົນ (Language)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onLanguageChange('lo')}
                        className={`p-2.5 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-2 ${
                          currentLanguage === 'lo'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>🇱🇦 ພາສາລາວ (Lao)</span>
                      </button>
                      <button
                        onClick={() => onLanguageChange('en')}
                        className={`p-2.5 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-2 ${
                          currentLanguage === 'en'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>🇬🇧 English</span>
                      </button>
                    </div>
                  </div>

                  {/* Audio Chimes Switch */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">ສຽງສັນຍານແຈ້ງເຕືອນ (Sound Effects)</p>
                        <p className="text-[11px] text-slate-500">ສຽງສັນຍານເວລາບັນທຶກ, ສົ່ງຕໍ່ ແລະ ສຳເລັດວຽກ</p>
                      </div>
                      <button
                        onClick={() => soundEffects.toggleSound()}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                      >
                        ທົດສອບສຽງ
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Export JSON Backup */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>ດາວໂຫຼດສຳຮອງຖານຂໍ້ມູນ (Export JSON Backup)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    ດາວໂຫຼດຖານຂໍ້ມູນທັງໝົດລວມມີ: ເອກະສານ, ກ່ອງເອກະສານ, ປະເພດ, ພະແນກການ, ຜູ້ໃຊ້ງານ ແລະ ວຽກງານ ເປັນໄຟລ໌ JSON ສຳຮອງໄວ້ໃນຄອມພິວເຕີຂອງທ່ານ.
                  </p>
                  <button
                    onClick={onExportBackup}
                    className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>ດາວໂຫຼດໄຟລ໌ສຳຮອງ (Download Backup JSON)</span>
                  </button>
                </div>

                {/* 4. Import JSON Restore */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                    <UploadCloud className="w-4 h-4 text-blue-600" />
                    <span>ກູ້ຄືນຖານຂໍ້ມູນຈາກໄຟລ໌ (Restore JSON Backup)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    ເລືອກໄຟລ໌ JSON ທີ່ເຄີຍສຳຮອງໄວ້ ເພື່ອນຳກັບມາໃຊ້ງານໃໝ່ໃນລະບົບ.
                  </p>
                  <label className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer">
                    <UploadCloud className="w-4 h-4" />
                    <span>ເລືອກໄຟລ໌ JSON ເພື່ອກູ້ຄືນ</span>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          onImportBackup(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* 5. Reset to Seed Defaults */}
                <div className="col-span-full bg-rose-50/60 p-4 rounded-xl border border-rose-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-rose-950 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-rose-600" />
                      <span>ຣີເຊັດກັບຄືນຄ່າເລີ່ມຕົ້ນຂອງແຂວງ (Reset to Provincial Seed Data)</span>
                    </h4>
                    <p className="text-[11px] text-rose-800 mt-0.5">
                      ຕັ້ງຄ່າຂໍ້ມູນທັງໝົດກັບຄືນສູ່ສະພາບເລີ່ມຕົ້ນມາດຕະຖານຂອງ ຫ້ອງວ່າການແຂວງຫົວພັນ
                    </p>
                  </div>
                  <button
                    onClick={onResetDefaults}
                    className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold shadow-xs transition shrink-0"
                  >
                    ຣີເຊັດຖານຂໍ້ມູນ
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500">
            ລະບົບ e-Office DMS ຫ້ອງວ່າການແຂວງຫົວພັນ • ການຄຸ້ມຄອງຂໍ້ມູນມາດຕະຖານລັດຖະບານດິຈິຕອນ
          </p>
          <button
            onClick={() => {
              soundEffects.playClickTick();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition"
          >
            ປິດໜ້າຕ່າງ
          </button>
        </div>

      </div>
    </div>
  );
};
