// app/(tabs)/_layout.tsx - Robust Dark Tab Layout
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { HapticTab } from '@/components/HapticTab';

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

// Custom Tab Label Component to ensure text renders in production
const TabLabel = ({ 
  focused, 
  title 
}: { 
  focused: boolean; 
  title: string; 
}) => (
  <Text 
    style={[
      styles.tabLabel,
      {
        color: focused ? colors.text : colors.textMuted,
        fontWeight: focused ? '800' : '600',
      }
    ]}
    numberOfLines={1}
  >
    {title}
  </Text>
);

// Enhanced Tab Icon Component
const TabIcon = ({ 
  name, 
  focusedName, 
  focused, 
  color,
  gradientColors 
}: {
  name: string;
  focusedName: string;
  focused: boolean;
  color: string;
  gradientColors: string[];
}) => (
  <View style={styles.iconContainer}>
    {focused && (
      <View style={styles.activeBackground}>
        <LinearGradient
          colors={gradientColors}
          style={styles.activeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>
    )}
    <Ionicons
      name={focused ? focusedName : name}
      size={focused ? 26 : 24}
      color={focused ? colors.text : color}
      style={styles.tabIcon}
    />
    {focused && <View style={styles.activeDot} />}
  </View>
);

// Tab Background Component
const TabBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <BlurView
      intensity={Platform.OS === 'ios' ? 100 : 80}
      tint="dark"
      style={StyleSheet.absoluteFill}
    />
    
    <LinearGradient
      colors={[
        'rgba(26, 26, 26, 0.98)', 
        'rgba(42, 42, 42, 0.95)', 
        'rgba(26, 26, 26, 0.98)'
      ]}
      style={StyleSheet.absoluteFill}
    />
    
    <View style={styles.topBorder} />
    
    <LinearGradient
      colors={['rgba(0, 0, 0, 0.4)', 'transparent']}
      style={styles.innerShadow}
    />
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBackground,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 20 : 16,
          left: 16,
          right: 16,
          height: Platform.OS === 'ios' ? 88 : 76,
          borderRadius: 24,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.border,
          elevation: 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          paddingHorizontal: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOpacity: 0.5,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 10 },
            },
            android: {
              elevation: 20,
              shadowColor: '#000',
            },
          }),
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          paddingHorizontal: 4,
          borderRadius: 16,
          marginHorizontal: 2,
          minHeight: 60,
        },
        tabBarLabelStyle: {
          fontSize: 0, // Hide default labels since we use custom ones
          height: 0,
          margin: 0,
          padding: 0,
        },
        tabBarIconStyle: {
          marginBottom: 0,
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} title="Home" />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="home-outline"
              focusedName="home"
              focused={focused}
              color={color}
              gradientColors={[colors.primary, colors.secondary]}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Library',
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} title="Library" />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="library-outline"
              focusedName="library"
              focused={focused}
              color={color}
              gradientColors={[colors.secondary, colors.primary]}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="ai"
        options={{
          title: 'A.I',
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} title="A.I" />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="sparkles-outline"
              focusedName="sparkles"
              focused={focused}
              color={color}
              gradientColors={[colors.warning, colors.secondary]}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} title="Upload" />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="cloud-upload-outline"
              focusedName="cloud-upload"
              focused={focused}
              color={color}
              gradientColors={[colors.success, colors.primary]}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} title="Profile" />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="person-outline"
              focusedName="person"
              focused={focused}
              color={color}
              gradientColors={[colors.danger, colors.secondary]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Background Elements
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary,
    opacity: 0.6,
  },
  
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 12,
  },

  // Icon Container
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 50,
    height: 50,
    marginBottom: 4,
  },

  // Active Background
  activeBackground: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 18,
    overflow: 'hidden',
  },
  
  activeGradient: {
    flex: 1,
    borderRadius: 18,
    opacity: 0.9,
  },

  // Tab Icon
  tabIcon: {
    zIndex: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Active Dot
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.text,
    shadowColor: colors.text,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 3,
  },

  // Custom Tab Label
  tabLabel: {
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.3,
    marginTop: 2,
    minHeight: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    // Ensure text renders in production
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});