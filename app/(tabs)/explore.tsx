// app/(tabs)/explore.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { dummyBooks } from '@/services/api';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  pdf_url: string;
  genre: string;
  rating: number;
  pages: number;
  progress?: number;
  reading_status?: string;
  is_favorite?: boolean;
  versions?: number;
}

export default function LibraryScreen() {
  const router = useRouter();
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [selectedTab, setSelectedTab] = useState('All');

  const tabs = ['All', 'Reading', 'Completed', 'Favorites'];

  useEffect(() => {
    // Load user books with reading progress
    const mockUserBooks = dummyBooks.map((book, index) => ({
      ...book,
      progress: index === 0 ? 75 : index === 1 ? 30 : index === 2 ? 100 : 0,
      reading_status: index === 0 ? 'reading' : index === 1 ? 'reading' : index === 2 ? 'completed' : 'not_started',
      is_favorite: index === 0 || index === 3,
      versions: Math.floor(Math.random() * 5) + 1,
    }));
    setUserBooks(mockUserBooks);
  }, []);

  const filteredBooks = userBooks.filter(book => {
    switch (selectedTab) {
      case 'Reading':
        return book.reading_status === 'reading';
      case 'Completed':
        return book.reading_status === 'completed';
      case 'Favorites':
        return book.is_favorite;
      default:
        return true;
    }
  });

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => router.push(`/book-details?bookId=${item.id}`)}
    >
      <Image
        source={{ uri: item.cover_url }}
        style={styles.bookCover}
        defaultSource={require('@/assets/images/placeholder-book.png')}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        <View style={styles.bookMeta}>
          <Text style={styles.bookRating}>⭐ {item.rating}</Text>
          {item.is_favorite && <Text style={styles.favoriteIcon}>❤️</Text>}
        </View>
        {item.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        )}
        <View style={styles.aiEnhanced}>
          <Text style={styles.aiText}>✨ {item.versions || 4} versions</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionIcon}>→</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Library</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Books List */}
      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        style={styles.booksList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  tabContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    height: 50, // Fixed height for tab container
  },
  tabScrollContent: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  tabButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    height: 36, // Fixed height for buttons
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  booksList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookRating: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
    marginRight: 8,
  },
  favoriteIcon: {
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    minWidth: 30,
  },
  aiEnhanced: {
    alignSelf: 'flex-start',
  },
  aiText: {
    fontSize: 12,
    color: '#8b5cf6',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
    color: '#6b7280',
  },
});