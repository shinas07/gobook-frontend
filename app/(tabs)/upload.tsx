// app/(tabs)/upload.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UploadScreen() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = () => {
    Alert.alert(
      'Upload Book',
      'Choose upload method',
      [
        { text: 'From Device', onPress: () => uploadFromDevice() },
        { text: 'From Cloud', onPress: () => uploadFromCloud() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const uploadFromDevice = () => {
    // Simulate upload process
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          Alert.alert('Success', 'Book uploaded successfully!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const uploadFromCloud = () => {
    Alert.alert('Coming Soon', 'Cloud upload feature will be available soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Upload Books</Text>
        </View>

        {/* Upload Area */}
        <View style={styles.uploadSection}>
          <View style={styles.uploadArea}>
            <Ionicons name="cloud-upload-outline" size={64} color="#8b5cf6" />
            <Text style={styles.uploadTitle}>Upload Your Books</Text>
            <Text style={styles.uploadSubtitle}>
              Drag and drop your PDF files here or click to browse
            </Text>
            
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handleFileUpload}
              disabled={isUploading}
            >
              <Text style={styles.uploadButtonText}>
                {isUploading ? 'Uploading...' : 'Choose Files'}
              </Text>
            </TouchableOpacity>

            {isUploading && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{uploadProgress}%</Text>
              </View>
            )}
          </View>
        </View>

        {/* Supported Formats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Supported Formats</Text>
          <View style={styles.formatList}>
            <View style={styles.formatItem}>
              <Ionicons name="document-text" size={24} color="#ef4444" />
              <Text style={styles.formatText}>PDF</Text>
            </View>
            <View style={styles.formatItem}>
              <Ionicons name="book" size={24} color="#10b981" />
              <Text style={styles.formatText}>EPUB</Text>
            </View>
            <View style={styles.formatItem}>
              <Ionicons name="library" size={24} color="#3b82f6" />
              <Text style={styles.formatText}>MOBI</Text>
            </View>
          </View>
        </View>

        {/* Recent Uploads */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Uploads</Text>
          <View style={styles.emptyState}>
            <Ionicons name="library-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No recent uploads</Text>
            <Text style={styles.emptySubtext}>
              Your uploaded books will appear here
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  uploadSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  formatList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  formatItem: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  formatText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
});