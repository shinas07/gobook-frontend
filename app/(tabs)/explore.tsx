// app/(tabs)/explore.tsx - Professional Clean Design with Consistent Colors
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
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { dummyBooks } from '@/services/api';

// Consistent Color System with other pages
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
      case 'reading': return colors.primary;
      case 'completed': return colors.success;
      default: return colors.textMuted;
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
            <Ionicons name="heart" size={12} color={colors.danger} />
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
              <Ionicons name="star" size={14} color={colors.warning} />
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
            <Ionicons name="sparkles" size={12} color={colors.primary} />
            <Text style={styles.aiVersionsText}>{item.versions} AI versions</Text>
          </View>
        )}
      </View>

      {/* Action Button */}
      {viewMode === 'list' && (
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Same Background Gradient as other pages */}
      <LinearGradient
        colors={[colors.background, '#1a1a2e', '#16213e', colors.background]}
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
                  color={colors.primary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchCard}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color={colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search books, authors..."
                  placeholderTextColor={colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
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
            key={viewMode}
            contentContainerStyle={styles.booksContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="library-outline" size={64} color={colors.textMuted} />
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
              <TouchableOpacity 
                style={styles.emptyAction}
                onPress={() => router.push('/upload')}
              >
                <LinearGradient
                  colors={[colors.secondary, colors.primary]}
                  style={styles.emptyActionGradient}
                >
                  <Text style={styles.emptyActionText}>Upload Books</Text>
                </LinearGradient>
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
    backgroundColor: colors.background,
  },
  
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  viewModeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search
  searchSection: {
    marginBottom: 16,
  },
  
  searchCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '400',
  },

  // Tabs
  tabsContainer: {
    paddingBottom: 20,
  },
  
  tabsScrollContent: {
    paddingHorizontal: 24,
  },
  
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  
  tabButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  
  tabTextActive: {
    color: colors.text,
  },
  
  tabBadge: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  tabBadgeText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
  },
  
  tabBadgeTextActive: {
    color: colors.text,
  },

  // Books Container
  booksContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },

  // Book Item - List View
  bookItem: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  bookItemGrid: {
    flex: 1,
    marginHorizontal: 6,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  
  bookCoverContainer: {
    position: 'relative',
  },
  
  bookCoverContainerGrid: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  
  bookCoverGrid: {
    width: 80,
    height: 120,
  },
  
  favoriteBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  
  bookInfo: {
    flex: 1,
    marginLeft: 16,
  },
  
  bookInfoGrid: {
    marginLeft: 0,
    alignItems: 'center',
  },
  
  bookTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  
  bookTitleGrid: {
    fontSize: 14,
    textAlign: 'center',
  },
  
  bookAuthor: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  
  bookAuthorGrid: {
    textAlign: 'center',
    fontSize: 13,
  },
  
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  
  ratingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '600',
  },
  
  pagesText: {
    fontSize: 12,
    color: colors.textMuted,
    marginRight: 16,
    fontWeight: '500',
  },
  
  genreText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },

  // Progress
  progressSection: {
    marginBottom: 8,
  },
  
  progressBar: {
    height: 4,
    backgroundColor: colors.card,
    borderRadius: 2,
    marginBottom: 4,
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  
  progressText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // AI Versions Badge
  aiVersionsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  
  aiVersionsText: {
    fontSize: 11,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },

  // Action Button
  actionButton: {
    padding: 8,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  
  emptyAction: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  
  emptyActionGradient: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  
  emptyActionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
  },
});