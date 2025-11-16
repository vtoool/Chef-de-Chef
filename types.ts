export interface Booking {
  id?: string;
  created_at?: string;
  event_date: string; // YYYY-MM-DD
  event_type: string;
  location: string;
  start_time?: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  notes_interne?: string | null;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  price?: number | null;
  prepayment?: number | null;
  payment_status?: 'neplatit' | 'avans platit' | 'platit integral' | null;
  currency?: 'MDL' | 'EUR' | 'USD' | null;
}

export interface ContactMessage {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface Testimonial {
  id: string;
  created_at: string;
  name: string;
  event_type: string;
  message: string;
  rating: number; // 1 to 5
}

export interface MediaAsset {
  id: string;
  created_at: string;
  type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
  description?: string;
}