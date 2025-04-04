import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function Index() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.replace('/(tabs)/search');
      return () => clearTimeout(timeoutId);
    }, 1000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
