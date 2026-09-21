import { db, collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from './firebase';
import { DocumentItem, TaskItem, User, RegistrationRequest } from '../types';
import { INITIAL_DOCUMENTS, INITIAL_TASKS, INITIAL_USERS, INITIAL_REGISTRATIONS } from './initialData';

const STORAGE_KEYS = {
  DOCS: 'eoffice_houaphanh_docs',
  TASKS: 'eoffice_houaphanh_tasks',
  USERS: 'eoffice_houaphanh_users',
  REGISTRATIONS: 'eoffice_houaphanh_registrations',
  THEME: 'eoffice_houaphanh_theme',
  LANG: 'eoffice_houaphanh_lang',
  CURRENT_USER: 'eoffice_houaphanh_current_user'
};

// Check file validation: Max 20MB, allowed types
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  const MAX_SIZE = 20 * 1024 * 1024; // 20MB
  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
  
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'ຂະໜາດຟາຍໃຫຍ່ເກີນ 20MB (File size exceeds 20MB limit)' };
  }
  
  const fileName = file.name.toLowerCase();
  const hasValidExt = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
  if (!hasValidExt) {
    return { valid: false, error: 'ຮອງຮັບສະເພາະຟາຍ .pdf, .doc, .docx, .xls, .xlsx ເທົ່ານັ້ນ' };
  }
  
  return { valid: true };
};

// Cryptographic hash simulation / SHA-256 calculation for e-Signatures
export async function generateDocumentHash(contentString: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(contentString + Date.now().toString());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `SHA256:${hashHex}`;
  } catch {
    // Fallback if subtle crypto is not available in some iFrame contexts
    let hash = 0;
    for (let i = 0; i < contentString.length; i++) {
      hash = (hash << 5) - hash + contentString.charCodeAt(i);
      hash |= 0;
    }
    return `SHA256:HP-${Math.abs(hash).toString(16)}-${Date.now().toString(16)}`;
  }
}

// Storage Service with Firestore + Local Fallback
export class StorageService {
  static async loadDocuments(): Promise<DocumentItem[]> {
    try {
      const colRef = collection(db, 'houaphanh_documents');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const docs = snap.docs.map(d => d.data() as DocumentItem);
        localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(docs));
        return docs;
      }
    } catch {
      console.warn('Firestore fetch failed, checking local cache...');
    }

    const local = localStorage.getItem(STORAGE_KEYS.DOCS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // pass
      }
    }

    // Seed defaults
    localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(INITIAL_DOCUMENTS));
    this.syncDocsToFirestore(INITIAL_DOCUMENTS).catch(() => {});
    return INITIAL_DOCUMENTS;
  }

  static async saveDocument(document: DocumentItem): Promise<void> {
    const docs = await this.loadDocuments();
    const existingIndex = docs.findIndex(d => d.id === document.id);
    let updatedDocs: DocumentItem[];

    if (existingIndex >= 0) {
      updatedDocs = [...docs];
      updatedDocs[existingIndex] = { ...document, updatedAt: new Date().toISOString() };
    } else {
      updatedDocs = [document, ...docs];
    }

    localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(updatedDocs));

    try {
      await setDoc(doc(db, 'houaphanh_documents', document.id), document);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  }

  static async deleteDocument(docId: string): Promise<void> {
    const docs = await this.loadDocuments();
    const filtered = docs.filter(d => d.id !== docId);
    localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(filtered));

    try {
      await deleteDoc(doc(db, 'houaphanh_documents', docId));
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
  }

  static async loadTasks(): Promise<TaskItem[]> {
    try {
      const colRef = collection(db, 'houaphanh_tasks');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const tasks = snap.docs.map(d => d.data() as TaskItem);
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        return tasks;
      }
    } catch {
      console.warn('Firestore tasks fetch fallback to local storage');
    }

    const local = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }

    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    this.syncTasksToFirestore(INITIAL_TASKS).catch(() => {});
    return INITIAL_TASKS;
  }

  static async saveTask(task: TaskItem): Promise<void> {
    const tasks = await this.loadTasks();
    const existingIndex = tasks.findIndex(t => t.id === task.id);
    let updatedTasks: TaskItem[];

    if (existingIndex >= 0) {
      updatedTasks = [...tasks];
      updatedTasks[existingIndex] = task;
    } else {
      updatedTasks = [task, ...tasks];
    }

    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));

    try {
      await setDoc(doc(db, 'houaphanh_tasks', task.id), task);
    } catch (e) {
      console.warn('Firestore task write warning:', e);
    }
  }

  static async updateTaskStatus(taskId: string, status: 'assigned' | 'in_progress' | 'completed', completionNote?: string): Promise<void> {
    const tasks = await this.loadTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = status;
    if (completionNote) task.completionNote = completionNote;

    await this.saveTask(task);
  }

  static async loadUsers(): Promise<User[]> {
    try {
      const colRef = collection(db, 'houaphanh_users');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const users = snap.docs.map(d => d.data() as User);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return users;
      }
    } catch {
      console.warn('Firestore users fetch fallback to local storage');
    }

    const local = localStorage.getItem(STORAGE_KEYS.USERS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    this.syncUsersToFirestore(INITIAL_USERS).catch(() => {});
    return INITIAL_USERS;
  }

  static async saveUser(user: User): Promise<void> {
    const users = await this.loadUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    let updated: User[];

    if (existingIndex >= 0) {
      updated = [...users];
      updated[existingIndex] = user;
    } else {
      updated = [user, ...users];
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'houaphanh_users', user.id), user);
    } catch (e) {
      console.warn('Firestore user write warning:', e);
    }
  }

  static async loadRegistrations(): Promise<RegistrationRequest[]> {
    try {
      const colRef = collection(db, 'houaphanh_registrations');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const regs = snap.docs.map(d => d.data() as RegistrationRequest);
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(regs));
        return regs;
      }
    } catch {
      console.warn('Firestore registrations fetch fallback');
    }

    const local = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }

    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
    return INITIAL_REGISTRATIONS;
  }

  static async addRegistrationRequest(req: RegistrationRequest): Promise<void> {
    const regs = await this.loadRegistrations();
    const updated = [req, ...regs];
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'houaphanh_registrations', req.id), req);
    } catch (e) {
      console.warn('Firestore registration write warning:', e);
    }
  }

  static async updateRegistrationStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    const regs = await this.loadRegistrations();
    const req = regs.find(r => r.id === id);
    if (!req) return;
    req.status = status;

    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(regs));

    try {
      await updateDoc(doc(db, 'houaphanh_registrations', id), { status });
    } catch (e) {
      console.warn('Firestore reg status update error:', e);
    }

    // If approved, create user account automatically
    if (status === 'approved') {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        username: req.username,
        fullName: req.fullName,
        title: `ວິຊາການ ${req.department}`,
        role: req.requestedRole,
        department: req.department,
        phone: req.phone,
        email: req.email,
        status: 'active',
        registeredAt: new Date().toISOString()
      };
      await this.saveUser(newUser);
    }
  }

  // Database Backup (JSON Export)
  static async exportFullBackup(): Promise<string> {
    const docs = await this.loadDocuments();
    const tasks = await this.loadTasks();
    const users = await this.loadUsers();
    const registrations = await this.loadRegistrations();

    const backupData = {
      system: 'Houaphanh Provincial Office e-Office DMS',
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      documents: docs,
      tasks: tasks,
      users: users,
      registrations: registrations
    };

    return JSON.stringify(backupData, null, 2);
  }

  // Database Restore (JSON Import)
  static async importBackup(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (!data.documents || !data.users) {
        throw new Error('Invalid backup schema');
      }

      localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(data.documents));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks || []));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users || []));
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(data.registrations || []));

      // Attempt Firestore background sync
      this.syncDocsToFirestore(data.documents).catch(() => {});
      this.syncTasksToFirestore(data.tasks || []).catch(() => {});
      this.syncUsersToFirestore(data.users || []).catch(() => {});

      return true;
    } catch (e) {
      console.error('Backup restore failed:', e);
      return false;
    }
  }

  // Reset to Initial Seed Data
  static async resetToSampleData(): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(INITIAL_DOCUMENTS));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));

    await this.syncDocsToFirestore(INITIAL_DOCUMENTS);
    await this.syncTasksToFirestore(INITIAL_TASKS);
    await this.syncUsersToFirestore(INITIAL_USERS);
  }

  private static async syncDocsToFirestore(docs: DocumentItem[]): Promise<void> {
    for (const d of docs) {
      try {
        await setDoc(doc(db, 'houaphanh_documents', d.id), d);
      } catch {}
    }
  }

  private static async syncTasksToFirestore(tasks: TaskItem[]): Promise<void> {
    for (const t of tasks) {
      try {
        await setDoc(doc(db, 'houaphanh_tasks', t.id), t);
      } catch {}
    }
  }

  private static async syncUsersToFirestore(users: User[]): Promise<void> {
    for (const u of users) {
      try {
        await setDoc(doc(db, 'houaphanh_users', u.id), u);
      } catch {}
    }
  }
}
