
import React, { useState } from 'react';
import { submitToGoogleSheet } from '../services/googleSheetService';
import { BorrowRecord } from '../types';

interface ReturnModalProps {
  onClose: () => void;
  onSuccess: (message: string) => void;
  onAddRecord: (record: BorrowRecord) => void;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({ onClose, onSuccess, onAddRecord }) => {
  const [studentId, setStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setIsSubmitting(true);
    const newRecord: BorrowRecord = {
      id: `REC-${Date.now()}`,
      timestamp: new Date().toISOString(),
      studentId: studentId,
      fullName: 'นักศึกษา (คืนรายการ)',
      classroom: '-',
      games: 'คืนบอร์ดเกมทั้งหมด',
      type: 'RETURN'
    };

    const success = await submitToGoogleSheet(newRecord);

    if (success) {
      onAddRecord(newRecord);
      onSuccess(`คืนบอร์ดเกมสำเร็จแล้ว ขอบคุณที่ใช้บริการ!`);
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
             </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">คืนบอร์ดเกม</h2>
          <p className="text-sm text-gray-500 mt-1">กรอกเลขประจำตัวนักศึกษาเพื่อทำรายการคืน</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">เลขประจำตัวนักศึกษา</label>
            <input 
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="เช่น 12345"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>
          
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || !studentId.trim()}
              className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100 transition-colors"
            >
              {isSubmitting ? 'กำลังส่ง...' : 'ยืนยันการคืน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
