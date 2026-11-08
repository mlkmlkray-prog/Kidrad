import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../theme";
import { t } from "../i18n/translations";
import HomeScreen from "../screens/HomeScreen";
import LocationScreen from "../screens/LocationScreen";
import MediaScreen from "../screens/MediaScreen";
import AppsScreen from "../screens/AppsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const ICONS = { Home:"🏠", Location:"📍", Media:"🖼", Apps:"📲", Settings:"⚙️" };

export default function AppNavigator() {
  const [lang, setLang] = useState("ar");
  useEffect(() => { AsyncStorage.getItem("lang").then(v => v && setLang(v)); }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 24 : 20 }}>{ICONS[route.name]}</Text>
          ),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: { height:60, paddingBottom:8, paddingTop:4, borderTopColor: colors.border },
          tabBarLabelStyle: { fontSize:11, fontWeight:"600" },
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight:"800", fontSize:18 },
          headerTitleAlign: "center",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen}
          options={{ title: t(lang,"appName"), tabBarLabel: t(lang,"home") }} />
        <Tab.Screen name="Location" component={LocationScreen}
          options={{ title: t(lang,"location"), tabBarLabel: t(lang,"location") }} />
        <Tab.Screen name="Media" component={MediaScreen}
          options={{ title: t(lang,"media"), tabBarLabel: t(lang,"media") }} />
        <Tab.Screen name="Apps" component={AppsScreen}
          options={{ title: t(lang,"apps"), tabBarLabel: t(lang,"apps") }} />
        <Tab.Screen name="Settings" component={SettingsScreen}
          options={{ title: t(lang,"settings"), tabBarLabel: t(lang,"settings") }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
