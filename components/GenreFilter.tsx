// components/GenreFilter.tsx
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
}

export default function GenreFilter({ genres, selectedGenre, onGenreSelect }: GenreFilterProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.genreContainer}
    >
      {genres.map((genre) => (
        <TouchableOpacity
          key={genre}
          style={[
            styles.genreButton,
            selectedGenre === genre && styles.genreButtonActive,
          ]}
          onPress={() => onGenreSelect(genre)}
        >
          <Text
            style={[
              styles.genreText,
              selectedGenre === genre && styles.genreTextActive,
            ]}
          >
            {genre}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  genreContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  genreButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  genreButtonActive: {
    backgroundColor: '#4f46e5',
  },
  genreText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  genreTextActive: {
    color: '#fff',
  },
});