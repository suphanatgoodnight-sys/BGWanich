
import React, { useState, useEffect } from 'react';
import { BoardGame, AppView, StudentInfo, BorrowRecord, User } from './types';
import { INITIAL_GAMES } from './constants';
import { BoardGameCard } from './components/BoardGameCard';
import { BorrowModal } from './components/BorrowModal';
import { ReturnModal } from './components/ReturnModal';
import { HistoryView } from './components/HistoryView';
import { AuthView } from './components/AuthView';
import { submitToGoogleSheet } from './services/googleSheetService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.CATALOG);
  const [games, setGames] = useState<BoardGame[]>(INITIAL_GAMES);
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Form State
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    fullName: '',
    studentId: '',
    classroom: ''
  });

  // Sync form state when user logs in
  useEffect(() => {
    if (currentUser) {
      setStudentInfo(prev => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName,
        studentId: currentUser.studentId || prev.studentId,
        classroom: currentUser.classroom || prev.classroom
      }));
    }
  }, [currentUser]);

  const toggleGameSelection = (id: string) => {
    setSelectedGameIds(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
  };

  const handleConfirmSelection = () => {
    setShowBorrowModal(false);
    if (!currentUser) {
      setView(AppView.AUTH);
    } else {
      setView(AppView.BORROW_FORM);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    notify(`ยินดีต้อนรับคุณ ${user.fullName}`);
    // If they were coming from selection, go to form
    if (selectedGameIds.length > 0) {
      setView(AppView.BORROW_FORM);
    } else {
      setView(AppView.CATALOG);
    }
  };

  const addRecord = (record: BorrowRecord) => {
    setRecords(prev => [...prev, record]);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const selectedGamesNames = games
      .filter(g => selectedGameIds.includes(g.id))
      .map(g => g.name)
      .join(', ');

    const newRecord: BorrowRecord = {
      id: `REC-${Date.now()}`,
      timestamp: new Date().toISOString(),
      studentId: studentInfo.studentId,
      fullName: studentInfo.fullName,
      classroom: studentInfo.classroom,
      games: selectedGamesNames,
      type: 'BORROW'
    };

    const success = await submitToGoogleSheet(newRecord);

    if (success) {
      addRecord(newRecord);
      setView(AppView.SUCCESS);
      setSelectedGameIds([]);
    }
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView(AppView.CATALOG);
    notify('ออกจากระบบเรียบร้อยแล้ว');
    // Clear Google sign-in session if needed
    // Fix: Accessing window.google through any cast to avoid TypeScript errors for the external script
    const google = (window as any).google;
    if (google) google.accounts.id.disableAutoSelect();
  };

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const selectedGames = games.filter(g => selectedGameIds.includes(g.id));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100 cursor-pointer" onClick={() => setView(AppView.CATALOG)}>
              W
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 cursor-pointer" onClick={() => setView(AppView.CATALOG)}>wanich</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setView(AppView.CATALOG)}
              className={`text-sm font-bold transition-colors ${view === AppView.CATALOG ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
            >
              หน้าแรก
            </button>
            <button 
              onClick={() => setView(AppView.HISTORY)}
              className={`text-sm font-bold transition-colors ${view === AppView.HISTORY ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
            >
              ประวัติการยืม-คืน
            </button>
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 pl-1 pr-3 py-1 rounded-full border border-gray-100">
                  {currentUser.picture ? (
                    <img src={currentUser.picture} alt="" className="w-7 h-7 rounded-full object-cover border border-indigo-100" />
                  ) : (
                    <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-600">
                      {currentUser.fullName.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-bold text-gray-600 truncate max-w-[100px]">
                    {currentUser.fullName}
                  </span>
                </div>
                <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors">ออกจากระบบ</button>
              </div>
            ) : (
              <button 
                onClick={() => setView(AppView.AUTH)}
                className={`text-sm font-bold transition-colors ${view === AppView.AUTH ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
              >
                เข้าสู่ระบบ
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowReturnModal(true)}
              className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              คืนบอร์ดเกม
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {notification && (
          <div className="mb-6 p-4 bg-indigo-600 text-white rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 flex items-center justify-between">
            <span className="font-medium">{notification}</span>
            <button onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100">&times;</button>
          </div>
        )}

        {view === AppView.CATALOG && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">บอร์ดเกม</h2>
                <p className="text-gray-500 max-w-2xl">เลือกบอร์ดเกมที่ต้องการยืมจากรายการด้านล่าง เพื่อนำไปสร้างความสนุกและความสัมพันธ์ที่ดีกับเพื่อนๆ</p>
              </div>
              
              <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex gap-1">
                <button className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-sm">ทั้งหมด</button>
                <button className="px-4 py-2 text-gray-500 font-medium rounded-lg text-sm hover:bg-gray-50">ยอดนิยม</button>
                <button className="px-4 py-2 text-gray-500 font-medium rounded-lg text-sm hover:bg-gray-50">ว่างตอนนี้</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map(game => (
                <BoardGameCard 
                  key={game.id} 
                  game={game} 
                  isSelected={selectedGameIds.includes(game.id)}
                  onToggle={toggleGameSelection}
                />
              ))}
            </div>

            {/* Persistent CTA */}
            {selectedGameIds.length > 0 && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 animate-in slide-in-from-bottom-4">
                <button 
                  onClick={() => setShowBorrowModal(true)}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-2xl shadow-2xl shadow-indigo-200 font-bold flex items-center justify-between group hover:bg-indigo-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">{selectedGameIds.length}</span>
                    <span>ยืนยันรายการยืม</span>
                  </div>
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {view === AppView.AUTH && (
          <AuthView 
            onLogin={handleLoginSuccess}
            onBack={() => setView(AppView.CATALOG)}
          />
        )}

        {view === AppView.HISTORY && (
          <HistoryView 
            records={records} 
            onBack={() => setView(AppView.CATALOG)} 
          />
        )}

        {view === AppView.BORROW_FORM && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setView(AppView.CATALOG)}
              className="mb-6 flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              ย้อนกลับ
            </button>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 bg-indigo-600 text-white">
                <h2 className="text-2xl font-bold mb-2">ข้อมูลผู้ยืม</h2>
                <p className="text-indigo-100 text-sm">กรุณากรอกข้อมูลนักศึกษาให้ครบถ้วนเพื่อดำเนินการต่อ</p>
              </div>

              <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อ-นามสกุล</label>
                    <input 
                      type="text" 
                      required
                      placeholder="เช่น สมชาย ใจดี"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                      value={studentInfo.fullName}
                      onChange={e => setStudentInfo({...studentInfo, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">เลขประจำตัวนักศึกษา</label>
                    <input 
                      type="text" 
                      required
                      placeholder="เช่น 12345"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                      value={studentInfo.studentId}
                      onChange={e => setStudentInfo({...studentInfo, studentId: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ห้องเรียน</label>
                  <input 
                    type="text" 
                    required
                    placeholder="เช่น ม.6/1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                    value={studentInfo.classroom}
                    onChange={e => setStudentInfo({...studentInfo, classroom: e.target.value})}
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'ส่งข้อมูลการยืม'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {view === AppView.SUCCESS && (
          <div className="max-w-2xl mx-auto text-center animate-in zoom-in fade-in duration-500">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">บันทึกข้อมูลการยืมเรียบร้อย!</h2>
            <p className="text-gray-500 mb-10 text-lg">ขอให้สนุกกับการเล่นบอร์ดเกมนะ!</p>
            
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl mb-10 text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 01-18 0z" />
                </svg>
                ขั้นตอนการคืนบอร์ดเกม
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-50 text-indigo-600 font-bold rounded-full flex items-center justify-center">1</span>
                  <p className="text-gray-600 pt-1 text-lg">ไปที่หน้าเลือกบอร์ดเกม (หน้าหลักของระบบ)</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-50 text-indigo-600 font-bold rounded-full flex items-center justify-center">2</span>
                  <p className="text-gray-600 pt-1 text-lg">กดปุ่ม <span className="font-bold text-indigo-600">"คืนบอร์ดเกม"</span> ด้านบน และใส่เลขประจำตัวของนักศึกษาเพื่อยืนยัน</p>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setView(AppView.CATALOG)}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              กลับสู่หน้าหลัก
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 bg-gray-600 rounded-md flex items-center justify-center text-white font-bold text-xs">W</div>
            <span className="text-sm font-semibold uppercase tracking-widest text-gray-900">wanich system</span>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Wanich Board Game Club. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      {showBorrowModal && (
        <BorrowModal 
          selectedGames={selectedGames}
          onConfirm={handleConfirmSelection}
          onClose={() => setShowBorrowModal(false)}
        />
      )}

      {showReturnModal && (
        <ReturnModal 
          onClose={() => setShowReturnModal(false)}
          onSuccess={notify}
          onAddRecord={addRecord}
        />
      )}
    </div>
  );
};

export default App;
