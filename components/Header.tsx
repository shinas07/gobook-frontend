// components/Header.tsx - Clean Dark Design
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

interface HeaderProps {
  userName?: string;
  notificationCount?: number;
}

export default function Header({ userName = "Reader", notificationCount = 3 }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.header}>
      {/* Left Section - App Name & Greeting */}
      <View style={styles.leftSection}>
        <View style={styles.appNameContainer}>
          <LinearGradient
            colors={[colors.secondary, colors.primary]}
            style={styles.appIconGradient}
          >
            <Ionicons name="book" size={18} color="#fff" />
          </LinearGradient>
          <Text style={styles.appName}>GoBooks</Text>
        </View>
        <Text style={styles.greeting}>
          {getGreeting()}, {userName}
        </Text>
      </View>

      {/* Right Section - Actions */}
      <View style={styles.rightSection}>
        {/* Search Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Notification Button */}
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : notificationCount.toString()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity style={styles.profileButton}>
          <LinearGradient
            colors={[colors.success, colors.primary]}
            style={styles.profileGradient}
          >
            <Text style={styles.profileInitial}>{userName.charAt(0).toUpperCase()}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0, // Remove padding since parent handles it
    paddingVertical: 12,
  },

  // Left Section
  leftSection: {
    flex: 1,
  },
  appNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 12,
  },
  appIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.3,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 44, // Align with app name (32 + 12 gap)
  },

  // Right Section
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Action Buttons
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
  },
  profileGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  // Notification Badge
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
});