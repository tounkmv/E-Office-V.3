import React from 'react';
import { Printer, X, CheckCircle2, QrCode } from 'lucide-react';
import { DocumentItem } from '../types';
import { LaoEmblem } from './LaoEmblem';

interface TrackingSlipModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const TrackingSlipModal: React.FC<TrackingSlipModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:rounded-none">
        {/* Modal Controls Header (Hidden during print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h3 className="text-sm font-bold tracking-wide">
              ໃບຕິດຄັດ ແລະ ຕິດຕາມເອກະສານທາງລັດຖະການ (Official Tracking Slip)
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="btn-print-slip"
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>ພິມໃບຕິດຄັດ (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Government Slip Document */}
        <div className="p-8 sm:p-10 font-sans text-slate-900 bg-white" id="printable-slip">
          {/* Official Lao PDR Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
            <div className="flex justify-center mb-1">
              <LaoEmblem size={64} />
            </div>
            <h2 className="text-sm sm:text-base font-bold tracking-wide text-slate-950">
              ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ
            </h2>
            <p className="text-xs font-medium text-slate-800 tracking-wider">
              ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນະຖາວອນ
            </p>
            <div className="w-36 h-0.5 bg-slate-900 mx-auto my-1"></div>
            <div className="flex items-center justify-between text-xs font-bold pt-2 px-2 text-slate-800">
              <div className="text-left">
                <p>ແຂວງຫົວພັນ</p>
                <p className="text-blue-900">ຫ້ອງວ່າການແຂວງ</p>
              </div>
              <div className="text-right">
                <p>ເລກທີ: <span className="text-slate-950 underline font-extrabold">{document.docNumber}</span></p>
                <p className="text-slate-600">ຊຳເໜືອ, ລົງວັນທີ: {document.issueDate}</p>
              </div>
            </div>
          </div>

          {/* Slip Title */}
          <div className="text-center my-4 py-2 bg-slate-50 border border-slate-200 rounded-lg">
            <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-blue-950">
              ໃບຕິດຕາມ ແລະ ແນະນຳເອກະສານທາງລັດຖະການ
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              (ປະເພດ: {document.type === 'incoming' ? 'ເອກະສານຂາເຂົ້າ' : 'ເອກະສານຂາອອກ'} - {document.category})
            </p>
          </div>

          {/* Document Summary & Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border border-slate-300 rounded-lg p-4 bg-slate-50/50">
            <div>
              <span className="font-bold text-slate-700">ປະເພດເອກະສານ: </span>
              <span className="font-semibold text-slate-950">{document.category}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">ລະດັບຄວາມດ່ວນ: </span>
              <span className={`font-bold ${document.priority === 'ດ່ວນທີ່ສຸດ' ? 'text-red-700' : 'text-blue-900'}`}>
                {document.priority}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-700">
                {document.type === 'incoming' ? 'ມາຈາກພາກສ່ວນ:' : 'ຫ້ອງວ່າການແຂວງ ສົ່ງເຖິງ:'}{' '}
              </span>
              <span className="font-semibold text-slate-950">
                {document.type === 'incoming' ? document.originDepartment : document.recipientDepartment}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-700">ຕູ້ເກັບມ້ຽນ (Storage Box): </span>
              <span className="font-semibold text-blue-900">{document.storageBox}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="font-bold text-slate-700">ຜູ້ຮັບຜິດຊອບ / ມອບໝາຍ: </span>
              <span className="font-semibold text-slate-900">{document.assignees.join(', ')}</span>
            </div>
            <div className="sm:col-span-2 pt-1 border-t border-slate-200">
              <span className="font-bold text-slate-800">ເນື້ອໃນຫຍໍ້ເອກະສານ: </span>
              <p className="mt-1 text-slate-900 leading-relaxed font-medium bg-white p-2.5 rounded border border-slate-200">
                {document.title}
              </p>
            </div>
          </div>

          {/* Official Routing History / Audit Table */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>ເສັ້ນທາງ ແລະ ປະຫວັດການເຄື່ອນໄຫວເອກະສານ (Audit Trail)</span>
              <span className="text-[11px] font-normal text-slate-500">ຜູ້ຖືເອກະສານປະຈຸບັນ: {document.currentHolder}</span>
            </h4>
            <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300 w-12 text-center">ລ/ດ</th>
                    <th className="p-2 border-r border-slate-300">ວັນທີ & ເວລາ</th>
                    <th className="p-2 border-r border-slate-300">ພາກສ່ວນ / ຜູ້ປະຕິບັດ</th>
                    <th className="p-2 border-r border-slate-300">ການດຳເນີນການ</th>
                    <th className="p-2">ລາຍເຊັນຮັບ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {document.auditTrail.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 text-center font-semibold">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600 font-mono text-[11px]">{item.timestamp}</td>
                      <td className="p-2 border-r border-slate-200 font-medium text-slate-900">
                        {item.user}
                        <span className="block text-[10px] text-slate-500">{item.department}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-800">
                        <span className="font-semibold">{item.action}</span>
                        {item.note && <span className="block text-[10px] text-blue-700 italic mt-0.5">"{item.note}"</span>}
                      </td>
                      <td className="p-2 text-center font-mono text-[10px] text-slate-400">
                        [ເຊັນຮັບດິຈິຕອນ]
                      </td>
                    </tr>
                  ))}
                  {/* Empty rows for physical routing annotations */}
                  <tr className="h-8">
                    <td className="p-2 border-r border-slate-200 text-center text-slate-400 font-semibold">{document.auditTrail.length + 1}</td>
                    <td className="p-2 border-r border-slate-200"></td>
                    <td className="p-2 border-r border-slate-200"></td>
                    <td className="p-2 border-r border-slate-200"></td>
                    <td className="p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Leadership Directives & Approval Area */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 flex flex-col justify-between min-h-[140px]">
              <div>
                <p className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                  ທິດຊີ້ນຳ ຂອງຫົວໜ້າຫ້ອງວ່າການແຂວງ:
                </p>
                <div className="mt-2 space-y-1 text-slate-600 text-[11px]">
                  <p>☐ ມອບໃຫ້ຂະແໜງບໍລິຫານ ຈັດຕັ້ງປະຕິບັດ</p>
                  <p>☐ ມອບໃຫ້ຂະແໜງສັງລວມ-ແຜນການ ຄົ້ນຄວ້າ</p>
                  <p>☐ ມອບໃຫ້ຂະແໜງການເງິນ ກວດກາລາຍລະອຽດ</p>
                  <p>☐ ແຈ້ງການນຳແຂວງຮັບຊາບ</p>
                </div>
              </div>
              <div className="mt-3 text-right">
                <p className="font-bold text-slate-900">ທ່ານ ຄໍາຜາຍ ໄຊຍະວົງ</p>
                <p className="text-[10px] text-slate-500">ຫົວໜ້າຫ້ອງວ່າການແຂວງຫົວພັນ</p>
              </div>
            </div>

            {/* Official Digital Signature & Stamp Box */}
            <div className="border-2 border-dashed border-red-300 rounded-lg p-3 bg-red-50/40 relative flex flex-col justify-between min-h-[140px]">
              <div>
                <p className="font-bold text-red-950 flex items-center justify-between border-b border-red-200 pb-1">
                  <span>ກາປະທັບ ແລະ ລາຍເຊັນເອເລັກໂຕຣນິກ</span>
                  {document.eSignature?.verified && (
                    <span className="text-emerald-700 flex items-center gap-1 text-[10px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ຢັ້ງຢືນແລ້ວ
                    </span>
                  )}
                </p>

                {document.eSignature ? (
                  <div className="mt-2 space-y-1 text-xs">
                    <p className="font-bold text-slate-900">{document.eSignature.signedBy}</p>
                    <p className="text-[11px] text-slate-600">{document.eSignature.userTitle}</p>
                    <p className="text-[10px] text-slate-500 font-mono">ເວລາເຊັນ: {document.eSignature.signedAt}</p>
                    <p className="text-[9px] text-slate-400 font-mono truncate">
                      {document.eSignature.certificateHash}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 text-center text-slate-400">
                    <p className="text-xs">ຍັງບໍ່ທັນມີລາຍເຊັນເອເລັກໂຕຣນິກ</p>
                    <p className="text-[10px] text-slate-400 mt-1">[ບ່ອນຈ້ຳກາປະທັບທາງການ]</p>
                  </div>
                )}
              </div>

              {/* Official Red Seal visual representation */}
              <div className="mt-2 flex items-center justify-between pt-2 border-t border-red-200 text-[10px] text-red-800">
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-6 h-6 text-slate-800" />
                  <span className="font-mono">{document.docNumber}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">ຫ້ອງວ່າການແຂວງຫົວພັນ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
            <span>ລະບົບ e-Office DMS ຫ້ອງວ່າການແຂວງຫົວພັນ - ອອກໂດຍຄອມພິວເຕີ</span>
            <span>ວັນທີພິມ: {new Date().toLocaleString('lo-LA')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
