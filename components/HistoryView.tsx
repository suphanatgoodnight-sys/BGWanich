
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
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M16,11V13H8V11H16M16,15V17H8V15H16Z" />
            </svg>
            ประวัติการยืม-คืน (Database)
          </h2>
          <p className="text-sm text-gray-500 font-medium">บันทึกข้อมูลในรูปแบบ Spreadsheet</p>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 text-sm font-bold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
        >
          กลับสู่หน้าแคตตาล็อก
        </button>
      </div>

      <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden font-mono text-[13px]">
        {/* Spreadsheet Header Row (A, B, C...) */}
        <div className="flex bg-[#f8f9fa] border-b border-gray-300">
          <div className="w-10 flex-shrink-0 border-r border-gray-300 bg-[#e8eaed]"></div>
          <div className="flex-1 flex text-center font-normal text-gray-500">
            <div className="w-[15%] border-r border-gray-300 py-1">A</div>
            <div className="w-[15%] border-r border-gray-300 py-1">B</div>
            <div className="w-[20%] border-r border-gray-300 py-1">C</div>
            <div className="w-[15%] border-r border-gray-300 py-1">D</div>
            <div className="flex-1 border-r border-gray-300 py-1">E</div>
            <div className="w-[10%] py-1">F</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-300">
                <th className="w-10 bg-[#e8eaed] border-r border-gray-300 p-0"></th>
                <th className="w-[15%] border-r border-gray-300 px-3 py-2 text-left font-bold text-gray-700">Timestamp</th>
                <th className="w-[15%] border-r border-gray-300 px-3 py-2 text-left font-bold text-gray-700">Student ID</th>
                <th className="w-[20%] border-r border-gray-300 px-3 py-2 text-left font-bold text-gray-700">Full Name</th>
                <th className="w-[15%] border-r border-gray-300 px-3 py-2 text-left font-bold text-gray-700">Classroom</th>
                <th className="flex-1 border-r border-gray-300 px-3 py-2 text-left font-bold text-gray-700">Board Games</th>
                <th className="w-[10%] px-3 py-2 text-center font-bold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td className="bg-[#e8eaed] border-r border-gray-300 text-center text-gray-400 py-10">1</td>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic">
                    (No data available in this sheet)
                  </td>
                </tr>
              ) : (
                [...records].reverse().map((record, index) => (
                  <tr key={record.id} className="border-b border-gray-200 hover:bg-[#e8f0fe] group transition-colors">
                    <td className="w-10 bg-[#e8eaed] border-r border-gray-300 text-center text-gray-500 select-none">
                      {index + 1}
                    </td>
                    <td className="w-[15%] border-r border-gray-200 px-3 py-2 whitespace-nowrap">
                      <span className="text-gray-900">{formatDate(record.timestamp)}</span>
                      <span className="text-gray-400 ml-2">{formatTime(record.timestamp)}</span>
                    </td>
                    <td className="w-[15%] border-r border-gray-200 px-3 py-2 text-indigo-600 font-medium">
                      {record.studentId}
                    </td>
                    <td className="w-[20%] border-r border-gray-200 px-3 py-2 text-gray-700">
                      {record.fullName}
                    </td>
                    <td className="w-[15%] border-r border-gray-200 px-3 py-2 text-gray-500">
                      {record.classroom}
                    </td>
                    <td className="flex-1 border-r border-gray-200 px-3 py-2 text-gray-600 truncate max-w-0">
                      {record.games}
                    </td>
                    <td className="w-[10%] px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-tight ${
                        record.type === 'BORROW' 
                          ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                          : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {record.type === 'BORROW' ? 'BORROW' : 'RETURN'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
              {/* Fill some empty rows to make it look like a sheet */}
              {Array.from({ length: Math.max(0, 10 - records.length) }).map((_, i) => (
                <tr key={`empty-${i}`} className="border-b border-gray-100">
                  <td className="w-10 bg-[#e8eaed] border-r border-gray-300 text-center text-gray-400 select-none">
                    {records.length + i + 1}
                  </td>
                  <td className="border-r border-gray-100 px-3 py-3"></td>
                  <td className="border-r border-gray-100 px-3 py-3"></td>
                  <td className="border-r border-gray-100 px-3 py-3"></td>
                  <td className="border-r border-gray-100 px-3 py-3"></td>
                  <td className="border-r border-gray-100 px-3 py-3"></td>
                  <td className="px-3 py-3"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-[11px] text-gray-400 px-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-100 border border-orange-200"></div>
          <span>กำลังยืม</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border border-green-200"></div>
          <span>คืนแล้ว</span>
        </div>
        <div className="ml-auto italic">
          Total: {records.length} records found
        </div>
      </div>
    </div>
  );
};
