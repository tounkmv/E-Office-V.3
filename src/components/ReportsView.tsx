import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Printer, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Building
} from 'lucide-react';
import { DocumentItem, TaskItem } from '../types';
import { DEPARTMENTS } from '../lib/initialData';

interface ReportsViewProps {
  documents: DocumentItem[];
  tasks: TaskItem[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ documents, tasks }) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'incoming' | 'outgoing'>('all');

  // Filter logic
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // Dept filter
      if (selectedDept !== 'all') {
        const matchesOrigin = doc.originDepartment.includes(selectedDept);
        const matchesRecipient = doc.recipientDepartment.includes(selectedDept);
        const matchesHolder = doc.currentHolder.includes(selectedDept);
        const matchesAssignee = doc.assignees.some(a => a.includes(selectedDept));
        if (!matchesOrigin && !matchesRecipient && !matchesHolder && !matchesAssignee) {
          return false;
        }
      }

      // Type filter
      if (selectedType !== 'all' && doc.type !== selectedType) {
        return false;
      }

      // Date range filter
      if (timeRange !== 'all') {
        const docDate = new Date(doc.issueDate || doc.createdAt);
        const now = new Date();
        if (timeRange === 'today') {
          return docDate.toDateString() === now.toDateString();
        } else if (timeRange === 'week') {
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return docDate >= oneWeekAgo;
        } else if (timeRange === 'month') {
          return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
        } else if (timeRange === 'year') {
          return docDate.getFullYear() === now.getFullYear();
        }
      }

      return true;
    });
  }, [documents, selectedDept, selectedType, timeRange]);

  // Calculations
  const totalCount = filteredDocs.length;
  const incomingCount = filteredDocs.filter(d => d.type === 'incoming').length;
  const outgoingCount = filteredDocs.filter(d => d.type === 'outgoing').length;
  const completedCount = filteredDocs.filter(d => d.status === 'ເຊັນອະນຸມັດແລ້ວ' || d.status === 'ສຳເລັດ/ຈັດເກັບ').length;
  const urgentCount = filteredDocs.filter(d => d.priority === 'ດ່ວນທີ່ສຸດ' || d.priority === 'ດ່ວນ').length;

  // Department distribution
  const deptStats = useMemo(() => {
    return DEPARTMENTS.map((dept) => {
      const count = documents.filter(d => 
        d.currentHolder.includes(dept) || 
        d.originDepartment.includes(dept) || 
        d.recipientDepartment.includes(dept)
      ).length;
      return { dept, count };
    });
  }, [documents]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ເລກທີເອກະສານ', 'ປະເພດ', 'ໝວດໝູ່', 'ຫົວຂໍ້/ເນື້ອໃນຫຍໍ້', 'ລະດັບຄວາມດ່ວນ', 'ສະຖານະ', 'ຕົ້ນທາງ', 'ປາຍທາງ', 'ລົງວັນທີ', 'ຕູ້ຈັດເກັບ'];
    const rows = filteredDocs.map(d => [
      `"${d.docNumber}"`,
      d.type === 'incoming' ? 'ຂາເຂົ້າ' : 'ຂາອອກ',
      d.category,
      `"${d.title.replace(/"/g, '""')}"`,
      d.priority,
      d.status,
      `"${d.originDepartment}"`,
      `"${d.recipientDepartment}"`,
      d.issueDate,
      `"${d.storageBox}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Houaphanh_DMS_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-700" />
            <span>ລາຍງານ ແລະ ສະຖິຕິການເຄື່ອນໄຫວເອກະສານ (Reports & Analytics)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ຫ້ອງວ່າການແຂວງຫົວພັນ - ສັງລວມຕົວເລກເອກະສານຂາເຂົ້າ-ຂາອອກ ແລະ ປະສິດທິພາບການດຳເນີນງານ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>ດາວໂຫຼດ Excel (CSV)</span>
          </button>
          <button
            id="btn-print-report"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>ພິມລາຍງານ</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-xs">
        <div>
          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-700" />
            <span>ຊ່ວງໄລຍະເວລາ</span>
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
          >
            <option value="all">ທັງໝົດ (All Time)</option>
            <option value="today">ມື້ນີ້ (Today)</option>
            <option value="week">ອາທິດນີ້ (This Week)</option>
            <option value="month">ເດືອນນີ້ (This Month)</option>
            <option value="year">ປີນີ້ 2026 (This Year)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-blue-700" />
            <span>ກັ່ນຕອງຕາມຂະແໜງການ / ຫ້ອງການ</span>
          </label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
          >
            <option value="all">ທຸກຂະແໜງການ (All Divisions)</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-700" />
            <span>ປະເພດການໄຫຼຂອງເອກະສານ</span>
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
          >
            <option value="all">ທັງໝົດ (ຂາເຂົ້າ & ຂາອອກ)</option>
            <option value="incoming">ສະເພາະເອກະສານຂາເຂົ້າ</option>
            <option value="outgoing">ສະເພາະເອກະສານຂາອອກ</option>
          </select>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">ເອກະສານທັງໝົດຕາມເງື່ອນໄຂ</p>
          <p className="text-2xl font-extrabold text-blue-950 mt-1">{totalCount}</p>
          <p className="text-[11px] text-blue-700 mt-1 font-semibold">
            {incomingCount} ຂາເຂົ້າ | {outgoingCount} ຂາອອກ
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">ສຳເລັດ / ເຊັນອະນຸມັດແລ້ວ</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{completedCount}</p>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
            {totalCount > 0 ? `${((completedCount / totalCount) * 100).toFixed(1)}%` : '0%'} ຂອງເອກະສານ
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">ເອກະສານດ່ວນ & ດ່ວນທີ່ສຸດ</p>
          <p className="text-2xl font-extrabold text-rose-700 mt-1">{urgentCount}</p>
          <p className="text-[11px] text-rose-600 mt-1 font-semibold">
            ຕ້ອງການຕິດຕາມ ແລະ ເລັ່ງລັດ
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">ວຽກງານມອບໝາຍທີ່ກ່ຽວຂ້ອງ</p>
          <p className="text-2xl font-extrabold text-indigo-900 mt-1">{tasks.length}</p>
          <p className="text-[11px] text-indigo-600 mt-1 font-semibold">
            {tasks.filter(t => t.status === 'completed').length} ສຳເລັດແລ້ວ
          </p>
        </div>
      </div>

      {/* Department Breakdown Chart / Progress bars */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          ການແຈກຢາຍເອກະສານ ຕາມແຕ່ລະຂະແໜງການ
        </h3>
        <div className="space-y-2.5">
          {deptStats.map(({ dept, count }) => {
            const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
            return (
              <div key={dept} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-800">{dept}</span>
                  <span className="font-bold text-blue-950">{count} ສະບັບ</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-800 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtered Documents List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            ລາຍຊື່ເອກະສານຕາມເງື່ອນໄຂ ({filteredDocs.length} ສະບັບ)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">ເລກທີ</th>
                <th className="p-3">ປະເພດ</th>
                <th className="p-3">ເນື້ອໃນຫຍໍ້</th>
                <th className="p-3">ພາກສ່ວນຕົ້ນທາງ/ປາຍທາງ</th>
                <th className="p-3">ລົງວັນທີ</th>
                <th className="p-3 text-center">ຄວາມດ່ວນ</th>
                <th className="p-3 text-center">ສະຖານະ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold font-mono text-blue-900">{doc.docNumber}</td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-800">{doc.category}</span>
                    <span className="block text-[10px] text-slate-500">
                      {doc.type === 'incoming' ? 'ຂາເຂົ້າ' : 'ຂາອອກ'}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-900 max-w-sm">
                    <p className="line-clamp-2">{doc.title}</p>
                  </td>
                  <td className="p-3 text-slate-700">
                    <p className="font-semibold">{doc.type === 'incoming' ? doc.originDepartment : doc.recipientDepartment}</p>
                    <p className="text-[10px] text-slate-500">{doc.storageBox}</p>
                  </td>
                  <td className="p-3 font-mono text-slate-600">{doc.issueDate}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.priority === 'ດ່ວນທີ່ສຸດ'
                          ? 'bg-red-100 text-red-800'
                          : doc.priority === 'ດ່ວນ'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {doc.priority}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    ບໍ່ພົບຂໍ້ມູນເອກະສານຕາມເງື່ອນໄຂທີ່ເລືອກ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
