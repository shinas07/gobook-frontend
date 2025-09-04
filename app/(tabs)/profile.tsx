// app/(tabs)/profile.tsx - Professional & Clean Design
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Clean Design System - Professional & Structured
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

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    booksRead: 24,
    readingStreak: 7,
    totalReadingTime: '48h 32m',
  });

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => console.log('Signing out...'),
        },
      ]
    );
  };

  const stats = [
    { label: 'Books Read', value: user.booksRead.toString(), icon: 'book-outline' },
    { label: 'Day Streak', value: user.readingStreak.toString(), icon: 'flame-outline' },
    { label: 'Reading Time', value: user.totalReadingTime, icon: 'time-outline' },
  ];

  const menuSections = [
    {
      title: 'Preferences',
      items: [
        { title: 'Reading Settings', icon: 'settings-outline', description: 'Font size, themes, display' },
        { title: 'Notifications', icon: 'notifications-outline', description: 'Reading reminders' },
        { title: 'Downloads', icon: 'download-outline', description: 'Offline content' },
      ]
    },
    {
      title: 'Account',
      items: [
        { title: 'Privacy & Security', icon: 'shield-checkmark-outline', description: 'Account protection' },
        { title: 'Subscription', icon: 'card-outline', description: 'Premium features' },
        { title: 'Storage', icon: 'server-outline', description: 'Library sync' },
      ]
    },
    {
      title: 'Support',
      items: [
        { title: 'Help Center', icon: 'help-circle-outline', description: 'FAQ and guides' },
        { title: 'Contact Support', icon: 'mail-outline', description: 'Get help' },
        { title: 'About GoBooks', icon: 'information-circle-outline', description: 'App information' },
      ]
    }
  ];

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
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={22} color={AppTheme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* User Section */}
          <View style={styles.userSection}>
            <View style={styles.userCard}>
              <View style={styles.avatarContainer}>
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={14} color={AppTheme.colors.warning} />
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reading Statistics</Text>
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons name={stat.icon as any} size={24} color={AppTheme.colors.primary} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Achievement */}
          <View style={styles.section}>
            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons name="trophy" size={24} color={AppTheme.colors.warning} />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Reading Champion</Text>
                <Text style={styles.achievementDescription}>You've read 20+ books this year</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={AppTheme.colors.textTertiary} />
            </View>
          </View>

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.menuCard}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity 
                    key={itemIndex} 
                    style={[
                      styles.menuItem,
                      itemIndex < section.items.length - 1 && styles.menuItemBorder
                    ]}
                  >
                    <View style={styles.menuLeft}>
                      <View style={styles.menuIcon}>
                        <Ionicons name={item.icon as any} size={22} color={AppTheme.colors.textSecondary} />
                      </View>
                      <View style={styles.menuText}>
                        <Text style={styles.menuTitle}>{item.title}</Text>
                        <Text style={styles.menuDescription}>{item.description}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={AppTheme.colors.textTertiary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Sign Out */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={AppTheme.colors.danger} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>GoBooks v1.0.0</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
  },
  
  headerTitle: {
    ...AppTheme.typography.largeTitle,
    color: AppTheme.colors.textPrimary,
  },
  
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // User Section
  userSection: {
    paddingHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.xl,
  },
  
  userCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  avatarContainer: {
    marginRight: AppTheme.spacing.lg,
  },
  
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  avatarText: {
    ...AppTheme.typography.title,
    color: '#FFFFFF',
  },
  
  userInfo: {
    flex: 1,
  },
  
  userName: {
    ...AppTheme.typography.title,
    color: AppTheme.colors.textPrimary,
    marginBottom: 4,
  },
  
  userEmail: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textSecondary,
    marginBottom: AppTheme.spacing.sm,
  },
  
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.surfaceLight,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  
  premiumText: {
    ...AppTheme.typography.caption,
    color: AppTheme.colors.warning,
    marginLeft: 4,
    fontWeight: '600',
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

  // Stats
  statsContainer: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppTheme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  
  statValue: {
    ...AppTheme.typography.headline,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
  },
  
  statLabel: {
    ...AppTheme.typography.footnote,
    color: AppTheme.colors.textSecondary,
    marginTop: 4,
  },

  // Achievement
  achievementCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppTheme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  
  achievementContent: {
    flex: 1,
  },
  
  achievementTitle: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
    fontWeight: '600',
  },
  
  achievementDescription: {
    ...AppTheme.typography.footnote,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },

  // Menu
  menuCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
  },
  
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  menuIcon: {
    width: 32,
    justifyContent: 'center',
    marginRight: AppTheme.spacing.md,
  },
  
  menuText: {
    flex: 1,
  },
  
  menuTitle: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.textPrimary,
  },
  
  menuDescription: {
    ...AppTheme.typography.footnote,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },

  // Sign Out
  signOutButton: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  signOutText: {
    ...AppTheme.typography.callout,
    color: AppTheme.colors.danger,
    marginLeft: AppTheme.spacing.sm,
    fontWeight: '600',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
  },
  
  footerText: {
    ...AppTheme.typography.footnote,
    color: AppTheme.colors.textTertiary,
  },
  
  bottomSpacing: {
    height: 80,
  },
});