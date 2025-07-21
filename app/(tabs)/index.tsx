// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { dummyBooks } from '@/services/api';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import GenreFilter from '@/components/GenreFilter';
import ContinueReadingSection from '@/components/ContinueReadingSection';
import BookGrid from '@/components/BookGrid';

export default function HomeScreen() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [continueReading, setContinueReading] = useState([]);

  const genres = ['All', 'Romance', 'Sci-Fi', 'Fantasy', 'Classics'];

  useEffect(() => {
    // Load books (using dummy data for now)
    setBooks(dummyBooks);
    
    // Set continue reading (first book with some progress)
    setContinueReading([
      { ...dummyBooks[1], progress: 30 },
    ]);
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header />
        
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreSelect={setSelectedGenre}
        />

        {continueReading.length > 0 && (
          <ContinueReadingSection
            books={continueReading}
            onBookPress={(book) => router.push(`/reader?bookId=${book.id}`)}
          />
        )}

        <BookGrid
          title="Your Shelf"
          books={filteredBooks}
          onBookPress={(book) => router.push(`/book-details?bookId=${book.id}`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});