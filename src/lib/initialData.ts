import { User, DocumentItem, TaskItem, RegistrationRequest, StorageBoxItem, DocumentCategoryItem, DepartmentItem } from '../types';

export const INITIAL_STORAGE_BOXES: StorageBoxItem[] = [
  {
    id: 'box_notice',
    code: 'BOX-01',
    name: 'ຕູ້ແຈ້ງການ (Notice Box)',
    location: 'ຕູ້ A - ຊັ້ນ 1 (ຫ້ອງເກັບມ້ຽນ 101)',
    capacity: 500,
    description: 'ສຳລັບເກັບມ້ຽນບັນດາແຈ້ງການທາງການທົ່ວໄປ',
    createdAt: '2026-01-01'
  },
  {
    id: 'box_decree',
    code: 'BOX-02',
    name: 'ຕູ້ດຳລັດ (Decree Box)',
    location: 'ຕູ້ B - ຊັ້ນ 1 (ຫ້ອງເກັບມ້ຽນ 101)',
    capacity: 300,
    description: 'ດຳລັດຂອງລັດຖະບານ ແລະ ນາຍົກລັດຖະມົນຕີ',
    createdAt: '2026-01-01'
  },
  {
    id: 'box_resolution',
    code: 'BOX-03',
    name: 'ຕູ້ຂໍ້ຕົກລົງ (Resolution Box)',
    location: 'ຕູ້ C - ຊັ້ນ 2 (ຫ້ອງເກັບມ້ຽນ 101)',
    capacity: 400,
    description: 'ຂໍ້ຕົກລົງຂອງເຈົ້າແຂວງ ແລະ ຫ້ອງວ່າການແຂວງ',
    createdAt: '2026-01-01'
  },
  {
    id: 'box_order',
    code: 'BOX-04',
    name: 'ຕູ້ຄຳສັ່ງ (Order Box)',
    location: 'ຕູ້ D - ຊັ້ນ 2 (ຫ້ອງເກັບມ້ຽນ 101)',
    capacity: 300,
    description: 'ຄຳສັ່ງແນະນຳ ແລະ ຄຳສັ່ງການນຳແຂວງ',
    createdAt: '2026-01-01'
  },
  {
    id: 'box_proposal',
    code: 'BOX-05',
    name: 'ຕູ້ໜັງສືສະເໜີ (Proposal Box)',
    location: 'ຕູ້ E - ຊັ້ນ 3 (ຫ້ອງເກັບມ້ຽນ 102)',
    capacity: 600,
    description: 'ໜັງສືສະເໜີຈາກບັນດາພະແນກການ ແລະ 10 ຕົວເມືອງ',
    createdAt: '2026-01-01'
  },
  {
    id: 'box_report',
    code: 'BOX-06',
    name: 'ຕູ້ບົດລາຍງານ (Report Box)',
    location: 'ຕູ້ F - ຊັ້ນ 3 (ຫ້ອງເກັບມ້ຽນ 102)',
    capacity: 500,
    description: 'ບົດລາຍງານປະຈຳອາທິດ, ເດືອນ, ງວດ ແລະ ປີ',
    createdAt: '2026-01-01'
  },
  {
    id: 'box_contract',
    code: 'BOX-07',
    name: 'ຕູ້ສັນຍາ ແລະ ບົດບັນທຶກ (Contract Box)',
    location: 'ຕູ້ G - ຊັ້ນ 4 (ຫ້ອງເກັບມ້ຽນ 103 - ຕູ້ພິເສດ)',
    capacity: 200,
    description: 'ສັນຍາຮ່ວມມື, ບົດບັນທຶກຄວາມເຂົ້າໃຈ (MOU)',
    createdAt: '2026-01-01'
  }
];

export const INITIAL_DOCUMENT_CATEGORIES: DocumentCategoryItem[] = [
  {
    id: 'cat_notice',
    code: 'NOT',
    name: 'ແຈ້ງການ',
    description: 'ແຈ້ງການແນະນຳ, ແຈ້ງການປະສານງານ ແລະ ມະຕິຕ່າງໆ',
    color: 'blue',
    defaultStorageBox: 'ຕູ້ແຈ້ງການ (Notice Box)',
    createdAt: '2026-01-01'
  },
  {
    id: 'cat_decree',
    code: 'DEC',
    name: 'ດຳລັດ',
    description: 'ດຳລັດລັດຖະບານ ແລະ ນາຍົກລັດຖະມົນຕີ',
    color: 'indigo',
    defaultStorageBox: 'ຕູ້ດຳລັດ (Decree Box)',
    createdAt: '2026-01-01'
  },
  {
    id: 'cat_resolution',
    code: 'RES',
    name: 'ຂໍ້ຕົກລົງ',
    description: 'ຂໍ້ຕົກລົງຂອງເຈົ້າແຂວງຫົວພັນ',
    color: 'emerald',
    defaultStorageBox: 'ຕູ້ຂໍ້ຕົກລົງ (Resolution Box)',
    createdAt: '2026-01-01'
  },
  {
    id: 'cat_order',
    code: 'ORD',
    name: 'ຄຳສັ່ງ',
    description: 'ຄຳສັ່ງແນະນຳ, ຄຳສັ່ງຊີ້ນຳຈາກຂັ້ນເທິງ',
    color: 'rose',
    defaultStorageBox: 'ຕູ້ຄຳສັ່ງ (Order Box)',
    createdAt: '2026-01-01'
  },
  {
    id: 'cat_proposal',
    code: 'PROP',
    name: 'ໜັງສືສະເໜີ',
    description: 'ໜັງສືສະເໜີ, ໜັງສືຜ່ານ, ຂໍທິດຊີ້ນຳ',
    color: 'amber',
    defaultStorageBox: 'ຕູ້ໜັງສືສະເໜີ (Proposal Box)',
    createdAt: '2026-01-01'
  },
  {
    id: 'cat_report',
    code: 'REP',
    name: 'ບົດລາຍງານ',
    description: 'ບົດລາຍງານການເຄື່ອນໄຫວວຽກງານຮອບດ້ານ',
    color: 'purple',
    defaultStorageBox: 'ຕູ້ບົດລາຍງານ (Report Box)',
    createdAt: '2026-01-01'
  },
  {
    id: 'cat_contract',
    code: 'CON',
    name: 'ສັນຍາ',
    description: 'ສັນຍາທາງການຄ້າ, ສັນຍາຈັດຊື້-ຈັດຈ້າງ, ບົດບັນທຶກ',
    color: 'teal',
    defaultStorageBox: 'ຕູ້ສັນຍາ ແລະ ບົດບັນທຶກ (Contract Box)',
    createdAt: '2026-01-01'
  },
  {
    id: 'cat_invitation',
    code: 'INV',
    name: 'ໜັງສືເຊີນ',
    description: 'ໜັງສືເຊີນເຂົ້າຮ່ວມກອງປະຊຸມ, ງານລັດຖະການ',
    color: 'cyan',
    defaultStorageBox: 'ຕູ້ແຈ້ງການ (Notice Box)',
    createdAt: '2026-01-01'
  },
  {
    id: 'cat_other',
    code: 'OTH',
    name: 'ອື່ນໆ',
    description: 'ເອກະສານອື່ນໆ ທີ່ບໍ່ຢູ່ໃນໝວດໝູ່ຂ້າງເທິງ',
    color: 'slate',
    defaultStorageBox: 'ຕູ້ແຈ້ງການ (Notice Box)',
    createdAt: '2026-01-01'
  }
];

export const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  {
    id: 'dep_gov',
    code: 'GOV-HP',
    name: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
    leaderName: 'ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ',
    phone: '020 5566 7788',
    email: 'leadership@houaphanh.gov.la',
    createdAt: '2026-01-01'
  },
  {
    id: 'dep_admin',
    code: 'SEC-ADM',
    name: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
    leaderName: 'ທ່ານ ບຸນມີ ວົງສາ',
    phone: '020 5541 2899',
    email: 'admin@houaphanh.gov.la',
    createdAt: '2026-01-01'
  },
  {
    id: 'dep_plan',
    code: 'SEC-PLN',
    name: 'ຂະແໜງສັງລວມ-ແຜນການ',
    leaderName: 'ທ່ານ ສົມພອນ ແກ້ວມະນີ',
    phone: '020 5522 3344',
    email: 'planning@houaphanh.gov.la',
    createdAt: '2026-01-01'
  },
  {
    id: 'dep_research',
    code: 'SEC-RSC',
    name: 'ຂະແໜງຄົ້ນຄວ້າ-ຊີ້ນຳ',
    leaderName: 'ທ່ານ ນາງ ມະນີວອນ ລັດສະໝີ',
    phone: '020 5533 4455',
    email: 'research@houaphanh.gov.la',
    createdAt: '2026-01-01'
  },
  {
    id: 'dep_finance',
    code: 'SEC-FIN',
    name: 'ຂະແໜງການເງິນ-ຊັບສິນ',
    leaderName: 'ທ່ານ ວິໄລສັກ ໄຊສົມບັດ',
    phone: '020 5588 9900',
    email: 'finance@houaphanh.gov.la',
    createdAt: '2026-01-01'
  },
  {
    id: 'dep_org',
    code: 'SEC-ORG',
    name: 'ຂະແໜງຈັດຕັ້ງ-ພະນັກງານ',
    leaderName: 'ທ່ານ ສົມຈິດ ດວງມະນີ',
    phone: '020 5511 2233',
    email: 'organization@houaphanh.gov.la',
    createdAt: '2026-01-01'
  },
  {
    id: 'dep_insp',
    code: 'SEC-INS',
    name: 'ຂະແໜງກວດກາ ແລະ ຕ້ານການສໍ້ລາດບັງຫຼວງ',
    leaderName: 'ທ່ານ ບຸນທອງ ພົມມະຫາໄຊ',
    phone: '020 5577 8899',
    email: 'inspection@houaphanh.gov.la',
    createdAt: '2026-01-01'
  }
];

export const DEPARTMENTS = INITIAL_DEPARTMENTS.map(d => d.name);
export const STORAGE_BOXES = INITIAL_STORAGE_BOXES.map(b => b.name);
export const DOCUMENT_CATEGORIES = INITIAL_DOCUMENT_CATEGORIES.map(c => c.name);

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    username: 'admin',
    fullName: 'ທ່ານ ພຸດທະສິນ ສັນຕິສຸກ',
    title: 'ຜູ້ຄຸ້ມຄອງລະບົບ DMS (System Administrator)',
    role: 'admin',
    department: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
    phone: '020 5541 2899',
    email: 'admin.hp@houaphanh.gov.la',
    status: 'active',
    registeredAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'usr_head',
    username: 'khamphay',
    fullName: 'ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ',
    title: 'ຫົວໜ້າຫ້ອງວ່າການແຂວງຫົວພັນ',
    role: 'leadership',
    department: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
    phone: '020 5566 7788',
    email: 'khamphay.x@houaphanh.gov.la',
    status: 'active',
    registeredAt: '2026-01-05T08:00:00Z'
  },
  {
    id: 'usr_deputy',
    username: 'bounmy',
    fullName: 'ທ່ານ ບຸນມີ ສີລະວົງ',
    title: 'ຮອງຫົວໜ້າຫ້ອງວ່າການແຂວງຫົວພັນ',
    role: 'leadership',
    department: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
    phone: '020 9988 7766',
    email: 'bounmy.s@houaphanh.gov.la',
    status: 'active',
    registeredAt: '2026-01-05T08:00:00Z'
  },
  {
    id: 'usr_dept_admin',
    username: 'somsack',
    fullName: 'ທ່ານ ສົມສັກ ແກ້ວມະນີ',
    title: 'ຫົວໜ້າຂະແໜງບໍລິຫານ-ພິທີການ',
    role: 'department_head',
    department: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
    phone: '020 5412 3698',
    email: 'somsack.k@houaphanh.gov.la',
    status: 'active',
    registeredAt: '2026-01-12T08:00:00Z'
  },
  {
    id: 'usr_clerk',
    username: 'vilaiphon',
    fullName: 'ທ່ານ ນາງ ວິໄລພອນ ວົງພະຈັນ',
    title: 'ວິຊາການສັງລວມເອກະສານ ຂາເຂົ້າ-ຂາອອກ',
    role: 'clerk',
    department: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
    phone: '020 5889 1234',
    email: 'vilaiphon.w@houaphanh.gov.la',
    status: 'active',
    registeredAt: '2026-01-15T08:00:00Z'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc_in_001',
    docNumber: '142/ຫສນຍ',
    title: 'ແຈ້ງການ ແນະນຳການຈັດຕັ້ງປະຕິບັດແຜນພັດທະນາເສດຖະກິດ-ສັງຄົມ ແຂວງຫົວພັນ ປະຈຳໄຕມາດ 2',
    type: 'incoming',
    category: 'ແຈ້ງການ',
    priority: 'ດ່ວນທີ່ສຸດ',
    status: 'ກຳລັງດຳເນີນການ',
    originDepartment: 'ຫ້ອງວ່າການສຳນັກງານນາຍົກລັດຖະມົນຕີ',
    recipientDepartment: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
    issueDate: '2026-09-15',
    receivedDate: '2026-09-16',
    storageBox: 'ຕູ້ແຈ້ງການ (Notice Box)',
    assignees: ['ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ', 'ຂະແໜງສັງລວມ-ແຜນການ', 'ທ່ານ ພຸດທະສິນ ສັນຕິສຸກ'],
    currentHolder: 'ຂະແໜງສັງລວມ-ແຜນການ',
    currentHolderDepartment: 'ຂະແໜງສັງລວມ-ແຜນການ',
    isReadByCurrentHolder: true,
    lastReadAt: '2026-09-16 14:25:00',
    readReceipts: [
      {
        userId: 'usr_head',
        userName: 'ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ',
        userTitle: 'ຫົວໜ້າຫ້ອງວ່າການແຂວງຫົວພັນ',
        department: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
        readAt: '2026-09-16 10:05:00',
        statusText: 'ເປີດອ່ານ ແລະ ຊີ້ນຳແລ້ວ'
      },
      {
        userId: 'usr_clerk',
        userName: 'ທ່ານ ນາງ ວິໄລພອນ ວົງພະຈັນ',
        userTitle: 'ວິຊາການສັງລວມເອກະສານ',
        department: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
        readAt: '2026-09-16 08:32:00',
        statusText: 'ລົງທະບຽນ ແລະ ເປີດອ່ານ'
      }
    ],
    summary: 'ແຈ້ງການຈາກສຳນັກງານນາຍົກ ເພື່ອໃຫ້ແຂວງຫົວພັນກະກຽມບົດລາຍງານ ແລະ ປະເມີນສະພາບການຜະລິດກະສິກຳ ແລະ ການລົງທຶນ.',
    attachments: [
      {
        name: 'Notice_142_PMO_Houaphanh.pdf',
        size: 3840000,
        type: 'application/pdf',
        uploadDate: '2026-09-16'
      }
    ],
    auditTrail: [
      {
        id: 'trail_1',
        timestamp: '2026-09-16 08:30:00',
        user: 'ທ່ານ ນາງ ວິໄລພອນ ວົງພະຈັນ',
        action: 'ລົງທະບຽນຮັບເອກະສານຂາເຂົ້າ',
        status: 'ລໍຖ້າບັນຈຸ',
        department: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
        note: 'ຮັບເອກະສານຕົວຈິງຜ່ານໄປສະນີດ່ວນ ແລະ ສະແກນເຂົ້າສູ່ລະບົບ',
        readStatus: 'read',
        readAt: '2026-09-16 08:32:00',
        targetRecipient: 'ທ່ານ ສົມສັກ ແກ້ວມະນີ',
        targetDepartment: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
        timeSpent: '45 ນາທີ'
      },
      {
        id: 'trail_2',
        timestamp: '2026-09-16 09:15:00',
        user: 'ທ່ານ ສົມສັກ ແກ້ວມະນີ',
        action: 'ກວດກາ ແລະ ສົ່ງຕໍ່ໃຫ້ການນຳ',
        status: 'ສົ່ງຕໍ່ແລ້ວ',
        department: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
        note: 'ສະເໜີ ທ່ານ ຫົວໜ້າຫ້ອງວ່າການແຂວງ ຊີ້ນຳທິດທາງ',
        readStatus: 'read',
        readAt: '2026-09-16 09:18:00',
        targetRecipient: 'ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ',
        targetDepartment: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
        timeSpent: '4 ຊົ່ວໂມງ 45 ນາທີ'
      },
      {
        id: 'trail_3',
        timestamp: '2026-09-16 14:00:00',
        user: 'ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ',
        action: 'ຊີ້ນຳມອບໝາຍວຽກຕໍ່',
        status: 'ກຳລັງດຳເນີນການ',
        department: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
        note: 'ມອບໃຫ້ຂະແໜງສັງລວມ-ແຜນການ ສົມທົບກັບພະແນກການເງິນ ຄົ້ນຄວ້າດ່ວນພາຍໃນ 7 ວັນ',
        readStatus: 'read',
        readAt: '2026-09-16 14:25:00',
        targetRecipient: 'ຂະແໜງສັງລວມ-ແຜນການ',
        targetDepartment: 'ຂະແໜງສັງລວມ-ແຜນການ',
        timeSpent: 'ກຳລັງດຳເນີນການ (2 ມື້)'
      }
    ],
    createdAt: '2026-09-16T08:30:00Z',
    updatedAt: '2026-09-16T14:00:00Z'
  },
  {
    id: 'doc_in_002',
    docNumber: '58/ຈຂ.ຫພ',
    title: 'ຂໍ້ຕົກລົງ ວ່າດ້ວຍການອະນຸມັດງົບປະມານບູລະນະສ້ອມແປງເສັ້ນທາງເທສະບານເມືອງຊຳເໜືອ',
    type: 'incoming',
    category: 'ຂໍ້ຕົກລົງ',
    priority: 'ດ່ວນ',
    status: 'ລໍຖ້າລົງລາຍເຊັນ',
    originDepartment: 'ພະແນກໂຍທາທິການ ແລະ ຂົນສົ່ງ ແຂວງຫົວພັນ',
    recipientDepartment: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
    issueDate: '2026-09-17',
    receivedDate: '2026-09-17',
    storageBox: 'ຕູ້ຂໍ້ຕົກລົງ (Resolution Box)',
    assignees: ['ທ່ານ ບຸນມີ ສີລະວົງ', 'ຂະແໜງການເງິນ-ຊັບສິນ', 'ທ່ານ ພຸດທະສິນ ສັນຕິສຸກ', 'ທ່ານ ນາງ ວິໄລພອນ ວົງພະຈັນ'],
    currentHolder: 'ທ່ານ ບຸນມີ ສີລະວົງ',
    currentHolderDepartment: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
    isReadByCurrentHolder: false,
    lastReadAt: undefined,
    readReceipts: [
      {
        userId: 'usr_dept_admin',
        userName: 'ທ່ານ ສົມສັກ ແກ້ວມະນີ',
        userTitle: 'ຫົວໜ້າຂະແໜງບໍລິຫານ-ພິທີການ',
        department: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
        readAt: '2026-09-17 10:15:00',
        statusText: 'ກວດກາຮ່າງຂໍ້ຕົກລົງ'
      }
    ],
    summary: 'ສະເໜີອະນຸມັດງົບປະມານສຸກເສີນເພື່ອສ້ອມແປງເສັ້ນທາງທີ່ໄດ້ຮັບຜົນກະທົບຈາກລະດູຝົນໃນເທສະບານເມືອງຊຳເໜືອ.',
    attachments: [
      {
        name: 'Road_Repair_Budget_HP2026.docx',
        size: 1540000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploadDate: '2026-09-17'
      }
    ],
    auditTrail: [
      {
        id: 'trail_21',
        timestamp: '2026-09-17 10:10:00',
        user: 'ທ່ານ ນາງ ວິໄລພອນ ວົງພະຈັນ',
        action: 'ລົງທະບຽນເອກະສານ',
        status: 'ລໍຖ້າບັນຈຸ',
        department: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
        note: 'ຮັບເອກະສານສະເໜີງົບປະມານບູລະນະທາງ',
        readStatus: 'read',
        readAt: '2026-09-17 10:12:00',
        targetRecipient: 'ທ່ານ ສົມສັກ ແກ້ວມະນີ',
        targetDepartment: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
        timeSpent: '1 ຊົ່ວໂມງ 20 ນາທີ'
      },
      {
        id: 'trail_22',
        timestamp: '2026-09-17 11:30:00',
        user: 'ທ່ານ ສົມສັກ ແກ້ວມະນີ',
        action: 'ສົ່ງຕໍ່ຂໍລາຍເຊັນການນຳ',
        status: 'ລໍຖ້າລົງລາຍເຊັນ',
        department: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
        note: 'ສົ່ງຫາ ທ່ານ ຮອງຫົວໜ້າຫ້ອງວ່າການ ເພື່ອກວດກາ ແລະ ລົງລາຍເຊັນ',
        readStatus: 'unread',
        targetRecipient: 'ທ່ານ ບຸນມີ ສີລະວົງ',
        targetDepartment: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
        timeSpent: 'ລໍຖ້າການເປີດອ່ານ ແລະ ລົງລາຍເຊັນ'
      }
    ],
    createdAt: '2026-09-17T10:10:00Z',
    updatedAt: '2026-09-17T11:30:00Z'
  },
  {
    id: 'doc_out_001',
    docNumber: '89/ຫຂ.ຫພ',
    title: 'ໜັງສືເຊີນ ເຂົ້າຮ່ວມກອງປະຊຸມສະຫຼຸບວຽກງານຮອບດ້ານຂອງແຂວງຫົວພັນ ປະຈຳໄຕມາດ 3 ປີ 2026',
    type: 'outgoing',
    category: 'ໜັງສືເຊີນ',
    priority: 'ທຳມະດາ',
    status: 'ເຊັນອະນຸມັດແລ້ວ',
    originDepartment: 'ຫ້ອງວ່າການແຂວງຫົວພັນ',
    recipientDepartment: 'ບັນດາພະແນກການ, ອົງການທຽບເທົ່າ ແລະ 10 ຕົວເມືອງທົ່ວແຂວງ',
    issueDate: '2026-09-18',
    dispatchDate: '2026-09-18',
    storageBox: 'ຕູ້ໜັງສືສະເໜີ (Proposal Box)',
    assignees: ['ຂະແໜງບໍລິຫານ-ພິທີການ'],
    currentHolder: 'ຂະແໜງບໍລິຫານ-ພິທີການ (ພະແນກແຈກຢາຍ)',
    currentHolderDepartment: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
    isReadByCurrentHolder: true,
    lastReadAt: '2026-09-18 16:00:00',
    readReceipts: [
      {
        userId: 'usr_head',
        userName: 'ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ',
        userTitle: 'ຫົວໜ້າຫ້ອງວ່າການແຂວງຫົວພັນ',
        department: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
        readAt: '2026-09-18 15:40:00',
        statusText: 'ເປີດອ່ານ ແລະ ເຊັນອະນຸມັດ'
      },
      {
        userId: 'usr_dept_admin',
        userName: 'ທ່ານ ສົມສັກ ແກ້ວມະນີ',
        userTitle: 'ຫົວໜ້າຂະແໜງບໍລິຫານ-ພິທີການ',
        department: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
        readAt: '2026-09-18 09:05:00',
        statusText: 'ຮ່າງເອກະສານ'
      }
    ],
    summary: 'ເຊີນເຈົ້າເມືອງ ແລະ ຫົວໜ້າພະແນກການ ເຂົ້າຮ່ວມກອງປະຊຸມທີ່ສະໂມສອນໃຫຍ່ຂອງແຂວງ ວັນທີ 25 ກັນຍາ 2026.',
    attachments: [
      {
        name: 'Official_Invitation_Quarter3_Meeting.pdf',
        size: 2100000,
        type: 'application/pdf',
        uploadDate: '2026-09-18'
      }
    ],
    eSignature: {
      signedBy: 'ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ',
      userTitle: 'ຫົວໜ້າຫ້ອງວ່າການແຂວງຫົວພັນ',
      signedAt: '2026-09-18 15:45:00',
      certificateHash: 'SHA256:4f8e9c2b1a8d7e6f5c4b3a2019e8d7c6b5a43210fedcba9876543210abcdef01',
      signerDepartment: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
      verified: true
    },
    auditTrail: [
      {
        id: 'trail_31',
        timestamp: '2026-09-18 09:00:00',
        user: 'ທ່ານ ສົມສັກ ແກ້ວມະນີ',
        action: 'ຮ່າງເອກະສານຂາອອກ',
        status: 'ກຳລັງດຳເນີນການ',
        department: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
        readStatus: 'read',
        readAt: '2026-09-18 09:05:00',
        targetRecipient: 'ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ',
        targetDepartment: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
        timeSpent: '6 ຊົ່ວໂມງ 45 ນາທີ'
      },
      {
        id: 'trail_32',
        timestamp: '2026-09-18 15:45:00',
        user: 'ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ',
        action: 'ລົງລາຍເຊັນເອເລັກໂຕຣນິກ ແລະ ປະທັບກາ',
        status: 'ເຊັນອະນຸມັດແລ້ວ',
        department: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
        note: 'ອະນຸມັດອອກເລກທີ ແລະ ແຈກຢາຍດ່ວນ',
        readStatus: 'read',
        readAt: '2026-09-18 15:40:00',
        targetRecipient: 'ຂະແໜງບໍລິຫານ-ພິທີການ (ພະແນກແຈກຢາຍ)',
        targetDepartment: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
        timeSpent: '15 ນາທີ'
      }
    ],
    createdAt: '2026-09-18T09:00:00Z',
    updatedAt: '2026-09-18T15:45:00Z'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'tsk_001',
    title: 'ຮ່າງບົດສະຫຼຸບຕີລາຄາການຈັດຕັ້ງປະຕິບັດວຽກງານໄຕມາດ 2 ແລະ ແຜນການໄຕມາດ 3',
    description: 'ໃຫ້ສັງລວມຕົວເລກເສດຖະກິດຈາກພະແນກແຜນການ ແລະ ການລົງທຶນ, ພະແນກການເງິນ ແລະ 10 ຕົວເມືອງ ເພື່ອກະກຽມເຂົ້າກອງປະຊຸມໃຫຍ່.',
    priority: 'ດ່ວນທີ່ສຸດ',
    assigneeType: 'department',
    assigneeName: 'ຂະແໜງສັງລວມ-ແຜນການ',
    startDate: '2026-09-16',
    dueDate: '2026-09-22',
    status: 'in_progress',
    createdBy: 'ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ',
    creatorDepartment: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
    documentId: 'doc_in_001',
    documentNumber: '142/ຫສນຍ',
    attachments: [
      {
        name: 'Report_Guidelines_Q3.docx',
        size: 980000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploadDate: '2026-09-16'
      }
    ],
    createdAt: '2026-09-16T14:15:00Z'
  },
  {
    id: 'tsk_002',
    title: 'ກວດກາຄວາມພ້ອມດ້ານສະຖານທີ່ ແລະ ພິທີການສຳລັບຕ້ອນຮັບຄະນະຜູ້ແທນແຂວງເຊີນລາ (ຫວຽດນາມ)',
    description: 'ກະກຽມລາຍການອາຫານ, ທີ່ພັກ, ຂອງຂວັນທີ່ລະນຶກ ແລະ ເອກະສານເຊັນບົດບັນທຶກຮ່ວມມື ສອງແຂວງ ຫົວພັນ - ເຊີນລາ.',
    priority: 'ດ່ວນ',
    assigneeType: 'department',
    assigneeName: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
    startDate: '2026-09-18',
    dueDate: '2026-09-25',
    status: 'assigned',
    createdBy: 'ທ່ານ ບຸນມີ ສີລະວົງ',
    creatorDepartment: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
    attachments: [],
    createdAt: '2026-09-18T10:00:00Z'
  },
  {
    id: 'tsk_003',
    title: 'ກວດກາຄວາມປອດໄພລະບົບຖານຂໍ້ມູນ ແລະ ຕິດຕັ້ງໂຄງຮ່າງເຄືອຂ່າຍ e-Office ກຽມຮັບໃຊ້ກອງປະຊຸມອົງການປົກຄອງແຂວງ',
    description: 'ກວດເຊັກລະບົບສຳຮອງຂໍ້ມູນອັດຕະໂນມັດ, ທົດສອບຄວາມໄວຂອງເຄືອຂ່າຍ ແລະ ກວດກາສິດການເຂົ້າເຖິງລະບົບຂອງບັນດາຂະແໜງການດ່ວນ.',
    priority: 'ດ່ວນທີ່ສຸດ',
    assigneeType: 'user',
    assigneeName: 'ທ່ານ ພຸດທະສິນ ສັນຕິສຸກ',
    startDate: '2026-09-19',
    dueDate: '2026-09-21',
    status: 'in_progress',
    createdBy: 'ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ',
    creatorDepartment: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
    documentNumber: '142/ຫສນຍ',
    attachments: [
      {
        name: 'IT_Network_Security_Checklist.pdf',
        size: 520000,
        type: 'application/pdf',
        uploadDate: '2026-09-19'
      }
    ],
    createdAt: '2026-09-19T08:30:00Z'
  },
  {
    id: 'tsk_004',
    title: 'ປະສານງານຂໍຂໍ້ມູນສະຖິຕິການເບີກຈ່າຍງົບປະມານລົງທຶນລັດ ປະຈຳ 9 ເດືອນ',
    description: 'ປະສານສົມທົບກັບພະແນກການເງິນ ແລະ ຂະແໜງການເງິນ-ຊັບສິນ ເພື່ອນຳມາປະກອບເຂົ້າໃນບົດລາຍງານເສດຖະກິດ-ສັງຄົມ.',
    priority: 'ດ່ວນ',
    assigneeType: 'user',
    assigneeName: 'ທ່ານ ພຸດທະສິນ ສັນຕິສຸກ',
    startDate: '2026-09-18',
    dueDate: '2026-09-24',
    status: 'assigned',
    createdBy: 'ທ່ານ ສົມພອນ ແກ້ວມະນີ',
    creatorDepartment: 'ຂະແໜງສັງລວມ-ແຜນການ',
    documentNumber: '58/ຈຂ.ຫພ',
    attachments: [],
    createdAt: '2026-09-18T14:00:00Z'
  },
  {
    id: 'tsk_005',
    title: 'ກວດກາເລກທີເອກະສານ ແລະ ຈັດພິມໃບຕິດຄັດເອກະສານຂາອອກເລກທີ 89/ຫຂ.ຫພ',
    description: 'ພິມໃບຕິດຄັດບາໂຄ້ດ QR Code ແລະ ຈັດກຽມຊອງຈົດໝາຍທາງລັດຖະການ ເພື່ອແຈກຢາຍໃຫ້ 10 ຕົວເມືອງ ແລະ ບັນດາພະແນກການ.',
    priority: 'ທຳມະດາ',
    assigneeType: 'user',
    assigneeName: 'ທ່ານ ນາງ ວິໄລພອນ ວົງພະຈັນ',
    startDate: '2026-09-18',
    dueDate: '2026-09-20',
    status: 'completed',
    completionNote: 'ໄດ້ພິມໃບຕິດຄັດ ແລະ ຈັດສົ່ງທາງໄປສະນີດ່ວນໃຫ້ 10 ເມືອງຮຽບຮ້ອຍແລ້ວ',
    createdBy: 'ທ່ານ ສົມສັກ ແກ້ວມະນີ',
    creatorDepartment: 'ຂະແໜງບໍລິຫານ-ພິທີການ',
    documentId: 'doc_out_001',
    documentNumber: '89/ຫຂ.ຫພ',
    attachments: [],
    createdAt: '2026-09-18T16:00:00Z'
  },
  {
    id: 'tsk_006',
    title: 'ຮ່າງຂໍ້ຕົກລົງແຕ່ງຕັ້ງຄະນະກຳມະການຊີ້ນຳໂຄງການພັດທະນາຕົວເມືອງສີຂຽວ',
    description: 'ຄົ້ນຄວ້າກົດໝາຍ ແລະ ລະບຽບການທີ່ກ່ຽວຂ້ອງ ເພື່ອກຳນົດໂຄງປະກອບບຸກຄະລາກອນ ແລະ ສິດໜ້າທີ່ຂອງຄະນະກຳມະການ.',
    priority: 'ດ່ວນ',
    assigneeType: 'user',
    assigneeName: 'ທ່ານ ສົມສັກ ແກ້ວມະນີ',
    startDate: '2026-09-17',
    dueDate: '2026-09-23',
    status: 'in_progress',
    createdBy: 'ທ່ານ ບຸນມີ ສີລະວົງ',
    creatorDepartment: 'ຫ້ອງວ່າການແຂວງ (ການນຳ)',
    documentNumber: '58/ຈຂ.ຫພ',
    attachments: [],
    createdAt: '2026-09-17T11:00:00Z'
  }
];

export const INITIAL_REGISTRATIONS: RegistrationRequest[] = [
  {
    id: 'reg_001',
    fullName: 'ທ່ານ ວັນໄຊ ຫຼວງໂຄດ',
    username: 'vanxay.lk',
    phone: '020 5999 4433',
    email: 'vanxay.lk@houaphanh.gov.la',
    department: 'ຂະແໜງຄົ້ນຄວ້າ-ຊີ້ນຳ',
    requestedRole: 'staff',
    reason: 'ຍ້າຍມາຈາກຫ້ອງວ່າການເມືອງວຽງໄຊ ເຂົ້າຮັບໜ້າທີ່ເປັນວິຊາການຄົ້ນຄວ້າ',
    status: 'pending',
    createdAt: '2026-09-18T16:20:00Z'
  },
  {
    id: 'reg_002',
    fullName: 'ທ່ານ ນາງ ດາວອນ ມະນີວົງ',
    username: 'davone.mn',
    phone: '020 9555 1122',
    email: 'davone.mn@houaphanh.gov.la',
    department: 'ຂະແໜງການເງິນ-ຊັບສິນ',
    requestedRole: 'staff',
    reason: 'ພະນັກງານບັນຊີຊັບສິນລັດ ຕ້ອງການເຂົ້າໃຊ້ລະບົບເພື່ອຕິດຕາມເອກະສານງົບປະມານ',
    status: 'pending',
    createdAt: '2026-09-19T07:45:00Z'
  }
];
