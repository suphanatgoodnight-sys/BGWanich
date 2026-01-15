
import React, { useState, useRef } from 'react';
import { BoardGame } from '../types';

interface ManageGamesViewProps {
  games: BoardGame[];
  onAddGame: (game: BoardGame) => void;
  onUpdateGame: (game: BoardGame) => void;
  onDeleteGame: (id: string) => void;
  onBack: () => void;
}

export const ManageGamesView: React.FC<ManageGamesViewProps> = ({ 
  games, 
  onAddGame, 
  onUpdateGame, 
  onDeleteGame, 
  onBack 
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<BoardGame | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<BoardGame>>({
    name: '',
    category: '',
    image: '',
    description: '',
    available: true
  });

  const handleOpenAdd = () => {
    setEditingGame(null);
    setFormData({ name: '', category: '', image: '', description: '', available: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (game: BoardGame) => {
    setEditingGame(game);
    setFormData(game);
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGame) {
      onUpdateGame({ ...editingGame, ...formData } as BoardGame);
    } else {
      const newGame: BoardGame = {
        ...formData,
        id: `BG-${String(games.length + 1).padStart(3, '0')}-${Date.now().toString().slice(-3)}`,
      } as BoardGame;
      onAddGame(newGame);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">จัดการคลังบอร์ดเกม</h2>
          <p className="text-gray-500">เพิ่มรูปภาพจากเครื่อง แก้ไข หรือลบรายการบอร์ดเกมในระบบ</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onBack}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
          >
            กลับหน้ายืม
          </button>
          <button 
            onClick={handleOpenAdd}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            เพิ่มเกมใหม่
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-400">
            <tr>
              <th className="px-6 py-4">รูปภาพ</th>
              <th className="px-6 py-4">ชื่อเกม / หมวดหมู่</th>
              <th className="px-6 py-4">สถานะ</th>
              <th className="px-6 py-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {games.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic">
                  ไม่มีข้อมูลในคลัง กรุณากด "เพิ่มเกมใหม่"
                </td>
              </tr>
            ) : (
              games.map((game) => (
                <tr key={game.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                      {game.image ? (
                        <img src={game.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{game.name}</div>
                    <div className="text-xs text-indigo-500 font-medium">{game.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      game.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {game.available ? 'ว่าง' : 'ถูกยืม'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleOpenEdit(game)}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                      title="แก้ไข"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => { if(confirm('ยืนยันการลบเกมนี้ออกจากระบบ?')) onDeleteGame(game.id) }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="ลบ"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in fade-in duration-200">
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900">{editingGame ? 'แก้ไขข้อมูลบอร์ดเกม' : 'เพิ่มบอร์ดเกมใหม่'}</h3>
              <p className="text-sm text-gray-500 mt-1">กรอกข้อมูลและเลือกรูปภาพจากเครื่องเพื่อบันทึก</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Image Preview and Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">รูปภาพบอร์ดเกม</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 px-4 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors"
                    >
                      เลือกรูปภาพจากเครื่อง
                    </button>
                    <div className="text-[10px] text-gray-400">รองรับไฟล์ .jpg, .png ขนาดไม่ควรเกิน 2MB</div>
                    <input 
                      type="text" 
                      value={formData.image} 
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      placeholder="หรือวาง URL รูปภาพที่นี่..."
                      className="w-full px-3 py-1 text-xs rounded-lg border border-gray-100 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">ชื่อบอร์ดเกม</label>
                  <input 
                    type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="เช่น Catan"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">หมวดหมู่</label>
                  <input 
                    type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    placeholder="เช่น Strategy"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">สถานะเริ่มต้น</label>
                  <select 
                    value={formData.available ? 'true' : 'false'}
                    onChange={e => setFormData({...formData, available: e.target.value === 'true'})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  >
                    <option value="true">ว่าง (Available)</option>
                    <option value="false">ถูกยืม (Borrowed)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">คำอธิบายเกม</label>
                <textarea 
                  rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="บอกเล่าความสนุกของเกมนี้..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                <button 
                  type="button" onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
