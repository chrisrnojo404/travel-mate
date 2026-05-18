import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: '#0b1a2a',
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 88,
          paddingTop: 10,
          paddingBottom: 14,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
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
          title: 'Money',
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
        name="settings"
        options={{
          title: 'Settings',
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
      <MaterialCommunityIcons color={focused ? colors.accent : color} name={name} size={22} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 42,
    height: 34,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(25, 194, 160, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(25, 194, 160, 0.28)',
  },
});
