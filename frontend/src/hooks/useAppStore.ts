import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface UserState {
  id?: string;
  name: string;
  username: string;
  avatar: string;
  email?: string;
  phone?: string;
  isAdmin: boolean;
  points?: number;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  isRead: boolean;
}

interface AppState {
  isLoggedIn: boolean;
  theme: 'dark' | 'light';
  lang: 'ID' | 'EN';
  selectedTransaction: any | null;
  collectedVouchers: any[];
  user: UserState;
  cart: CartItem[];
  pointPercentage: number;
  activeVoucherCode: string | null;
  notifications: Notification[];

  login: (userData?: Partial<UserState>) => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleLang: () => void;
  setSelectedTransaction: (tx: any | null) => void;
  setCollectedVouchers: (vouchers: any[]) => void;
  setActiveVoucher: (code: string | null) => void;
  addToCart: (product: { id: string; name: string; price: number }) => void;
  clearCart: () => void;
  updateUser: (data: Partial<UserState>) => void;
  setUser: (user: UserState) => void;
  setPoints: (points: number) => void;
  setPointPercentage: (percent: number) => void;
  setNotifications: (notifs: Notification[]) => void;
  markNotificationsAsRead: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  theme: 'light',
  lang: 'ID',
  selectedTransaction: null,
  collectedVouchers: [],
  user: {
    name: '',
    username: '',
    avatar: 'A',
    isAdmin: false,
  },
  cart: [],
  pointPercentage: 1,
  activeVoucherCode: null,
  notifications: [],

  login: (userData) =>
    set((state) => ({
      isLoggedIn: true,
      user: userData ? { ...state.user, ...userData } : state.user,
    })),

  logout: () => set({ isLoggedIn: false }),

  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  toggleLang: () =>
    set((state) => ({ lang: state.lang === 'ID' ? 'EN' : 'ID' })),

  setSelectedTransaction: (tx) => set({ selectedTransaction: tx }),

  setCollectedVouchers: (vouchers) => set({ collectedVouchers: vouchers }),

  setActiveVoucher: (code) => set({ activeVoucherCode: code }),

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, qty: 1 }] };
    }),

  clearCart: () => set({ cart: [], activeVoucherCode: null }),

  updateUser: (data) =>
    set((state) => ({ user: { ...state.user, ...data } })),

  setUser: (user) => set({ user }),

  setPoints: (points) =>
    set((state) => ({ user: { ...state.user, points } })),

  setPointPercentage: (percent) => set({ pointPercentage: percent }),

  setNotifications: (notifs) => set({ notifications: notifs }),

  markNotificationsAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),
}));
