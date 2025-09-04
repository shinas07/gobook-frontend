// components/ContinueReadingSection.tsx - Professional Dark Theme
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Same theme as other pages
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
      {/* Book Cover */}
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: item.cover_url }}
          style={styles.continueCover}
          defaultSource={require('@/assets/images/placeholder-book.png')}
        />
        {/* Progress Ring Overlay */}
        <View style={styles.progressRing}>
          <Text style={styles.progressRingText}>{item.progress || 0}%</Text>
        </View>
      </View>

      {/* Book Info */}
      <View style={styles.continueInfo}>
        <View style={styles.bookHeader}>
          <Text style={styles.continueTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.aiChip}>
            <Ionicons name="sparkles" size={12} color={AppTheme.colors.warning} />
            <Text style={styles.aiText}>AI Enhanced</Text>
          </View>
        </View>
        
        <Text style={styles.continueAuthor} numberOfLines={1}>
          by {item.author}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[AppTheme.colors.primary, '#4F46E5']}
              style={[styles.progressFill, { width: `${item.progress || 0}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {item.progress || 0}% complete
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => onBookPress(item)}
          >
            <LinearGradient
              colors={[AppTheme.colors.primary, '#4F46E5']}
              style={styles.buttonGradient}
            >
              <Ionicons name="play" size={16} color="#FFFFFF" />
              <Text style={styles.continueButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={16} color={AppTheme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!books || books.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Continue Reading</Text>
        <Text style={styles.sectionSubtitle}>{books.length} book{books.length > 1 ? 's' : ''} in progress</Text>
      </View>
      
      <FlatList
        data={books}
        renderItem={renderContinueReading}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.continueList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: AppTheme.spacing.xl,
  },
  
  sectionHeader: {
    paddingHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.md,
  },
  
  sectionTitle: {
    ...AppTheme.typography.headline,
    color: AppTheme.colors.textPrimary,
    marginBottom: 4,
  },
  
  sectionSubtitle: {
    ...AppTheme.typography.footnote,
    color: AppTheme.colors.textSecondary,
  },
  
  continueList: {
    paddingLeft: AppTheme.spacing.lg,
  },
  
  continueCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    marginRight: AppTheme.spacing.md,
    width: 320,
    flexDirection: 'row',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Cover Section
  coverContainer: {
    position: 'relative',
    marginRight: AppTheme.spacing.lg,
  },
  
  continueCover: {
    width: 80,
    height: 120,
    borderRadius: AppTheme.borderRadius.md,
  },
  
  progressRing: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppTheme.colors.surface,
  },
  
  progressRingText: {
    ...AppTheme.typography.caption,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  
  // Info Section
  continueInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  bookHeader: {
    marginBottom: AppTheme.spacing.sm,
  },
  
  continueTitle: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: AppTheme.spacing.sm,
    lineHeight: 22,
  },
  
  aiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${AppTheme.colors.warning}20`,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  
  aiText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.warning,
    marginLeft: 4,
    fontWeight: '500',
  },
  
  continueAuthor: {
    ...AppTheme.typography.subhead,
    color: AppTheme.colors.textSecondary,
    marginBottom: AppTheme.spacing.md,
  },
  
  // Progress Section
  progressSection: {
    marginBottom: AppTheme.spacing.md,
  },
  
  progressBar: {
    height: 6,
    backgroundColor: AppTheme.colors.surfaceLight,
    borderRadius: 3,
    marginBottom: AppTheme.spacing.sm,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  progressText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textSecondary,
    fontWeight: '500',
  },
  
  // Action Section
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  continueButton: {
    borderRadius: AppTheme.borderRadius.md,
    overflow: 'hidden',
    flex: 1,
    marginRight: AppTheme.spacing.md,
  },
  
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme.spacing.sm,
    paddingHorizontal: AppTheme.spacing.md,
  },
  
  continueButtonText: {
    ...AppTheme.typography.callout,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: AppTheme.spacing.sm,
  },
  
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppTheme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});