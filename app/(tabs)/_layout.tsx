// app/(tabs)/_layout.tsx - Professional Dark Tab Layout
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

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

const ProfessionalTabBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    {/* Blur Effect */}
    <BlurView
      intensity={80}
      tint="dark"
      style={StyleSheet.absoluteFill}
    />
    
    {/* Dark Gradient Overlay */}
    <LinearGradient
      colors={[
        'rgba(26, 26, 26, 0.95)', 
        'rgba(42, 42, 42, 0.9)', 
        'rgba(26, 26, 26, 0.95)'
      ]}
      style={StyleSheet.absoluteFill}
    />
    
    {/* Top Accent Line */}
    <View style={styles.topAccentLine} />
    
    {/* Subtle Inner Shadow */}
    <LinearGradient
      colors={[
        'rgba(0, 0, 0, 0.3)',
        'rgba(0, 0, 0, 0)',
      ]}
      style={styles.innerShadow}
    />
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: ProfessionalTabBackground,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 16,
          right: 16,
          height: 76,
          borderRadius: 20,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 8,
          paddingTop: 8,
          paddingHorizontal: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOpacity: 0.4,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
            },
            android: {
              elevation: 16,
            },
          }),
        },
        tabBarItemStyle: {
          paddingVertical: 6,
          borderRadius: 14,
          marginHorizontal: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 4,
          letterSpacing: 0.2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <View style={styles.activeBackground}>
                  <LinearGradient
                    colors={[colors.primary, colors.secondary]}
                    style={styles.activeGradient}
                  />
                </View>
              )}
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={focused ? 26 : 24}
                color={focused ? colors.text : color}
                style={styles.tabIcon}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <View style={styles.activeBackground}>
                  <LinearGradient
                    colors={[colors.secondary, colors.primary]}
                    style={styles.activeGradient}
                  />
                </View>
              )}
              <Ionicons
                name={focused ? 'library' : 'library-outline'}
                size={focused ? 26 : 24}
                color={focused ? colors.text : color}
                style={styles.tabIcon}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="ai"
        options={{
          title: 'A.I',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <View style={styles.activeBackground}>
                  <LinearGradient
                    colors={[colors.warning, colors.secondary]}
                    style={styles.activeGradient}
                  />
                </View>
              )}
              <Ionicons
                name={focused ? 'sparkles' : 'sparkles-outline'}
                size={focused ? 26 : 24}
                color={focused ? colors.text : color}
                style={styles.tabIcon}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <View style={styles.activeBackground}>
                  <LinearGradient
                    colors={[colors.success, colors.primary]}
                    style={styles.activeGradient}
                  />
                </View>
              )}
              <Ionicons
                name={focused ? 'cloud-upload' : 'cloud-upload-outline'}
                size={focused ? 26 : 24}
                color={focused ? colors.text : color}
                style={styles.tabIcon}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <View style={styles.activeBackground}>
                  <LinearGradient
                    colors={[colors.danger, colors.secondary]}
                    style={styles.activeGradient}
                  />
                </View>
              )}
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={focused ? 26 : 24}
                color={focused ? colors.text : color}
                style={styles.tabIcon}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Background Elements
  topAccentLine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary,
    opacity: 0.8,
  },
  
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
  },

  // Icon Container
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 48,
    height: 48,
  },

  // Active Background
  activeBackground: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
  },
  
  activeGradient: {
    flex: 1,
    borderRadius: 16,
  },

  // Tab Icon
  tabIcon: {
    zIndex: 1,
  },

  // Active Dot
  activeDot: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text,
    shadowColor: colors.text,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});