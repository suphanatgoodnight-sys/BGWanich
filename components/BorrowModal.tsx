
import React from 'react';
import { BoardGame } from '../types';

interface BorrowModalProps {
  selectedGames: BoardGame[];
  onConfirm: () => void;
  onClose: () => void;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({ selectedGames, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">ยืนยันรายการยืม</h2>
          <p className="text-sm text-gray-500 mt-1">โปรดตรวจสอบรายการบอร์ดเกมที่คุณต้องการยืม</p>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {selectedGames.map((game) => (
              <div key={game.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <img src={game.image} alt={game.name} className="w-16 h-12 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{game.name}</h4>
                  <p className="text-xs text-gray-500">{game.category}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-gray-600">จำนวนทั้งหมด</span>
              <span className="text-indigo-600">{selectedGames.length} รายการ</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-white transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-colors"
          >
            ไปที่หน้ากรอกข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
};
