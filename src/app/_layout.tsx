import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { colors } from '@/design-system/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

const scioraTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.spaceDark,
    card: colors.spaceSurface,
    text: colors.textPrimary,
    border: colors.glassBorder,
    primary: colors.cyan,
  },
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider value={scioraTheme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.spaceDark },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="units/[unitId]" options={{ headerShown: false }} />
          <Stack.Screen name="lessons/[lessonId]" options={{ headerShown: false }} />
          <Stack.Screen name="simulations/[simulationId]" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.spaceDark,
  },
});
