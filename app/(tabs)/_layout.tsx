import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.cardDark,
          borderTopColor: colors.border,
          height: 70,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabGlyph color={color} glyph="Home" />,
        }}
      />
      <Tabs.Screen
        name="converter"
        options={{
          title: 'Convert',
          tabBarIcon: ({ color }) => <TabGlyph color={color} glyph="FX" />,
        }}
      />
      <Tabs.Screen
        name="translator"
        options={{
          title: 'Translate',
          tabBarIcon: ({ color }) => <TabGlyph color={color} glyph="Talk" />,
        }}
      />
      <Tabs.Screen
        name="phrases"
        options={{
          title: 'Phrases',
          tabBarIcon: ({ color }) => <TabGlyph color={color} glyph="Say" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabGlyph color={color} glyph="Tune" />,
        }}
      />
    </Tabs>
  );
}

function TabGlyph({ color, glyph }: { color: string; glyph: string }) {
  return <Text style={[styles.glyph, { color }]}>{glyph}</Text>;
}

const styles = StyleSheet.create({
  glyph: {
    fontSize: 11,
    fontWeight: '800',
  },
});
