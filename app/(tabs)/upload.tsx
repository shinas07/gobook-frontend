// app/(tabs)/index.tsx - Clean Dark Design
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { dummyBooks } from '@/services/api';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import GenreFilter from '@/components/GenreFilter';
import ContinueReadingSection from '@/components/ContinueReadingSection';
import BookGrid from '@/components/BookGrid';

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
  
  // Animation values
  const fadeValue = useSharedValue(0);
  const slideValue = useSharedValue(50);

  const genres = ['All', 'Romance', 'Sci-Fi', 'Fantasy', 'Mystery', 'Classics', 'Biography'];

  useEffect(() => {
    // Load books (using dummy data for now)
    setBooks(dummyBooks);
    
    // Set continue reading (first book with some progress)
    setContinueReading([
      { ...dummyBooks[1], progress: 30 },
    ]);

    // Animate entrance
    fadeValue.value = withTiming(1, { duration: 800 });
    slideValue.value = withTiming(0, { duration: 800 });
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
    transform: [{ translateY: slideValue.value }],
  }));

  const stats = [
    { label: 'Total Books', value: books.length.toString(), icon: 'library', color: colors.primary },
    { label: 'Reading', value: continueReading.length.toString(), icon: 'book-open', color: colors.success },
    { label: 'Genres', value: (genres.length - 1).toString(), icon: 'grid', color: colors.secondary },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.background, '#1a1a2e', colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          
          {/* Header */}
          <Animated.View style={[styles.header, animatedHeaderStyle]}>
            <Header />
          </Animated.View>

          {/* Welcome Section */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Upload Your Books</Text>
            <Text style={styles.welcomeSubtitle}>Drag and drop your PDF files here or click to browse</Text>
          </Animated.View>

          {/* Stats Cards */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Search Section */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.searchSection}>
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </Animated.View>

          {/* Genre Filter */}
          <Animated.View entering={FadeInUp.delay(500)} style={styles.genreSection}>
            <GenreFilter
              genres={genres}
              selectedGenre={selectedGenre}
              onGenreSelect={setSelectedGenre}
            />
          </Animated.View>
        
            

          {/* Quick Actions */}
          <Animated.View entering={FadeInUp.delay(800)} style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/upload')}
              >
                <LinearGradient
                  colors={[colors.secondary, colors.primary]}
                  style={styles.actionGradient}
                >
                  <Ionicons name="cloud-upload" size={24} color="#fff" />
                  <Text style={styles.actionText}>Upload Book</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/search')}
              >
                <View style={[styles.actionGradient, { backgroundColor: colors.surface }]}>
                  <Ionicons name="search" size={24} color={colors.primary} />
                  <Text style={[styles.actionText, { color: colors.text }]}>Browse All</Text>
                </View>
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
    backgroundColor: colors.background 
  },
  safeArea: { 
    flex: 1 
  },
  scrollContent: { 
    paddingBottom: 32 
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 10,
  },

  // Welcome Section
  welcomeSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Search Section
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },

  // Genre Section
  genreSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  // Section
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  bookCount: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bookCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});