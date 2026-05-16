import { create } from 'zustand';

interface AppState {
  isLoggedIn: boolean;
  theme: 'dark' | 'light';
  lang: 'ID' | 'EN';
  selectedTransaction: any | null;
  collectedVoucherCodes: string[];
  user: {
    name: string;
    username: string;
    avatar: string;
    isAdmin: boolean;
  };
  cart: { id: string, name: string, price: number, qty: number }[];
  pointPercentage: number;
  activeVoucherCode: string | null;
  login: () => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleLang: () => void;
  setSelectedTransaction: (tx: any | null) => void;
  claimVoucher: (code: string) => void;
  setActiveVoucher: (code: string | null) => void;
  addToCart: (product: { id: string, name: string, price: number }) => void;
  clearCart: () => void;
  updateUser: (data: Partial<AppState['user']>) => void;
  setPointPercentage: (percent: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  theme: 'dark',
  lang: 'ID',
  selectedTransaction: null,
  collectedVoucherCodes: ['GIATHEMAT'],
  user: {
    name: 'Afa User',
    username: 'afa_jagoan',
    avatar: 'A',
    isAdmin: true, // Defaulting to true for demo purposes
  },
  cart: [],
  pointPercentage: 1, // Default 1%
  activeVoucherCode: null,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  toggleLang: () => set((state) => ({ lang: state.lang === 'ID' ? 'EN' : 'ID' })),
  setSelectedTransaction: (tx) => set({ selectedTransaction: tx }),
  claimVoucher: (code) => set((state) => ({
    collectedVoucherCodes: state.collectedVoucherCodes.includes(code)
      ? state.collectedVoucherCodes
      : [...state.collectedVoucherCodes, code]
  })),
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
  setPointPercentage: (percent) => set({ pointPercentage: percent }),
}));
