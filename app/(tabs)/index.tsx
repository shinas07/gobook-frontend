// app/(tabs)/index.tsx - Professional Best Home Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
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

export default function HomeScreen() {
  const router = useRouter();
  const [greeting, setGreeting] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyReading, setCurrentlyReading] = useState(null);
  const [recentBooks, setRecentBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [stats, setStats] = useState({
    booksRead: 24,
    readingStreak: 7,
    weeklyGoal: 5,
    weeklyProgress: 3,
    totalTime: '48h 32m'
  });

  useEffect(() => {
    // Set dynamic greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Load mock data
    const mockData = dummyBooks.map((book, index) => ({
      ...book,
      progress: index === 0 ? 67 : index === 1 ? 23 : index === 2 ? 100 : 0,
      reading_status: index === 0 ? 'reading' : index === 1 ? 'reading' : index === 2 ? 'completed' : 'not_started',
      is_favorite: index === 0 || index === 3,
    }));

    // Set currently reading
    const reading = mockData.find(book => book.reading_status === 'reading');
    setCurrentlyReading(reading);

    // Set recent and recommended books
    setRecentBooks(mockData.slice(1, 5));
    setRecommendedBooks(mockData.slice(2, 6));
  }, []);

  const quickActions = [
    { 
      id: 'upload', 
      title: 'Upload Book', 
      subtitle: 'Add new books', 
      icon: 'cloud-upload-outline', 
      color: AppTheme.colors.primary,
      route: 'upload'
    },
    { 
      id: 'ai', 
      title: 'AI Features', 
      subtitle: 'Enhanced reading', 
      icon: 'sparkles-outline', 
      color: AppTheme.colors.warning,
      route: 'ai'
    },
  ];

  const renderRecentBook = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.recentBookCard}
      onPress={() => router.push(`/book-details?bookId=${item.id}`)}
    >
      <Image
        source={{ uri: item.cover_url }}
        style={styles.recentBookCover}
        defaultSource={require('@/assets/images/placeholder-book.png')}
      />
      <View style={styles.recentBookInfo}>
        <Text style={styles.recentBookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.recentBookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        {item.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const filteredBooks = recommendedBooks.filter(book => 
    searchQuery === '' || 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[AppTheme.colors.background, AppTheme.colors.surface, AppTheme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Professional Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>{greeting},</Text>
                <Text style={styles.userName}>Reader! 👋</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerButton}>
                  <Ionicons name="notifications-outline" size={20} color={AppTheme.colors.textSecondary} />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>2</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.profileButton}
                  onPress={() => router.push('profile')}
                >
                  <Text style={styles.avatarText}>R</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
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

          {/* Weekly Goal Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Reading Goal</Text>
            <View style={styles.goalCard}>
              <View style={styles.goalContent}>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>Books This Week</Text>
                  <Text style={styles.goalNumbers}>{stats.weeklyProgress} of {stats.weeklyGoal}</Text>
                  <Text style={styles.goalMotivation}>
                    {stats.weeklyProgress >= stats.weeklyGoal 
                      ? "🎉 Goal achieved!" 
                      : `${stats.weeklyGoal - stats.weeklyProgress} more to go`
                    }
                  </Text>
                </View>
                <View style={styles.goalVisualization}>
                  <View style={styles.circularProgress}>
                    <Text style={styles.circularProgressText}>
                      {Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Continue Reading */}
          {currentlyReading && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Continue Reading</Text>
              <TouchableOpacity 
                style={styles.continueCard}
                onPress={() => router.push(`/reader?bookId=${currentlyReading.id}`)}
              >
                <Image
                  source={{ uri: currentlyReading.cover_url }}
                  style={styles.continueBookCover}
                  defaultSource={require('@/assets/images/placeholder-book.png')}
                />
                <View style={styles.continueBookInfo}>
                  <View style={styles.aiChip}>
                    <Ionicons name="sparkles" size={12} color={AppTheme.colors.warning} />
                    <Text style={styles.aiChipText}>AI Enhanced</Text>
                  </View>
                  <Text style={styles.continueBookTitle}>{currentlyReading.title}</Text>
                  <Text style={styles.continueBookAuthor}>by {currentlyReading.author}</Text>
                  
                  <View style={styles.progressSection}>
                    <View style={styles.largeProgressBar}>
                      <LinearGradient
                        colors={[AppTheme.colors.primary, '#4F46E5']}
                        style={[styles.largeProgressFill, { width: `${currentlyReading.progress}%` }]}
                      />
                    </View>
                    <Text style={styles.largeProgressText}>{currentlyReading.progress}% complete</Text>
                  </View>
                  
                  <View style={styles.continueButtonContainer}>
                    <TouchableOpacity style={styles.continueButton}>
                      <LinearGradient
                        colors={[AppTheme.colors.primary, '#4F46E5']}
                        style={styles.continueButtonGradient}
                      >
                        <Ionicons name="play" size={16} color="#FFFFFF" />
                        <Text style={styles.continueButtonText}>Continue Reading</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Reading Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Reading Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${AppTheme.colors.primary}20` }]}>
                  <Ionicons name="book-outline" size={20} color={AppTheme.colors.primary} />
                </View>
                <Text style={styles.statValue}>{stats.booksRead}</Text>
                <Text style={styles.statLabel}>Books Read</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${AppTheme.colors.warning}20` }]}>
                  <Ionicons name="flame-outline" size={20} color={AppTheme.colors.warning} />
                </View>
                <Text style={styles.statValue}>{stats.readingStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${AppTheme.colors.success}20` }]}>
                  <Ionicons name="time-outline" size={20} color={AppTheme.colors.success} />
                </View>
                <Text style={styles.statValue}>{stats.totalTime}</Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity 
                  key={action.id}
                  style={styles.actionCard}
                  onPress={() => router.push(action.route)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                    <Ionicons name={action.icon} size={24} color={action.color} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recently Added */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recently Added</Text>
              <TouchableOpacity onPress={() => router.push('explore')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={recentBooks}
              renderItem={renderRecentBook}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentBooksContainer}
            />
          </View>

          {/* Recommended Books */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            {filteredBooks.slice(0, 3).map((book) => (
              <TouchableOpacity 
                key={book.id}
                style={styles.recommendedCard}
                onPress={() => router.push(`/book-details?bookId=${book.id}`)}
              >
                <Image
                  source={{ uri: book.cover_url }}
                  style={styles.recommendedCover}
                  defaultSource={require('@/assets/images/placeholder-book.png')}
                />
                <View style={styles.recommendedInfo}>
                  <Text style={styles.recommendedTitle} numberOfLines={1}>
                    {book.title}
                  </Text>
                  <Text style={styles.recommendedAuthor} numberOfLines={1}>
                    by {book.author}
                  </Text>
                  <View style={styles.recommendedMeta}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color={AppTheme.colors.warning} />
                      <Text style={styles.ratingText}>{book.rating}</Text>
                    </View>
                    <Text style={styles.genreText}>{book.genre}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add" size={20} color={AppTheme.colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
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

  // Header
  header: {
    paddingHorizontal: AppTheme.spacing.lg,
    paddingTop: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.lg,
  },
  
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.lg,
  },
  
  greeting: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textSecondary,
    marginBottom: 4,
  },
  
  userName: {
    ...AppTheme.typography.largeTitle,
    color: AppTheme.colors.textPrimary,
  },
  
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.sm,
    position: 'relative',
  },
  
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: AppTheme.colors.danger,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppTheme.colors.background,
  },
  
  badgeText: {
    ...AppTheme.typography.caption,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  avatarText: {
    ...AppTheme.typography.headline,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Search
  searchContainer: {
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

  // Section
  section: {
    paddingHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.xl,
  },
  
  sectionTitle: {
    ...AppTheme.typography.headline,
    color: AppTheme.colors.textPrimary,
    marginBottom: AppTheme.spacing.md,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  
  viewAllText: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.primary,
    fontWeight: '500',
  },

  // Goal Card
  goalCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
  },
  
  goalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  goalInfo: {
    flex: 1,
  },
  
  goalTitle: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
  },
  
  goalNumbers: {
    ...AppTheme.typography.title,
    color: AppTheme.colors.primary,
    fontWeight: '700',
    marginVertical: 4,
  },
  
  goalMotivation: {
    ...AppTheme.typography.footnote,
    color: AppTheme.colors.textSecondary,
  },
  
  goalVisualization: {
    marginLeft: AppTheme.spacing.lg,
  },
  
  circularProgress: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppTheme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: AppTheme.colors.primary,
  },
  
  circularProgressText: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.primary,
    fontWeight: '600',
  },

  // Continue Reading
  continueCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    flexDirection: 'row',
  },
  
  continueBookCover: {
    width: 80,
    height: 120,
    borderRadius: AppTheme.borderRadius.sm,
    marginRight: AppTheme.spacing.lg,
  },
  
  continueBookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  aiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${AppTheme.colors.warning}20`,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: AppTheme.spacing.sm,
  },
  
  aiChipText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.warning,
    marginLeft: 4,
    fontWeight: '500',
  },
  
  continueBookTitle: {
    ...AppTheme.typography.headline,
    color: AppTheme.colors.textPrimary,
    marginBottom: 4,
  },
  
  continueBookAuthor: {
    ...AppTheme.typography.subhead,
    color: AppTheme.colors.textSecondary,
    marginBottom: AppTheme.spacing.md,
  },
  
  progressSection: {
    marginBottom: AppTheme.spacing.md,
  },
  
  largeProgressBar: {
    height: 6,
    backgroundColor: AppTheme.colors.surfaceLight,
    borderRadius: 3,
    marginBottom: AppTheme.spacing.sm,
    overflow: 'hidden',
  },
  
  largeProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  largeProgressText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textSecondary,
    fontWeight: '500',
  },
  
  continueButtonContainer: {
    marginTop: 'auto',
  },
  
  continueButton: {
    borderRadius: AppTheme.borderRadius.md,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
  },
  
  continueButtonText: {
    ...AppTheme.typography.callout,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: AppTheme.spacing.sm,
  },

  // Stats
  statsGrid: {
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
  
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  
  statValue: {
    ...AppTheme.typography.headline,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
  },
  
  statLabel: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  actionCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    flex: 1,
    marginHorizontal: AppTheme.spacing.xs,
    alignItems: 'center',
  },
  
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  
  actionTitle: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  
  actionSubtitle: {
    ...AppTheme.typography.footnote,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
  },

  // Recent Books
  recentBooksContainer: {
    paddingRight: AppTheme.spacing.lg,
  },
  
  recentBookCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.md,
    marginRight: AppTheme.spacing.md,
    width: 140,
  },
  
  recentBookCover: {
    width: '100%',
    height: 80,
    borderRadius: AppTheme.borderRadius.sm,
    marginBottom: AppTheme.spacing.sm,
  },
  
  recentBookInfo: {
    flex: 1,
  },
  
  recentBookTitle: {
    ...AppTheme.typography.subhead,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
    minHeight: 40,
  },
  
  recentBookAuthor: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textSecondary,
    marginBottom: AppTheme.spacing.sm,
  },
  
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: AppTheme.colors.surfaceLight,
    borderRadius: 2,
    marginRight: AppTheme.spacing.sm,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 2,
  },
  
  progressText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textTertiary,
    fontSize: 11,
  },

  // Recommended Books
  recommendedCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  
  recommendedCover: {
    width: 50,
    height: 75,
    borderRadius: AppTheme.borderRadius.sm,
    marginRight: AppTheme.spacing.md,
  },
  
  recommendedInfo: {
    flex: 1,
  },
  
  recommendedTitle: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  recommendedAuthor: {
    ...AppTheme.typography.subhead,
    color: AppTheme.colors.textSecondary,
    marginBottom: AppTheme.spacing.sm,
  },
  
  recommendedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  
  genreText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.primary,
    fontWeight: '500',
  },
  
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppTheme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  bottomSpacing: {
    height: 100,
  },
});