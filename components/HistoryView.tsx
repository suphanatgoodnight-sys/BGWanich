
import React from 'react';
import { BorrowRecord } from '../types';

interface HistoryViewProps {
  records: BorrowRecord[];
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ records, onBack }) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' น.';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">ประวัติการยืม-คืน</h2>
          <p className="text-gray-500">รายการธุรกรรมทั้งหมดที่เกิดขึ้นในระบบ</p>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          กลับสู่หน้าหลัก
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">วัน/เวลา</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">นักศึกษา</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">รายการบอร์ดเกม</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ประเภท</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                    ยังไม่มีประวัติการทำรายการในขณะนี้
                  </td>
                </tr>
              ) : (
                [...records].reverse().map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{formatDate(record.timestamp)}</div>
                      <div className="text-xs text-gray-500">{formatTime(record.timestamp)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{record.fullName}</div>
                      <div className="text-xs text-gray-500">ID: {record.studentId} • ห้อง {record.classroom}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 line-clamp-1 max-w-xs">{record.games}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        record.type === 'BORROW' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {record.type === 'BORROW' ? 'ยืม' : 'คืน'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
