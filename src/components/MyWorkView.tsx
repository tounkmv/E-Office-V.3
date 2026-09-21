import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  Building2,
  User as UserIcon,
  ShieldCheck,
  ChevronRight,
  Send,
  Eye,
  FileDown,
  FileUp,
  Award,
  Search,
  Check,
  Printer,
  Bell,
  Sparkles,
  ArrowUpRight,
  MessageSquare,
  Calendar,
  Layers,
  Flame,
  CheckSquare
} from 'lucide-react';
import { User, DocumentItem, TaskItem, DepartmentItem, PriorityLevel, LanguageCode } from '../types';
import { soundEffects } from '../lib/soundEffects';

export type AssignerCategory = 'all' | 'leadership' | 'department' | 'user';
export type WorkTypeFilter = 'all' | 'documents' | 'tasks';
export type StatusFilter = 'all' | 'pending' | 'in_progress' | 'completed' | 'urgent';

export interface MyWorkViewProps {
  currentUser: User;
  documents: DocumentItem[];
  tasks: TaskItem[];
  allUsers: User[];
  departments: DepartmentItem[];
  onOpenDocDetails: (doc: DocumentItem) => void;
  onOpenForwardModal: (doc: DocumentItem) => void;
  onOpenESignModal: (doc: DocumentItem) => void;
  onOpenPrintSlip: (doc: DocumentItem) => void;
  onToggleTaskStatus: (task: TaskItem) => void;
  onUpdateTaskStatusWithNote: (taskId: string, status: 'assigned' | 'in_progress' | 'completed', note?: string) => void;
  onMarkDocAsRead: (docId: string) => void;
  onAddNewTask?: () => void;
  currentLang?: LanguageCode;
  soundEnabled?: boolean;
}

interface NormalizedWorkItem {
  id: string;
  kind: 'document' | 'task';
  rawDoc?: DocumentItem;
  rawTask?: TaskItem;
  title: string;
  codeOrNumber: string;
  description: string;
  priority: PriorityLevel;
  status: 'pending' | 'in_progress' | 'completed';
  statusLabel: string;
  isUrgent: boolean;
  assignedDate: string;
  dueDate?: string;
  // Origin classification
  assignerCategory: 'leadership' | 'department' | 'user';
  assignerName: string;
  assignerTitle?: string;
  assignerDepartment: string;
  assignerBadgeLabel: string;
  directiveNote?: string;
  isRead: boolean;
  attachmentsCount: number;
}

export const MyWorkView: React.FC<MyWorkViewProps> = ({
  currentUser,
  documents,
  tasks,
  allUsers,
  departments,
  onOpenDocDetails,
  onOpenForwardModal,
  onOpenESignModal,
  onOpenPrintSlip,
  onToggleTaskStatus,
  onUpdateTaskStatusWithNote,
  onMarkDocAsRead,
  onAddNewTask,
  currentLang = 'lo',
  soundEnabled = true
}) => {
  // Filters State
  const [workTypeFilter, setWorkTypeFilter] = useState<WorkTypeFilter>('all');
  const [assignerFilter, setAssignerFilter] = useState<AssignerCategory>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemForAction, setSelectedItemForAction] = useState<NormalizedWorkItem | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Helper to determine whether an assigner belongs to Leadership
  const isLeadership = (name: string, dept?: string, title?: string): boolean => {
    const text = `${name} ${dept || ''} ${title || ''}`.toLowerCase();
    if (text.includes('ຫົວໜ້າຫ້ອງວ່າການ') || text.includes('ຮອງຫົວໜ້າຫ້ອງວ່າການ') || text.includes('ການນຳ')) {
      return true;
    }
    if (text.includes('ຄໍາຜາຍ') || text.includes('ຄຳຜາຍ') || text.includes('ບຸນມີ ສີລະວົງ')) {
      return true;
    }
    return false;
  };

  // Helper to determine if an assigner is a Department
  const isDepartmentEntity = (name: string): boolean => {
    if (name.startsWith('ຂະແໜງ') || name.startsWith('ພະແນກ') || name.includes('ຫ້ອງວ່າການແຂວງ')) {
      return true;
    }
    return departments.some(d => d.name === name);
  };

  // Compile Normalized Work Items
  const normalizedItems = useMemo<NormalizedWorkItem[]>(() => {
    const items: NormalizedWorkItem[] = [];

    // 1. Process Documents assigned to or held by current user or current user's department
    documents.forEach((doc) => {
      const isDirectAssignee = doc.assignees && doc.assignees.some(a => 
        a.includes(currentUser.fullName) || 
        a.includes(currentUser.username) ||
        (currentUser.department && a.includes(currentUser.department))
      );
      const isCurrentHolder = doc.currentHolder === currentUser.fullName || 
        (currentUser.department && (doc.currentHolder === currentUser.department || doc.currentHolderDepartment === currentUser.department));
      const isRecipientDept = doc.recipientDepartment === currentUser.department;
      
      // Look for forwarding or delegation to this user in auditTrail
      const relevantAudit = [...(doc.auditTrail || [])].reverse().find(a => 
        a.targetRecipient?.includes(currentUser.fullName) ||
        a.targetRecipient?.includes(currentUser.username) ||
        (currentUser.department && a.targetDepartment?.includes(currentUser.department)) ||
        (a.action.includes('ຊີ້ນຳ') || a.action.includes('ມອບໝາຍ') || a.action.includes('ສົ່ງຕໍ່'))
      );

      // Leadership can also review pending signatures or general processing
      const isLeadershipAssigned = (currentUser.role === 'leadership') && 
        (doc.status === 'ລໍຖ້າລົງລາຍເຊັນ' || doc.recipientDepartment.includes('ການນຳ') || doc.currentHolder.includes('ການນຳ'));

      if (isDirectAssignee || isCurrentHolder || isRecipientDept || isLeadershipAssigned) {
        // Determine Assigner & Directive info
        let assignerName = relevantAudit?.user || doc.originDepartment || 'ຫ້ອງວ່າການແຂວງຫົວພັນ';
        let assignerDept = relevantAudit?.department || doc.originDepartment;
        let directiveNote = relevantAudit?.note || doc.summary;
        let assignerCat: 'leadership' | 'department' | 'user' = 'department';
        let badgeLabel = 'ຂະແໜງການ';

        if (isLeadership(assignerName, assignerDept)) {
          assignerCat = 'leadership';
          badgeLabel = 'ຄະນະຫົວໜ້າຫ້ອງວ່າການ';
        } else if (isDepartmentEntity(assignerName) || !relevantAudit?.user) {
          assignerCat = 'department';
          badgeLabel = 'ຂະແໜງການ / ພາກສ່ວນ';
        } else {
          assignerCat = 'user';
          badgeLabel = 'ເພື່ອນຮ່ວມງານ / ວິຊາການ';
        }

        // Map status
        let mappedStatus: 'pending' | 'in_progress' | 'completed' = 'in_progress';
        if (doc.status === 'ລໍຖ້າບັນຈຸ' || doc.status === 'ລໍຖ້າລົງລາຍເຊັນ') {
          mappedStatus = 'pending';
        } else if (doc.status === 'ສຳເລັດ/ຈັດເກັບ') {
          mappedStatus = 'completed';
        }

        const isRead = !!doc.readReceipts?.some(r => r.userId === currentUser.id) || !!doc.isReadByCurrentHolder;

        items.push({
          id: `doc_${doc.id}`,
          kind: 'document',
          rawDoc: doc,
          title: doc.title,
          codeOrNumber: doc.docNumber,
          description: doc.summary,
          priority: doc.priority,
          status: mappedStatus,
          statusLabel: doc.status,
          isUrgent: doc.priority === 'ດ່ວນທີ່ສຸດ' || doc.priority === 'ດ່ວນ',
          assignedDate: doc.receivedDate || doc.issueDate,
          assignerCategory: assignerCat,
          assignerName,
          assignerDepartment: assignerDept,
          assignerBadgeLabel: badgeLabel,
          directiveNote,
          isRead,
          attachmentsCount: doc.attachments?.length || 0
        });
      }
    });

    // 2. Process Tasks assigned to currentUser or currentUser's department
    tasks.forEach((task) => {
      const isDirectUser = task.assigneeType === 'user' && 
        (task.assigneeName === currentUser.fullName || task.assigneeName === currentUser.username);
      const isDept = task.assigneeType === 'department' && 
        currentUser.department && task.assigneeName.includes(currentUser.department);
      const isAdminView = currentUser.role === 'admin' || currentUser.role === 'super_admin';

      if (isDirectUser || isDept || isAdminView) {
        let assignerCat: 'leadership' | 'department' | 'user' = 'department';
        let badgeLabel = 'ຂະແໜງການ';

        if (isLeadership(task.createdBy, task.creatorDepartment)) {
          assignerCat = 'leadership';
          badgeLabel = 'ຄະນະຫົວໜ້າຫ້ອງວ່າການ';
        } else if (isDepartmentEntity(task.createdBy) || task.creatorDepartment.includes('ຂະແໜງ')) {
          assignerCat = 'department';
          badgeLabel = 'ຂະແໜງການ / ພາກສ່ວນ';
        } else {
          assignerCat = 'user';
          badgeLabel = 'ບັນຊີຜູ້ໃຊ້ອື່ນໆ';
        }

        const mappedStatus = task.status === 'completed' ? 'completed' : task.status === 'in_progress' ? 'in_progress' : 'pending';
        const statusLabel = task.status === 'completed' ? 'ສຳເລັດແລ້ວ' : task.status === 'in_progress' ? 'ກຳລັງປະຕິບັດ' : 'ມອບໝາຍໃໝ່ (ລໍຖ້າ)';

        items.push({
          id: `task_${task.id}`,
          kind: 'task',
          rawTask: task,
          title: task.title,
          codeOrNumber: task.documentNumber || task.id,
          description: task.description,
          priority: task.priority,
          status: mappedStatus,
          statusLabel,
          isUrgent: task.priority === 'ດ່ວນທີ່ສຸດ' || task.priority === 'ດ່ວນ',
          assignedDate: task.startDate,
          dueDate: task.dueDate,
          assignerCategory: assignerCat,
          assignerName: task.createdBy,
          assignerDepartment: task.creatorDepartment,
          assignerBadgeLabel: badgeLabel,
          directiveNote: task.completionNote ? `ລາຍງານ: ${task.completionNote}` : undefined,
          isRead: task.status !== 'assigned',
          attachmentsCount: task.attachments?.length || 0
        });
      }
    });

    return items;
  }, [documents, tasks, currentUser, departments]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return normalizedItems.filter((item) => {
      // Work type filter
      if (workTypeFilter === 'documents' && item.kind !== 'document') return false;
      if (workTypeFilter === 'tasks' && item.kind !== 'task') return false;

      // Assigner origin filter
      if (assignerFilter !== 'all' && item.assignerCategory !== assignerFilter) return false;

      // Status filter
      if (statusFilter === 'pending' && item.status !== 'pending') return false;
      if (statusFilter === 'in_progress' && item.status !== 'in_progress') return false;
      if (statusFilter === 'completed' && item.status !== 'completed') return false;
      if (statusFilter === 'urgent' && !item.isUrgent) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCode = item.codeOrNumber.toLowerCase().includes(q);
        const matchesAssigner = item.assignerName.toLowerCase().includes(q);
        const matchesDept = item.assignerDepartment.toLowerCase().includes(q);
        const matchesDirective = item.directiveNote?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCode && !matchesAssigner && !matchesDept && !matchesDirective) {
          return false;
        }
      }

      return true;
    });
  }, [normalizedItems, workTypeFilter, assignerFilter, statusFilter, searchQuery]);

  // Metric counts for current user
  const metrics = useMemo(() => {
    const total = normalizedItems.length;
    const fromLeadership = normalizedItems.filter(i => i.assignerCategory === 'leadership').length;
    const fromDept = normalizedItems.filter(i => i.assignerCategory === 'department').length;
    const fromUser = normalizedItems.filter(i => i.assignerCategory === 'user').length;
    const pendingCount = normalizedItems.filter(i => i.status === 'pending' || i.status === 'in_progress').length;
    const urgentCount = normalizedItems.filter(i => i.isUrgent && i.status !== 'completed').length;
    const unreadCount = normalizedItems.filter(i => !i.isRead).length;

    return {
      total,
      fromLeadership,
      fromDept,
      fromUser,
      pendingCount,
      urgentCount,
      unreadCount
    };
  }, [normalizedItems]);

  const handleQuickAcknowledge = (item: NormalizedWorkItem) => {
    if (item.kind === 'document' && item.rawDoc) {
      onMarkDocAsRead(item.rawDoc.id);
    } else if (item.kind === 'task' && item.rawTask) {
      if (item.rawTask.status === 'assigned') {
        onUpdateTaskStatusWithNote(item.rawTask.id, 'in_progress', 'ຮັບຊາບ ແລະ ກຳລັງເລີ່ມຈັດຕັ້ງປະຕິບັດ');
      }
    }
  };

  const handleSaveActionNote = () => {
    if (!selectedItemForAction || !actionNote.trim()) return;
    setIsSubmittingNote(true);
    if (selectedItemForAction.kind === 'task' && selectedItemForAction.rawTask) {
      onUpdateTaskStatusWithNote(
        selectedItemForAction.rawTask.id,
        selectedItemForAction.status === 'completed' ? 'completed' : 'in_progress',
        actionNote.trim()
      );
    }
    setIsSubmittingNote(false);
    setSelectedItemForAction(null);
    setActionNote('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Header Banner & Notification Callout */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border border-blue-700/40">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 border border-blue-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ສູນລວມໜ້າວຽກ & ເອກະສານມອບໝາຍສ່ວນຕົວ</span>
              <span className="font-mono bg-blue-950/80 px-2 py-0.5 rounded-full text-[10px] text-white">
                {currentUser.fullName}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
              <Briefcase className="w-6 h-6 text-amber-400 shrink-0" />
              <span>ວຽກຂອງຂ້ອຍ (My Assigned Work)</span>
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
              ຕິດຕາມ ແລະ ປະຕິບັດເອກະສານ, ຂໍ້ຊີ້ນຳ ແລະ ໜ້າວຽກທີ່ໄດ້ຮັບມອບໝາຍຈາກ{' '}
              <strong className="text-amber-300 font-semibold">ຄະນະຫົວໜ້າຫ້ອງວ່າການ</strong>,{' '}
              <strong className="text-blue-200 font-semibold">ຂະແໜງການຕ່າງໆ</strong> ແລະ{' '}
              <strong className="text-purple-200 font-semibold">ເພື່ອນຮ່ວມງານ</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onAddNewTask && (
              <button
                onClick={onAddNewTask}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckSquare className="w-4 h-4" />
                <span>+ ມອບໝາຍວຽກໃໝ່</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Interactive Alert Strip if unread or urgent */}
        {(metrics.urgentCount > 0 || metrics.unreadCount > 0) && (
          <div className="mt-4 pt-3 border-t border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-amber-200 font-medium">
                ແຈ້ງເຕືອນ: ທ່ານມີ <strong className="text-white font-bold">{metrics.pendingCount}</strong> ລາຍການວຽກທີ່ລໍຖ້າດຳເນີນການ 
                {metrics.urgentCount > 0 && ` (ດ່ວນທີ່ສຸດ ${metrics.urgentCount} ລາຍການ)`}
                {metrics.fromLeadership > 0 && ` • ຈາກຄະນະຫົວໜ້າ ${metrics.fromLeadership} ລາຍການ`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter('urgent')}
                className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 rounded-lg text-[11px] font-semibold transition cursor-pointer"
              >
                ກັ່ນຕອງວຽກດ່ວນ ({metrics.urgentCount})
              </button>
              <button
                onClick={() => setAssignerFilter('leadership')}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-lg text-[11px] font-semibold transition cursor-pointer"
              >
                ຈາກຄະນະຫົວໜ້າ ({metrics.fromLeadership})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Stat Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Assigned */}
        <div 
          onClick={() => {
            setWorkTypeFilter('all');
            setAssignerFilter('all');
            setStatusFilter('all');
          }}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">ວຽກທັງໝົດທີ່ມອບໃຫ້ຂ້ອຍ</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.total}</span>
            <span className="text-[11px] text-slate-500">ລາຍການ</span>
          </div>
          <p className="text-[10px] text-blue-600 font-medium mt-1">ລວມເອກະສານ & ໜ້າວຽກ</p>
        </div>

        {/* From Office Leadership */}
        <div 
          onClick={() => setAssignerFilter('leadership')}
          className={`bg-white p-4 rounded-2xl border shadow-xs transition cursor-pointer group ${
            assignerFilter === 'leadership' ? 'border-amber-500 ring-2 ring-amber-400/20' : 'border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700">ຈາກຄະນະຫົວໜ້າຫ້ອງວ່າການ</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-900">{metrics.fromLeadership}</span>
            <span className="text-[11px] text-amber-700">ລາຍການ</span>
          </div>
          <p className="text-[10px] text-amber-600 font-medium mt-1">ຂໍ້ຊີ້ນຳ & ຄຳສັ່ງການນຳ</p>
        </div>

        {/* From Departments */}
        <div 
          onClick={() => setAssignerFilter('department')}
          className={`bg-white p-4 rounded-2xl border shadow-xs transition cursor-pointer group ${
            assignerFilter === 'department' ? 'border-indigo-500 ring-2 ring-indigo-400/20' : 'border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700">ຈາກຂະແໜງການ</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-950">{metrics.fromDept}</span>
            <span className="text-[11px] text-indigo-700">ລາຍການ</span>
          </div>
          <p className="text-[10px] text-indigo-600 font-medium mt-1">ປະສານງານລະຫວ່າງຂະແໜງ</p>
        </div>

        {/* From Other Users / Colleagues */}
        <div 
          onClick={() => setAssignerFilter('user')}
          className={`bg-white p-4 rounded-2xl border shadow-xs transition cursor-pointer group ${
            assignerFilter === 'user' ? 'border-purple-500 ring-2 ring-purple-400/20' : 'border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700">ຈາກບັນຊີຜູ້ໃຊ້ອື່ນໆ</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition">
              <UserIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-950">{metrics.fromUser}</span>
            <span className="text-[11px] text-purple-700">ລາຍການ</span>
          </div>
          <p className="text-[10px] text-purple-600 font-medium mt-1">ມອບໝາຍພາຍໃນສາຍງານ</p>
        </div>
      </div>

      {/* 4. Controls & Filters Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
        {/* Search & Main Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Work Type Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start">
            <button
              onClick={() => setWorkTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                workTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ທັງໝົດ ({normalizedItems.length})
            </button>
            <button
              onClick={() => setWorkTypeFilter('documents')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                workTypeFilter === 'documents' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>ເອກະສານທີ່ຖືກມອບໝາຍ ({normalizedItems.filter(i => i.kind === 'document').length})</span>
            </button>
            <button
              onClick={() => setWorkTypeFilter('tasks')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                workTypeFilter === 'tasks' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>ໜ້າວຽກທີ່ຕ້ອງປະຕິບັດ ({normalizedItems.filter(i => i.kind === 'task').length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 text-xs">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ຄົ້ນຫາເລກທີ, ຊື່ວຽກ, ຜູ້ມອບໝາຍ..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Secondary Filters: Assigner Origin & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Assigner Origin pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1">ແຫຼ່ງທີ່ມອບໝາຍ:</span>
            <button
              onClick={() => setAssignerFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
                assignerFilter === 'all'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ທຸກແຫຼ່ງ
            </button>
            <button
              onClick={() => setAssignerFilter('leadership')}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer text-xs ${
                assignerFilter === 'leadership'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              <span>ຄະນະຫົວໜ້າຫ້ອງວ່າການ</span>
            </button>
            <button
              onClick={() => setAssignerFilter('department')}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer text-xs ${
                assignerFilter === 'department'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <Building2 className="w-3 h-3 text-indigo-600" />
              <span>ຂະແໜງການ</span>
            </button>
            <button
              onClick={() => setAssignerFilter('user')}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer text-xs ${
                assignerFilter === 'user'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <UserIcon className="w-3 h-3 text-purple-600" />
              <span>ບັນຊີຜູ້ໃຊ້ອື່ນໆ</span>
            </button>
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">ສະຖານະ:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">ທຸກສະຖານະ</option>
              <option value="pending">ລໍຖ້າດຳເນີນການ (Pending)</option>
              <option value="in_progress">ກຳລັງປະຕິບັດ (In Progress)</option>
              <option value="urgent">ດ່ວນ & ດ່ວນທີ່ສຸດ (Urgent)</option>
              <option value="completed">ສຳເລັດແລ້ວ (Completed)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Work Items Feed */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800">
              ບໍ່ພົບລາຍການວຽກຕາມເງື່ອນໄຂທີ່ເລືອກ
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              ທ່ານບໍ່ມີເອກະສານ ຫຼື ໜ້າວຽກທີ່ຕົກຄ້າງໃນໝວດໝູ່ນີ້. ທ່ານສາມາດເລືອກເບິ່ງ "ທັງໝົດ" ຫຼື ລອງປ່ຽນຕົວກັ່ນຕອງ.
            </p>
            <button
              onClick={() => {
                setWorkTypeFilter('all');
                setAssignerFilter('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              ລ້າງຕົວກັ່ນຕອງທັງໝົດ
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isLeadershipOrigin = item.assignerCategory === 'leadership';
            const isDeptOrigin = item.assignerCategory === 'department';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-3 hover:shadow-md ${
                  item.isUrgent
                    ? 'border-red-200/90 hover:border-red-400 bg-gradient-to-r from-red-50/20 via-white to-white'
                    : isLeadershipOrigin
                    ? 'border-amber-200/80 hover:border-amber-400'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div>
                  {/* Top Bar: Kind Badge, Assigner Origin Badge, Priority, Read status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Kind Badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        item.kind === 'document'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.kind === 'document' ? <FileText className="w-3 h-3" /> : <CheckSquare className="w-3 h-3" />}
                        <span>{item.kind === 'document' ? 'ເອກະສານ' : 'ໜ້າວຽກ'}</span>
                      </span>

                      {/* Assigner Origin Badge (Highlights where it came from!) */}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border ${
                        isLeadershipOrigin
                          ? 'bg-gradient-to-r from-amber-500/15 to-red-500/15 text-amber-900 border-amber-300/80'
                          : isDeptOrigin
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          : 'bg-purple-50 text-purple-800 border-purple-200'
                      }`}>
                        {isLeadershipOrigin ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        ) : isDeptOrigin ? (
                          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <UserIcon className="w-3.5 h-3.5 text-purple-600" />
                        )}
                        <span>
                          {isLeadershipOrigin
                            ? `🏛️ ຊີ້ນຳ/ມອບໝາຍໂດຍ: ${item.assignerBadgeLabel}`
                            : `🏢 ມອບໝາຍຈາກ: ${item.assignerBadgeLabel}`}
                        </span>
                      </span>

                      {/* Priority Tag */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.priority === 'ດ່ວນທີ່ສຸດ'
                          ? 'bg-red-100 text-red-800 animate-pulse'
                          : item.priority === 'ດ່ວນ'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    {/* Status & Unread indicator */}
                    <div className="flex items-center gap-2">
                      {!item.isRead && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Bell className="w-2.5 h-2.5" />
                          <span>ວຽກໃໝ່ (ຍັງບໍ່ອ່ານ)</span>
                        </span>
                      )}

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.statusLabel}
                      </span>
                    </div>
                  </div>

                  {/* Assigner Person & Department Highlight Card */}
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isLeadershipOrigin
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : isDeptOrigin
                          ? 'bg-indigo-100 text-indigo-900'
                          : 'bg-purple-100 text-purple-900'
                      }`}>
                        {item.assignerName.slice(0, 1)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{item.assignerName}</span>
                          {item.assignerTitle && (
                            <span className="text-[10px] text-slate-500 font-normal">
                              ({item.assignerTitle})
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{item.assignerDepartment}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>ມອບເມື່ອ: {item.assignedDate}</span>
                      {item.dueDate && (
                        <span className="font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                          ກຳນົດ: {item.dueDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Document Code */}
                  <div className="mt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 shrink-0">
                        {item.codeOrNumber}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    {/* Directive / Instructions Box (Highlights orders from leadership or departments) */}
                    {item.directiveNote && (
                      <div className="mt-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 space-y-1">
                        <p className="font-bold text-[11px] text-amber-800 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                          <span>ຂໍ້ຊີ້ນຳ / ເນື້ອໃນການມອບໝາຍ (Instructions):</span>
                        </p>
                        <p className="leading-relaxed pl-5 font-medium">
                          "{item.directiveNote}"
                        </p>
                      </div>
                    )}

                    {/* Summary Description */}
                    {!item.directiveNote && item.description && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Bar: Quick Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {item.attachmentsCount > 0 && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <FileDown className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.attachmentsCount} ໄຟລ໌ຄັດຕິດ</span>
                      </span>
                    )}

                    {!item.isRead && (
                      <button
                        onClick={() => handleQuickAcknowledge(item)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>ກົດຮັບຊາບວຽກ (Acknowledge)</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* View Document Details */}
                    {item.rawDoc && (
                      <>
                        <button
                          onClick={() => onOpenDocDetails(item.rawDoc!)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-800 font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>ເບິ່ງລາຍລະອຽດ</span>
                        </button>

                        <button
                          onClick={() => onOpenPrintSlip(item.rawDoc!)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition flex items-center gap-1 cursor-pointer"
                          title="ພິມໃບຕິດຄັດເອກະສານ"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-600" />
                          <span className="hidden sm:inline">ໃບຕິດຄັດ</span>
                        </button>

                        <button
                          onClick={() => onOpenForwardModal(item.rawDoc!)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-indigo-600" />
                          <span>ສົ່ງຕໍ່ / ມອບໝາຍຕໍ່</span>
                        </button>

                        {currentUser.role === 'leadership' && item.rawDoc.status === 'ລໍຖ້າລົງລາຍເຊັນ' && (
                          <button
                            onClick={() => onOpenESignModal(item.rawDoc!)}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>ລົງລາຍເຊັນ</span>
                          </button>
                        )}
                      </>
                    )}

                    {/* Task Actions */}
                    {item.rawTask && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedItemForAction(item);
                            setActionNote(item.rawTask?.completionNote || '');
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                          <span>ລາຍງານຄວາມຄືບໜ້າ</span>
                        </button>

                        <button
                          onClick={() => onToggleTaskStatus(item.rawTask!)}
                          className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                            item.rawTask.status === 'completed'
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {item.rawTask.status === 'completed' ? 'ປ່ຽນເປັນຍັງບໍ່ສຳເລັດ' : 'ແຈ້ງສຳເລັດວຽກ'}
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. Progress / Completion Note Modal Dialog */}
      {selectedItemForAction && selectedItemForAction.rawTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  ລາຍງານຜົນ / ອັບເດດຄວາມຄືບໜ້າວຽກ
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemForAction(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 bg-slate-50 p-3 rounded-xl text-xs">
              <p className="font-bold text-slate-900">{selectedItemForAction.title}</p>
              <p className="text-slate-500">
                ມອບໝາຍໂດຍ: <strong className="text-slate-700">{selectedItemForAction.assignerName}</strong> ({selectedItemForAction.assignerDepartment})
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                ເນື້ອໃນລາຍງານຄວາມຄືບໜ້າ ຫຼື ຜົນການປະຕິບັດ:
              </label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="ພິມເນື້ອໃນລາຍງານຄວາມຄືບໜ້າ ເພື່ອສົ່ງຄືນໃຫ້ຜູ້ມອບໝາຍຮັບຊາບ..."
                rows={4}
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedItemForAction(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={handleSaveActionNote}
                disabled={isSubmittingNote || !actionNote.trim()}
                className="px-4 py-2 bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>ບັນທຶກລາຍງານ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
