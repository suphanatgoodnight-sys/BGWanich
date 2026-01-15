
export interface BoardGame {
  id: string;
  name: string;
  image: string;
  category: string;
  available: boolean;
  description: string;
}

export interface StudentInfo {
  fullName: string;
  studentId: string;
  classroom: string;
}

export interface User {
  email: string;
  fullName: string;
  studentId: string;
  classroom: string;
  picture?: string;
  isLoggedIn: boolean;
}

export interface BorrowRecord {
  id: string;
  timestamp: string;
  studentId: string;
  fullName: string;
  classroom: string;
  games: string;
  type: 'BORROW' | 'RETURN';
}

export enum AppView {
  CATALOG = 'CATALOG',
  AUTH = 'AUTH',
  BORROW_FORM = 'BORROW_FORM',
  SUCCESS = 'SUCCESS',
  HISTORY = 'HISTORY',
  MANAGE_GAMES = 'MANAGE_GAMES',
  ADMIN = 'ADMIN'
}
