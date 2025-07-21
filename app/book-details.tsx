// app/book-details.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
}

export default function BookDetailsScreen() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams();
  const [book, setBook] = useState<Book | null>(null);
  const [selectedVersion, setSelectedVersion] = useState('Version 1');

  const versions = ['Version 1', 'Version 2', 'Version 3'];

  useEffect(() => {
    // Find book by ID
    const foundBook = dummyBooks.find(b => b.id === bookId);
    if (foundBook) {
      setBook(foundBook);
    }
  }, [bookId]);

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>Book not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{book.title}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Book Cover and Info */}
        <View style={styles.bookSection}>
          <Image
            source={{ uri: book.cover_url }}
            style={styles.bookCover}
            defaultSource={require('@/assets/images/placeholder-book.png')}
          />
          
          <View style={styles.aiEnhancedBadge}>
            <Text style={styles.aiEnhancedText}>✨ A.I Enhanced</Text>
          </View>

          <View style={styles.bookMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.rating}>⭐ {book.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.genre}>{book.genre}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.pages}>{book.pages} Pages</Text>
            </View>
          </View>
        </View>

        {/* Author */}
        <Text style={styles.author}>{book.author}</Text>

        {/* Synopsis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.synopsis}>{book.description}</Text>
        </View>

        {/* Version Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Re-Write</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {versions.map((version) => (
              <TouchableOpacity
                key={version}
                style={[
                  styles.versionButton,
                  selectedVersion === version && styles.versionButtonActive,
                ]}
                onPress={() => setSelectedVersion(version)}
              >
                <Text
                  style={[
                    styles.versionText,
                    selectedVersion === version && styles.versionTextActive,
                  ]}
                >
                  {version}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Read Button */}
        <TouchableOpacity
          style={styles.readButton}
          onPress={() => router.push(`/reader?bookId=${book.id}`)}
        >
          <Text style={styles.readButtonText}>Start Reading</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  placeholder: {
    width: 40,
  },
  bookSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  bookCover: {
    width: 200,
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  aiEnhancedBadge: {
    backgroundColor: '#ddd6fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  aiEnhancedText: {
    color: '#8b5cf6',
    fontSize: 12,
    fontWeight: '500',
  },
  bookMeta: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f59e0b',
  },
  genre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  pages: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  author: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  synopsis: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4b5563',
  },
  versionButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  versionButtonActive: {
    backgroundColor: '#4f46e5',
  },
  versionText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  versionTextActive: {
    color: '#fff',
  },
  readButton: {
    backgroundColor: '#8b5cf6',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  readButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});