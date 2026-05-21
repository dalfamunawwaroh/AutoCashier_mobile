import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  barcode?: string;
  image_url?: string;
  category?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>(`${API_URL}/products`);
      setProducts(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}
