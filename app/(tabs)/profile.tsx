// app/(tabs)/profile.tsx - Clean Dark Design
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
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    booksRead: 24,
    readingStreak: 7,
    totalReadingTime: '48h 32m',
    level: 5,
    points: 2840,
    nextLevelPoints: 3000,
  });

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            console.log('Logging out...');
          },
        },
      ]
    );
  };

  const stats = [
    { 
      label: 'Books Read', 
      value: user.booksRead, 
      icon: 'library',
      color: colors.primary,
    },
    { 
      label: 'Day Streak', 
      value: user.readingStreak, 
      icon: 'flame',
      color: colors.warning,
    },
    { 
      label: 'Hours Read', 
      value: user.totalReadingTime, 
      icon: 'time',
      color: colors.success,
    },
  ];

  const menuItems = [
    { 
      title: 'Reading Preferences', 
      subtitle: 'Themes, fonts & display',
      icon: 'settings', 
      color: colors.primary,
    },
    { 
      title: 'My Library', 
      subtitle: 'Manage your books',
      icon: 'library', 
      color: colors.secondary,
    },
    { 
      title: 'Download Settings', 
      subtitle: 'Offline reading',
      icon: 'download', 
      color: colors.success,
    },
    { 
      title: 'Reading Goals', 
      subtitle: 'Set your targets',
      icon: 'trophy', 
      color: colors.warning,
    },
    { 
      title: 'Notifications', 
      subtitle: 'Reading reminders',
      icon: 'notifications', 
      color: colors.primary,
    },
    { 
      title: 'Privacy & Security', 
      subtitle: 'Account protection',
      icon: 'shield-checkmark', 
      color: colors.danger,
    },
    { 
      title: 'Help & Support', 
      subtitle: 'Get assistance',
      icon: 'help-circle', 
      color: colors.textSecondary,
    },
  ];

  const levelProgress = (user.points / user.nextLevelPoints) * 100;

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
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Profile</Text>
              <Text style={styles.headerSubtitle}>Your reading journey</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                  <LinearGradient
                    colors={[colors.primary, colors.secondary]}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                  </LinearGradient>
                )}
                
                {/* Level Badge */}
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>LV {user.level}</Text>
                </View>
              </View>
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                
                {/* XP Progress */}
                <View style={styles.xpContainer}>
                  <View style={styles.xpBar}>
                    <View style={[styles.xpProgress, { width: `${levelProgress}%` }]} />
                  </View>
                  <Text style={styles.xpText}>
                    {user.points}/{user.nextLevelPoints} XP
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Reading Stats</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                    <Ionicons name={stat.icon as any} size={28} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Achievement Card */}
          <View style={styles.achievementCard}>
            <LinearGradient
              colors={[`${colors.success}20`, `${colors.success}10`]}
              style={styles.achievementGradient}
            >
              <View style={styles.achievementContent}>
                <View style={styles.achievementIcon}>
                  <Ionicons name="star" size={32} color={colors.success} />
                </View>
                <View style={styles.achievementText}>
                  <Text style={styles.achievementTitle}>Reading Champion!</Text>
                  <Text style={styles.achievementSubtitle}>
                    Keep up your {user.readingStreak}-day streak
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Menu Section */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon as any} size={22} color={item.color} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={[colors.danger, '#dc2626']}
              style={styles.logoutGradient}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>GoBooks v2.0.0</Text>
            <Text style={styles.footerSubtext}>Made with love for readers</Text>
          </View>

        </ScrollView>
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
  
  scrollContent: {
    paddingBottom: 32,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Profile Card
  profileCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  
  userInfo: {
    flex: 1,
  },
  
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  
  xpContainer: {
    marginTop: 8,
  },
  
  xpBar: {
    height: 6,
    backgroundColor: colors.card,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  
  xpProgress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  
  xpText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // Stats
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Achievement
  achievementCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  achievementGradient: {
    padding: 20,
  },
  
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.success}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  achievementText: {
    flex: 1,
  },
  
  achievementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  
  achievementSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Menu
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  menuTextContainer: {
    flex: 1,
  },
  
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  
  menuSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  // Logout
  logoutButton: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  
  footerText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  footerSubtext: {
    fontSize: 12,
    color: colors.textMuted,
    opacity: 0.7,
  },
});