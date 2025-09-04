// app/(tabs)/upload.tsx - Professional Clean Design
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

// Same Design System as Profile
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

export default function UploadScreen() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [recentUploads] = useState([
    { id: '1', name: 'The Great Gatsby.pdf', size: '2.4 MB', date: '2 hours ago', status: 'completed' },
    { id: '2', name: 'To Kill a Mockingbird.epub', size: '1.8 MB', date: '1 day ago', status: 'completed' },
    { id: '3', name: 'Pride and Prejudice.pdf', size: '3.1 MB', date: '3 days ago', status: 'failed' },
  ]);

  const supportedFormats = [
    { name: 'PDF', icon: 'document-text-outline', color: AppTheme.colors.danger, description: 'Portable Document Format' },
    { name: 'EPUB', icon: 'book-outline', color: AppTheme.colors.success, description: 'Electronic Publication' },
    { name: 'MOBI', icon: 'library-outline', color: AppTheme.colors.primary, description: 'Mobipocket Format' },
    { name: 'TXT', icon: 'document-outline', color: AppTheme.colors.warning, description: 'Plain Text Format' },
  ];

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/epub+zip', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        simulateUpload(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const simulateUpload = (file: any) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          Alert.alert('Success!', `${file.name} uploaded successfully!`);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return AppTheme.colors.success;
      case 'failed': return AppTheme.colors.danger;
      case 'uploading': return AppTheme.colors.warning;
      default: return AppTheme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'failed': return 'close-circle';
      case 'uploading': return 'time';
      default: return 'document';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[AppTheme.colors.background, AppTheme.colors.surface, AppTheme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Upload Books</Text>
            <Text style={styles.headerSubtitle}>Add books to your library</Text>
          </View>

          {/* Upload Area */}
          <View style={styles.section}>
            <View style={[
              styles.uploadArea,
              isDragOver && styles.uploadAreaActive,
              isUploading && styles.uploadAreaUploading
            ]}>
              <View style={styles.uploadIcon}>
                <Ionicons 
                  name={isUploading ? "cloud-upload" : "cloud-upload-outline"} 
                  size={48} 
                  color={isUploading ? AppTheme.colors.primary : AppTheme.colors.textSecondary} 
                />
              </View>
              
              <Text style={styles.uploadTitle}>
                {isUploading ? 'Uploading...' : 'Upload Your Books'}
              </Text>
              
              <Text style={styles.uploadDescription}>
                {isUploading 
                  ? 'Please wait while we process your file'
                  : 'Choose PDF, EPUB, MOBI, or TXT files from your device'
                }
              </Text>

              {isUploading ? (
                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{uploadProgress}% Complete</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={handleFileUpload}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                  <Text style={styles.uploadButtonText}>Choose Files</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <Ionicons name="camera-outline" size={24} color={AppTheme.colors.primary} />
                </View>
                <Text style={styles.actionTitle}>Scan Document</Text>
                <Text style={styles.actionDescription}>Use camera to scan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <Ionicons name="link-outline" size={24} color={AppTheme.colors.success} />
                </View>
                <Text style={styles.actionTitle}>From URL</Text>
                <Text style={styles.actionDescription}>Import from link</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Supported Formats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Supported Formats</Text>
            <View style={styles.formatsContainer}>
              {supportedFormats.map((format, index) => (
                <View key={index} style={styles.formatCard}>
                  <View style={[styles.formatIcon, { backgroundColor: `${format.color}20` }]}>
                    <Ionicons name={format.icon as any} size={24} color={format.color} />
                  </View>
                  <View style={styles.formatInfo}>
                    <Text style={styles.formatName}>{format.name}</Text>
                    <Text style={styles.formatDescription}>{format.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Uploads */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Uploads</Text>
            {recentUploads.length > 0 ? (
              <View style={styles.uploadsContainer}>
                {recentUploads.map((upload) => (
                  <View key={upload.id} style={styles.uploadItem}>
                    <View style={styles.uploadItemLeft}>
                      <View style={[styles.uploadItemIcon, { backgroundColor: `${getStatusColor(upload.status)}20` }]}>
                        <Ionicons 
                          name={getStatusIcon(upload.status) as any} 
                          size={20} 
                          color={getStatusColor(upload.status)} 
                        />
                      </View>
                      <View style={styles.uploadItemInfo}>
                        <Text style={styles.uploadItemName}>{upload.name}</Text>
                        <Text style={styles.uploadItemDetails}>{upload.size} • {upload.date}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.uploadItemAction}>
                      <Ionicons name="ellipsis-horizontal" size={20} color={AppTheme.colors.textTertiary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="library-outline" size={48} color={AppTheme.colors.textTertiary} />
                </View>
                <Text style={styles.emptyTitle}>No uploads yet</Text>
                <Text style={styles.emptyDescription}>
                  Your uploaded books will appear here
                </Text>
              </View>
            )}
          </View>

          {/* Tips Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips</Text>
            <View style={styles.tipsContainer}>
              <View style={styles.tipItem}>
                <Ionicons name="information-circle-outline" size={20} color={AppTheme.colors.primary} />
                <Text style={styles.tipText}>Maximum file size is 50MB per book</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="shield-checkmark-outline" size={20} color={AppTheme.colors.success} />
                <Text style={styles.tipText}>Your files are encrypted and secure</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="sync-outline" size={20} color={AppTheme.colors.warning} />
                <Text style={styles.tipText}>Books sync across all your devices</Text>
              </View>
            </View>
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
    paddingVertical: AppTheme.spacing.md,
  },
  
  headerTitle: {
    ...AppTheme.typography.largeTitle,
    color: AppTheme.colors.textPrimary,
    marginBottom: 4,
  },
  
  headerSubtitle: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textSecondary,
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

  // Upload Area
  uploadArea: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    borderWidth: 2,
    borderColor: AppTheme.colors.border,
    borderStyle: 'dashed',
    padding: AppTheme.spacing.xl,
    alignItems: 'center',
  },
  
  uploadAreaActive: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.surfaceLight,
  },
  
  uploadAreaUploading: {
    borderColor: AppTheme.colors.primary,
    borderStyle: 'solid',
  },
  
  uploadIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppTheme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  
  uploadTitle: {
    ...AppTheme.typography.title,
    color: AppTheme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  
  uploadDescription: {
    ...AppTheme.typography.subhead,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.lg,
    lineHeight: 20,
  },
  
  uploadButton: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: AppTheme.borderRadius.md,
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  uploadButtonText: {
    ...AppTheme.typography.callout,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: AppTheme.spacing.sm,
  },

  // Progress
  progressSection: {
    width: '100%',
    alignItems: 'center',
  },
  
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: AppTheme.colors.surfaceLight,
    borderRadius: 4,
    marginBottom: AppTheme.spacing.sm,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: AppTheme.colors.primary,
  },
  
  progressText: {
    ...AppTheme.typography.footnote,
    color: AppTheme.colors.textSecondary,
    fontWeight: '500',
  },

  // Quick Actions
  actionsContainer: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppTheme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  
  actionTitle: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  actionDescription: {
    ...AppTheme.typography.footnote,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
  },

  // Formats
  formatsContainer: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  
  formatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  
  formatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  
  formatInfo: {
    flex: 1,
  },
  
  formatName: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
  },
  
  formatDescription: {
    ...AppTheme.typography.footnote,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },

  // Recent Uploads
  uploadsContainer: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  
  uploadItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  
  uploadItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  uploadItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  
  uploadItemInfo: {
    flex: 1,
  },
  
  uploadItemName: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '500',
  },
  
  uploadItemDetails: {
    ...AppTheme.typography.footnote,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  
  uploadItemAction: {
    padding: AppTheme.spacing.sm,
  },

  // Empty State
  emptyState: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.xl,
    alignItems: 'center',
  },
  
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppTheme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  
  emptyTitle: {
    ...AppTheme.typography.headline,
    color: AppTheme.colors.textPrimary,
    marginBottom: AppTheme.spacing.sm,
  },
  
  emptyDescription: {
    ...AppTheme.typography.subhead,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
  },

  // Tips
  tipsContainer: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
  },
  
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  
  tipText: {
    ...AppTheme.typography.subhead,
    color: AppTheme.colors.textSecondary,
    marginLeft: AppTheme.spacing.md,
    flex: 1,
  },
  
  bottomSpacing: {
    height: 80,
  },
});