export const PRODUCTS = [
  { id: '1', name: 'Ultra Milk Chocolate 250ml', price: 6500 },
  { id: '2', name: 'Indomie Goreng Original', price: 3500 },
  { id: '3', name: 'Aqua Mineral 600ml', price: 4000 },
  { id: '4', name: 'Silverqueen Almond 65g', price: 15500 },
];

export const VOUCHERS = [
  { code: 'GIATHEMAT', discount: 2000, desc: 'Potongan Rp 2.000' },
  { code: 'JAGOAI5K', discount: 5000, desc: 'Potongan Rp 5.000' },
];

export const TRANSACTION_HISTORY = [
  { id: 'TX001', date: '20 Apr 2026', total: 25500, points: 25, status: 'Success', items: [
    { name: 'Indomie Goreng', qty: 2, price: 3500 },
    { name: 'Ultra Milk', qty: 1, price: 6500 },
    { name: 'Silverqueen', qty: 1, price: 12000 },
  ], method: 'QRIS' },
  { id: 'TX002', date: '18 Apr 2026', total: 12000, points: 12, status: 'Success', items: [
    { name: 'Aqua Mineral', qty: 3, price: 4000 },
  ], method: 'QRIS' },
  { id: 'TX003', date: '15 Apr 2026', total: 45000, points: 45, status: 'Success', items: [
    { name: 'Items Mixed Pack', qty: 1, price: 45000 },
  ], method: 'Cash' },
];

export const POINTS_HISTORY = [
  { id: '1', type: 'earn', title: 'Belanja di Indomaret', date: '20 Apr 2026', points: 25 },
  { id: '2', type: 'earn', title: 'Belanja di Alfamart', date: '18 Apr 2026', points: 12 },
  { id: '3', type: 'redeem', title: 'Tukar Voucher GIATHEMAT', date: '12 Apr 2026', points: -100 },
  { id: '4', type: 'earn', title: 'Bonus Pendaftaran', date: '10 Apr 2026', points: 500 },
  { id: '5', type: 'earn', title: 'Promo Ramadhan', date: '08 Apr 2026', points: 200 },
];
