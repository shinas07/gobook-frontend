// components/BookGrid.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  rating: number;
  pages: number;
}

interface BookGridProps {
  title: string;
  books: Book[];
  onBookPress: (book: Book) => void;
}

export default function BookGrid({ title, books, onBookPress }: BookGridProps) {
  const renderBookCard = (item: Book) => (
    <TouchableOpacity
      key={item.id}
      style={styles.bookCard}
      onPress={() => onBookPress(item)}
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
          <Text style={styles.bookPages}>{item.pages} pages</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Create rows of 2 books each
  const createRows = () => {
    const rows = [];
    for (let i = 0; i < books.length; i += 2) {
      const rowBooks = books.slice(i, i + 2);
      rows.push(
        <View key={i} style={styles.bookRow}>
          {rowBooks.map(book => renderBookCard(book))}
          {/* Add empty placeholder if odd number of books */}
          {rowBooks.length === 1 && <View style={styles.bookCard} />}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.booksContainer}>
        {createRows()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b5cf6', // Purple color to match "Your Shelf" text
    marginBottom: 16,
  },
  booksContainer: {
    flex: 1,
  },
  bookRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bookCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    width: '48%',
  },
  bookCover: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  bookMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookRating: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  bookPages: {
    fontSize: 12,
    color: '#9ca3af',
  },
});