// app/book-details.tsx - Dark Design
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { dummyBooks } from '@/services/api';

const colors = {
  background: '#0a0a0a',
  surface: '#1a1a1a',
  card: '#2a2a2a',
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  border: '#374151',
};

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
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <LinearGradient
          colors={[colors.background, '#1a1a2e', colors.background]}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.center}>
            <Ionicons name="book" size={64} color={colors.textMuted} />
            <Text style={styles.notFoundText}>Book not found</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const getGenreColor = (genre: string) => {
    switch (genre) {
      case 'Romance': return colors.danger;
      case 'Sci-Fi': return colors.primary;
      case 'Fantasy': return colors.secondary;
      case 'Mystery': return colors.warning;
      case 'Classics': return colors.success;
      default: return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.background, '#1a1a2e', colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>{book.title}</Text>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </Animated.View>

          {/* Book Cover and Info */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.bookSection}>
            <View style={styles.coverContainer}>
              <Image
                source={{ uri: book.cover_url }}
                style={styles.bookCover}
                defaultSource={require('@/assets/images/placeholder-book.png')}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.coverGradient}
              />
            </View>
            
            <View style={styles.aiEnhancedBadge}>
              <LinearGradient
                colors={[colors.secondary, colors.primary]}
                style={styles.badgeGradient}
              >
                <Ionicons name="sparkles" size={16} color="#fff" />
                <Text style={styles.aiEnhancedText}>A.I Enhanced</Text>
              </LinearGradient>
            </View>

            <View style={styles.bookMeta}>
              <View style={[styles.metaItem, { backgroundColor: `${colors.warning}20` }]}>
                <Ionicons name="star" size={18} color={colors.warning} />
                <Text style={[styles.metaText, { color: colors.warning }]}>{book.rating}</Text>
              </View>
              <View style={[styles.metaItem, { backgroundColor: `${getGenreColor(book.genre)}20` }]}>
                <Ionicons name="pricetag" size={18} color={getGenreColor(book.genre)} />
                <Text style={[styles.metaText, { color: getGenreColor(book.genre) }]}>{book.genre}</Text>
              </View>
              <View style={[styles.metaItem, { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons name="document-text" size={18} color={colors.primary} />
                <Text style={[styles.metaText, { color: colors.primary }]}>{book.pages}p</Text>
              </View>
            </View>
          </Animated.View>

          {/* Title and Author */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.titleSection}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.author}>by {book.author}</Text>
          </Animated.View>

          {/* Synopsis */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Synopsis</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.synopsis}>{book.description}</Text>
            </View>
          </Animated.View>

          {/* Version Selector */}
          <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="refresh-outline" size={20} color={colors.secondary} />
              <Text style={styles.sectionTitle}>Re-Write Versions</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.versionsContainer}>
              {versions.map((version, index) => (
                <TouchableOpacity
                  key={version}
                  style={[
                    styles.versionButton,
                    selectedVersion === version && styles.versionButtonActive,
                  ]}
                  onPress={() => setSelectedVersion(version)}
                >
                  {selectedVersion === version ? (
                    <LinearGradient
                      colors={[colors.secondary, colors.primary]}
                      style={styles.versionGradient}
                    >
                      <Ionicons name="checkmark-circle" size={16} color="#fff" />
                      <Text style={styles.versionTextActive}>{version}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.versionContent}>
                      <Ionicons name="ellipse-outline" size={16} color={colors.textMuted} />
                      <Text style={styles.versionText}>{version}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Reading Progress */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="analytics-outline" size={20} color={colors.success} />
              <Text style={styles.sectionTitle}>Reading Progress</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>0% Complete</Text>
                <Text style={styles.progressSubtext}>Start your reading journey</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '0%' }]} />
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInDown.delay(700)} style={styles.actionSection}>
            <TouchableOpacity
              style={styles.readButton}
              onPress={() => router.push(`/reader?bookId=${book.id}`)}
            >
              <LinearGradient
                colors={[colors.secondary, colors.primary]}
                style={styles.readButtonGradient}
              >
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.readButtonText}>Start Reading</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="download-outline" size={20} color={colors.primary} />
                <Text style={styles.secondaryButtonText}>Download</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="share-outline" size={20} color={colors.primary} />
                <Text style={styles.secondaryButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textMuted,
    marginTop: 16,
    fontWeight: '600',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Book Section
  bookSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  coverContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  bookCover: {
    width: 200,
    height: 300,
    borderRadius: 20,
  },
  coverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  aiEnhancedBadge: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  aiEnhancedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  bookMeta: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
    minWidth: 80,
    justifyContent: 'center',
  },
  metaText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Title Section
  titleSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 34,
  },
  author: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Section
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Synopsis
  synopsis: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Versions
  versionsContainer: {
    marginLeft: -24,
    paddingLeft: 24,
  },
  versionButton: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  versionButtonActive: {
    borderColor: colors.primary,
  },
  versionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  versionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    gap: 8,
  },
  versionText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  versionTextActive: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // Progress
  progressInfo: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },

  // Actions
  actionSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  readButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  readButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  readButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});