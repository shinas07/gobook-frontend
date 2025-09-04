// app/(tabs)/index.tsx - Perfect Home Page Design
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { dummyBooks } from '@/services/api';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import GenreFilter from '@/components/GenreFilter';
import ContinueReadingSection from '@/components/ContinueReadingSection';
import BookGrid from '@/components/BookGrid';

const { width } = Dimensions.get('window');

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

export default function HomeScreen() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [continueReading, setContinueReading] = useState([]);

  const genres = ['All', 'Romance', 'Sci-Fi', 'Fantasy', 'Mystery', 'Classics', 'Biography'];

  useEffect(() => {
    // Load books (using dummy data for now)
    setBooks(dummyBooks);
    
    // Set continue reading (first book with some progress)
    setContinueReading([
      { ...dummyBooks[1], progress: 30 },
      { ...dummyBooks[3], progress: 65 },
    ]);
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const stats = [
    {
      label: 'Library',
      value: books.length.toString(),
      icon: 'library',
      color: colors.primary,
      subtitle: `${books.length} Books`,
    },
    {
      label: 'Reading',
      value: continueReading.length.toString(),
      icon: 'book-open',
      color: colors.success,
      subtitle: 'In Progress',
    },
    {
      label: 'Completed',
      value: '12',
      icon: 'checkmark-circle',
      color: colors.warning,
      subtitle: 'This Year',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.background, '#1a1a2e', '#16213e', colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >

          
          
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Header />
          </View>

          {/* Hero Welcome Section */}
          <View style={styles.heroSection}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.heroTitle}>Ready to dive into</Text>
            <Text style={styles.heroTitleAccent}>your next adventure?</Text>
            <Text style={styles.heroSubtitle}>
              Discover new worlds, continue your journey, or explore your library
            </Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <TouchableOpacity key={index} style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                    <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Search & Filter Section */}
          <View style={styles.searchSection}>
            <View style={styles.sectionCard}>
              <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </View>
          </View>

          

          <View style={styles.filterSection}>
            <View style={styles.sectionCard}>
              <GenreFilter
                genres={genres}
                selectedGenre={selectedGenre}
                onGenreSelect={setSelectedGenre}
              />
            </View>
          </View>

          {/* Continue Reading Section */}
          {continueReading.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="play-circle" size={20} color={colors.success} />
                  <Text style={styles.sectionTitle}>Continue Reading</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.sectionCard}>
                <ContinueReadingSection
                  books={continueReading}
                  onBookPress={(book) => router.push(`/reader?bookId=${book.id}`)}
                />
              </View>
            </View>
          )}

              {/* Reading Insights */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="analytics" size={20} color={colors.warning} />
              <Text style={styles.sectionTitle}>This Week's Progress</Text>
            </View>
            
            <View style={styles.insightsCard}>
              <View style={styles.insightsGrid}>
                <View style={styles.insightItem}>
                  <View style={[styles.insightIcon, { backgroundColor: `${colors.success}20` }]}>
                    <Ionicons name="time" size={18} color={colors.success} />
                  </View>
                  <Text style={styles.insightValue}>3.2hrs</Text>
                  <Text style={styles.insightLabel}>Reading Time</Text>
                </View>
                
                <View style={styles.insightDivider} />
                
                <View style={styles.insightItem}>
                  <View style={[styles.insightIcon, { backgroundColor: `${colors.primary}20` }]}>
                    <Ionicons name="book" size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.insightValue}>47</Text>
                  <Text style={styles.insightLabel}>Pages Read</Text>
                </View>
                
                <View style={styles.insightDivider} />
                
                <View style={styles.insightItem}>
                  <View style={[styles.insightIcon, { backgroundColor: `${colors.warning}20` }]}>
                    <Ionicons name="trophy" size={18} color={colors.warning} />
                  </View>
                  <Text style={styles.insightValue}>5</Text>
                  <Text style={styles.insightLabel}>Day Streak</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Your Library Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="library" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Your Library</Text>
              </View>
              <View style={styles.bookCountBadge}>
                <Text style={styles.bookCountText}>
                  {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
                </Text>
              </View>
            </View>
            
            <View style={styles.sectionCard}>
              <BookGrid
                title=""
                books={filteredBooks}
                onBookPress={(book) => router.push(`/book-details?bookId=${book.id}`)}
                columns={2}
              />
            </View>
          </View>

       

      

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  safeArea: { 
    flex: 1 
  },
  scrollContent: { 
    paddingBottom: 40 
  },

  // Header
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 8,
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 34,
  },
  heroTitleAccent: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    lineHeight: 34,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: '400',
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },

  // Search and Filter
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Sections
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  bookCountBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bookCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },

  // Insights
  insightsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 16,
  },
  insightsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  insightItem: {
    alignItems: 'center',
    flex: 1,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
  },
  insightDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },

  // Bottom spacing
  bottomSpacing: {
    height: 20,
  },
});