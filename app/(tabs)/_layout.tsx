import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentStrong,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: 'rgba(255, 251, 244, 0.98)',
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 92,
          paddingTop: 10,
          paddingBottom: 14,
          shadowColor: '#9fb2a2',
          shadowOpacity: 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -6 },
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '700',
          marginTop: 1,
          letterSpacing: 0.1,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          paddingHorizontal: 0,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="compass-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="converter"
        options={{
          title: 'Currency',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="cash-multiple" />
          ),
        }}
      />
      <Tabs.Screen
        name="translator"
        options={{
          title: 'Translate',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="translate" />
          ),
        }}
      />
      <Tabs.Screen
        name="phrases"
        options={{
          title: 'Phrases',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="message-text-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="map-marker-path" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Prefs',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="tune-variant" />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  color,
  focused,
  name,
}: {
  color: string;
  focused: boolean;
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}) {
  return (
    <View style={[styles.iconWrap, focused ? styles.iconWrapActive : null]}>
      <MaterialCommunityIcons color={focused ? colors.accent : color} name={name} size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 34,
    height: 30,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(43, 182, 115, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(43, 182, 115, 0.22)',
  },
});
