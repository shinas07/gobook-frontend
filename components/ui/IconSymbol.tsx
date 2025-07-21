// components/ui/IconSymbol.tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: string;
  size?: number;
  color: string | undefined;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
} & SymbolViewProps) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={name as any}
      style={style}
    />
  );
}