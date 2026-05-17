import { create } from 'zustand';

interface AppState {
  isLoggedIn: boolean;
  theme: 'dark' | 'light';
  lang: 'ID' | 'EN';
  selectedTransaction: any | null;
  collectedVouchers: any[];
  user: {
    id?: string;
    name: string;
    username: string;
    avatar: string;
    email?: string;
    phone?: string;
    isAdmin: boolean;
    points?: number;
  };
  cart: { id: string, name: string, price: number, qty: number }[];
  pointPercentage: number;
  activeVoucherCode: string | null;
  notifications: any[];
  login: (userData?: any) => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleLang: () => void;
  setSelectedTransaction: (tx: any | null) => void;
  setCollectedVouchers: (vouchers: any[]) => void;
  setActiveVoucher: (code: string | null) => void;
  addToCart: (product: { id: string, name: string, price: number }) => void;
  clearCart: () => void;
  updateUser: (data: Partial<AppState['user']>) => void;
  setUser: (user: any) => void;
  setPoints: (points: number) => void;
  setPointPercentage: (percent: number) => void;
  setNotifications: (notifs: any[]) => void;
  markNotificationsAsRead: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  theme: 'light',
  lang: 'ID',
  selectedTransaction: null,
  collectedVouchers: [],
  user: {
    name: 'Afa User',
    username: 'afa_jagoan',
    avatar: 'A',
    isAdmin: true, // Defaulting to true for demo purposes
  },
  cart: [],
  pointPercentage: 1, // Default 1%
  activeVoucherCode: null,
  notifications: [],
  login: (userData) => set((state) => ({ 
    isLoggedIn: true, 
    user: userData ? { ...state.user, ...userData } : state.user 
  })),
  logout: () => set({ isLoggedIn: false }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  toggleLang: () => set((state) => ({ lang: state.lang === 'ID' ? 'EN' : 'ID' })),
  setSelectedTransaction: (tx) => set({ selectedTransaction: tx }),
  setCollectedVouchers: (vouchers) => set({ collectedVouchers: vouchers }),
  setActiveVoucher: (code) => set({ activeVoucherCode: code }),
  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return { cart: state.cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) };
    }
    return { cart: [...state.cart, { ...product, qty: 1 }] };
  }),
  clearCart: () => set({ cart: [], activeVoucherCode: null }),
  updateUser: (data) => set((state) => ({
    user: { ...state.user, ...data }
  })),
  setUser: (user) => set({ user }),
  setPoints: (points) => set((state) => ({ user: { ...state.user, points } })),
  setPointPercentage: (percent) => set({ pointPercentage: percent }),
  setNotifications: (notifs) => set({ notifications: notifs }),
  markNotificationsAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true }))
  })),
}));
