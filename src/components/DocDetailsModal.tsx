import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  Send, 
  Award, 
  FileText, 
  Clock, 
  Building2, 
  User as UserIcon, 
  CheckCircle2, 
  ShieldCheck,
  Archive,
  Download,
  Eye,
  Check,
  ArrowRight
} from 'lucide-react';
import { DocumentItem, User } from '../types';
import { LaoEmblem } from './LaoEmblem';

interface DocDetailsModalProps {
  document: DocumentItem | null;
  currentUser: User;
  onClose: () => void;
  onOpenPrintSlip: (doc: DocumentItem) => void;
  onOpenForwardModal: (doc: DocumentItem) => void;
  onOpenESignModal: (doc: DocumentItem) => void;
  onMarkAsRead?: (docId: string) => void;
}

export const DocDetailsModal: React.FC<DocDetailsModalProps> = ({
  document,
  currentUser,
  onClose,
  onOpenPrintSlip,
  onOpenForwardModal,
  onOpenESignModal,
  onMarkAsRead
}) => {
  if (!document) return null;

  const canSign = currentUser.role === 'leadership' || currentUser.role === 'admin';
  const hasUserRead = document.readReceipts?.some(r => r.userId === currentUser.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto modal-glass-backdrop flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop motion click-outside */}
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
          className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl modal-window-shadow overflow-hidden border border-white/20 z-10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-amber-400/25">
            <div className="flex items-center gap-3">
              <LaoEmblem size={40} variant="medallion" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    {document.type === 'incoming' ? 'ເອກະສານຂາເຂົ້າ' : 'ເອກະສານຂາອອກ'}
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    {document.priority === 'ດ່ວນ' && '⚡ ດ່ວນ'}
                    {document.priority === 'ດ່ວນທີ່ສຸດ' && '🔥 ດ່ວນທີ່ສຸດ'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2 mt-1">
                  <span>ເລກທີ: {document.docNumber}</span>
                </h3>
                <p className="text-xs text-blue-200/90 font-medium">
                  ປະເພດ: <strong className="text-white">{document.category}</strong> | ລົງວັນທີ: {document.issueDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenPrintSlip(document)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition border border-white/15 cursor-pointer shadow-xs"
                title="ພິມໃບຕິດຄັດ"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">ພິມໃບຕິດຄັດ</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition border border-transparent hover:border-white/20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Main Title & Summary */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              ເນື້ອໃນຫຍໍ້ເອກະສານ (Subject)
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {document.title}
            </h2>
            {document.summary && (
              <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                {document.summary}
              </p>
            )}
          </div>

          {/* Current Custody & Read Status Highlight Box */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50/80 to-amber-50/60 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider block">
                ຜູ້ຖືເອກະສານປະຈຸບັນ & ສະຖານະການອ່ານ
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {document.currentHolder} ({document.currentHolderDepartment || 'ຫ້ອງວ່າການແຂວງ'})
              </p>
              <span className="text-[11px] text-slate-500">
                ຕູ້ເກັບມ້ຽນ: <strong>{document.storageBox}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {document.isReadByCurrentHolder !== false ? (
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] flex items-center gap-1 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ເປີດອ່ານແລ້ວ</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] flex items-center gap-1 border border-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>ຍັງບໍ່ທັນເປີດອ່ານ</span>
                </span>
              )}

              {(!hasUserRead || !document.isReadByCurrentHolder) && onMarkAsRead && (
                <button
                  onClick={() => onMarkAsRead(document.id)}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>ໝາຍວ່າອ່ານແລ້ວ</span>
                </button>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-600">ລະດັບຄວາມດ່ວນ: </span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  document.priority === 'ດ່ວນທີ່ສຸດ'
                    ? 'bg-red-100 text-red-800'
                    : document.priority === 'ດ່ວນ'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {document.priority}
              </span>
            </div>

            <div>
              <span className="font-bold text-slate-600">ສະຖານະປະຈຸບັນ: </span>
              <span className="font-semibold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                {document.status}
              </span>
            </div>

            <div>
              <span className="font-bold text-slate-600">
                {document.type === 'incoming' ? 'ມາຈາກພາກສ່ວນ:' : 'ຫ້ອງວ່າການແຂວງ ສົ່ງເຖິງ:'}{' '}
              </span>
              <span className="font-semibold text-slate-900">
                {document.type === 'incoming' ? document.originDepartment : document.recipientDepartment}
              </span>
            </div>

            <div>
              <span className="font-bold text-slate-600">ຕູ້ເກັບມ້ຽນ (Storage Box): </span>
              <span className="font-semibold text-blue-800 flex items-center gap-1 mt-0.5">
                <Archive className="w-3.5 h-3.5 text-blue-600" />
                <span>{document.storageBox}</span>
              </span>
            </div>

            <div>
              <span className="font-bold text-slate-600">ຜູ້ຖືເອກະສານຕົວຈິງ: </span>
              <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                {document.currentHolder}
              </span>
            </div>

            <div>
              <span className="font-bold text-slate-600">ວັນທີຮັບ/ສົ່ງ: </span>
              <span className="font-mono text-slate-800 font-semibold">
                {document.receivedDate || document.dispatchDate || document.issueDate}
              </span>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-600">ຜູ້ຮັບຜິດຊອບ / ມອບໝາຍ: </span>
              <span className="font-semibold text-slate-800">{document.assignees.join(', ')}</span>
            </div>
          </div>

          {/* Attachments */}
          {document.attachments && document.attachments.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>ຟາຍເອກະສານຄັດຕິດ ({document.attachments.length})</span>
              </h4>
              <div className="space-y-1.5">
                {document.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:bg-blue-50/50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        PDF
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{att.name}</p>
                        <p className="text-[10px] text-slate-400">
                          ຂະໜາດ: {(att.size / 1024 / 1024).toFixed(2)} MB | ວັນທີອັບໂຫຼດ: {att.uploadDate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`ກຳລັງເປີດເບິ່ງຟາຍ ${att.name}`)}
                      className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-slate-700 font-bold transition flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ດາວໂຫຼດ</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Digital Signature Badge if signed */}
          {document.eSignature && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>ໃບຢັ້ງຢືນລາຍເຊັນເອເລັກໂຕຣນິກ (Cryptographic E-Signature)</span>
                </span>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  ຢັ້ງຢືນແລ້ວ ✓
                </span>
              </div>
              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">ລົງລາຍເຊັນໂດຍ: </span>
                  <span className="font-bold text-slate-900">{document.eSignature.signedBy}</span>
                  <span className="block text-slate-500">{document.eSignature.userTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500">ເວລາລົງລາຍເຊັນ: </span>
                  <span className="font-mono text-slate-800 font-medium">{document.eSignature.signedAt}</span>
                </div>
                <div className="sm:col-span-2 pt-1 border-t border-emerald-200/60">
                  <span className="text-slate-500">ລະຫັດ Hash: </span>
                  <span className="font-mono text-[10px] text-slate-600 break-all">
                    {document.eSignature.certificateHash}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Read Receipts Record */}
          {document.readReceipts && document.readReceipts.length > 0 && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-700" />
                <span>ລາຍການຜູ້ເປີດອ່ານເອກະສານ ({document.readReceipts.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {document.readReceipts.map((rc, idx) => (
                  <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 text-[11px]">
                    <p className="font-bold text-slate-900">{rc.userName}</p>
                    <p className="text-[10px] text-slate-500">{rc.department}</p>
                    <p className="text-[10px] text-emerald-700 font-mono font-medium mt-0.5">✓ ອ່ານເມື່ອ: {rc.readAt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Audit Trail / Routing Timeline */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>ເສັ້ນທາງ ແລະ ປະຫວັດການເຄື່ອນໄຫວ (Document Lifecycle Timeline)</span>
            </h4>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
              {document.auditTrail.map((item, idx) => (
                <div key={item.id || idx} className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-800 border-2 border-white shadow-xs"></div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.action}</span>
                      <span className="font-mono text-[10px] text-slate-400">{item.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-semibold text-blue-950">{item.user}</span>
                      <span>({item.department})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
                      {item.targetRecipient && (
                        <span className="inline-flex items-center gap-1 text-slate-700 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                          <ArrowRight className="w-3 h-3 text-blue-600" />
                          <span>ມອບໝາຍຕໍ່ໃຫ້: <strong>{item.targetRecipient}</strong></span>
                        </span>
                      )}
                      {item.timeSpent && (
                        <span className="inline-flex items-center gap-1 text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>ໄລຍະເວລາ: {item.timeSpent}</span>
                        </span>
                      )}
                      {item.readStatus === 'read' ? (
                        <span className="text-emerald-700 font-semibold">
                          ✓ ເປີດອ່ານແລ້ວ {item.readAt ? `(${item.readAt})` : ''}
                        </span>
                      ) : item.readStatus === 'unread' ? (
                        <span className="text-amber-700 font-semibold">
                          ⚠️ ລໍຖ້າການເປີດອ່ານ
                        </span>
                      ) : null}
                    </div>

                    {item.note && (
                      <p className="text-[11px] text-slate-700 italic bg-white p-2 rounded border border-slate-200 mt-1">
                        "{item.note}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Quick Actions */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenForwardModal(document)}
              className="px-3.5 py-1.5 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ສົ່ງຕໍ່ເອກະສານ</span>
            </button>

            {canSign && document.status !== 'ເຊັນອະນຸມັດແລ້ວ' && (
              <button
                onClick={() => onOpenESignModal(document)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>ລົງລາຍເຊັນ & ປະທັບກາ</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            ປິດ
          </button>
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
  );
};

