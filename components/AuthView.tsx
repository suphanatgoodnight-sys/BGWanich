
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';

interface AuthViewProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

// Helper to decode JWT without external library
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, onBack }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [classroom, setClassroom] = useState('');
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if google is available (script loaded)
    const initGoogle = () => {
      // Fix: Accessing window.google through any cast to avoid TypeScript errors for the external script
      const google = (window as any).google;
      if (google) {
        google.accounts.id.initialize({
          // Replace with your real Google Client ID from Google Cloud Console
          client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });

        if (googleBtnRef.current) {
          google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            shape: "rectangular"
          });
        }
      }
    };

    const handleCredentialResponse = (response: any) => {
      const payload = parseJwt(response.credential);
      if (payload) {
        const user: User = {
          email: payload.email,
          fullName: payload.name,
          picture: payload.picture,
          studentId: '', // Google doesn't provide Student ID, will need to be filled in form
          classroom: '',
          isLoggedIn: true
        };
        onLogin(user);
      }
    };

    // Retry initialization if script isn't loaded yet
    const timer = setTimeout(initGoogle, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      email: email || 'user@example.com',
      fullName: fullName || 'ผู้ใช้ใหม่',
      studentId: studentId || '000000',
      classroom: classroom || 'N/A',
      isLoggedIn: true
    };
    onLogin(user);
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        ย้อนกลับ
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">{isRegistering ? 'ลงทะเบียนใหม่' : 'เข้าสู่ระบบ'}</h2>
          <p className="text-gray-500 text-sm mt-1">เข้าใช้งานระบบ wanich เพื่อดำเนินการยืม</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Real Google Login Button Container */}
          <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]">
            {/* Google's library will render the button here */}
            <div className="animate-pulse bg-gray-100 h-11 w-full rounded-lg"></div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium">หรือ</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-1">ชื่อ-นามสกุล</label>
                  <input 
                    type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="สมชาย ใจดี"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-1">เลขประจำตัว</label>
                    <input 
                      type="text" required value={studentId} onChange={e => setStudentId(e.target.value)}
                      placeholder="66xxxxxx"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-1">ห้องเรียน</label>
                    <input 
                      type="text" required value={classroom} onChange={e => setClassroom(e.target.value)}
                      placeholder="ม.6/1"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-1">อีเมล</label>
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-1">รหัสผ่าน</label>
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
            >
              {isRegistering ? 'สร้างบัญชี' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              {isRegistering ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? ลงทะเบียนที่นี่'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
