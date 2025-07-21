// components/ContinueReadingSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  progress?: number;
}

interface ContinueReadingSectionProps {
  books: Book[];
  onBookPress: (book: Book) => void;
}

export default function ContinueReadingSection({ books, onBookPress }: ContinueReadingSectionProps) {
  const renderContinueReading = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.continueCard}
      onPress={() => onBookPress(item)}
    >
      <Image
        source={{ uri: item.cover_url }}
        style={styles.continueCover}
        defaultSource={require('@/assets/images/placeholder-book.png')}
      />
      <View style={styles.continueInfo}>
        <Text style={styles.continueTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.continueAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress || 0}%` }]} />
          </View>
          <Text style={styles.progressText}>{item.progress || 0}%</Text>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.readButton}>
          <Text style={styles.readButtonText}>Read</Text>
        </TouchableOpacity>
        <View style={styles.aiEnhanced}>
          <Text style={styles.aiText}>✨ A.I Enhanced</Text>
        </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Continue Reading..</Text>
      <FlatList
        data={books}
        renderItem={renderContinueReading}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.continueList}
      />
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
    color: '#8b5cf6', // Purple color to match "Continue Reading.." text
    marginBottom: 16,
  },
  continueList: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  continueCard: {
    backgroundColor: '#ddd6fe',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    width: 300,
    flexDirection: 'row',
  },
  continueCover: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  continueInfo: {
    flex: 1,
    marginLeft: 16,
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'space-between',
    
  },
  continueAuthor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  },
  readButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  readButtonText: {
    color: '#8b5cf6',
    fontWeight: '500',
  },
  aiEnhanced: {
    flex: 1,
    alignContent: 'flex-end',
    
  },
  aiText: {
    fontSize: 12,
    color: '#8b5cf6',
  },
});