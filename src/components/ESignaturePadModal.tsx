import React, { useRef, useState, useEffect } from 'react';
import { X, Check, RotateCcw, ShieldCheck, Award, PenTool } from 'lucide-react';
import { DocumentItem, User } from '../types';
import { generateDocumentHash } from '../lib/storageService';

interface ESignaturePadModalProps {
  document: DocumentItem | null;
  currentUser: User;
  onClose: () => void;
  onSignComplete: (signedDoc: DocumentItem) => void;
}

export const ESignaturePadModal: React.FC<ESignaturePadModalProps> = ({
  document,
  currentUser,
  onClose,
  onSignComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [includeOfficialSeal, setIncludeOfficialSeal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signingNote, setSigningNote] = useState('ເຫັນດີອະນຸມັດ ແລະ ມອບໝາຍໃຫ້ຈັດຕັ້ງປະຕິບັດຕາມເນື້ອໃນ');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#1E3A8A'; // Blue ink
  }, []);

  if (!document) return null;

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirmSignature = async () => {
    setIsSubmitting(true);
    try {
      const canvas = canvasRef.current;
      const signatureDataUrl = canvas ? canvas.toDataURL('image/png') : undefined;
      const hash = await generateDocumentHash(document.id + document.docNumber + currentUser.fullName);

      const now = new Date();
      const formattedTimestamp = now.toLocaleString('lo-LA');

      const updatedDoc: DocumentItem = {
        ...document,
        status: 'ເຊັນອະນຸມັດແລ້ວ',
        eSignature: {
          signedBy: currentUser.fullName,
          userTitle: currentUser.title,
          signedAt: formattedTimestamp,
          certificateHash: hash,
          signatureImage: signatureDataUrl,
          verified: true,
          signerDepartment: currentUser.department
        },
        auditTrail: [
          ...document.auditTrail,
          {
            id: `trail_${Date.now()}`,
            timestamp: formattedTimestamp,
            user: currentUser.fullName,
            action: 'ລົງລາຍເຊັນເອເລັກໂຕຣນິກ ແລະ ອະນຸມັດ',
            status: 'ເຊັນອະນຸມັດແລ້ວ',
            department: currentUser.department,
            note: signingNote
          }
        ],
        updatedAt: now.toISOString()
      };

      onSignComplete(updatedDoc);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold shadow">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                ລົງລາຍເຊັນເອເລັກໂຕຣນິກ ແລະ ປະທັບກາອະນຸມັດ
              </h3>
              <p className="text-xs text-blue-200">
                e-Signature Verification System - ຫ້ອງວ່າການແຂວງຫົວພັນ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Target Document Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-blue-900">ເລກທີ: {document.docNumber}</span>
              <span className="text-slate-500">ລົງວັນທີ: {document.issueDate}</span>
            </div>
            <p className="font-bold text-slate-800 mt-2 line-clamp-2">
              {document.title}
            </p>
            <p className="text-slate-500 text-[11px] mt-1">
              {document.type === 'incoming' ? `ມາຈາກ: ${document.originDepartment}` : `ສົ່ງເຖິງ: ${document.recipientDepartment}`}
            </p>
          </div>

          {/* Signer Profile Details */}
          <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
              <div>
                <p className="font-bold text-blue-950">{currentUser.fullName}</p>
                <p className="text-blue-800 text-[11px]">{currentUser.title}</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded">
              ສິດອຳນາດລົງລາຍເຊັນ
            </span>
          </div>

          {/* Canvas Signature Pad */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-blue-700" />
                <span>ແຕ້ມລາຍເຊັນດິຈິຕອນ ຂອງທ່ານໃສ່ໃນຊ່ອງນີ້:</span>
              </label>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-medium transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ລຶບແຕ້ມໃໝ່</span>
              </button>
            </div>

            <div className="relative border-2 border-dashed border-blue-300 rounded-xl overflow-hidden bg-white touch-none">
              <canvas
                ref={canvasRef}
                width={560}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-40 cursor-crosshair bg-white"
              />
              {!hasDrawn && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-300 text-xs">
                  <PenTool className="w-6 h-6 mb-1 opacity-50" />
                  <span>ກະລຸນາໃຊ້ເມົ້າສ໌ ຫຼື ນິ້ວມືແຕ້ມລາຍເຊັນຂອງທ່ານຢູ່ບ່ອນນີ້</span>
                </div>
              )}
            </div>
          </div>

          {/* Official Seal Stamping Option */}
          <div className="p-3 border border-red-200 bg-red-50/50 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border-2 border-red-600 text-red-700 flex items-center justify-center font-bold text-[9px] text-center shrink-0">
                ກາແດງ
              </div>
              <div>
                <p className="font-bold text-red-950">ປະທັບກາກຽດຕິຍົດ ຫ້ອງວ່າການແຂວງຫົວພັນ</p>
                <p className="text-[11px] text-red-800">ລະບົບຈະສ້າງ Cryptographic Hash ແລະ ປະທັບກາຮັບຮອງອັດຕະໂນມັດ</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeOfficialSeal}
              onChange={(e) => setIncludeOfficialSeal(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500 border-red-300"
            />
          </div>

          {/* Directive Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ທິດຊີ້ນຳ ຫຼື ຂໍ້ສັງເກດເພີ່ມເຕີມ:
            </label>
            <input
              type="text"
              value={signingNote}
              onChange={(e) => setSigningNote(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="ໃສ່ຄຳເຫັນ ຫຼື ທິດຊີ້ນຳ..."
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            ຍົກເລີກ
          </button>
          <button
            type="button"
            id="btn-confirm-esign"
            onClick={handleConfirmSignature}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'ກຳລັງຢືນຢັນ...' : 'ຢືນຢັນການລົງລາຍເຊັນ ແລະ ອະນຸມັດ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
