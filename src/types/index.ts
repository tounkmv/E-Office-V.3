export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'leadership' 
  | 'department_head' 
  | 'clerk' 
  | 'staff';

export interface User {
  id: string;
  username: string;
  fullName: string;
  title: string;
  role: UserRole;
  department: string;
  phone: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  avatar?: string;
  signatureImage?: string;
  registeredAt?: string;
}

export type DocumentType = 'incoming' | 'outgoing';

export type DocumentCategory = 
  | 'ແຈ້ງການ' 
  | 'ດຳລັດ' 
  | 'ຂໍ້ຕົກລົງ' 
  | 'ຄຳສັ່ງ' 
  | 'ໜັງສືສະເໜີ' 
  | 'ບົດລາຍງານ' 
  | 'ສັນຍາ'
  | 'ໜັງສືເຊີນ'
  | 'ອື່ນໆ'
  | (string & {});

export interface StorageBoxItem {
  id: string;
  code: string;
  name: string;
  location: string;
  capacity?: number;
  description?: string;
  createdAt: string;
}

export interface DocumentCategoryItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  color?: string;
  defaultStorageBox?: string;
  createdAt: string;
}

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  leaderName?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export type PriorityLevel = 'ດ່ວນທີ່ສຸດ' | 'ດ່ວນ' | 'ທຳມະດາ';

export type DocumentStatus = 
  | 'ລໍຖ້າບັນຈຸ' 
  | 'ກຳລັງດຳເນີນການ' 
  | 'ສົ່ງຕໍ່ແລ້ວ' 
  | 'ລໍຖ້າລົງລາຍເຊັນ' 
  | 'ເຊັນອະນຸມັດແລ້ວ' 
  | 'ສຳເລັດ/ຈັດເກັບ';

export interface DocumentAttachment {
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadDate: string;
}

export interface DocumentReadReceipt {
  userId: string;
  userName: string;
  userTitle?: string;
  department: string;
  readAt: string;
  statusText?: string;
}

export interface DocumentAuditTrail {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  status: string;
  department: string;
  note?: string;
  readStatus?: 'read' | 'unread';
  readAt?: string;
  targetRecipient?: string;
  targetDepartment?: string;
  timeSpent?: string;
}

export interface ESignatureData {
  signedBy: string;
  userTitle: string;
  signedAt: string;
  certificateHash: string;
  signatureImage?: string;
  verified: boolean;
  signerDepartment: string;
}

export interface DocumentItem {
  id: string;
  docNumber: string;
  title: string;
  type: DocumentType;
  category: DocumentCategory;
  priority: PriorityLevel;
  status: DocumentStatus;
  originDepartment: string;
  recipientDepartment: string;
  issueDate: string;
  receivedDate?: string;
  dispatchDate?: string;
  storageBox: string;
  assignees: string[];
  currentHolder: string;
  currentHolderDepartment?: string;
  summary: string;
  attachments: DocumentAttachment[];
  auditTrail: DocumentAuditTrail[];
  readReceipts?: DocumentReadReceipt[];
  isReadByCurrentHolder?: boolean;
  lastReadAt?: string;
  eSignature?: ESignatureData;
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  assigneeType: 'user' | 'department';
  assigneeName: string;
  startDate: string;
  dueDate: string;
  status: 'assigned' | 'in_progress' | 'completed';
  createdBy: string;
  creatorDepartment: string;
  documentId?: string;
  documentNumber?: string;
  attachments: DocumentAttachment[];
  completionNote?: string;
  createdAt: string;
}

export interface RegistrationRequest {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  email: string;
  department: string;
  requestedRole: UserRole;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export type ThemeName = 'royal_blue' | 'emerald_green' | 'slate_dark' | 'crimson_gold' | 'golden_amber';

export type LanguageCode = 'lo' | 'en';
