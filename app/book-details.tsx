// app/book-details.tsx - Professional Book Details Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { dummyBooks } from '@/services/api';

// Same Design System as other pages
const AppTheme = {
  colors: {
    background: '#1B1B1F',
    surface: '#2A2A2E',
    surfaceLight: '#35353A',
    
    primary: '#007AFF',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    
    textPrimary: '#FFFFFF',
    textSecondary: '#AEAEB2',
    textTertiary: '#8E8E93',
    
    border: '#38383A',
    borderLight: '#48484A',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  
  typography: {
    largeTitle: { fontSize: 34, fontWeight: '700' },
    title: { fontSize: 28, fontWeight: '600' },
    headline: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 17, fontWeight: '400' },
    callout: { fontSize: 16, fontWeight: '400' },
    subhead: { fontSize: 15, fontWeight: '400' },
    footnote: { fontSize: 13, fontWeight: '400' },
    caption: { fontSize: 12, fontWeight: '400' },
  },
};

const { width } = Dimensions.get('window');

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [readingProgress] = useState(0); // Would come from API

  const versions = [
    { id: 'v1', name: 'Original', description: 'Classic version' },
    { id: 'v2', name: 'Simplified', description: 'Easy reading' },
    { id: 'v3', name: 'Enhanced', description: 'AI improved' },
  ];

  useEffect(() => {
    // Find book by ID
    const foundBook = dummyBooks.find(b => b.id === bookId);
    if (foundBook) {
      setBook(foundBook);
    }
  }, [bookId]);

  const handleStartReading = () => {
    router.push(`/reader?bookId=${book?.id}&version=${selectedVersion}`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // API call would go here
  };

  if (!book) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[AppTheme.colors.background, AppTheme.colors.surface, AppTheme.colors.background]}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <View style={styles.errorContainer}>
              <Ionicons name="book-outline" size={64} color={AppTheme.colors.textTertiary} />
              <Text style={styles.errorTitle}>Book Not Found</Text>
              <Text style={styles.errorDescription}>
                The book you're looking for doesn't exist or has been removed.
              </Text>
              <TouchableOpacity 
                style={styles.backToLibraryButton}
                onPress={() => router.push('/explore')}
              >
                <Text style={styles.backToLibraryText}>Back to Library</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[AppTheme.colors.background, AppTheme.colors.surface, AppTheme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={AppTheme.colors.textPrimary} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle} numberOfLines={1}>
              {book.title}
            </Text>
            
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={toggleFavorite}
              >
                <Ionicons 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={20} 
                  color={isFavorite ? AppTheme.colors.danger : AppTheme.colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.bookCoverContainer}>
              <Image
                source={{ uri: book.cover_url }}
                style={styles.bookCover}
                defaultSource={require('@/assets/images/placeholder-book.png')}
              />
              
              {/* AI Badge */}
              <View style={styles.aiBadge}>
                <LinearGradient
                  colors={[AppTheme.colors.warning, '#FF6B35']}
                  style={styles.aiBadgeGradient}
                >
                  <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                  <Text style={styles.aiBadgeText}>AI Enhanced</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Book Info */}
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>by {book.author}</Text>
              
              {/* Meta Information */}
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <View style={styles.metaIcon}>
                    <Ionicons name="star" size={16} color={AppTheme.colors.warning} />
                  </View>
                  <Text style={styles.metaText}>{book.rating}</Text>
                </View>
                
                <View style={styles.metaItem}>
                  <View style={styles.metaIcon}>
                    <Ionicons name="library-outline" size={16} color={AppTheme.colors.success} />
                  </View>
                  <Text style={styles.metaText}>{book.genre}</Text>
                </View>
                
                <View style={styles.metaItem}>
                  <View style={styles.metaIcon}>
                    <Ionicons name="document-text-outline" size={16} color={AppTheme.colors.primary} />
                  </View>
                  <Text style={styles.metaText}>{book.pages} pages</Text>
                </View>
              </View>

              {/* Reading Progress */}
              {readingProgress > 0 && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Your Progress</Text>
                    <Text style={styles.progressPercentage}>{readingProgress}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={[AppTheme.colors.primary, '#4F46E5']}
                      style={[styles.progressFill, { width: `${readingProgress}%` }]}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Synopsis Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <View style={styles.synopsisContainer}>
              <Text style={styles.synopsisText}>{book.description}</Text>
            </View>
          </View>

          {/* AI Versions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Versions</Text>
              <View style={styles.versionsBadge}>
                <Text style={styles.versionsBadgeText}>{versions.length} versions</Text>
              </View>
            </View>
            
            <Text style={styles.sectionSubtitle}>
              Choose how you want to experience this book
            </Text>
            
            <View style={styles.versionsContainer}>
              {versions.map((version, index) => (
                <TouchableOpacity
                  key={version.id}
                  style={[
                    styles.versionCard,
                    selectedVersion === version.name && styles.versionCardActive,
                  ]}
                  onPress={() => setSelectedVersion(version.name)}
                >
                  <View style={styles.versionContent}>
                    <View style={styles.versionHeader}>
                      <Text style={[
                        styles.versionName,
                        selectedVersion === version.name && styles.versionNameActive,
                      ]}>
                        {version.name}
                      </Text>
                      {selectedVersion === version.name && (
                        <Ionicons name="checkmark-circle" size={20} color={AppTheme.colors.primary} />
                      )}
                    </View>
                    <Text style={[
                      styles.versionDescription,
                      selectedVersion === version.name && styles.versionDescriptionActive,
                    ]}>
                      {version.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reading Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reading Information</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="time-outline" size={24} color={AppTheme.colors.primary} />
                <Text style={styles.statValue}>~8h 30m</Text>
                <Text style={styles.statLabel}>Estimated Time</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="trending-up-outline" size={24} color={AppTheme.colors.success} />
                <Text style={styles.statValue}>Intermediate</Text>
                <Text style={styles.statLabel}>Reading Level</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="language-outline" size={24} color={AppTheme.colors.warning} />
                <Text style={styles.statValue}>English</Text>
                <Text style={styles.statLabel}>Language</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStartReading}
            >
              <LinearGradient
                colors={[AppTheme.colors.primary, '#4F46E5']}
                style={styles.primaryButtonGradient}
              >
                <Ionicons name="play" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>
                  {readingProgress > 0 ? 'Continue Reading' : 'Start Reading'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.secondaryActions}>
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="download-outline" size={20} color={AppTheme.colors.textSecondary} />
                <Text style={styles.secondaryButtonText}>Download</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="share-outline" size={20} color={AppTheme.colors.textSecondary} />
                <Text style={styles.secondaryButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  safeArea: {
    flex: 1,
  },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Error State
  errorContainer: {
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.xl,
  },
  
  errorTitle: {
    ...AppTheme.typography.title,
    color: AppTheme.colors.textPrimary,
    marginTop: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.sm,
  },
  
  errorDescription: {
    ...AppTheme.typography.body,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: AppTheme.spacing.xl,
  },
  
  backToLibraryButton: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: AppTheme.borderRadius.md,
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
  },
  
  backToLibraryText: {
    ...AppTheme.typography.callout,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    paddingTop: AppTheme.spacing.md,
    paddingBottom: AppTheme.spacing.lg,
  },
  
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headerTitle: {
    ...AppTheme.typography.headline,
    color: AppTheme.colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: AppTheme.spacing.md,
  },
  
  headerActions: {
    flexDirection: 'row',
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.xl,
    alignItems: 'center',
  },
  
  bookCoverContainer: {
    position: 'relative',
    marginBottom: AppTheme.spacing.lg,
  },
  
  bookCover: {
    width: 200,
    height: 300,
    borderRadius: AppTheme.borderRadius.lg,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  
  aiBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  
  aiBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
  },
  
  aiBadgeText: {
    ...AppTheme.typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  
  bookInfo: {
    alignItems: 'center',
    width: '100%',
  },
  
  bookTitle: {
    ...AppTheme.typography.largeTitle,
    color: AppTheme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  
  bookAuthor: {
    ...AppTheme.typography.title,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.lg,
  },

  // Meta Information
  metaContainer: {
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: AppTheme.spacing.lg,
  },
  
  metaItem: {
    alignItems: 'center',
  },
  
  metaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppTheme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  
  metaText: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '500',
  },

  // Progress
  progressContainer: {
    width: '100%',
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
  },
  
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  
  progressLabel: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textSecondary,
    fontWeight: '500',
  },
  
  progressPercentage: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.primary,
    fontWeight: '600',
  },
  
  progressBar: {
    height: 6,
    backgroundColor: AppTheme.colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Section
  section: {
    paddingHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.xl,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  
  sectionTitle: {
    ...AppTheme.typography.headline,
    color: AppTheme.colors.textPrimary,
  },
  
  sectionSubtitle: {
    ...AppTheme.typography.subhead,
    color: AppTheme.colors.textSecondary,
    marginBottom: AppTheme.spacing.lg,
  },
  
  versionsBadge: {
    backgroundColor: AppTheme.colors.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 4,
  },
  
  versionsBadgeText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textSecondary,
    fontWeight: '500',
  },

  // Synopsis
  synopsisContainer: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
  },
  
  synopsisText: {
    ...AppTheme.typography.body,
    color: AppTheme.colors.textSecondary,
    lineHeight: 24,
  },

  // Versions
  versionsContainer: {
    gap: AppTheme.spacing.sm,
  },
  
  versionCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  versionCardActive: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.surfaceLight,
  },
  
  versionContent: {
    padding: AppTheme.spacing.lg,
  },
  
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  
  versionName: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
  },
  
  versionNameActive: {
    color: AppTheme.colors.primary,
  },
  
  versionDescription: {
    ...AppTheme.typography.subhead,
    color: AppTheme.colors.textSecondary,
  },
  
  versionDescriptionActive: {
    color: AppTheme.colors.textPrimary,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  statCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    flex: 1,
    marginHorizontal: AppTheme.spacing.xs,
    alignItems: 'center',
  },
  
  statValue: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
    marginVertical: AppTheme.spacing.sm,
  },
  
  statLabel: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
  },

  // Actions
  actionsContainer: {
    paddingHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.lg,
  },
  
  primaryButton: {
    borderRadius: AppTheme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: AppTheme.spacing.lg,
    shadowColor: AppTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme.spacing.lg,
  },
  
  primaryButtonText: {
    ...AppTheme.typography.headline,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: AppTheme.spacing.sm,
  },
  
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  secondaryButton: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    paddingVertical: AppTheme.spacing.md,
    flex: 1,
    marginHorizontal: AppTheme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  secondaryButtonText: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textSecondary,
    fontWeight: '500',
    marginLeft: AppTheme.spacing.sm,
  },
  
  bottomSpacing: {
    height: 100,
  },
});