// services/api.ts - Professional API Service
import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enhanced Types with better structure
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  pdf_url: string;
  genre: string;
  rating: number;
  pages: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserBook extends Book {
  progress?: number;
  current_page?: number;
  is_favorite?: boolean;
  reading_status?: 'not_started' | 'reading' | 'completed';
  started_at?: string;
  completed_at?: string;
  last_read_at?: string;
  reading_time_minutes?: number;
  notes?: string;
  bookmarks?: number[];
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  reading_streak: number;
  total_books_read: number;
  total_reading_time: number;
  weekly_goal: number;
}

export interface ReadingStats {
  books_read: number;
  reading_streak: number;
  total_time: string;
  weekly_progress: number;
  weekly_goal: number;
  favorite_genre: string;
  average_rating: number;
}

// API Response wrapper for consistent error handling
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading?: boolean;
}

// Enhanced error handling utility
const handleApiError = (error: any): string => {
  if (!error) return null;
  
  // Handle common Supabase errors
  if (error.code === 'PGRST301') return 'Resource not found';
  if (error.code === '23505') return 'This item already exists';
  if (error.message?.includes('JWT expired')) return 'Session expired, please login again';
  if (error.message?.includes('Row Level Security')) return 'Access denied';
  
  // Return user-friendly error message
  return error.message || 'An unexpected error occurred';
};

// Authentication API with enhanced features
export const authAPI = {
  // Login with better error handling
  login: async (email: string, password: string): Promise<ApiResponse<any>> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });
      
      if (error) {
        return { data: null, error: handleApiError(error) };
      }
      
      if (data.session) {
        await AsyncStorage.setItem('authToken', data.session.access_token);
        await AsyncStorage.setItem('userId', data.user.id);
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  // Signup with profile creation
  signup: async (email: string, password: string, fullName: string): Promise<ApiResponse<any>> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          }
        }
      });
      
      if (error) {
        return { data: null, error: handleApiError(error) };
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  // Logout with cleanup
  logout: async (): Promise<ApiResponse<boolean>> => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userId']);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { data: false, error: handleApiError(error) };
      }
      
      return { data: true, error: null };
    } catch (error) {
      return { data: false, error: handleApiError(error) };
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { data: null, error: 'Not authenticated' };
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return { data: null, error: handleApiError(profileError) };
      }

      return { data: profile, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  // Check authentication status
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return false;

      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch {
      return false;
    }
  }
};

// Enhanced Books API
export const booksAPI = {
  // Get all books with pagination and filters
  getAllBooks: async (
    page: number = 1, 
    limit: number = 20,
    genre?: string,
    search?: string
  ): Promise<ApiResponse<{ books: Book[]; total: number }>> => {
    try {
      let query = supabase
        .from('books')
        .select('*, total:books(count)', { count: 'exact' })
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false });

      if (genre && genre !== 'All') {
        query = query.eq('genre', genre);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
      }

      const { data, error, count } = await query;
      
      if (error) {
        return { data: null, error: handleApiError(error) };
      }
      
      return { 
        data: { 
          books: data || [], 
          total: count || 0 
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  // Get book by ID with user data
  getBookById: async (id: string, userId?: string): Promise<ApiResponse<UserBook>> => {
    try {
      const { data: book, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
      
      if (bookError) {
        return { data: null, error: handleApiError(bookError) };
      }

      // If user is logged in, get user-specific data
      if (userId) {
        const { data: userBookData } = await supabase
          .from('user_books')
          .select('*')
          .eq('user_id', userId)
          .eq('book_id', id)
          .single();

        return { 
          data: { 
            ...book, 
            ...userBookData 
          }, 
          error: null 
        };
      }

      return { data: book, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  // Get popular books
  getPopularBooks: async (limit: number = 10): Promise<ApiResponse<Book[]>> => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('rating', { ascending: false })
        .limit(limit);
      
      if (error) {
        return { data: null, error: handleApiError(error) };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  // Get recommended books based on user reading history
  getRecommendedBooks: async (userId: string, limit: number = 5): Promise<ApiResponse<Book[]>> => {
    try {
      // Simple recommendation: books in favorite genres
      const { data: userBooks } = await supabase
        .from('user_books')
        .select('books(genre)')
        .eq('user_id', userId)
        .eq('reading_status', 'completed');

      const favoriteGenres = [...new Set(
        userBooks?.map(ub => ub.books?.genre).filter(Boolean) || []
      )];

      if (favoriteGenres.length === 0) {
        // Fallback to popular books
        return this.getPopularBooks(limit);
      }

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .in('genre', favoriteGenres)
        .order('rating', { ascending: false })
        .limit(limit);
      
      if (error) {
        return { data: null, error: handleApiError(error) };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  }
};

// Enhanced User Books API
export const userBooksAPI = {
  // Get user's library with filtering
  getUserBooks: async (
    userId: string, 
    status?: string
  ): Promise<ApiResponse<UserBook[]>> => {
    try {
      let query = supabase
        .from('user_books')
        .select(`
          *,
          books (*)
        `)
        .eq('user_id', userId)
        .order('last_read_at', { ascending: false, nullsLast: true });

      if (status && status !== 'All') {
        if (status === 'Reading') {
          query = query.eq('reading_status', 'reading');
        } else if (status === 'Completed') {
          query = query.eq('reading_status', 'completed');
        } else if (status === 'Favorites') {
          query = query.eq('is_favorite', true);
        }
      }

      const { data, error } = await query;
      
      if (error) {
        return { data: null, error: handleApiError(error) };
      }
      
      // Flatten the data structure
      const userBooks = data?.map(item => ({
        ...item.books,
        ...item
      })) || [];
      
      return { data: userBooks, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  // Update reading progress with enhanced tracking
  updateReadingProgress: async (
    userId: string, 
    bookId: string, 
    progress: number, 
    currentPage: number,
    readingTimeMinutes?: number
  ): Promise<ApiResponse<boolean>> => {
    try {
      const readingStatus = progress > 0 
        ? (progress >= 100 ? 'completed' : 'reading') 
        : 'not_started';

      const updateData: any = {
        user_id: userId,
        book_id: bookId,
        progress,
        current_page: currentPage,
        reading_status: readingStatus,
        last_read_at: new Date().toISOString(),
      };

      if (progress > 0 && readingStatus === 'reading') {
        updateData.started_at = new Date().toISOString();
      }

      if (progress >= 100) {
        updateData.completed_at = new Date().toISOString();
      }

      if (readingTimeMinutes) {
        updateData.reading_time_minutes = readingTimeMinutes;
      }

      const { error } = await supabase
        .from('user_books')
        .upsert(updateData);
      
      if (error) {
        return { data: false, error: handleApiError(error) };
      }
      
      return { data: true, error: null };
    } catch (error) {
      return { data: false, error: handleApiError(error) };
    }
  },

  // Toggle favorite status
  toggleFavorite: async (
    userId: string, 
    bookId: string, 
    isFavorite: boolean
  ): Promise<ApiResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('user_books')
        .upsert({
          user_id: userId,
          book_id: bookId,
          is_favorite: isFavorite,
        });
      
      if (error) {
        return { data: false, error: handleApiError(error) };
      }
      
      return { data: true, error: null };
    } catch (error) {
      return { data: false, error: handleApiError(error) };
    }
  },

  // Get reading statistics
  getReadingStats: async (userId: string): Promise<ApiResponse<ReadingStats>> => {
    try {
      const { data, error } = await supabase
        .from('user_books')
        .select(`
          reading_status,
          progress,
          reading_time_minutes,
          books (genre, rating)
        `)
        .eq('user_id', userId);
      
      if (error) {
        return { data: null, error: handleApiError(error) };
      }

      // Calculate statistics
      const completedBooks = data?.filter(book => book.reading_status === 'completed') || [];
      const currentlyReading = data?.filter(book => book.reading_status === 'reading') || [];
      
      const totalTime = data?.reduce((sum, book) => sum + (book.reading_time_minutes || 0), 0) || 0;
      const genres = data?.map(book => book.books?.genre).filter(Boolean) || [];
      const favoriteGenre = genres.reduce((a, b, i, arr) => 
        arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b, genres[0]
      ) || 'Fantasy';

      const stats: ReadingStats = {
        books_read: completedBooks.length,
        reading_streak: 7, // Would need more complex calculation
        total_time: `${Math.floor(totalTime / 60)}h ${totalTime % 60}m`,
        weekly_progress: currentlyReading.length,
        weekly_goal: 5, // From user profile
        favorite_genre: favoriteGenre,
        average_rating: 4.2 // Would calculate from user ratings
      };
      
      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  }
};

// Enhanced dummy data with more realistic structure
export const dummyBooks: Book[] = [
  {
    id: '1',
    title: 'One Dark Window',
    author: 'Rachel Gillig',
    description: 'Elspeth needs a monster. The monster might be her. Elspeth Spindle needs more than luck to stay safe in the eerie, mist-locked kingdom of Blunder—she needs a monster. She calls him the Nightmare, an ancient, mercurial spirit trapped in her head. He protects her. He keeps her secrets. But nothing comes for free, especially magic.',
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
    pdf_url: 'one_dark_window.pdf',
    genre: 'Fantasy',
    rating: 4.5,
    pages: 432,
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'A Day of Fallen Night',
    author: 'Samantha Shannon',
    description: 'The stunning prequel to the New York Times bestselling The Priory of the Orange Tree. A world divided. A queendom without an heir. An ancient enemy awakens. The House of Berethnet has ruled Inys for a thousand years.',
    cover_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    pdf_url: 'day_of_fallen_night.pdf',
    genre: 'Fantasy',
    rating: 4.2,
    pages: 688,
    created_at: '2024-01-14T00:00:00Z'
  },
  {
    id: '3',
    title: 'Book of Night',
    author: 'Holly Black',
    description: 'Charlie Hall has never found a lock she couldn\'t pick, a book she couldn\'t steal, or a bad decision she wouldn\'t make. She\'s spent half her life working for gloamists, magicians who manipulate shadows to peer into locked rooms, strangle people in their beds, or worse.',
    cover_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    pdf_url: 'book_of_night.pdf',
    genre: 'Fantasy',
    rating: 4.0,
    pages: 352,
    created_at: '2024-01-13T00:00:00Z'
  },
  {
    id: '4',
    title: 'The Wolf Den',
    author: 'Elodie Harper',
    description: 'Amara is a slave in Pompeii\'s infamous brothel. But she is also a woman of remarkable determination. Spirited and clever, she refuses to let her situation break her. Instead, she forms a sisterhood with her fellow women, the Wolves of the Wolf Den.',
    cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
    pdf_url: 'wolf_den.pdf',
    genre: 'Historical Fiction',
    rating: 4.8,
    pages: 416,
    created_at: '2024-01-12T00:00:00Z'
  },
  {
    id: '5',
    title: 'The Seven Moons of Maali Almeida',
    author: 'Shehan Karunatilaka',
    description: 'In 1990, photographer Maali Almeida wakes up dead in what seems like a celestial visa office. His dismembered body is sinking in the serene Beira lake and he has no idea who killed him.',
    cover_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
    pdf_url: 'seven_moons.pdf',
    genre: 'Literary Fiction',
    rating: 4.3,
    pages: 384,
    created_at: '2024-01-11T00:00:00Z'
  },
  {
    id: '6',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    description: 'In this exuberant novel, two friends—often in love, but never lovers—come together as creative partners in the world of video game design, where success brings them fame, joy, tragedy, duplicity, and, ultimately, a kind of immortality.',
    cover_url: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=300&h=400&fit=crop',
    pdf_url: 'tomorrow.pdf',
    genre: 'Contemporary Fiction',
    rating: 4.6,
    pages: 416,
    created_at: '2024-01-10T00:00:00Z'
  }
];

// Utility functions for the UI
export const apiUtils = {
  // Format reading time
  formatReadingTime: (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  },

  // Calculate estimated reading time based on pages
  estimateReadingTime: (pages: number, wordsPerPage: number = 250, wordsPerMinute: number = 200): number => {
    return Math.ceil((pages * wordsPerPage) / wordsPerMinute);
  },

  // Get reading status color (for your theme)
  getStatusColor: (status: string) => {
    const AppTheme = {
      colors: {
        primary: '#007AFF',
        success: '#34C759',
        warning: '#FF9500',
        textTertiary: '#8E8E93',
      }
    };
    
    switch (status) {
      case 'reading': return AppTheme.colors.primary;
      case 'completed': return AppTheme.colors.success;
      case 'not_started': return AppTheme.colors.textTertiary;
      default: return AppTheme.colors.textTertiary;
    }
  }
};