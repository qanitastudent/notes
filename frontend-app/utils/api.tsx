// utils/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  user_id: number;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

class APIService {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private getAuthHeader(): HeadersInit {
    const headers: HeadersInit = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  // Auth
  async register(data: RegisterData) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Registration failed');
    }
    return res.json();
  }

  async login(data: LoginData): Promise<{ token: string }> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }
    const result = await res.json();
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', result.token);
    }
    return result;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  // Notes
  async getNotes(): Promise<Note[]> {
    const res = await fetch(`${API_URL}/notes`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  }

  async getNoteById(id: number): Promise<Note> {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Note not found');
    return res.json();
  }

  async createNote(data: { title: string; content: string; image_url?: string }): Promise<Note> {
    const res = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create note');
    }
    return res.json();
  }

  async updateNote(id: number, data: { title: string; content: string; image_url?: string }): Promise<Note> {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update note');
    }
    return res.json();
  }

  async deleteNote(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    if (!res.ok) {
      let message = 'Failed to delete note';
      try {
        const error = await res.json();
        message = error.error || message;
      } catch {
        // If backend doesn't send JSON
      }
      throw new Error(message);
    }
  }

  // Upload Image
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    return res.json();
  }

  async deleteImage(url: string): Promise<void> {
    const res = await fetch(`${API_URL}/upload/image?url=${encodeURIComponent(url)}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });

    if (!res.ok) {
      throw new Error('Failed to delete image');
    }
  }
}

export const api = new APIService();