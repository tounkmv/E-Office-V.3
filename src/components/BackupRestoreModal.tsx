import React, { useState } from 'react';
import { X, Download, Upload, Database, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { StorageService } from '../lib/storageService';

interface BackupRestoreModalProps {
  onClose: () => void;
  onRefreshData: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ onClose, onRefreshData }) => {
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExportBackup = async () => {
    try {
      setIsProcessing(true);
      const jsonBackup = await StorageService.exportFullBackup();
      const blob = new Blob([jsonBackup], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Houaphanh_eOffice_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: 'success',
        text: 'ດາວໂຫຼດຟາຍສຳຮອງຂໍ້ມູນ JSON ສຳເລັດຮຽບຮ້ອຍແລ້ວ'
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'ບໍ່ສາມາດດາວໂຫຼດຟາຍສຳຮອງໄດ້'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setIsProcessing(true);
      const text = await file.text();
      const success = await StorageService.importBackup(text);
      if (success) {
        setStatusMessage({
          type: 'success',
          text: 'ກູ້ຄືນຖານຂໍ້ມູນຈາກຟາຍ JSON ສຳເລັດຮຽບຮ້ອຍແລ້ວ'
        });
        onRefreshData();
      } else {
        setStatusMessage({
          type: 'error',
          text: 'ໂຄງສ້າງຟາຍ JSON ບໍ່ຖືກຕ້ອງຕາມມາດຕະຖານຖານຂໍ້ມູນ e-Office'
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'ເກີດຂໍ້ຜິດພາດໃນການອ່ານຟາຍ JSON'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຣີເຊັດຖານຂໍ້ມູນກັບຄືນສູ່ຄ່າເລີ່ມຕົ້ນຂອງຫ້ອງວ່າການແຂວງຫົວພັນ?')) {
      return;
    }
    try {
      setIsProcessing(true);
      await StorageService.resetToSampleData();
      setStatusMessage({
        type: 'success',
        text: 'ຣີເຊັດຖານຂໍ້ມູນກັບສູ່ຄ່າເລີ່ມຕົ້ນສຳເລັດແລ້ວ'
      });
      onRefreshData();
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'ບໍ່ສາມາດຣີເຊັດຖານຂໍ້ມູນໄດ້'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                ສຳຮອງ & ກູ້ຄືນຖານຂໍ້ມູນ (Backup & Restore)
              </h3>
              <p className="text-xs text-blue-200">
                ຄຸ້ມຄອງຄວາມປອດໄພຂອງຂໍ້ມູນລະບົບ e-Office ຫ້ອງວ່າການແຂວງຫົວພັນ
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

        <div className="p-6 space-y-5">
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Export JSON */}
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                1. ສຳຮອງຂໍ້ມູນທັງໝົດ (Export JSON Backup)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                ດາວໂຫຼດເອກະສານ, ວຽກ, ຜູ້ໃຊ້ ແລະ ເສັ້ນທາງຕິດຕາມ ເປັນຟາຍ JSON
              </p>
            </div>
            <button
              onClick={handleExportBackup}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>ດາວໂຫຼດ Backup</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                2. ກູ້ຄືນຂໍ້ມູນຈາກຟາຍ (Restore Database)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                ເລືອກຟາຍ JSON Backup ເພື່ອນຳເຂົ້າສູ່ລະບົບ ແລະ ຊິ້ງຄ໌ກັບ Firestore
              </p>
            </div>
            <label className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5 shrink-0 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>ເລືອກຟາຍກູ້ຄືນ</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                disabled={isProcessing}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset to Seed Defaults */}
          <div className="p-4 border border-red-200 rounded-xl bg-red-50/50 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-red-950">
                3. ຣີເຊັດກັບຄືນຄ່າເລີ່ມຕົ້ນ (Factory Sample Data)
              </h4>
              <p className="text-[11px] text-red-700 mt-0.5">
                ໂຫຼດຂໍ້ມູນຕົວຢ່າງມາດຕະຖານຂອງຫ້ອງວ່າການແຂວງຫົວພັນຄືນໃໝ່
              </p>
            </div>
            <button
              onClick={handleResetToDefault}
              disabled={isProcessing}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ຣີເຊັດຂໍ້ມູນ</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            ປິດໜ້າຕ່າງ
          </button>
        </div>
      </div>
    </div>
  );
};
