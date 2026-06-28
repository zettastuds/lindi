/**
 * Root layout: loads fonts (BRAND §5), holds the splash until ready, sets the
 * cream header theme, and mounts the expo-router Stack.
 */
import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    Nunito_800ExtraBold,
  });

  // Safety net: hide splash after 3 s even if fonts stall (asset load failure).
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      return;
    }
    const t = setTimeout(() => SplashScreen.hideAsync(), 3000);
    return () => clearTimeout(t);
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FAF1E0' },
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: 'PlusJakartaSans_700Bold', color: '#14150D' },
          headerTintColor: '#14150D',
          contentStyle: { backgroundColor: '#FAF1E0' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="discover" options={{ title: 'Jelajah' }} />
        <Stack.Screen name="circle/[id]" options={{ title: '' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
