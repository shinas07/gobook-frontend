// app/reader.tsx - Professional Reader Screen
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

const { width, height } = Dimensions.get('window');

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
  const { bookId, version } = useLocalSearchParams();
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [fontSize, setFontSize] = useState(18);
  const [isAIContent, setIsAIContent] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [brightness, setBrightness] = useState(100);

  // Enhanced sample content
  const originalContent = `Chapter One: The Awakening

The morning mist clung to the ancient stones like forgotten memories, each droplet catching the first light of dawn and scattering it into a thousand tiny rainbows. Elena pressed her palm against the cold wall and felt the familiar pulse of something deeper than stone, older than the foundations themselves.

She had been having the dreams again.

They came in fragments—glimpses of corridors that shouldn't exist, voices speaking in languages that had been dead for centuries, and always, always, the sense that something was calling to her from the depths below.

Her grandmother had warned her about this place. "Some knowledge comes with a price," the old woman had said, her weathered hands tracing protective symbols in the air. "And some doors, once opened, can never be closed again."

But Elena had never been one to heed warnings.

The archaeological dig had been her idea, her proposal, her life's work condensed into a hundred pages of careful research and passionate argument. When the university approved her request to excavate the ruins beneath the monastery, she thought she had won the greatest victory of her career.

Now, standing in the pre-dawn darkness with her heart hammering against her ribs, she wondered if she had instead sealed her fate.

The entrance to the lower chambers yawned before her like a mouth waiting to swallow secrets. Her headlamp cut through the gloom, illuminating carved symbols that seemed to shift and dance in the wavering light. Each step echoed with the weight of centuries, and Elena found herself moving as if in a trance, drawn deeper into the earth by forces she couldn't name or understand.

Behind her, the world above continued its daily rhythm—birds singing their morning songs, the distant hum of traffic, the ordinary sounds of a life she was leaving further behind with every step. Ahead lay only mystery, darkness, and the growing certainty that she was about to discover something that would change everything.

The corridor opened into a vast chamber, and Elena's breath caught in her throat. The walls were covered in murals that seemed to glow with their own inner light, depicting scenes of ritual and ceremony, of figures that were almost human but not quite, of events that belonged to no history she had ever studied.

At the center of the chamber stood a pedestal, and upon it...

Elena's hand trembled as she reached toward the artifact that had been waiting there, perhaps for centuries, perhaps for her.`;

  const aiEnhancedContent = `Chapter One: The Mystical Awakening ✨

The ethereal morning mist embraced the primordial stones like spectral memories woven from time itself, each crystalline droplet capturing dawn's inaugural luminescence and transforming it into countless miniature prisms of celestial radiance. Elena's trembling palm made contact with the glacial wall, immediately sensing the profound resonance of something far more ancient than mere stone—a primordial force that predated even these hallowed foundations.

The prophetic visions had returned to torment her slumber once more.

They manifested as enigmatic fragments—tantalizing glimpses of impossible corridors that defied architectural logic, phantom voices articulating forgotten dialects from civilizations lost to the mists of antiquity, and perpetually, the undeniable sensation that an otherworldly presence beckoned to her from the abyssal depths below.

Her venerable grandmother had issued cryptic warnings regarding this mystical sanctuary. "Certain forbidden knowledge exacts a terrible toll," the sage crone had intoned, her time-weathered hands weaving arcane protective sigils through the ambient air. "And some dimensional gateways, once breached, remain eternally open to forces beyond mortal comprehension."

Yet Elena had never possessed the wisdom to honor such supernatural counsel.

The archaeological expedition represented her intellectual magnum opus—her doctoral proposal, her scholarly passion distilled into a comprehensive manuscript of meticulous research and fervent academic discourse. When the prestigious university sanctioned her revolutionary request to excavate the enigmatic ruins concealed beneath the ancient monastery, she believed herself victorious in the greatest triumph of her academic career.

Now, positioned within the pre-dawn shadows with her mortal heart thundering against her ribcage like a desperate prisoner, she contemplated whether she had inadvertently orchestrated her own supernatural destiny.

The threshold to the subterranean chambers gaped before her consciousness like a primordial maw anticipating the consumption of forbidden secrets. Her professional headlamp pierced the stygian gloom, illuminating cryptic hieroglyphs that appeared to undulate and perform an otherworldly dance within the fluctuating illumination. Each calculated footstep resonated with the accumulated weight of countless centuries, and Elena discovered herself progressing as though entranced, inexorably drawn deeper into the earth's embrace by cosmic forces that transcended nomenclature or rational understanding.

Behind her corporeal form, the mundane world above maintained its quotidian rhythm—avian creatures serenading the dawn with their melodious compositions, the distant mechanical harmonies of vehicular traffic, the prosaic sounds of an existence she was progressively abandoning with each mystical step. Ahead awaited only unfathomable mystery, impenetrable darkness, and the intensifying conviction that she stood upon the precipice of a discovery that would fundamentally alter the fabric of reality itself.

The ancient corridor expanded into a magnificent subterranean cathedral, and Elena's respiratory function momentarily ceased in overwhelming awe. The walls displayed extraordinary murals that seemed to emanate their own supernatural luminescence, depicting elaborate scenes of ritualistic ceremony and mystical observance, featuring entities that possessed an almost-human appearance yet remained distinctly otherworldly, chronicling events that belonged to no terrestrial history she had ever encountered in her scholarly pursuits.

At the chamber's sacred epicenter stood an ornate pedestal of impossible antiquity, and upon its consecrated surface...

Elena's hand quivered with supernatural anticipation as she extended her trembling fingers toward the mystical artifact that had awaited this precise moment, perhaps across multiple centuries, perhaps specifically for her destined arrival.`;

  const currentContent = isAIContent ? aiEnhancedContent : originalContent;

  useEffect(() => {
    const foundBook = dummyBooks.find(b => b.id === bookId);
    if (foundBook) {
      setBook(foundBook);
      setTotalPages(foundBook.pages || 100);
    }

    // Reading time tracker
    const interval = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [bookId]);

  useEffect(() => {
    // Hide status bar for immersive reading
    StatusBar.setHidden(true);
    return () => StatusBar.setHidden(false);
  }, []);

  if (!book) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[AppTheme.colors.background, AppTheme.colors.surface]}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Ionicons name="book-outline" size={64} color={AppTheme.colors.textTertiary} />
            <Text style={styles.errorTitle}>Book Not Found</Text>
            <TouchableOpacity 
              style={styles.errorButton}
              onPress={() => router.back()}
            >
              <Text style={styles.errorButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const progress = (currentPage / totalPages) * 100;

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const adjustFontSize = (change: number) => {
    setFontSize(Math.max(14, Math.min(24, fontSize + change)));
  };

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
      <LinearGradient
        colors={[AppTheme.colors.background, AppTheme.colors.surface]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header - Hidden by default, show on tap */}
        {isMenuVisible && (
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={20} color={AppTheme.colors.textPrimary} />
              </TouchableOpacity>
              
              <View style={styles.headerInfo}>
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={styles.chapterInfo}>
                  Chapter 1 • {Math.floor((totalPages - currentPage) * 0.5)} min left
                </Text>
              </View>

              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={() => adjustFontSize(-1)}
                >
                  <Text style={styles.fontButtonText}>A⁻</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={() => adjustFontSize(1)}
                >
                  <Text style={styles.fontButtonText}>A⁺</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={[AppTheme.colors.primary, '#4F46E5']}
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          </View>
        )}

        {/* Reading Mode Toggle */}
        {isMenuVisible && (
          <View style={styles.modeToggleContainer}>
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeButton, !isAIContent && styles.modeButtonActive]}
                onPress={() => setIsAIContent(false)}
              >
                <Ionicons 
                  name="document-text-outline" 
                  size={16} 
                  color={!isAIContent ? AppTheme.colors.primary : AppTheme.colors.textTertiary} 
                />
                <Text style={[
                  styles.modeText, 
                  !isAIContent && styles.modeTextActive
                ]}>
                  Original
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modeButton, isAIContent && styles.modeButtonActive]}
                onPress={() => setIsAIContent(true)}
              >
                <Ionicons 
                  name="sparkles" 
                  size={16} 
                  color={isAIContent ? AppTheme.colors.warning : AppTheme.colors.textTertiary} 
                />
                <Text style={[
                  styles.modeText, 
                  isAIContent && styles.modeTextActive
                ]}>
                  AI Enhanced
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Reading Content */}
        <TouchableOpacity 
          style={styles.contentContainer} 
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <ScrollView 
            style={styles.contentScroll} 
            contentContainerStyle={styles.contentPadding}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.contentText, { fontSize, lineHeight: fontSize * 1.6 }]}>
              {currentContent}
            </Text>
            <View style={styles.contentBottom} />
          </ScrollView>
        </TouchableOpacity>

        {/* Bottom Navigation */}
        {isMenuVisible && (
          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={[styles.navButton, currentPage === 1 && styles.navButtonDisabled]}
              onPress={previousPage}
              disabled={currentPage === 1}
            >
              <Ionicons 
                name="chevron-back" 
                size={20} 
                color={currentPage === 1 ? AppTheme.colors.textTertiary : AppTheme.colors.textPrimary} 
              />
              <Text style={[
                styles.navButtonText,
                currentPage === 1 && styles.navButtonTextDisabled
              ]}>
                Previous
              </Text>
            </TouchableOpacity>

            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                {currentPage} / {totalPages}
              </Text>
              <Text style={styles.readingTime}>
                {readingTime}m read
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.navButton, currentPage === totalPages && styles.navButtonDisabled]}
              onPress={nextPage}
              disabled={currentPage === totalPages}
            >
              <Text style={[
                styles.navButtonText,
                currentPage === totalPages && styles.navButtonTextDisabled
              ]}>
                Next
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={currentPage === totalPages ? AppTheme.colors.textTertiary : AppTheme.colors.textPrimary} 
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Reading Settings Panel */}
        {isMenuVisible && (
          <View style={styles.settingsPanel}>
            <TouchableOpacity style={styles.settingButton}>
              <Ionicons name="bookmark-outline" size={20} color={AppTheme.colors.textSecondary} />
              <Text style={styles.settingButtonText}>Bookmark</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingButton}>
              <Ionicons name="chatbubble-outline" size={20} color={AppTheme.colors.textSecondary} />
              <Text style={styles.settingButtonText}>Notes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingButton}>
              <Ionicons name="share-outline" size={20} color={AppTheme.colors.textSecondary} />
              <Text style={styles.settingButtonText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingButton}>
              <Ionicons name="settings-outline" size={20} color={AppTheme.colors.textSecondary} />
              <Text style={styles.settingButtonText}>Settings</Text>
            </TouchableOpacity>
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

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.xl,
  },
  
  errorTitle: {
    ...AppTheme.typography.title,
    color: AppTheme.colors.textPrimary,
    marginTop: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.xl,
  },
  
  errorButton: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: AppTheme.borderRadius.md,
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
  },
  
  errorButtonText: {
    ...AppTheme.typography.callout,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Header
  header: {
    backgroundColor: AppTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
  },
  
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headerInfo: {
    flex: 1,
    marginHorizontal: AppTheme.spacing.md,
  },
  
  bookTitle: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
  },
  
  chapterInfo: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  
  headerActions: {
    flexDirection: 'row',
  },
  
  fontButtonText: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textSecondary,
    fontWeight: '600',
  },

  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.md,
  },
  
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: AppTheme.colors.surfaceLight,
    borderRadius: 2,
    marginRight: AppTheme.spacing.md,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  
  progressText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textSecondary,
    fontWeight: '500',
    minWidth: 35,
  },

  // Mode Toggle
  modeToggleContainer: {
    paddingHorizontal: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.md,
  },
  
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.surfaceLight,
    borderRadius: AppTheme.borderRadius.lg,
    padding: 4,
  },
  
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.md,
  },
  
  modeButtonActive: {
    backgroundColor: AppTheme.colors.surface,
  },
  
  modeText: {
    ...AppTheme.typography.subhead,
    color: AppTheme.colors.textTertiary,
    fontWeight: '500',
    marginLeft: AppTheme.spacing.sm,
  },
  
  modeTextActive: {
    color: AppTheme.colors.textPrimary,
  },

  // Content
  contentContainer: {
    flex: 1,
  },
  
  contentScroll: {
    flex: 1,
  },
  
  contentPadding: {
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.xl,
  },
  
  contentText: {
    color: AppTheme.colors.textSecondary,
    textAlign: 'justify',
    fontFamily: 'Georgia', // Better reading font
  },
  
  contentBottom: {
    height: 100,
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
  },
  
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.surfaceLight,
    borderRadius: AppTheme.borderRadius.md,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
  },
  
  navButtonDisabled: {
    opacity: 0.5,
  },
  
  navButtonText: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '500',
    marginHorizontal: AppTheme.spacing.sm,
  },
  
  navButtonTextDisabled: {
    color: AppTheme.colors.textTertiary,
  },
  
  pageIndicator: {
    alignItems: 'center',
  },
  
  pageText: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
  },
  
  readingTime: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textTertiary,
    marginTop: 2,
  },

  // Settings Panel
  settingsPanel: {
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.surface,
    paddingHorizontal: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.lg,
    justifyContent: 'space-around',
  },
  
  settingButton: {
    alignItems: 'center',
    padding: AppTheme.spacing.sm,
  },
  
  settingButtonText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textSecondary,
    marginTop: 4,
  },
});