import React from 'react';

import { Text, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

interface TheamedTextProps extends React.ComponentProps<typeof Text> {
  children: React.ReactNode;
  style?: object;
  size?: number;
  align?: 'left' | 'right' | 'center' | 'justify';
}
const TheamedText: React.FC<TheamedTextProps> = ({
  children,
  size = 16,
  align = 'left',
  style,
  ...rest
}) => {
  const theme = Colors[useColorScheme() ?? 'light'];
  return (
    <Text style={[{ color: theme.text, textAlign: align, fontSize: size }, style]} {...rest}>
      {children}
    </Text>
  );
};

export default TheamedText;
