import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  User as UserIcon,
  Building2,
  Archive,
  Eye,
  EyeOff,
  Printer,
  Send,
  ShieldCheck,
  FileText,
  RefreshCw,
  Share2,
  Check,
  ChevronRight,
  Download,
  Sparkles,
  Calendar,
  Layers,
  MapPin,
  ExternalLink,
  MessageSquare,
  FileDown,
  FileUp,
  Award
} from 'lucide-react';
import { DocumentItem, User, DocumentAuditTrail } from '../types';
import { DEPARTMENTS, STORAGE_BOXES } from '../lib/initialData';
import { soundEffects } from '../lib/soundEffects';

interface DocumentTrackingHubProps {
  documents: DocumentItem[];
  currentUser: User;
  allUsers: User[];
  onOpenDetails: (doc: DocumentItem) => void;
  onOpenPrintSlip: (doc: DocumentItem) => void;
  onOpenForwardModal: (doc: DocumentItem) => void;
  onOpenESignModal: (doc: DocumentItem) => void;
  onMarkAsRead: (docId: string) => void;
}

export const DocumentTrackingHub: React.FC<DocumentTrackingHubProps> = ({
  documents,
  currentUser,
  allUsers,
  onOpenDetails,
  onOpenPrintSlip,
  onOpenForwardModal,
  onOpenESignModal,
  onMarkAsRead
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'my_custody' | 'in_progress' | 'urgent' | 'completed'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'incoming' | 'outgoing'>('all');

  // Currently inspected document
  const selectedDoc = useMemo(() => {
    return documents.find(d => d.id === selectedDocId) || documents[0] || null;
  }, [documents, selectedDocId]);

  // Filtered documents list
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        doc.docNumber.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q) ||
        doc.currentHolder.toLowerCase().includes(q) ||
        doc.originDepartment.toLowerCase().includes(q) ||
        doc.recipientDepartment.toLowerCase().includes(q) ||
        doc.storageBox.toLowerCase().includes(q);

      if (!matchQuery) return false;

      // Filter Tab
      if (filterTab === 'unread') {
        const isUnread = doc.isReadByCurrentHolder === false || !doc.readReceipts || doc.readReceipts.length === 0;
        if (!isUnread) return false;
      } else if (filterTab === 'my_custody') {
        const isMyCustody =
          doc.currentHolder.includes(currentUser.fullName) ||
          doc.currentHolder.includes(currentUser.department) ||
          doc.assignees.some(a => a.includes(currentUser.fullName) || a.includes(currentUser.department));
        if (!isMyCustody) return false;
      } else if (filterTab === 'in_progress') {
        if (doc.status !== 'ກຳລັງດຳເນີນການ' && doc.status !== 'ສົ່ງຕໍ່ແລ້ວ') return false;
      } else if (filterTab === 'urgent') {
        if (doc.priority !== 'ດ່ວນທີ່ສຸດ' && doc.priority !== 'ດ່ວນ') return false;
      } else if (filterTab === 'completed') {
        if (doc.status !== 'ສຳເລັດ/ຈັດເກັບ' && doc.status !== 'ເຊັນອະນຸມັດແລ້ວ') return false;
      }

      // Department filter
      if (selectedDept !== 'all') {
        const matchDept =
          doc.currentHolder.includes(selectedDept) ||
          doc.originDepartment.includes(selectedDept) ||
          doc.recipientDepartment.includes(selectedDept) ||
          doc.assignees.some(a => a.includes(selectedDept));
        if (!matchDept) return false;
      }

      // Type filter
      if (selectedType !== 'all') {
        if (doc.type !== selectedType) return false;
      }

      return true;
    });
  }, [documents, searchQuery, filterTab, selectedDept, selectedType, currentUser]);

  // Statistics
  const totalDocs = documents.length;
  const unreadCount = documents.filter(d => d.isReadByCurrentHolder === false || !d.readReceipts || d.readReceipts.length === 0).length;
  const inProgressCount = documents.filter(d => d.status === 'ກຳລັງດຳເນີນການ' || d.status === 'ສົ່ງຕໍ່ແລ້ວ').length;
  const completedCount = documents.filter(d => d.status === 'ສຳເລັດ/ຈັດເກັບ' || d.status === 'ເຊັນອະນຸມັດແລ້ວ').length;
  const myCustodyCount = documents.filter(d =>
    d.currentHolder.includes(currentUser.fullName) ||
    d.currentHolder.includes(currentUser.department)
  ).length;

  const handleSelectDoc = (id: string) => {
    soundEffects.playClickTick();
    setSelectedDocId(id);
  };

  const handleAcknowledgeRead = (doc: DocumentItem) => {
    soundEffects.playSuccessChime();
    onMarkAsRead(doc.id);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-5 rounded-2xl shadow-sm border border-blue-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400 text-blue-950 font-bold shadow-xs">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              ລະບົບຕິດຕາມເສັ້ນທາງເອກະສານ & Timeline ທົ່ວລະບົບ (Document Tracking Hub)
            </h2>
          </div>
          <p className="text-xs text-blue-200 mt-1.5 max-w-3xl leading-relaxed">
            ກວດກາເສັ້ນທາງເອກະສານທຸກສະບັບໃນຫ້ອງວ່າການແຂວງຫົວພັນ: ເວລາ, ວັນເດືອນປີ, ສະຖານະເປີດອ່ານ, ຜູ້ຖືເອກະສານຕົວຈິງ, ແລະ ປະຫວັດການມອບໝາຍວຽກງານລະອຽດ
          </p>
        </div>

        {/* Quick Action Button */}
        {selectedDoc && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrintSlip(selectedDoc)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>ພິມໃບຕິດຕາມ</span>
            </button>
            <button
              onClick={() => onOpenForwardModal(selectedDoc)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-blue-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>ສົ່ງຕໍ່ເອກະສານ</span>
            </button>
          </div>
        )}
      </div>

      {/* Metrics Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setFilterTab('all')}
          className={`cursor-pointer p-3.5 rounded-2xl border transition ${
            filterTab === 'all'
              ? 'bg-blue-50 border-blue-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-blue-200'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500">ເອກະສານທັງໝົດ</span>
          <p className="text-xl font-extrabold text-blue-950 mt-1">{totalDocs}</p>
          <span className="text-[10px] text-blue-700 font-semibold">ທຸກປະເພດໃນລະບົບ</span>
        </div>

        <div
          onClick={() => setFilterTab('unread')}
          className={`cursor-pointer p-3.5 rounded-2xl border transition ${
            filterTab === 'unread'
              ? 'bg-amber-50 border-amber-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">ຍັງບໍ່ທັນເປີດອ່ານ</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          </div>
          <p className="text-xl font-extrabold text-amber-700 mt-1">{unreadCount}</p>
          <span className="text-[10px] text-amber-600 font-semibold">ລໍຖ້າຜູ້ຮັບເປີດເບິ່ງ</span>
        </div>

        <div
          onClick={() => setFilterTab('my_custody')}
          className={`cursor-pointer p-3.5 rounded-2xl border transition ${
            filterTab === 'my_custody'
              ? 'bg-purple-50 border-purple-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-purple-200'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500">ຄ້າງຢູ່ຂ້ອຍ / ຂະແໜງຂ້ອຍ</span>
          <p className="text-xl font-extrabold text-purple-900 mt-1">{myCustodyCount}</p>
          <span className="text-[10px] text-purple-700 font-semibold">ຢູ່ໃນຄວາມຮັບຜິດຊອບ</span>
        </div>

        <div
          onClick={() => setFilterTab('in_progress')}
          className={`cursor-pointer p-3.5 rounded-2xl border transition ${
            filterTab === 'in_progress'
              ? 'bg-indigo-50 border-indigo-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-indigo-200'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500">ກຳລັງດຳເນີນການ</span>
          <p className="text-xl font-extrabold text-indigo-900 mt-1">{inProgressCount}</p>
          <span className="text-[10px] text-indigo-700 font-semibold">ຢູ່ໃນຂັ້ນຕອນປະຕິບັດ</span>
        </div>

        <div
          onClick={() => setFilterTab('completed')}
          className={`cursor-pointer p-3.5 rounded-2xl border transition ${
            filterTab === 'completed'
              ? 'bg-emerald-50 border-emerald-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-200'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500">ສຳເລັດ / ຈັດເກັບ</span>
          <p className="text-xl font-extrabold text-emerald-800 mt-1">{completedCount}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">ສຳເລັດຂັ້ນຕອນແລ້ວ</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ຄົ້ນຫາເລກທີ, ເນື້ອໃນຫຍໍ້, ຜູ້ຖືເອກະສານ, ຫຼື ພາກສ່ວນ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto text-xs">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none bg-white"
          >
            <option value="all">ທຸກປະເພດເອກະສານ (ທັງຂາເຂົ້າ & ຂາອອກ)</option>
            <option value="incoming">ເອກະສານຂາເຂົ້າເທົ່ານັ້ນ</option>
            <option value="outgoing">ເອກະສານຂາອອກເທົ່ານັ້ນ</option>
          </select>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none bg-white max-w-[200px] truncate"
          >
            <option value="all">ທຸກຂະແໜງການ / ພາກສ່ວນ</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Layout: Document List (Left) & Deep Timeline Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Filtered Documents Master List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">
              ລາຍການເອກະສານທີ່ກົງເງື່ອນໄຂ ({filteredDocuments.length})
            </span>
            <span className="text-[11px] text-slate-400">
              ກົດເລືອກເພື່ອເບິ່ງ Timeline
            </span>
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {filteredDocuments.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">ບໍ່ພົບເອກະສານທີ່ຄົ້ນຫາ</p>
                <p className="text-[11px]">ກະລຸນາລອງປ່ຽນຄຳຄົ້ນ ຫຼື ເງື່ອນໄຂການກອງ</p>
              </div>
            ) : (
              filteredDocuments.map(doc => {
                const isSelected = doc.id === selectedDoc?.id;
                const isRead = doc.isReadByCurrentHolder !== false && doc.readReceipts && doc.readReceipts.length > 0;

                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDoc(doc.id)}
                    className={`cursor-pointer p-3.5 rounded-2xl border transition duration-150 relative ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Top Row: Type & Number & Priority */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            doc.type === 'incoming'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {doc.type === 'incoming' ? 'ຂາເຂົ້າ' : 'ຂາອອກ'}
                        </span>
                        <span className="font-bold text-xs text-blue-950 font-mono">
                          {doc.docNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {isRead ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Eye className="w-3 h-3" />
                            <span>ອ່ານແລ້ວ</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <EyeOff className="w-3 h-3" />
                            <span>ຍັງບໍ່ອ່ານ</span>
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            doc.priority === 'ດ່ວນທີ່ສຸດ'
                              ? 'bg-red-100 text-red-800'
                              : doc.priority === 'ດ່ວນ'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {doc.priority}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2 leading-relaxed">
                      {doc.title}
                    </h4>

                    {/* Holder & Department Info */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 text-slate-600 truncate max-w-[240px]">
                        <UserIcon className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span className="truncate">
                          ຖືຕົວຈິງ: <strong className="text-slate-800">{doc.currentHolder}</strong>
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString('lo-LA') : doc.issueDate}
                      </span>
                    </div>

                    {/* Steps Count Progress */}
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span>ຜ່ານ {doc.auditTrail?.length || 1} ຂັ້ນຕອນ</span>
                      <span className="font-semibold text-blue-700">{doc.status}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Deep Timeline & Chain of Custody (7 cols) */}
        <div className="lg:col-span-7">
          {selectedDoc ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-5 p-5">
              {/* Header of Inspector */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono">
                      ເລກທີ: {selectedDoc.docNumber}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {selectedDoc.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        selectedDoc.priority === 'ດ່ວນທີ່ສຸດ'
                          ? 'bg-red-100 text-red-800'
                          : selectedDoc.priority === 'ດ່ວນ'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {selectedDoc.priority}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {selectedDoc.status}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-2 leading-relaxed">
                    {selectedDoc.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    ຕົ້ນທາງ: <span className="font-semibold text-slate-700">{selectedDoc.originDepartment}</span> ➔ ເປົ້າໝາຍ: <span className="font-semibold text-slate-700">{selectedDoc.recipientDepartment}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenDetails(selectedDoc)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    title="ເບິ່ງລາຍລະອຽດເຕັມ"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenPrintSlip(selectedDoc)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    title="ພິມໃບຕິດຄັດ"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Custody Card: Who is currently holding the document? */}
              <div className="p-4 bg-gradient-to-r from-amber-50/80 via-amber-50/40 to-blue-50/40 border border-amber-200 rounded-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>ບ່ອນຢູ່ ແລະ ຜູ້ຖືເອກະສານຕົວຈິງປະຈຸບັນ (Current Custody Location)</span>
                  </span>
                  {selectedDoc.isReadByCurrentHolder !== false ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>ເປີດອ່ານ ແລະ ຮັບຮູ້ແລ້ວ</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-600 animate-pulse" />
                      <span>ຍັງບໍ່ທັນເປີດອ່ານ</span>
                    </span>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">ຜູ້ຖືເອກະສານຕົວຈິງ:</span>
                    <strong className="text-slate-900 font-bold text-xs mt-0.5 block">
                      {selectedDoc.currentHolder}
                    </strong>
                    <span className="text-[10px] text-blue-700 font-semibold">
                      {selectedDoc.currentHolderDepartment || 'ຫ້ອງວ່າການແຂວງ'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">ຕູ້ເກັບມ້ຽນທາງກາຍະພາບ:</span>
                    <strong className="text-slate-800 font-bold text-xs mt-0.5 flex items-center gap-1">
                      <Archive className="w-3.5 h-3.5 text-blue-600" />
                      <span>{selectedDoc.storageBox}</span>
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">ເວລາອັບເດດຫຼ້າສຸດ:</span>
                    <strong className="text-slate-800 font-mono text-[11px] mt-0.5 block">
                      {selectedDoc.auditTrail[selectedDoc.auditTrail.length - 1]?.timestamp || selectedDoc.updatedAt || selectedDoc.issueDate}
                    </strong>
                  </div>
                </div>

                {/* Acknowledge Receipt Button if Unread */}
                {(!selectedDoc.isReadByCurrentHolder || !selectedDoc.readReceipts?.some(r => r.userId === currentUser.id)) && (
                  <div className="mt-3 pt-3 border-t border-amber-200/80 flex items-center justify-between">
                    <span className="text-[11px] text-amber-900">
                      ທ່ານສັງກັດໃນຂະແໜງການກ່ຽວຂ້ອງ? ກົດຢືນຢັນເພື່ອບັນທຶກວ່າທ່ານໄດ້ເປີດອ່ານເອກະສານນີ້ແລ້ວ
                    </span>
                    <button
                      onClick={() => handleAcknowledgeRead(selectedDoc)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>ຢືນຢັນເປີດອ່ານເອກະສານ</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Chain of Custody Stepper / Visual Flow */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-700" />
                  <span>ສາຍພົວພັນການສົ່ງຕໍ່ & ມອບໝາຍ (Chain of Custody Flow)</span>
                </h4>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
                  <div className="flex items-center gap-2 min-w-max">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center text-xs shadow-xs min-w-[120px]">
                      <span className="text-[9px] text-slate-400 block font-bold">ຕົ້ນທາງ</span>
                      <strong className="text-slate-800 font-bold block truncate max-w-[130px]">
                        {selectedDoc.originDepartment}
                      </strong>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                    {selectedDoc.auditTrail.map((trail, index) => (
                      <React.Fragment key={trail.id || index}>
                        <div className="p-2.5 bg-white rounded-xl border border-blue-200 text-center text-xs shadow-xs min-w-[130px]">
                          <span className="text-[9px] text-blue-600 block font-bold font-mono">
                            ຂັ້ນຕອນ {index + 1}
                          </span>
                          <strong className="text-slate-900 font-bold block truncate max-w-[140px]">
                            {trail.user}
                          </strong>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                            {trail.action}
                          </span>
                          {trail.targetRecipient && (
                            <span className="text-[9px] text-amber-700 block font-semibold mt-0.5 truncate max-w-[140px]">
                              ➔ {trail.targetRecipient}
                            </span>
                          )}
                        </div>

                        {index < selectedDoc.auditTrail.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}

                    <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />

                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-300 text-center text-xs shadow-xs min-w-[120px]">
                      <span className="text-[9px] text-amber-700 block font-bold">ປະຈຸບັນຢູ່ກັບ</span>
                      <strong className="text-amber-950 font-bold block truncate max-w-[130px]">
                        {selectedDoc.currentHolder}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Chronological Timeline with Read Statuses & Duration */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-700" />
                    <span>ເສັ້ນທາງ ແລະ ປະຫວັດການດຳເນີນການລະອຽດ (Document Timeline)</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    ທັງໝົດ {selectedDoc.auditTrail.length} ເຫດການ
                  </span>
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
                  {selectedDoc.auditTrail.map((trail, idx) => {
                    const isLatest = idx === selectedDoc.auditTrail.length - 1;

                    return (
                      <div key={trail.id || idx} className="relative group">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                            isLatest ? 'bg-amber-500 ring-4 ring-amber-100 animate-pulse' : 'bg-blue-800'
                          }`}
                        ></div>

                        {/* Card */}
                        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 transition space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                              <span>{trail.action}</span>
                              {isLatest && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                                  ຂັ້ນຕອນຫຼ້າສຸດ
                                </span>
                              )}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{trail.timestamp}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                            <span className="font-bold text-blue-950 flex items-center gap-1">
                              <UserIcon className="w-3 h-3 text-blue-700" />
                              <span>{trail.user}</span>
                            </span>
                            <span className="text-slate-500 flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span>{trail.department}</span>
                            </span>
                            <span className="bg-blue-100/60 text-blue-800 font-semibold text-[10px] px-2 py-0.5 rounded">
                              ສະຖານະ: {trail.status}
                            </span>
                          </div>

                          {/* Recipient delegation & Time spent tags */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 text-[10px]">
                            {trail.targetRecipient && (
                              <span className="inline-flex items-center gap-1 text-slate-700 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                                <ArrowRight className="w-3 h-3 text-blue-600" />
                                <span>ມອບໝາຍໃຫ້: <strong>{trail.targetRecipient}</strong></span>
                              </span>
                            )}

                            {trail.timeSpent && (
                              <span className="inline-flex items-center gap-1 text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>ໄລຍະເວລາ: {trail.timeSpent}</span>
                              </span>
                            )}

                            {trail.readStatus === 'read' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>ເປີດອ່ານແລ້ວ {trail.readAt ? `(${trail.readAt})` : ''}</span>
                              </span>
                            ) : trail.readStatus === 'unread' ? (
                              <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>ລໍຖ້າການເປີດອ່ານ</span>
                              </span>
                            ) : null}
                          </div>

                          {/* Directive Note */}
                          {trail.note && (
                            <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200 mt-1 leading-relaxed">
                              "{trail.note}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Read Receipts Record */}
              {selectedDoc.readReceipts && selectedDoc.readReceipts.length > 0 && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>ລາຍການຜູ້ເປີດອ່ານ & ຮັບຮູ້ເອກະສານ ({selectedDoc.readReceipts.length} ຄົນ)</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedDoc.readReceipts.map((rc, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-slate-900 font-bold">{rc.userName}</strong>
                          <span className="text-slate-500 text-[11px] block">{rc.department} {rc.userTitle ? `(${rc.userTitle})` : ''}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-[10px] text-emerald-700 font-semibold block">
                            {rc.readAt}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {rc.statusText || 'ເປີດອ່ານແລ້ວ'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
              <Clock className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">ກະລຸນາເລືອກເອກະສານເພື່ອເບິ່ງເສັ້ນທາງ ແລະ Timeline</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
