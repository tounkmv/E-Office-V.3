import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  FileDown,
  FileUp,
  CheckSquare,
  Activity,
  Award,
  BarChart3,
  Users,
  Database,
  Search,
  Plus,
  Printer,
  Eye,
  Send,
  Calendar,
  AlertCircle,
  FolderOpen,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  ArrowRight,
  Copy,
  Check,
  Bell,
  Volume2,
  VolumeX,
  Archive,
  Tag,
  Building2,
  Sliders,
  Briefcase
} from 'lucide-react';
import { 
  User, 
  DocumentItem, 
  TaskItem, 
  RegistrationRequest, 
  ThemeName, 
  LanguageCode, 
  DocumentType,
  DocumentCategory,
  PriorityLevel,
  DocumentStatus,
  StorageBoxItem,
  DocumentCategoryItem,
  DepartmentItem
} from './types';
import { NotificationItem, ToastMessage } from './types/notifications';
import { StorageService } from './lib/storageService';
import { THEMES } from './lib/theme';
import { soundEffects } from './lib/soundEffects';
import { translations } from './locales/translations';
import { 
  DEPARTMENTS, 
  DOCUMENT_CATEGORIES,
  INITIAL_STORAGE_BOXES,
  INITIAL_DOCUMENT_CATEGORIES,
  INITIAL_DEPARTMENTS
} from './lib/initialData';

// Components
import { Navbar } from './components/Navbar';
import { LaoEmblem } from './components/LaoEmblem';
import { TrackingSlipModal } from './components/TrackingSlipModal';
import { ESignaturePadModal } from './components/ESignaturePadModal';
import { DocFormModal } from './components/DocFormModal';
import { TaskModal } from './components/TaskModal';
import { ForwardDocModal } from './components/ForwardDocModal';
import { DocDetailsModal } from './components/DocDetailsModal';
import { DocumentTrackingHub } from './components/DocumentTrackingHub';
import { RegisterModal } from './components/RegisterModal';
import { PendingApprovalsModal } from './components/PendingApprovalsModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { UserManagementModal } from './components/UserManagementModal';
import { SystemManagementModal, SystemAdminTab } from './components/SystemManagementModal';
import { ReportsView } from './components/ReportsView';
import { ToastContainer } from './components/ToastContainer';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ProvincialTicker } from './components/ProvincialTicker';
import { MyWorkView } from './components/MyWorkView';

export default function App() {
  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRequest[]>([]);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    try {
      const saved = localStorage.getItem('eoffice_theme');
      if (saved && (saved in THEMES)) return saved as ThemeName;
    } catch {}
    return 'royal_blue';
  });
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('eoffice_lang');
      if (saved === 'lo' || saved === 'en') return saved as LanguageCode;
    } catch {}
    return 'lo';
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals State
  const [slipModalDoc, setSlipModalDoc] = useState<DocumentItem | null>(null);
  const [esignModalDoc, setEsignModalDoc] = useState<DocumentItem | null>(null);
  const [detailsModalDoc, setDetailsModalDoc] = useState<DocumentItem | null>(null);
  const [forwardModalDoc, setForwardModalDoc] = useState<DocumentItem | null>(null);
  const [docFormType, setDocFormType] = useState<DocumentType | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showUserManageModal, setShowUserManageModal] = useState(false);

  // Dynamic Storage Boxes, Categories, and Departments State
  const [storageBoxes, setStorageBoxes] = useState<StorageBoxItem[]>(() => {
    try {
      const saved = localStorage.getItem('eoffice_houaphanh_storage_boxes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STORAGE_BOXES;
  });

  const [categories, setCategories] = useState<DocumentCategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('eoffice_houaphanh_categories');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DOCUMENT_CATEGORIES;
  });

  const [departments, setDepartments] = useState<DepartmentItem[]>(() => {
    try {
      const saved = localStorage.getItem('eoffice_houaphanh_departments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEPARTMENTS;
  });

  const [showSystemModal, setShowSystemModal] = useState(false);
  const [systemModalTab, setSystemModalTab] = useState<SystemAdminTab>('boxes');

  // Modern Toast Notification Queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Interactive Notifications & Sound State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundEffects.getSoundEnabled());
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // Translations & Theme
  const t = translations[currentLang];
  const theme = THEMES[currentTheme];

  // Load initial data
  const loadAllData = async () => {
    try {
      const [docsData, tasksData, usersData, regsData] = await Promise.all([
        StorageService.loadDocuments(),
        StorageService.loadTasks(),
        StorageService.loadUsers(),
        StorageService.loadRegistrations()
      ]);

      setDocuments(docsData);
      setTasks(tasksData);
      setAllUsers(usersData);
      setRegistrations(regsData);

      // Check saved user session
      const savedUser = localStorage.getItem('eoffice_houaphanh_current_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          const found = usersData.find(u => u.id === parsed.id);
          if (found) setCurrentUser(found);
          else setCurrentUser(usersData[0]);
        } catch {
          setCurrentUser(usersData[0]);
        }
      } else {
        // Default login for demo convenience
        setCurrentUser(usersData[0]);
      }
    } catch (e) {
      console.error('Data load error:', e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Toast notification management
  const addToast = (
    type: 'success' | 'urgent' | 'warning' | 'info',
    title: string,
    description?: string,
    docNumber?: string
  ) => {
    const newToast: ToastMessage = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      title,
      description,
      docNumber,
      duration: type === 'urgent' ? 6500 : 4500
    };

    setToasts(prev => [newToast, ...prev.slice(0, 3)]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundEffects.setSoundEnabled(nextState);
    if (nextState) {
      soundEffects.playClickTick();
      addToast('info', 'ເປີດສຽງແຈ້ງເຕືອນແລ້ວ', 'ລະບົບຈະສົ່ງສຽງແຈ້ງເຕືອນເມື່ອມີເອກະສານ ຫຼື ກິດຈະກຳໃໝ່');
    } else {
      addToast('info', 'ປິດສຽງແຈ້ງເຕືອນແລ້ວ');
    }
  };

  // Copy tracking number with sound & visual feedback
  const handleCopyTracking = (docNumber: string, docId: string) => {
    navigator.clipboard.writeText(docNumber);
    soundEffects.playClickTick();
    setCopiedDocId(docId);
    setTimeout(() => setCopiedDocId(null), 2000);
    addToast('info', 'ຄັດລອກລະຫັດເອກະສານແລ້ວ', `ເລກທີ: ${docNumber}`, docNumber);
  };

  // Generate real-time system notifications
  useEffect(() => {
    const notifs: NotificationItem[] = [];

    // Urgent documents
    documents
      .filter(d => d.priority === 'ດ່ວນທີ່ສຸດ')
      .forEach(d => {
        notifs.push({
          id: `notif-urgent-${d.id}`,
          title: `ເອກະສານດ່ວນທີ່ສຸດ: ${d.docNumber}`,
          message: d.title,
          category: 'urgent',
          timestamp: d.issueDate,
          read: false,
          docId: d.id,
          docNumber: d.docNumber,
          priority: d.priority
        });
      });

    // Pending signatures
    documents
      .filter(d => d.status === 'ລໍຖ້າລົງລາຍເຊັນ')
      .forEach(d => {
        notifs.push({
          id: `notif-sign-${d.id}`,
          title: `ລໍຖ້າລົງລາຍເຊັນ & ປະທັບກາ: ${d.docNumber}`,
          message: `${d.title} (ຜູ້ຖື: ${d.currentHolder})`,
          category: 'signature',
          timestamp: d.issueDate,
          read: false,
          docId: d.id,
          docNumber: d.docNumber
        });
      });

    // Pending account registrations
    registrations
      .filter(r => r.status === 'pending')
      .forEach(r => {
        notifs.push({
          id: `notif-reg-${r.id}`,
          title: `ຄຳຮ້ອງຂໍເປີດບັນຊີໃໝ່: ${r.fullName}`,
          message: `${r.department} - ຕຳແໜ່ງ: ${r.requestedRole}`,
          category: 'system',
          timestamp: r.createdAt.slice(0, 10),
          read: false
        });
      });

    // Active tasks
    tasks
      .filter(t => t.status !== 'completed')
      .forEach(t => {
        notifs.push({
          id: `notif-task-${t.id}`,
          title: `ວຽກມອບໝາຍ: ${t.title}`,
          message: `ມອບໃຫ້: ${t.assigneeName} (ກຳນົດສົ່ງ: ${t.dueDate})`,
          category: 'task',
          timestamp: t.dueDate,
          read: false,
          taskId: t.id
        });
      });

    setNotifications(notifs);
  }, [documents, tasks, registrations]);

  // Welcome Toast upon user change
  const showWelcomeToast = (user: User) => {
    soundEffects.playSuccessChime();
    addToast(
      'info',
      `${t.welcomeBack} - ${user.fullName}`,
      `${user.title} • ${user.department}`
    );
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('eoffice_houaphanh_current_user', JSON.stringify(user));
    showWelcomeToast(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eoffice_houaphanh_current_user');
  };

  // Document Operations
  const handleSaveDocument = async (newDoc: DocumentItem) => {
    await StorageService.saveDocument(newDoc);
    const updatedDocs = await StorageService.loadDocuments();
    setDocuments(updatedDocs);
    setDocFormType(null);
    soundEffects.playSuccessChime();
    addToast(
      newDoc.priority === 'ດ່ວນທີ່ສຸດ' ? 'urgent' : 'success',
      `ບັນທຶກເອກະສານ${newDoc.type === 'incoming' ? 'ຂາເຂົ້າ' : 'ຂາອອກ'}ສຳເລັດ`,
      `ຫົວຂໍ້: ${newDoc.title}`,
      newDoc.docNumber
    );
    // Show tracking slip right away
    setSlipModalDoc(newDoc);
  };

  const handleSignComplete = async (signedDoc: DocumentItem) => {
    await StorageService.saveDocument(signedDoc);
    const updatedDocs = await StorageService.loadDocuments();
    setDocuments(updatedDocs);
    setEsignModalDoc(null);
    soundEffects.playSignatureCelebration();
    addToast(
      'success',
      `ລົງລາຍເຊັນ ແລະ ປະທັບກາອະນຸມັດສຳເລັດແລ້ວ`,
      `ເອກະສານເລກທີ: ${signedDoc.docNumber} ໄດ້ຮັບການຢືນຢັນທາງດິຈິຕອນແລ້ວ`,
      signedDoc.docNumber
    );
  };

  const handleForwardComplete = async (updatedDoc: DocumentItem) => {
    await StorageService.saveDocument(updatedDoc);
    const updatedDocs = await StorageService.loadDocuments();
    setDocuments(updatedDocs);
    setForwardModalDoc(null);
    soundEffects.playSuccessChime();
    addToast(
      'info',
      `ສົ່ງຕໍ່ເອກະສານເລກທີ ${updatedDoc.docNumber} ຮຽບຮ້ອຍ`,
      `ຜູ້ຖືປັດຈຸບັນ: ${updatedDoc.currentHolder}`,
      updatedDoc.docNumber
    );
  };

  const handleMarkDocumentAsRead = async (docId: string) => {
    if (!currentUser) return;
    const docToUpdate = documents.find(d => d.id === docId);
    if (!docToUpdate) return;

    const now = new Date();
    const formattedTimestamp = now.toLocaleString('lo-LA');

    const newReceipt = {
      userId: currentUser.id,
      userName: currentUser.fullName,
      userTitle: currentUser.title,
      department: currentUser.department,
      readAt: formattedTimestamp,
      statusText: 'ເປີດອ່ານ ແລະ ຮັບຮູ້ແລ້ວ'
    };

    const existingReceipts = docToUpdate.readReceipts || [];
    const alreadyReceipted = existingReceipts.some(r => r.userId === currentUser.id);
    const updatedReceipts = alreadyReceipted ? existingReceipts : [...existingReceipts, newReceipt];

    const updatedDoc: DocumentItem = {
      ...docToUpdate,
      isReadByCurrentHolder: true,
      lastReadAt: formattedTimestamp,
      readReceipts: updatedReceipts,
      auditTrail: [
        ...docToUpdate.auditTrail,
        {
          id: `trail_read_${Date.now()}`,
          timestamp: formattedTimestamp,
          user: currentUser.fullName,
          action: 'ເປີດອ່ານ ແລະ ຮັບຮູ້ເອກະສານ',
          status: docToUpdate.status,
          department: currentUser.department,
          note: `ຜູ້ໃຊ້ງານ ${currentUser.fullName} (${currentUser.title}) ໄດ້ເປີດອ່ານ ແລະ ຮັບຮູ້ເອກະສານແລ້ວ`,
          readStatus: 'read',
          readAt: formattedTimestamp
        }
      ],
      updatedAt: now.toISOString()
    };

    await StorageService.saveDocument(updatedDoc);
    const updatedDocs = await StorageService.loadDocuments();
    setDocuments(updatedDocs);
    if (detailsModalDoc?.id === docId) {
      setDetailsModalDoc(updatedDoc);
    }
    soundEffects.playSuccessChime();
    addToast(
      'success',
      'ຢືນຢັນເປີດອ່ານເອກະສານສຳເລັດ',
      `ເລກທີ: ${updatedDoc.docNumber} - ບັນທຶກເຂົ້າ Timeline ແລ້ວ`,
      updatedDoc.docNumber
    );
  };

  // Task Operations
  const handleSaveTask = async (newTask: TaskItem) => {
    await StorageService.saveTask(newTask);
    const updatedTasks = await StorageService.loadTasks();
    setTasks(updatedTasks);
    setShowTaskModal(false);
    soundEffects.playSuccessChime();
    addToast(
      'success',
      'ມອບໝາຍວຽກງານໃໝ່ສຳເລັດ',
      `ມອບໃຫ້: ${newTask.assigneeName} (ກຳນົດສົ່ງ: ${newTask.dueDate})`
    );
  };

  const handleToggleTaskStatus = async (task: TaskItem) => {
    const nextStatus = task.status === 'assigned' ? 'in_progress' : task.status === 'in_progress' ? 'completed' : 'in_progress';
    await StorageService.updateTaskStatus(task.id, nextStatus);
    const updatedTasks = await StorageService.loadTasks();
    setTasks(updatedTasks);
    soundEffects.playSuccessChime();
    addToast(
      'info',
      nextStatus === 'completed' ? 'ແຈ້ງສຳເລັດວຽກງານແລ້ວ' : 'ອັບເດດສະຖານະວຽກງານ',
      task.title
    );
  };

  const handleUpdateTaskStatusWithNote = async (
    taskId: string,
    status: 'assigned' | 'in_progress' | 'completed',
    note?: string
  ) => {
    await StorageService.updateTaskStatus(taskId, status, note);
    const updatedTasks = await StorageService.loadTasks();
    setTasks(updatedTasks);
    soundEffects.playSuccessChime();
    addToast(
      'success',
      status === 'completed' ? 'ແຈ້ງສຳເລັດວຽກງານຮຽບຮ້ອຍແລ້ວ' : 'ອັບເດດສະຖານະວຽກງານແລ້ວ',
      note ? `ໝາຍເຫດ: ${note}` : undefined
    );
  };

  // User & Registration Operations
  const handleRegistrationRequest = async (req: RegistrationRequest) => {
    await StorageService.addRegistrationRequest(req);
    const updatedRegs = await StorageService.loadRegistrations();
    setRegistrations(updatedRegs);
    soundEffects.playSuccessChime();
    addToast(
      'info',
      'ສົ່ງຄຳຮ້ອງຂໍເປີດບັນຊີສຳເລັດ',
      'ກະລຸນາລໍຖ້າການອະນຸມັດຈາກຫົວໜ້າຫ້ອງວ່າການ'
    );
  };

  const handleApproveRegistration = async (id: string) => {
    await StorageService.updateRegistrationStatus(id, 'approved');
    const [updatedRegs, updatedUsers] = await Promise.all([
      StorageService.loadRegistrations(),
      StorageService.loadUsers()
    ]);
    setRegistrations(updatedRegs);
    setAllUsers(updatedUsers);
    soundEffects.playSuccessChime();
    addToast('success', 'ອະນຸມັດ ແລະ ເປີດບັນຊີພະນັກງານໃໝ່ຮຽບຮ້ອຍແລ້ວ');
  };

  const handleRejectRegistration = async (id: string) => {
    await StorageService.updateRegistrationStatus(id, 'rejected');
    const updatedRegs = await StorageService.loadRegistrations();
    setRegistrations(updatedRegs);
    soundEffects.playClickTick();
    addToast('warning', 'ປະຕິເສດຄຳຮ້ອງຂໍເປີດບັນຊີແລ້ວ');
  };

  const handleSaveUser = async (user: User) => {
    await StorageService.saveUser(user);
    const updatedUsers = await StorageService.loadUsers();
    setAllUsers(updatedUsers);
    if (currentUser?.id === user.id) setCurrentUser(user);
    soundEffects.playSuccessChime();
    addToast('success', 'ບັນທຶກຂໍ້ມູນຜູ້ໃຊ້ງານສຳເລັດ');
  };

  const handleDeleteUser = async (userId: string) => {
    const filtered = allUsers.filter(u => u.id !== userId);
    setAllUsers(filtered);
    localStorage.setItem('eoffice_houaphanh_users', JSON.stringify(filtered));
  };

  // System Management CRUD Handlers
  const handleSaveStorageBox = (box: StorageBoxItem) => {
    setStorageBoxes(prev => {
      const exists = prev.some(b => b.id === box.id);
      const updated = exists ? prev.map(b => b.id === box.id ? box : b) : [...prev, box];
      localStorage.setItem('eoffice_houaphanh_storage_boxes', JSON.stringify(updated));
      return updated;
    });
    addToast('success', 'ກ່ອງເອກະສານ', `ບັນທຶກ ${box.name} ຮຽບຮ້ອຍແລ້ວ`);
  };

  const handleDeleteStorageBox = (boxId: string) => {
    setStorageBoxes(prev => {
      const target = prev.find(b => b.id === boxId);
      const updated = prev.filter(b => b.id !== boxId);
      localStorage.setItem('eoffice_houaphanh_storage_boxes', JSON.stringify(updated));
      if (target) addToast('info', 'ລົບກ່ອງເອກະສານ', `ລົບກ່ອງ "${target.name}" ອອກແລ້ວ`);
      return updated;
    });
  };

  const handleSaveCategory = (cat: DocumentCategoryItem) => {
    setCategories(prev => {
      const exists = prev.some(c => c.id === cat.id);
      const updated = exists ? prev.map(c => c.id === cat.id ? cat : c) : [...prev, cat];
      localStorage.setItem('eoffice_houaphanh_categories', JSON.stringify(updated));
      return updated;
    });
    addToast('success', 'ປະເພດເອກະສານ', `ບັນທຶກປະເພດ "${cat.name}" ຮຽບຮ້ອຍແລ້ວ`);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories(prev => {
      const target = prev.find(c => c.id === catId);
      const updated = prev.filter(c => c.id !== catId);
      localStorage.setItem('eoffice_houaphanh_categories', JSON.stringify(updated));
      if (target) addToast('info', 'ລົບປະເພດເອກະສານ', `ລົບປະເພດ "${target.name}" ອອກແລ້ວ`);
      return updated;
    });
  };

  const handleSaveDepartment = (dept: DepartmentItem) => {
    setDepartments(prev => {
      const exists = prev.some(d => d.id === dept.id);
      const updated = exists ? prev.map(d => d.id === dept.id ? dept : d) : [...prev, dept];
      localStorage.setItem('eoffice_houaphanh_departments', JSON.stringify(updated));
      return updated;
    });
    addToast('success', 'ພະແນກ / ຂະແໜງການ', `ບັນທຶກ "${dept.name}" ຮຽບຮ້ອຍແລ້ວ`);
  };

  const handleDeleteDepartment = (deptId: string) => {
    setDepartments(prev => {
      const target = prev.find(d => d.id === deptId);
      const updated = prev.filter(d => d.id !== deptId);
      localStorage.setItem('eoffice_houaphanh_departments', JSON.stringify(updated));
      if (target) addToast('info', 'ລົບພະແນກການ', `ລົບ "${target.name}" ອອກແລ້ວ`);
      return updated;
    });
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      documents,
      tasks,
      users: allUsers,
      registrations,
      storageBoxes,
      categories,
      departments,
      numbering: {
        incomingPrefix: localStorage.getItem('eoffice_numbering_incoming_prefix') || '/ຫຂ.ຫພ',
        outgoingPrefix: localStorage.getItem('eoffice_numbering_outgoing_prefix') || '/ຂພ.ຫພ',
        year: localStorage.getItem('eoffice_numbering_year') || '2026',
      }
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eoffice_houaphanh_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('success', 'ສຳຮອງຂໍ້ມູນ', 'ດາວໂຫຼດໄຟລ໌ສຳຮອງຖານຂໍ້ມູນ JSON ສຳເລັດແລ້ວ');
  };

  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const success = await StorageService.importBackup(text);
        if (success) {
          await loadAllData();
          try {
            const parsed = JSON.parse(text);
            if (parsed.storageBoxes) {
              setStorageBoxes(parsed.storageBoxes);
              localStorage.setItem('eoffice_houaphanh_storage_boxes', JSON.stringify(parsed.storageBoxes));
            }
            if (parsed.categories) {
              setCategories(parsed.categories);
              localStorage.setItem('eoffice_houaphanh_categories', JSON.stringify(parsed.categories));
            }
            if (parsed.departments) {
              setDepartments(parsed.departments);
              localStorage.setItem('eoffice_houaphanh_departments', JSON.stringify(parsed.departments));
            }
          } catch {}
          addToast('success', 'ກູ້ຄືນຂໍ້ມູນ', 'ກູ້ຄືນຖານຂໍ້ມູນສຳເລັດສົມບູນ');
          soundEffects.playSuccessChime();
        } else {
          alert('ຮູບແບບໄຟລ໌ JSON ບໍ່ຖືກຕ້ອງ ຫຼື ຂໍ້ມູນບໍ່ສົມບູນ');
        }
      } catch (err) {
        alert('ເກີດຂໍ້ຜິດພາດໃນການອ່ານໄຟລ໌ JSON');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຣີເຊັດຂໍ້ມູນທັງໝົດກັບຄືນສູ່ຄ່າເລີ່ມຕົ້ນຂອງແຂວງ?')) return;
    setStorageBoxes(INITIAL_STORAGE_BOXES);
    setCategories(INITIAL_DOCUMENT_CATEGORIES);
    setDepartments(INITIAL_DEPARTMENTS);
    localStorage.removeItem('eoffice_houaphanh_storage_boxes');
    localStorage.removeItem('eoffice_houaphanh_categories');
    localStorage.removeItem('eoffice_houaphanh_departments');
    await StorageService.resetToSampleData();
    await loadAllData();
    addToast('info', 'ຣີເຊັດຖານຂໍ້ມູນ', 'ຕັ້ງຄ່າຂໍ້ມູນທັງໝົດກັບຄືນສູ່ສະພາບເລີ່ມຕົ້ນມາດຕະຖານແລ້ວ');
    soundEffects.playSuccessChime();
  };

  // Calculations & Filtering
  const pendingRegistrationsCount = useMemo(() => {
    return registrations.filter(r => r.status === 'pending').length;
  }, [registrations]);

  const urgentDocsCount = useMemo(() => {
    return documents.filter(d => d.priority === 'ດ່ວນທີ່ສຸດ').length;
  }, [documents]);

  const incomingDocs = useMemo(() => {
    return documents.filter(d => d.type === 'incoming');
  }, [documents]);

  const outgoingDocs = useMemo(() => {
    return documents.filter(d => d.type === 'outgoing');
  }, [documents]);

  const pendingProcessingDocs = useMemo(() => {
    return documents.filter(d => d.status === 'ກຳລັງດຳເນີນການ' || d.status === 'ລໍຖ້າບັນຈຸ' || d.status === 'ລໍຖ້າລົງລາຍເຊັນ');
  }, [documents]);

  const myAssignedWorkCount = useMemo(() => {
    if (!currentUser) return 0;
    
    // Assigned Documents
    const assignedDocs = documents.filter((doc) => {
      const isDirectAssignee = doc.assignees && doc.assignees.some(a => 
        a.includes(currentUser.fullName) || 
        a.includes(currentUser.username) ||
        (currentUser.department && a.includes(currentUser.department))
      );
      const isCurrentHolder = doc.currentHolder === currentUser.fullName || 
        (currentUser.department && (doc.currentHolder === currentUser.department || doc.currentHolderDepartment === currentUser.department));
      const isRecipientDept = doc.recipientDepartment === currentUser.department;
      const isLeadershipAssigned = (currentUser.role === 'leadership') && 
        (doc.status === 'ລໍຖ້າລົງລາຍເຊັນ' || doc.recipientDepartment.includes('ການນຳ') || doc.currentHolder.includes('ການນຳ'));

      return (isDirectAssignee || isCurrentHolder || isRecipientDept || isLeadershipAssigned) && doc.status !== 'ສຳເລັດ/ຈັດເກັບ';
    });

    // Assigned Tasks
    const assignedTasks = tasks.filter((task) => {
      const isDirectUser = task.assigneeType === 'user' && 
        (task.assigneeName === currentUser.fullName || task.assigneeName === currentUser.username);
      const isDept = task.assigneeType === 'department' && 
        currentUser.department && task.assigneeName.includes(currentUser.department);
      const isAdminTask = (currentUser.role === 'admin' || currentUser.role === 'super_admin');

      return (isDirectUser || isDept || isAdminTask) && task.status !== 'completed';
    });

    return assignedDocs.length + assignedTasks.length;
  }, [currentUser, documents, tasks]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Tab scope
      if (activeTab === 'incoming' && doc.type !== 'incoming') return false;
      if (activeTab === 'outgoing' && doc.type !== 'outgoing') return false;
      if (activeTab === 'esign' && doc.status === 'ເຊັນອະນຸມັດແລ້ວ') return false;

      // Category filter
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;

      // Priority filter
      if (selectedPriority !== 'all' && doc.priority !== selectedPriority) return false;

      // Status filter
      if (selectedStatus !== 'all' && doc.status !== selectedStatus) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNo = doc.docNumber.toLowerCase().includes(q);
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesOrigin = doc.originDepartment.toLowerCase().includes(q);
        const matchesRecipient = doc.recipientDepartment.toLowerCase().includes(q);
        const matchesBox = doc.storageBox.toLowerCase().includes(q);
        return matchesNo || matchesTitle || matchesOrigin || matchesRecipient || matchesBox;
      }

      return true;
    });
  }, [documents, activeTab, selectedCategory, selectedPriority, selectedStatus, searchQuery]);

  // If user is not logged in, render the official government login screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-amber-500 selection:text-slate-950">
        {/* Subtle Ambient Golden & Royal Blue Aurora */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/15 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Top National Motto Bar */}
        <div className="text-center space-y-1 relative z-10 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300 tracking-wider">
            <span className="text-amber-400">★</span>
            <span>{t.nationalMottoLao}</span>
            <span className="text-amber-400">★</span>
          </div>
          <p className="text-[11px] sm:text-xs text-amber-200/80 font-medium">
            {t.nationalMottoSub}
          </p>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-1.5" />
        </div>

        {/* Centered Executive Login Card */}
        <div className="w-full max-w-md mx-auto my-auto relative z-10">
          <div className="bg-slate-900/85 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative overflow-hidden">
            {/* Top Card Accent Glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-blue-600" />

            {/* Emblem & Branding Section */}
            <div className="text-center mb-6 pt-2">
              <div className="flex justify-center mb-4">
                <LaoEmblem size={96} variant="medallion" showHalo={true} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {t.provincialOfficeTitle}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xs text-blue-400 font-bold">
                  {t.appTitle}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {t.loginSubtitle} • ແຂວງຫົວພັນ (ລະຫັດ 06)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {t.usernameOrEmail}
                </label>
                <input
                  type="text"
                  defaultValue="admin"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 focus:outline-none text-white font-mono transition"
                  placeholder="somvang.x"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {t.password}
                </label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 focus:outline-none text-white font-mono transition"
                />
              </div>

              <button
                id="btn-login-submit"
                onClick={() => handleLogin(allUsers[0])}
                className="w-full py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-900/40 transition flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30"
              >
                <span>{t.loginBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-open-register"
                onClick={() => setShowRegisterModal(true)}
                className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition border border-slate-700/60 cursor-pointer"
              >
                {t.registerBtn}
              </button>

              {/* Quick Demo Selector */}
              <div className="pt-4 border-t border-slate-800/80">
                <p className="text-[11px] font-bold text-slate-400 mb-2 flex items-center justify-between">
                  <span>ເລືອກບັນຊີທົດສອບດ່ວນ (Quick Demo Accounts):</span>
                  <span className="text-[10px] text-amber-400/80 font-mono">ຄລິກເພື່ອເຂົ້າສູ່ລະບົບ</span>
                </p>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleLogin(u)}
                      className="w-full text-left p-2 rounded-xl bg-slate-800/50 hover:bg-blue-950/70 text-xs transition flex items-center justify-between border border-slate-700/40 hover:border-blue-500/40 cursor-pointer group"
                    >
                      <div className="truncate">
                        <p className="font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                          {u.fullName}
                        </p>
                        <p className="text-[10px] text-blue-300/80 truncate">
                          {u.title} • {u.department}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20 shrink-0 ml-2">
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 relative z-10 pb-2">
          © 2026 ຫ້ອງວ່າການແຂວງຫົວພັນ. ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ.
        </div>

        {showRegisterModal && (
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
            onSubmitRequest={handleRegistrationRequest}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Government Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchUser={handleLogin}
        allUsers={allUsers}
        pendingRegistrationsCount={pendingRegistrationsCount}
        urgentDocsCount={urgentDocsCount}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        currentTheme={currentTheme}
        onThemeChange={(th) => {
          setCurrentTheme(th);
          try {
            localStorage.setItem('eoffice_theme', th);
          } catch {}
          addToast('info', 'ປ່ຽນຮູບແບບສີສຳເລັດ', THEMES[th].nameLo);
        }}
        currentLang={currentLang}
        onLangChange={(lang) => {
          setCurrentLang(lang);
          try {
            localStorage.setItem('eoffice_lang', lang);
          } catch {}
          addToast('info', lang === 'lo' ? 'ປ່ຽນເປັນພາສາລາວສຳເລັດ' : 'Switched to English');
        }}
        onOpenPendingModal={() => setShowPendingModal(true)}
        onOpenNotificationDrawer={() => setShowNotificationDrawer(true)}
        onOpenUserManagement={() => setShowUserManageModal(true)}
        onOpenSystemManagement={(tab) => {
          if (tab) setSystemModalTab(tab);
          setShowSystemModal(true);
        }}
        onOpenMyWork={() => setActiveTab('my_work')}
        myWorkCount={myAssignedWorkCount}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Floating Modern Toast Alerts Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        onToastAction={(toast) => {
          if (toast.docNumber) {
            const found = documents.find(d => d.docNumber === toast.docNumber);
            if (found) setDetailsModalDoc(found);
          }
        }}
      />

      {/* Interactive Notification Center Drawer */}
      <NotificationDrawer
        isOpen={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        onNotificationClick={(item) => {
          setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
          if (item.docId) {
            const doc = documents.find(d => d.id === item.docId);
            if (doc) setDetailsModalDoc(doc);
          } else if (item.category === 'task') {
            setActiveTab('my_work');
          } else if (item.category === 'system') {
            setShowPendingModal(true);
          }
        }}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main Container with Sidebar & Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* Unified Executive Workspace & Smart Action Bar */}
        <ProvincialTicker
          urgentCount={urgentDocsCount}
          pendingSignCount={documents.filter(d => d.status === 'ລໍຖ້າລົງລາຍເຊັນ').length}
          totalDocsCount={documents.length}
          onInspectUrgent={() => {
            setActiveTab('incoming');
            setSelectedPriority('ດ່ວນທີ່ສຸດ');
          }}
          onInspectSign={() => {
            setActiveTab('esign');
          }}
          currentLang={currentLang}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Navigation Menu */}
          <nav className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs space-y-1 text-xs font-semibold">
            <button
              id="nav-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-2.5 ${
                activeTab === 'dashboard' ? theme.activeSidebarClass : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4 text-blue-600" />
              <span>{t.navDashboard}</span>
            </button>

            {/* My Work (ວຽກຂອງຂ້ອຍ) with live assigned badge */}
            <button
              id="nav-my-work"
              onClick={() => setActiveTab('my_work')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center justify-between ${
                activeTab === 'my_work' ? theme.activeSidebarClass : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-amber-500" />
                <span className="font-bold">{t.navMyWork || 'ວຽກຂອງຂ້ອຍ'}</span>
              </div>
              {myAssignedWorkCount > 0 ? (
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
                  {myAssignedWorkCount}
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
                  0
                </span>
              )}
            </button>

            <button
              id="nav-incoming"
              onClick={() => setActiveTab('incoming')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center justify-between ${
                activeTab === 'incoming' ? theme.activeSidebarClass : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileDown className="w-4 h-4 text-emerald-600" />
                <span>{t.navIncoming}</span>
              </div>
              <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-mono">
                {incomingDocs.length}
              </span>
            </button>

            <button
              id="nav-outgoing"
              onClick={() => setActiveTab('outgoing')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center justify-between ${
                activeTab === 'outgoing' ? theme.activeSidebarClass : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileUp className="w-4 h-4 text-blue-600" />
                <span>{t.navOutgoing}</span>
              </div>
              <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-mono">
                {outgoingDocs.length}
              </span>
            </button>

            <button
              id="nav-tasks"
              onClick={() => setActiveTab('tasks')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center justify-between ${
                activeTab === 'tasks' ? theme.activeSidebarClass : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-amber-600" />
                <span>{t.navTasks}</span>
              </div>
              <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-mono">
                {tasks.length}
              </span>
            </button>

            <button
              id="nav-tracking"
              onClick={() => setActiveTab('tracking')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center justify-between ${
                activeTab === 'tracking' ? theme.activeSidebarClass : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>{t.navTracking || 'ຕິດຕາມເສັ້ນທາງເອກະສານ'}</span>
              </div>
              <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                {documents.length}
              </span>
            </button>

            <button
              id="nav-esign"
              onClick={() => setActiveTab('esign')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center justify-between ${
                activeTab === 'esign' ? theme.activeSidebarClass : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-red-600" />
                <span>{t.navESign}</span>
              </div>
              <span className="bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                {documents.filter(d => d.status === 'ລໍຖ້າລົງລາຍເຊັນ').length}
              </span>
            </button>

            <button
              id="nav-reports"
              onClick={() => setActiveTab('reports')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-2.5 ${
                activeTab === 'reports' ? theme.activeSidebarClass : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>{t.navReports}</span>
            </button>

            {/* Admin and Leadership Sections */}
            {(currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.role === 'leadership') && (
              <>
                <div className="pt-2 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  ການຄຸ້ມຄອງລະບົບ (Administration)
                </div>

                <button
                  id="nav-users"
                  onClick={() => setShowUserManageModal(true)}
                  className="w-full text-left px-3.5 py-2 rounded-xl transition flex items-center gap-2.5 text-slate-700 hover:bg-slate-50"
                >
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>{t.navUsers}</span>
                </button>

                <button
                  id="nav-approvals"
                  onClick={() => setShowPendingModal(true)}
                  className="w-full text-left px-3.5 py-2 rounded-xl transition flex items-center justify-between text-slate-700 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>{t.navApprovals}</span>
                  </div>
                  {pendingRegistrationsCount > 0 && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {pendingRegistrationsCount}
                    </span>
                  )}
                </button>

                <button
                  id="nav-boxes"
                  onClick={() => {
                    setSystemModalTab('boxes');
                    setShowSystemModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2 rounded-xl transition flex items-center justify-between text-slate-700 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <Archive className="w-4 h-4 text-blue-600" />
                    <span>{t.navBoxes}</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full">
                    {storageBoxes.length}
                  </span>
                </button>

                <button
                  id="nav-categories"
                  onClick={() => {
                    setSystemModalTab('categories');
                    setShowSystemModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2 rounded-xl transition flex items-center justify-between text-slate-700 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    <span>{t.navCategories}</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                    {categories.length}
                  </span>
                </button>

                <button
                  id="nav-departments"
                  onClick={() => {
                    setSystemModalTab('departments');
                    setShowSystemModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2 rounded-xl transition flex items-center justify-between text-slate-700 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>{t.navDepartments}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                    {departments.length}
                  </span>
                </button>

                <button
                  id="nav-settings"
                  onClick={() => {
                    setSystemModalTab('backup');
                    setShowSystemModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2 rounded-xl transition flex items-center gap-2.5 text-slate-700 hover:bg-slate-50"
                >
                  <Sliders className="w-4 h-4 text-purple-600" />
                  <span>{t.navSettings}</span>
                </button>
              </>
            )}
          </nav>
        </aside>

        {/* Right Main Content Area */}
        <main className="lg:col-span-9 space-y-5">
          {/* Executive Dashboard Overview Cards */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5">
              {/* 4 Statistical Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <motion.div 
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  onClick={() => setActiveTab('incoming')}
                  className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 p-4 rounded-2xl border border-blue-200/80 shadow-xs hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-400 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">{t.totalIncoming}</span>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-110 transition-transform">
                      <FileDown className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono">{incomingDocs.length}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <p className="text-[11px] text-blue-700 font-bold">ເອກະສານຂາເຂົ້າທັງໝົດ</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  onClick={() => setActiveTab('outgoing')}
                  className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/20 p-4 rounded-2xl border border-emerald-200/80 shadow-xs hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-400 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">{t.totalOutgoing}</span>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                      <FileUp className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono">{outgoingDocs.length}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <p className="text-[11px] text-emerald-700 font-bold">ເອກະສານຂາອອກທັງໝົດ</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  onClick={() => setActiveTab('incoming')}
                  className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50/30 to-amber-100/20 p-4 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-400 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">{t.pendingProcessing}</span>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono">{pendingProcessingDocs.length}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <p className="text-[11px] text-amber-700 font-bold">ກຳລັງດຳເນີນການ</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  onClick={() => {
                    setSelectedPriority('ດ່ວນທີ່ສຸດ');
                    setActiveTab('incoming');
                  }}
                  className="relative overflow-hidden bg-gradient-to-br from-white via-rose-50/30 to-rose-100/20 p-4 rounded-2xl border border-rose-200/80 shadow-xs hover:shadow-lg hover:shadow-rose-500/10 hover:border-rose-400 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">{t.urgentAlerts}</span>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 group-hover:scale-110 transition-transform relative">
                      <AlertCircle className="w-4 h-4" />
                      {urgentDocsCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
                      )}
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-rose-700 mt-2 font-mono">{urgentDocsCount}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <p className="text-[11px] text-rose-700 font-bold">ດ່ວນທີ່ສຸດ / ໃກ້ຮອດກຳນົດ</p>
                  </div>
                </motion.div>
              </div>

              {/* Department breakdown widget */}
              <div className="bg-white p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      {t.deptBreakdown}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full">
                    ຫ້ອງວ່າການແຂວງຫົວພັນ
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  {DEPARTMENTS.slice(0, 4).map((dept) => {
                    const count = documents.filter(d => d.currentHolder.includes(dept) || d.assignees.some(a => a.includes(dept))).length;
                    return (
                      <div key={dept} className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 hover:from-blue-50/50 hover:to-indigo-50/50 rounded-xl sm:rounded-2xl border border-slate-200/70 transition hover:border-blue-300">
                        <p className="font-bold text-slate-800 truncate">{dept}</p>
                        <p className="text-lg font-black text-blue-950 mt-1 font-mono">{count} <span className="text-xs font-bold text-slate-500">ສະບັບ</span></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* My Assigned Work View (ວຽກຂອງຂ້ອຍ) */}
          {activeTab === 'my_work' && (
            <MyWorkView
              currentUser={currentUser}
              allUsers={allUsers}
              documents={documents}
              tasks={tasks}
              departments={departments}
              currentLang={currentLang}
              soundEnabled={soundEnabled}
              onOpenDocDetails={(doc) => {
                soundEffects.playClickTick();
                setDetailsModalDoc(doc);
              }}
              onOpenForwardModal={(doc) => {
                soundEffects.playClickTick();
                setForwardModalDoc(doc);
              }}
              onOpenESignModal={(doc) => {
                soundEffects.playClickTick();
                setEsignModalDoc(doc);
              }}
              onOpenPrintSlip={(doc) => {
                soundEffects.playClickTick();
                setSlipModalDoc(doc);
              }}
              onToggleTaskStatus={handleToggleTaskStatus}
              onUpdateTaskStatusWithNote={handleUpdateTaskStatusWithNote}
              onMarkDocAsRead={handleMarkDocumentAsRead}
              onAddNewTask={() => setShowTaskModal(true)}
            />
          )}

          {/* Task Management Module Tab */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-amber-600" />
                    <span>ລະບົບມອບໝາຍວຽກງານ ແລະ ຕິດຕາມກຳນົດເວລາ (Task Assignments)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ມອບໝາຍວຽກໃຫ້ບັນດາຂະແໜງການ ແລະ ວິຊາການພາຍໃນຫ້ອງວ່າການແຂວງ
                  </p>
                </div>
                <button
                  id="btn-create-task"
                  onClick={() => setShowTaskModal(true)}
                  className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ ມອບໝາຍວຽກໃໝ່</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-blue-300 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            task.priority === 'ດ່ວນທີ່ສຸດ'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'ດ່ວນ'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.priority}
                        </span>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            task.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : task.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.status === 'completed' ? 'ສຳເລັດແລ້ວ' : task.status === 'in_progress' ? 'ກຳລັງປະຕິບັດ' : 'ມອບໝາຍແລ້ວ'}
                        </span>
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 mt-2">
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {task.description}
                      </p>

                      <div className="mt-3 p-2 bg-slate-50 rounded-lg text-[11px] space-y-1">
                        <p className="text-slate-700 font-semibold">
                          ມອບໃຫ້: <span className="text-blue-900">{task.assigneeName}</span> ({task.assigneeType === 'department' ? 'ຂະແໜງການ' : 'ບຸກຄົນ'})
                        </p>
                        <p className="text-slate-500">
                          ມອບໂດຍ: {task.createdBy} - {task.creatorDepartment}
                        </p>
                        <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] pt-1 border-t border-slate-200">
                          <span>ວັນທີເລີ່ມ: {task.startDate}</span>
                          <span className="font-bold text-red-700">ກຳນົດສົ່ງ: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        ລະຫັດ: {task.id}
                      </span>
                      <button
                        onClick={() => handleToggleTaskStatus(task)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
                          task.status === 'completed'
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{task.status === 'completed' ? 'ປ່ຽນເປັນຍັງບໍ່ສຳເລັດ' : 'ແຈ້ງສຳເລັດວຽກ'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports & Analytics Tab */}
          {activeTab === 'reports' && (
            <ReportsView documents={documents} tasks={tasks} />
          )}

          {/* Document Tracking & Timeline Hub */}
          {activeTab === 'tracking' && (
            <DocumentTrackingHub
              documents={documents}
              currentUser={currentUser}
              allUsers={allUsers}
              onOpenDetails={(doc) => {
                soundEffects.playClickTick();
                setDetailsModalDoc(doc);
              }}
              onOpenPrintSlip={(doc) => {
                soundEffects.playClickTick();
                setSlipModalDoc(doc);
              }}
              onOpenForwardModal={(doc) => {
                soundEffects.playClickTick();
                setForwardModalDoc(doc);
              }}
              onOpenESignModal={(doc) => {
                soundEffects.playClickTick();
                setEsignModalDoc(doc);
              }}
              onMarkAsRead={handleMarkDocumentAsRead}
            />
          )}

          {/* Document Management Section (Dashboard, Incoming, Outgoing, eSign views) */}
          {(activeTab === 'dashboard' || activeTab === 'incoming' || activeTab === 'outgoing' || activeTab === 'esign') && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-5">
              {/* Header Title & Tab Context */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-blue-700" />
                    <span>
                      {activeTab === 'incoming'
                        ? 'ບັນຊີເອກະສານຂາເຂົ້າ ຫ້ອງວ່າການແຂວງຫົວພັນ'
                        : activeTab === 'outgoing'
                        ? 'ບັນຊີເອກະສານຂາອອກ ຫ້ອງວ່າການແຂວງຫົວພັນ'
                        : activeTab === 'esign'
                        ? 'ເອກະສານທີ່ລໍຖ້າການລົງລາຍເຊັນເອເລັກໂຕຣນິກ & ປະທັບກາ'
                        : t.recentDocs}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ຄຸ້ມຄອງ, ຕິດຕາມເສັ້ນທາງເອກະສານ ແລະ ພິມໃບຕິດຄັດທາງລັດຖະການ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDocFormType(activeTab === 'outgoing' ? 'outgoing' : 'incoming')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-900/20 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {activeTab === 'outgoing' ? t.addNewOutgoing : t.addNewIncoming}
                    </span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {/* Search query */}
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                {/* Category filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
                  >
                    <option value="all">{t.filterCategory}</option>
                    {DOCUMENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Priority filter */}
                <div>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
                  >
                    <option value="all">{t.filterPriority}</option>
                    <option value="ດ່ວນທີ່ສຸດ">ດ່ວນທີ່ສຸດ (Most Urgent)</option>
                    <option value="ດ່ວນ">ດ່ວນ (Urgent)</option>
                    <option value="ທຳມະດາ">ທຳມະດາ (Normal)</option>
                  </select>
                </div>
              </div>

              {/* Documents Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">ເລກທີ & ປະເພດ</th>
                        <th className="p-3">ເນື້ອໃນຫຍໍ້ເອກະສານ</th>
                        <th className="p-3">ຕົ້ນທາງ / ປາຍທາງ</th>
                        <th className="p-3">ຜູ້ຖືເອກະສານ</th>
                        <th className="p-3 text-center">ຄວາມດ່ວນ</th>
                        <th className="p-3 text-center">ສະຖານະ</th>
                        <th className="p-3 text-center">ການດຳເນີນການ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-blue-50/40 transition group">
                          {/* Doc Number & Category */}
                          <td className="p-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold font-mono text-blue-900">{doc.docNumber}</span>
                              <button
                                onClick={() => handleCopyTracking(doc.docNumber, doc.id)}
                                className={`p-1 rounded-md transition cursor-pointer ${
                                  copiedDocId === doc.id
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'text-slate-400 hover:text-blue-700 hover:bg-slate-100 opacity-70 group-hover:opacity-100'
                                }`}
                                title="ຄັດລອກເລກທີເອກະສານ"
                              >
                                {copiedDocId === doc.id ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-500 font-semibold">
                              {doc.category} ({doc.type === 'incoming' ? 'ຂາເຂົ້າ' : 'ຂາອອກ'})
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">{doc.issueDate}</p>
                          </td>

                          {/* Subject & Summary */}
                          <td className="p-3 max-w-xs">
                            <p className="font-bold text-slate-900 line-clamp-2 leading-relaxed">{doc.title}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                              <span className="font-semibold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                                ຕູ້: {doc.storageBox}
                              </span>
                            </p>
                          </td>

                          {/* Origin / Recipient */}
                          <td className="p-3 text-slate-700 max-w-[180px]">
                            <p className="font-semibold truncate text-slate-800">
                              {doc.type === 'incoming' ? doc.originDepartment : doc.recipientDepartment}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {doc.type === 'incoming' ? `ຮັບ: ${doc.receivedDate || '-'}` : `ສົ່ງ: ${doc.dispatchDate || '-'}`}
                            </p>
                          </td>

                          {/* Current Holder & Read Status */}
                          <td className="p-3">
                            <span className="font-semibold text-amber-900 bg-amber-50/80 border border-amber-200/80 px-2 py-0.5 rounded-lg text-[11px] block truncate max-w-[145px]">
                              {doc.currentHolder}
                            </span>
                            <div className="mt-1 flex items-center gap-1">
                              {doc.isReadByCurrentHolder !== false && doc.readReceipts && doc.readReceipts.length > 0 ? (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  <Check className="w-2.5 h-2.5" />
                                  <span>ອ່ານແລ້ວ</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-300 animate-pulse">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>ຍັງບໍ່ອ່ານ</span>
                                </span>
                              )}
                              <span className="text-[9px] text-slate-400 font-mono">
                                ({doc.auditTrail?.length || 1} ຂັ້ນຕອນ)
                              </span>
                            </div>
                          </td>

                          {/* Priority */}
                          <td className="p-3 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs ${
                                doc.priority === 'ດ່ວນທີ່ສຸດ'
                                  ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse'
                                  : doc.priority === 'ດ່ວນ'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {doc.priority === 'ດ່ວນທີ່ສຸດ' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                              )}
                              <span>{doc.priority}</span>
                            </span>
                          </td>

                          {/* Status & eSign badge */}
                          <td className="p-3 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border shadow-2xs ${
                                doc.status === 'ເຊັນອະນຸມັດແລ້ວ'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : doc.status === 'ລໍຖ້າລົງລາຍເຊັນ'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                                  : 'bg-blue-50 text-blue-800 border-blue-200'
                              }`}
                            >
                              {doc.status === 'ເຊັນອະນຸມັດແລ້ວ' && (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              )}
                              {doc.status === 'ລໍຖ້າລົງລາຍເຊັນ' && (
                                <Award className="w-3 h-3 text-amber-600" />
                              )}
                              <span>{doc.status}</span>
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="p-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              {/* Print Tracking Slip */}
                              <button
                                id={`btn-print-${doc.id}`}
                                onClick={() => {
                                  soundEffects.playClickTick();
                                  setSlipModalDoc(doc);
                                }}
                                className="p-1.5 text-blue-800 hover:bg-blue-100/70 rounded-lg transition cursor-pointer"
                                title="ພິມໃບຕິດຄັດເອກະສານ"
                              >
                                <Printer className="w-4 h-4" />
                              </button>

                              {/* Direct Timeline / Tracking Hub Button */}
                              <button
                                id={`btn-track-${doc.id}`}
                                onClick={() => {
                                  soundEffects.playClickTick();
                                  setActiveTab('tracking');
                                }}
                                className="p-1.5 text-purple-700 hover:bg-purple-100 rounded-lg transition cursor-pointer"
                                title="ກວດກາ Timeline & ເສັ້ນທາງເອກະສານ"
                              >
                                <Clock className="w-4 h-4" />
                              </button>

                              {/* View Details & Timeline */}
                              <button
                                id={`btn-view-${doc.id}`}
                                onClick={() => {
                                  soundEffects.playClickTick();
                                  setDetailsModalDoc(doc);
                                }}
                                className="p-1.5 text-slate-700 hover:bg-slate-200/70 rounded-lg transition cursor-pointer"
                                title="ເບິ່ງລາຍລະອຽດ ແລະ ເສັ້ນທາງເອກະສານ"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Forward Document */}
                              <button
                                id={`btn-forward-${doc.id}`}
                                onClick={() => {
                                  soundEffects.playClickTick();
                                  setForwardModalDoc(doc);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-100/70 rounded-lg transition cursor-pointer"
                                title="ສົ່ງຕໍ່ເອກະສານ"
                              >
                                <Send className="w-4 h-4" />
                              </button>

                              {/* E-Signature & Official Seal */}
                              {(currentUser.role === 'leadership' || currentUser.role === 'admin') && doc.status !== 'ເຊັນອະນຸມັດແລ້ວ' && (
                                <button
                                  id={`btn-sign-${doc.id}`}
                                  onClick={() => {
                                    soundEffects.playClickTick();
                                    setEsignModalDoc(doc);
                                  }}
                                  className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                                  title="ລົງລາຍເຊັນເອເລັກໂຕຣນິກ"
                                >
                                  <Award className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredDocuments.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            ບໍ່ພົບລາຍການເອກະສານຕາມເງື່ອນໄຂທີ່ຄົ້ນຫາ
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Document Tracking Slip Generator & Printer Modal */}
      {slipModalDoc && (
        <TrackingSlipModal
          document={slipModalDoc}
          onClose={() => setSlipModalDoc(null)}
        />
      )}

      {/* 2. E-Signature Pad Modal */}
      {esignModalDoc && (
        <ESignaturePadModal
          document={esignModalDoc}
          currentUser={currentUser}
          onClose={() => setEsignModalDoc(null)}
          onSignComplete={handleSignComplete}
        />
      )}

      {/* 3. Document Details & Audit Timeline Modal */}
      {detailsModalDoc && (
        <DocDetailsModal
          document={detailsModalDoc}
          currentUser={currentUser}
          onClose={() => setDetailsModalDoc(null)}
          onOpenPrintSlip={(d: DocumentItem) => {
            setDetailsModalDoc(null);
            setSlipModalDoc(d);
          }}
          onOpenForwardModal={(d: DocumentItem) => {
            setDetailsModalDoc(null);
            setForwardModalDoc(d);
          }}
          onOpenESignModal={(d: DocumentItem) => {
            setDetailsModalDoc(null);
            setEsignModalDoc(d);
          }}
          onMarkAsRead={handleMarkDocumentAsRead}
        />
      )}

      {/* 4. Forward Document Modal */}
      {forwardModalDoc && (
        <ForwardDocModal
          document={forwardModalDoc}
          currentUser={currentUser}
          allUsers={allUsers}
          onClose={() => setForwardModalDoc(null)}
          onForwardComplete={handleForwardComplete}
        />
      )}

      {/* 5. Document Entry Form Modal (Incoming / Outgoing) */}
      {docFormType && (
        <DocFormModal
          type={docFormType}
          currentUser={currentUser}
          onClose={() => setDocFormType(null)}
          onSave={handleSaveDocument}
          categoriesList={categories.map(c => c.name)}
          storageBoxesList={storageBoxes.map(b => b.name)}
          departmentsList={departments.map(d => d.name)}
          categoryDefaultBoxMap={categories.reduce((acc, c) => {
            if (c.defaultStorageBox) acc[c.name] = c.defaultStorageBox;
            return acc;
          }, {} as Record<string, string>)}
        />
      )}

      {/* 6. Task Assignment Modal */}
      {showTaskModal && (
        <TaskModal
          currentUser={currentUser}
          allUsers={allUsers}
          onClose={() => setShowTaskModal(false)}
          onSave={handleSaveTask}
        />
      )}

      {/* 7. User Registration Modal */}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSubmitRequest={handleRegistrationRequest}
        />
      )}

      {/* 8. Pending Approvals Modal for Admins */}
      {showPendingModal && (
        <PendingApprovalsModal
          requests={registrations}
          onClose={() => setShowPendingModal(false)}
          onApprove={handleApproveRegistration}
          onReject={handleRejectRegistration}
        />
      )}

      {/* 9. Backup & Restore Database Modal */}
      {showBackupModal && (
        <BackupRestoreModal
          onClose={() => setShowBackupModal(false)}
          onRefreshData={loadAllData}
        />
      )}

      {/* 10. User Account Management Modal */}
      {showUserManageModal && (
        <UserManagementModal
          users={allUsers}
          onClose={() => setShowUserManageModal(false)}
          onSaveUser={handleSaveUser}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {/* 11. System Administration Hub (Boxes, Categories, Departments, Numbering, Database) */}
      {showSystemModal && (
        <SystemManagementModal
          initialTab={systemModalTab}
          storageBoxes={storageBoxes}
          onSaveStorageBox={handleSaveStorageBox}
          onDeleteStorageBox={handleDeleteStorageBox}
          categories={categories}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          departments={departments}
          onSaveDepartment={handleSaveDepartment}
          onDeleteDepartment={handleDeleteDepartment}
          documents={documents}
          currentTheme={currentTheme}
          onThemeChange={(th) => {
            setCurrentTheme(th);
            try {
              localStorage.setItem('eoffice_theme', th);
            } catch {}
            addToast('info', 'ປ່ຽນຮູບແບບສີສຳເລັດ', THEMES[th].nameLo);
          }}
          currentLanguage={currentLang}
          onLanguageChange={(lang) => {
            setCurrentLang(lang);
            try {
              localStorage.setItem('eoffice_lang', lang);
            } catch {}
            addToast('info', lang === 'lo' ? 'ປ່ຽນເປັນພາສາລາວສຳເລັດ' : 'Switched to English');
          }}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
          onResetDefaults={handleResetDefaults}
          onClose={() => setShowSystemModal(false)}
        />
      )}
    </div>
  );
}
