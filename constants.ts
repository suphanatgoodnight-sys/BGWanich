
import { BoardGame } from './types';

export const INITIAL_GAMES: BoardGame[] = [
  {
    id: 'BG-001',
    name: 'Catan (คาทาน)',
    image: 'https://picsum.photos/seed/catan/400/300',
    category: 'Strategy',
    available: true,
    description: 'เกมสร้างอาณานิคม ยอดนิยมระดับโลก'
  },
  {
    id: 'BG-002',
    name: 'Splendor (สเพลนเดอร์)',
    image: 'https://picsum.photos/seed/splendor/400/300',
    category: 'Card Game',
    available: true,
    description: 'การสะสมอัญมณีเพื่อสร้างอาณาจักร'
  },
  {
    id: 'BG-003',
    name: 'Dixit (ดิกซิท)',
    image: 'https://picsum.photos/seed/dixit/400/300',
    category: 'Party',
    available: true,
    description: 'เกมทายภาพจากจินตนาการและการเล่าเรื่อง'
  },
  {
    id: 'BG-004',
    name: 'Exploding Kittens',
    image: 'https://picsum.photos/seed/kittens/400/300',
    category: 'Party',
    available: true,
    description: 'เกมไพ่แมวระเบิดสุดฮาและตื่นเต้น'
  },
  {
    id: 'BG-005',
    name: 'Ticket to Ride',
    image: 'https://picsum.photos/seed/train/400/300',
    category: 'Strategy',
    available: true,
    description: 'สร้างเส้นทางรถไฟเชื่อมต่อเมืองต่างๆ'
  },
  {
    id: 'BG-006',
    name: 'Avalon',
    image: 'https://picsum.photos/seed/avalon/400/300',
    category: 'Social Deduction',
    available: true,
    description: 'เกมค้นหาผู้ทรยศในยุคอัศวินโต๊ะกลม'
  }
];

export const GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/YOUR_APPS_SCRIPT_ID/exec';
