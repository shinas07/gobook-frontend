// app/reader.tsx - Dark Design
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { dummyBooks } from '@/services/api';

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

export default function ReaderScreen() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams();
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [fontSize, setFontSize] = useState(16);
  const [isAIContent, setIsAIContent] = useState(false);

  // Sample book content - in real app, this would come from PDF/ebook file
  const originalContent = `
Chapter One

The infection comes as fever at night. If you take ill, watch the veins— the tributary of blood travelling down the arms. If they remain as they ever did, you have nothing to fear.

If the blood darkens to an inky black, the infection has taken hold.

The infection comes as fever at night.

I was nine the first time the Physicians came in house. My uncle and his men were away. My cousin Ione and her brothers played loudly in the kitchen, and my aunt did not hear the pounding at the door until the first man in white robes was already in the parlor. She did not have time to hide me. I was asleep, resting like a cat in the window.

When she shook me awake, her voice was thick with fear. "Go to the wood," she whispered, unlatching the window and gently pushing me through the casement to the ground below.

I ran barefoot through the cold morning mist, my nightdress catching on brambles and low branches. Behind me, I could hear the heavy footsteps of the Physicians, their white robes ghosting between the trees like death itself.

The forest was my sanctuary. I knew every twisted root, every hidden hollow where I could curl up small and invisible. My aunt had taught me the paths when I was barely walking, showing me which berries were safe to eat, which streams ran clean, and where the old magic still lingered in the shadows.

But that morning, as I pressed myself against the rough bark of an ancient oak, I felt something different in the air. A darkness that seemed to seep from the very earth, cold and hungry and aware.

The Physicians' voices echoed through the trees, calling out in their strange, melodic language. They were searching for someone like me—someone who carried the old blood, the infection that ran deeper than fever and darker than night.

I closed my eyes and tried to make myself smaller, tried to become nothing more than shadow and bark and morning dew. But I could feel their presence drawing closer, could smell the sharp scent of their remedies and see the pale glow of their lanterns cutting through the mist.

That was the day I learned that some infections cannot be cured, only hidden. And some hunts never truly end.
  `;

  const aiEnhancedContent = `
Chapter One: The Shadow Plague

✨ The infection manifests as fever during nocturnal hours. Should you fall ill, observe the veins carefully—those crimson rivers that flow through your arms like ancient tributaries. If they maintain their natural appearance, you need not fear.

However, if the blood transforms to an obsidian black, the infection has claimed you.

The infection comes as fever at night.

I was merely nine years old when the Physicians first crossed our threshold. My uncle and his warriors were away on their expedition. My cousin Ione and her brothers created a cacophony in the kitchen, and my aunt remained oblivious to the thunderous pounding at our door until the first figure draped in pristine white robes had already materialized in our parlor. She lacked the time to conceal me. I slumbered peacefully, curled like a contented feline upon the windowsill.

When she roused me from sleep, terror thickened her voice like honey. "Flee to the woods," she whispered urgently, releasing the window latch and guiding me gently through the opening to the earth below.

I sprinted barefoot through the ethereal morning mist, my nightgown snagging on thorny brambles and low-hanging branches. Behind me echoed the ominous footfalls of the Physicians, their alabaster robes flowing between the trees like harbingers of death itself.

The forest served as my sacred refuge. I knew intimately every gnarled root, every concealed hollow where I could compress myself into invisibility. My aunt had illuminated these pathways when I could barely toddle, demonstrating which berries offered nourishment, which streams flowed pure, and where the ancient magic still pulsed within the shadows.

Yet that morning, as I pressed my small frame against the weathered bark of a primordial oak, I sensed something extraordinary permeating the atmosphere. A malevolent darkness that appeared to emanate from the very soil beneath my feet—cold, ravenous, and unnervingly sentient.

The Physicians' voices resonated through the woodland, their incantations flowing in an otherworldly, melodious tongue. They hunted someone precisely like me—an individual who carried the ancestral bloodline, the infection that penetrated deeper than any fever and darker than the endless night.

I sealed my eyes and attempted to diminish my presence, striving to become nothing more substantial than shadow, bark, and morning dew. Yet I could perceive their ominous approach, detect the acrid aroma of their medicinal concoctions, and observe the ghostly luminescence of their lanterns piercing the mist.

That fateful day taught me that certain infections resist all cures—they can only be concealed. And some pursuits never truly cease.
  `;

  const currentContent = isAIContent ? aiEnhancedContent : originalContent;

  useEffect(() => {
    // Find book by ID
    const foundBook = dummyBooks.find(b => b.id === bookId);
    if (foundBook) {
      setBook(foundBook);
      setTotalPages(foundBook.pages || 100);
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

  const progress = (currentPage / totalPages) * 100;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.bookTitle} numberOfLines={1}>
              {book.title}
            </Text>
            <Text style={styles.timeLeft}>20 mins left in Chapter</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.fontButton} 
              onPress={() => setFontSize(Math.max(12, fontSize - 2))}
            >
              <Text style={styles.fontButtonText}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.fontButton} 
              onPress={() => setFontSize(Math.min(24, fontSize + 2))}
            >
              <Text style={styles.fontButtonText}>A+</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Progress Bar */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[colors.secondary, colors.primary]}
              style={[styles.progressFill, { width: `${progress}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </Animated.View>

        {/* Content Toggle */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.contentToggle}>
          <TouchableOpacity
            style={[styles.toggleOption, !isAIContent && styles.toggleOptionActive]}
            onPress={() => setIsAIContent(false)}
          >
            {!isAIContent ? (
              <LinearGradient
                colors={[colors.secondary, colors.primary]}
                style={styles.toggleGradient}
              >
                <Ionicons name="document-text" size={16} color="#fff" />
                <Text style={styles.toggleTextActive}>Original</Text>
              </LinearGradient>
            ) : (
              <View style={styles.toggleContent}>
                <Ionicons name="document-text-outline" size={16} color={colors.textMuted} />
                <Text style={styles.toggleText}>Original</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toggleOption, isAIContent && styles.toggleOptionActive]}
            onPress={() => setIsAIContent(true)}
          >
            {isAIContent ? (
              <LinearGradient
                colors={[colors.secondary, colors.primary]}
                style={styles.toggleGradient}
              >
                <Ionicons name="sparkles" size={16} color="#fff" />
                <Text style={styles.toggleTextActive}>AI Enhanced</Text>
              </LinearGradient>
            ) : (
              <View style={styles.toggleContent}>
                <Ionicons name="sparkles-outline" size={16} color={colors.textMuted} />
                <Text style={styles.toggleText}>AI Enhanced</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Book Content */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.contentContainer}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={[styles.contentText, { fontSize, color: colors.textSecondary }]}>
              {currentContent}
            </Text>
          </ScrollView>
        </Animated.View>

        {/* Navigation */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, currentPage === 1 && styles.navButtonDisabled]}
            onPress={previousPage}
            disabled={currentPage === 1}
          >
            <View style={styles.navButtonContent}>
              <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? colors.textMuted : colors.primary} />
              <Text style={[styles.navButtonText, { color: currentPage === 1 ? colors.textMuted : colors.primary }]}>
                Previous
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.pageInfoContainer}>
            <Text style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </Text>
            <Text style={styles.chapterInfo}>Chapter 1</Text>
          </View>

          <TouchableOpacity
            style={[styles.navButton, currentPage === totalPages && styles.navButtonDisabled]}
            onPress={nextPage}
            disabled={currentPage === totalPages}
          >
            <View style={[styles.navButtonContent, { flexDirection: 'row-reverse' }]}>
              <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? colors.textMuted : colors.primary} />
              <Text style={[styles.navButtonText, { color: currentPage === totalPages ? colors.textMuted : colors.primary }]}>
                Next
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  timeLeft: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  fontButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },

  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.card,
    borderRadius: 3,
    marginRight: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
    minWidth: 40,
  },

  // Toggle
  contentToggle: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginVertical: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleOption: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  toggleOptionActive: {
    // Active styles handled by gradient
  },
  toggleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  toggleTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  // Content
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  contentText: {
    lineHeight: 28,
    textAlign: 'justify',
    fontWeight: '400',
  },

  // Navigation
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  navButton: {
    flex: 1,
    maxWidth: 100,
  },
  navButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  pageInfoContainer: {
    alignItems: 'center',
    flex: 1,
  },
  pageInfo: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 2,
  },
  chapterInfo: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
});