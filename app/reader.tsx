// app/reader.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { dummyBooks } from '@/services/api';

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

export default function ReaderScreen() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams();
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [fontSize, setFontSize] = useState(16);
  const [isAIContent, setIsAIContent] = useState(false); // Toggle between AI and original content

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
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>Book not found</Text>
        </View>
      </SafeAreaView>
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {book.title}
          </Text>
          <Text style={styles.timeLeft}>20 mins left in Chapter</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.fontButton} onPress={() => setFontSize(Math.max(12, fontSize - 2))}>
            <Text style={styles.fontButtonText}>A-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fontButton} onPress={() => setFontSize(Math.min(24, fontSize + 2))}>
            <Text style={styles.fontButtonText}>A+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>

      {/* Content Toggle */}
      <View style={styles.contentToggle}>
        <TouchableOpacity
          style={[styles.toggleOption, !isAIContent && styles.toggleOptionActive]}
          onPress={() => setIsAIContent(false)}
        >
          <Ionicons name="document-text-outline" size={16} color={!isAIContent ? '#8b5cf6' : '#9ca3af'} />
          <Text style={[styles.toggleText, !isAIContent && styles.toggleTextActive]}>
            Original
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.toggleOption, isAIContent && styles.toggleOptionActive]}
          onPress={() => setIsAIContent(true)}
        >
          <Ionicons name="sparkles" size={16} color={isAIContent ? '#8b5cf6' : '#9ca3af'} />
          <Text style={[styles.toggleText, isAIContent && styles.toggleTextActive]}>
            AI Enhanced
          </Text>
        </TouchableOpacity>
      </View>

      {/* Book Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.contentText, { fontSize }]}>
          {currentContent}
        </Text>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentPage === 1 && styles.navButtonDisabled]}
          onPress={previousPage}
          disabled={currentPage === 1}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>

        <TouchableOpacity
          style={[styles.navButton, currentPage === totalPages && styles.navButtonDisabled]}
          onPress={nextPage}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  timeLeft: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  fontButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  fontButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    minWidth: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  contentText: {
    lineHeight: 28,
    color: '#374151',
    textAlign: 'justify',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  navButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  contentToggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  toggleOptionActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
    marginLeft: 6,
  },
  pageInfo: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});
