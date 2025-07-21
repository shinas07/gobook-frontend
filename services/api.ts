// services/api.ts
import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
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
}

export interface UserBook extends Book {
  progress?: number;
  current_page?: number;
  is_favorite?: boolean;
  reading_status?: 'not_started' | 'reading' | 'completed';
  started_at?: string;
  completed_at?: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error && data.session) {
      await AsyncStorage.setItem('authToken', data.session.access_token);
    }
    
    return { data, error };
  },

  signup: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    
    return { data, error };
  },

  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    const { error } = await supabase.auth.signOut();
    return { error };
  },
};

// Books API
export const booksAPI = {
  getAllBooks: async (): Promise<{ data: Book[] | null; error: any }> => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  getBooksByGenre: async (genre: string): Promise<{ data: Book[] | null; error: any }> => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('genre', genre)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  getBookById: async (id: string): Promise<{ data: Book | null; error: any }> => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },
};

// User Books API
export const userBooksAPI = {
  getUserBooks: async (userId: string): Promise<{ data: UserBook[] | null; error: any }> => {
    const { data, error } = await supabase
      .from('user_books')
      .select(`
        *,
        books (*)
      `)
      .eq('user_id', userId);
    
    return { data, error };
  },

  updateReadingProgress: async (
    userId: string, 
    bookId: string, 
    progress: number, 
    currentPage: number
  ) => {
    const readingStatus = progress > 0 
      ? (progress >= 100 ? 'completed' : 'reading') 
      : 'not_started';

    const { data, error } = await supabase
      .from('user_books')
      .upsert({
        user_id: userId,
        book_id: bookId,
        progress,
        current_page: currentPage,
        reading_status: readingStatus,
        started_at: progress > 0 ? new Date().toISOString() : null,
        completed_at: progress >= 100 ? new Date().toISOString() : null,
      });
    
    return { data, error };
  },
};

// Dummy data for testing
export const dummyBooks: Book[] = [
  {
    id: '1',
    title: 'One Dark Window',
    author: 'Rachel Gillig',
    description: 'Elspeth needs a monster. The monster might be her. Elspeth Spindle needs more than luck to stay safe in the eerie, mist-locked kingdom of Blunder—she needs a monster. She calls him the Nightmare, an ancient, mercurial spirit trapped in her head. He protects her. He keeps her secrets. But nothing comes for free, especially magic. When Elspeth meets a mysterious highwayman on the forest road, her life takes a drastic turn. Thrust into a world of shadow and deception, she joins a dangerous quest to cure Blunder from the dark magic infecting it. And the highwayman? He just happens to be the King\'s nephew, Captain of the most dangerous men in Blunder...and guilty of high treason.',
    cover_url: 'one_dark_window_cover.jpg',
    pdf_url: 'one_dark_window.pdf',
    genre: 'Fantasy',
    rating: 4.5,
    pages: 432,
  },
  {
    id: '2',
    title: 'A Day of Fallen Night',
    author: 'Samantha Shannon',
    description: 'The stunning prequel to the New York Times bestselling The Priory of the Orange Tree. A world divided. A queendom without an heir. An ancient enemy awakens. The House of Berethnet has ruled Inys for a thousand years. Still unwed, Queen Sabran the Ninth must conceive a daughter to protect her realm from destruction—but assassins are closing in on her, and her most trusted bodyguard is hiding a terrible secret.',
    cover_url: 'day_of_fallen_night_cover.jpg',
    pdf_url: 'day_of_fallen_night.pdf',
    genre: 'Fantasy',
    rating: 4.2,
    pages: 688,
  },
  {
    id: '3',
    title: 'Book of Night',
    author: 'Holly Black',
    description: 'Charlie Hall has never found a lock she couldn\'t pick, a book she couldn\'t steal, or a bad decision she wouldn\'t make. She\'s spent half her life working for gloamists, magicians who manipulate shadows to peer into locked rooms, strangle people in their beds, or worse. Gloamists guard their secrets greedily, creating an underground economy of grimoires. And to rob their fellow magicians, they need Charlie Hall.',
    cover_url: 'book_of_night_cover.jpg',
    pdf_url: 'book_of_night.pdf',
    genre: 'Fantasy',
    rating: 4.0,
    pages: 352,
  },
  {
    id: '4',
    title: 'The Wolf Den',
    author: 'Elodie Harper',
    description: 'Amara is a slave in Pompeii\'s infamous brothel. But she is also a woman of remarkable determination. Spirited and clever, she refuses to let her situation break her. Instead, she forms a sisterhood with her fellow women, the Wolves of the Wolf Den. But when Amara\'s path crosses with that of Felix, one of the town\'s most dangerous men, can she find a way to claim her freedom without losing herself?',
    cover_url: 'wolf_den_cover.jpg',
    pdf_url: 'wolf_den.pdf',
    genre: 'Historical Fiction',
    rating: 4.8,
    pages: 416,
  },
];