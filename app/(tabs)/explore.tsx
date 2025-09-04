// app/(tabs)/explore.tsx - Professional Clean Design
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
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function ExploreScreen() {
  const router = useRouter();
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const tabs = [
    { id: 'All', label: 'All Books', count: 0 },
    { id: 'Reading', label: 'Currently Reading', count: 0 },
    { id: 'Completed', label: 'Completed', count: 0 },
    { id: 'Favorites', label: 'Favorites', count: 0 },
  ];

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
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = (() => {
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
    })();

    return matchesSearch && matchesTab;
  });

  // Update tab counts
  const tabsWithCounts = tabs.map(tab => ({
    ...tab,
    count: tab.id === 'All' ? userBooks.length :
           tab.id === 'Reading' ? userBooks.filter(b => b.reading_status === 'reading').length :
           tab.id === 'Completed' ? userBooks.filter(b => b.reading_status === 'completed').length :
           tab.id === 'Favorites' ? userBooks.filter(b => b.is_favorite).length : 0
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reading': return AppTheme.colors.primary;
      case 'completed': return AppTheme.colors.success;
      default: return AppTheme.colors.textTertiary;
    }
  };

  const getStatusText = (status: string, progress: number) => {
    switch (status) {
      case 'reading': return `${progress}% complete`;
      case 'completed': return 'Completed';
      default: return 'Not started';
    }
  };

  const renderBookItem = ({ item, index }: { item: Book; index: number }) => (
    <TouchableOpacity
      style={[styles.bookItem, viewMode === 'grid' && styles.bookItemGrid]}
      onPress={() => router.push(`/book-details?bookId=${item.id}`)}
    >
      {/* Book Cover */}
      <View style={[styles.bookCoverContainer, viewMode === 'grid' && styles.bookCoverContainerGrid]}>
        <Image
          source={{ uri: item.cover_url }}
          style={[styles.bookCover, viewMode === 'grid' && styles.bookCoverGrid]}
          defaultSource={require('@/assets/images/placeholder-book.png')}
        />
        {item.is_favorite && (
          <View style={styles.favoriteBadge}>
            <Ionicons name="heart" size={12} color={AppTheme.colors.danger} />
          </View>
        )}
      </View>

      {/* Book Info */}
      <View style={[styles.bookInfo, viewMode === 'grid' && styles.bookInfoGrid]}>
        <Text style={[styles.bookTitle, viewMode === 'grid' && styles.bookTitleGrid]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.bookAuthor, viewMode === 'grid' && styles.bookAuthorGrid]} numberOfLines={1}>
          by {item.author}
        </Text>

        {viewMode === 'list' && (
          <View style={styles.bookMeta}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={AppTheme.colors.warning} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <Text style={styles.pagesText}>{item.pages} pages</Text>
            <Text style={styles.genreText}>{item.genre}</Text>
          </View>
        )}

        {/* Progress Bar */}
        {item.progress > 0 && (
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { 
                width: `${item.progress}%`,
                backgroundColor: getStatusColor(item.reading_status || '')
              }]} />
            </View>
            <Text style={[styles.progressText, { color: getStatusColor(item.reading_status || '') }]}>
              {getStatusText(item.reading_status || '', item.progress)}
            </Text>
          </View>
        )}

        {/* AI Versions Badge */}
        {viewMode === 'list' && (
          <View style={styles.aiVersionsBadge}>
            <Ionicons name="sparkles" size={12} color={AppTheme.colors.primary} />
            <Text style={styles.aiVersionsText}>{item.versions} AI versions</Text>
          </View>
        )}
      </View>

      {/* Action Button */}
      {viewMode === 'list' && (
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chevron-forward" size={20} color={AppTheme.colors.textTertiary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[AppTheme.colors.background, AppTheme.colors.surface, AppTheme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Your Library</Text>
              <Text style={styles.headerSubtitle}>{userBooks.length} books in your collection</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.viewModeButton}
                onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              >
                <Ionicons 
                  name={viewMode === 'list' ? 'grid-outline' : 'list-outline'} 
                  size={20} 
                  color={AppTheme.colors.primary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={AppTheme.colors.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search books, authors..."
                placeholderTextColor={AppTheme.colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={AppTheme.colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            {tabsWithCounts.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  selectedTab === tab.id && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedTab(tab.id)}
              >
                <Text style={[
                  styles.tabText,
                  selectedTab === tab.id && styles.tabTextActive,
                ]}>
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <View style={[
                    styles.tabBadge,
                    selectedTab === tab.id && styles.tabBadgeActive,
                  ]}>
                    <Text style={[
                      styles.tabBadgeText,
                      selectedTab === tab.id && styles.tabBadgeTextActive,
                    ]}>
                      {tab.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Books List/Grid */}
        {filteredBooks.length > 0 ? (
          <FlatList
            data={filteredBooks}
            renderItem={renderBookItem}
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={viewMode} // Force re-render when view mode changes
            contentContainerStyle={styles.booksContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="library-outline" size={64} color={AppTheme.colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No books found' : 'No books yet'}
            </Text>
            <Text style={styles.emptyDescription}>
              {searchQuery 
                ? `No books match "${searchQuery}"`
                : 'Start building your library by uploading books'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity style={styles.emptyAction}>
                <Text style={styles.emptyActionText}>Upload Books</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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

  // Header
  header: {
    paddingHorizontal: AppTheme.spacing.lg,
    paddingTop: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.md,
  },
  
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: AppTheme.spacing.lg,
  },
  
  headerTitle: {
    ...AppTheme.typography.largeTitle,
    color: AppTheme.colors.textPrimary,
    marginBottom: 4,
  },
  
  headerSubtitle: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textSecondary,
  },
  
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  viewModeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search
  searchContainer: {
    marginBottom: AppTheme.spacing.md,
  },
  
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.md,
    paddingHorizontal: AppTheme.spacing.md,
    height: 44,
  },
  
  searchInput: {
    flex: 1,
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    marginLeft: AppTheme.spacing.sm,
  },

  // Tabs
  tabsContainer: {
    paddingBottom: AppTheme.spacing.md,
  },
  
  tabsScrollContent: {
    paddingHorizontal: AppTheme.spacing.lg,
  },
  
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.surface,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.lg,
    marginRight: AppTheme.spacing.sm,
  },
  
  tabButtonActive: {
    backgroundColor: AppTheme.colors.primary,
  },
  
  tabText: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textSecondary,
    fontWeight: '500',
  },
  
  tabTextActive: {
    color: '#FFFFFF',
  },
  
  tabBadge: {
    backgroundColor: AppTheme.colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: AppTheme.spacing.sm,
  },
  
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  tabBadgeText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textSecondary,
    fontWeight: '600',
  },
  
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },

  // Books Container
  booksContainer: {
    paddingHorizontal: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.xl,
  },

  // Book Item - List View
  bookItem: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  bookItemGrid: {
    flex: 1,
    marginHorizontal: AppTheme.spacing.xs,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  
  bookCoverContainer: {
    position: 'relative',
  },
  
  bookCoverContainerGrid: {
    alignSelf: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: AppTheme.borderRadius.sm,
  },
  
  bookCoverGrid: {
    width: 80,
    height: 120,
  },
  
  favoritebadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  bookInfo: {
    flex: 1,
    marginLeft: AppTheme.spacing.md,
  },
  
  bookInfoGrid: {
    marginLeft: 0,
    alignItems: 'center',
  },
  
  bookTitle: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  bookTitleGrid: {
    ...AppTheme.typography.subhead,
    textAlign: 'center',
  },
  
  bookAuthor: {
    ...AppTheme.typography.footnote,
    color: AppTheme.colors.textSecondary,
    marginBottom: AppTheme.spacing.sm,
  },
  
  bookAuthorGrid: {
    textAlign: 'center',
  },
  
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  
  ratingText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  
  pagesText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textTertiary,
    marginRight: AppTheme.spacing.md,
  },
  
  genreText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.primary,
    fontWeight: '500',
  },

  // Progress
  progressSection: {
    marginBottom: AppTheme.spacing.sm,
  },
  
  progressBar: {
    height: 4,
    backgroundColor: AppTheme.colors.surfaceLight,
    borderRadius: 2,
    marginBottom: 4,
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  
  progressText: {
    ...AppTheme.typography.caption,
    fontWeight: '500',
  },

  // AI Versions Badge
  aiVersionsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  
  aiVersionsText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },

  // Action Button
  actionButton: {
    padding: AppTheme.spacing.sm,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.xl,
  },
  
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.lg,
  },
  
  emptyTitle: {
    ...AppTheme.typography.title,
    color: AppTheme.colors.textPrimary,
    marginBottom: AppTheme.spacing.sm,
  },
  
  emptyDescription: {
    ...AppTheme.typography.subhead,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: AppTheme.spacing.lg,
  },
  
  emptyAction: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: AppTheme.borderRadius.md,
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
  },
  
  emptyActionText: {
    ...AppTheme.typography.callout,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});