// components/HapticTab.tsx
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Add haptic feedback for iOS if available
        if (process.env.EXPO_OS === 'ios') {
          try {
            // Try to use haptics if available
            const Haptics = require('expo-haptics');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch (error) {
            // Haptics not available, continue without it
            console.log('Haptics not available');
          }
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}