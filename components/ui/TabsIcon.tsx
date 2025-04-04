import { View, Text } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}

const TabsIcon = ({ name, size, color }: TabIconProps) => {
  return <Ionicons name={name} size={size} color={color} />;
};

export default TabsIcon;
