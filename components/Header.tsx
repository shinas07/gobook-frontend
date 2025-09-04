// components/Header.tsx - Attractive Professional Header
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

interface HeaderProps {
  showNotification?: boolean;
  onNotificationPress?: () => void;
}

export default function Header({ 
  showNotification = true, 
  onNotificationPress 
}: HeaderProps) {
  
  return (
    <View style={styles.header}>
      {/* App Branding */}
      <View style={styles.brandContainer}>
        <LinearGradient
          colors={[AppTheme.colors.primary, '#4F46E5']}
          style={styles.logoGradient}
        >
          <Ionicons name="library" size={20} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.brandText}>
          <Text style={styles.appName}>GoBooks</Text>
          <Text style={styles.tagline}>Smart Reading</Text>
        </View>
      </View>

      {/* Right Actions */}
      <View style={styles.actionsContainer}>
        {/* Search Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons 
            name="search-outline" 
            size={20} 
            color={AppTheme.colors.textSecondary} 
          />
        </TouchableOpacity>
        
        {/* Notification Button */}
        {showNotification && (
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={onNotificationPress}
          >
            <Ionicons 
              name="notifications-outline" 
              size={20} 
              color={AppTheme.colors.textSecondary} 
            />
            {/* Notification Badge */}
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    paddingTop: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.md,
  },
  
  // Brand Section
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  logoGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
    shadowColor: AppTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  brandText: {
    justifyContent: 'center',
  },
  
  appName: {
    ...AppTheme.typography.title,
    color: AppTheme.colors.textPrimary,
    fontWeight: '700',
    marginBottom: 2,
  },
  
  tagline: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.textTertiary,
    fontWeight: '500',
  },
  
  // Actions Section
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.sm,
  },
  
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: AppTheme.colors.danger,
    borderRadius: 8,
    minWidth: 16,
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
});