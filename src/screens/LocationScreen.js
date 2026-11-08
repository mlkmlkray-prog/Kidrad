import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, radius, shadow } from "../theme";
import { t } from "../i18n/translations";

const SAFE_ZONES = [
  { id:"1", name:"home_zone", emoji:"🏠", lat:33.5731, lng:-7.5898, radius:200 },
  { id:"2", name:"school_zone", emoji:"🏫", lat:33.5831, lng:-7.5798, radius:150 },
];

const HISTORY = [
  { time:"08:30", place:"المنزل 🏠" },
  { time:"09:00", place:"المدرسة 🏫" },
  { time:"14:00", place:"الحديقة 🌳" },
  { time:"16:30", place:"المنزل 🏠" },
];

export default function LocationScreen({ route }) {
  const [lang, setLang] = useState("ar");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("map");
  const child = route?.params?.child;
  const isAr = lang === "ar";

  useEffect(() => {
    AsyncStorage.getItem("lang").then(v => v && setLang(v));
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("⚠️", "يلزم إذن الموقع");
      setLoading(false);
      return;
    }
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocation(loc.coords);
    setLoading(false);
  };

  const region = location
    ? { latitude: location.latitude, longitude: location.longitude, latitudeDelta:0.01, longitudeDelta:0.01 }
    : { latitude: 33.5731, longitude: -7.5898, latitudeDelta:0.05, longitudeDelta:0.05 };

  const TABS = [
    { key:"map", label: t(lang,"currentLocation") },
    { key:"history", label: t(lang,"locationHistory") },
    { key:"zones", label: t(lang,"safeZones") },
  ];

  return (
    <View style={styles.container}>
      {child && (
        <View style={[styles.childHeader, isAr && styles.rtl]}>
          <Text style={styles.childAvatar}>{child.avatar}</Text>
          <View style={{ marginHorizontal: spacing.sm }}>
            <Text style={styles.childName}>{child.name}</Text>
            <Text style={styles.childLocation}>📍 {child.location}</Text>
          </View>
          <View style={[styles.onlinePill,
            {backgroundColor: child.online ? colors.secondaryLight : colors.border}]}>
            <Text style={[styles.onlineText,
              {color: child.online ? colors.secondary : colors.textMuted}]}>
              {t(lang, child.online ? "online" : "offline")}
            </Text>
          </View>
        </View>
      )}

      <View style={[styles.tabs, isAr && styles.rtl]}>
        {TABS.map(tabItem => (
          <TouchableOpacity key={tabItem.key}
            style={[styles.tab, tab === tabItem.key && styles.tabActive]}
            onPress={() => setTab(tabItem.key)}>
            <Text style={[styles.tabText, tab === tabItem.key && styles.tabTextActive]}>
              {tabItem.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === "map" && (
        <View style={styles.mapContainer}>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>{t(lang,"updateLocation")}...</Text>
            </View>
          ) : (
            <MapView style={styles.map} region={region} showsUserLocation>
              {location && (
                <Marker coordinate={{latitude: location.latitude, longitude: location.longitude}}
                  title={child?.name || "الطفل"}>
                  <View style={styles.markerChild}>
                    <Text style={{fontSize:28}}>{child?.avatar || "👦"}</Text>
                  </View>
                </Marker>
              )}
              {SAFE_ZONES.map(zone => (
                <React.Fragment key={zone.id}>
                  <Circle center={{latitude:zone.lat, longitude:zone.lng}}
                    radius={zone.radius} fillColor="rgba(26,115,232,0.12)"
                    strokeColor={colors.primary} strokeWidth={2} />
                  <Marker coordinate={{latitude:zone.lat, longitude:zone.lng}}>
                    <Text style={{fontSize:24}}>{zone.emoji}</Text>
                  </Marker>
                </React.Fragment>
              ))}
            </MapView>
          )}
          <TouchableOpacity style={[styles.refreshBtn, shadow.md]} onPress={fetchLocation}>
            <Text style={styles.refreshBtnText}>🔄 {t(lang,"updateLocation")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {tab === "history" && (
        <ScrollView style={styles.listContainer}>
          {HISTORY.map((item, i) => (
            <View key={i} style={[styles.historyItem, isAr && styles.rtl]}>
              <View style={styles.timelineDot} />
              <View style={{ marginHorizontal: spacing.md }}>
                <Text style={styles.historyTime}>{item.time}</Text>
                <Text style={styles.historyPlace}>{item.place}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {tab === "zones" && (
        <ScrollView style={styles.listContainer}>
          {SAFE_ZONES.map(zone => (
            <View key={zone.id} style={[styles.zoneCard, shadow.sm, isAr && styles.rtl]}>
              <Text style={styles.zoneEmoji}>{zone.emoji}</Text>
              <View style={{flex:1, marginHorizontal: spacing.md}}>
                <Text style={styles.zoneName}>{t(lang, zone.name)}</Text>
                <Text style={styles.zoneRadius}>نطاق {zone.radius}م</Text>
              </View>
              <View style={styles.activeZonePill}>
                <Text style={styles.activeZoneText}>✓ نشط</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addZoneBtn}>
            <Text style={styles.addZoneBtnText}>+ {t(lang,"addSafeZone")}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.background },
  rtl: { flexDirection:"row-reverse" },
  childHeader: { flexDirection:"row", alignItems:"center",
    backgroundColor: colors.white, padding: spacing.md,
    borderBottomWidth:1, borderBottomColor: colors.border },
  childAvatar: { fontSize:32 },
  childName: { fontSize:16, fontWeight:"700", color: colors.textPrimary },
  childLocation: { fontSize:13, color: colors.textSecondary },
  onlinePill: { paddingHorizontal:10, paddingVertical:4,
    borderRadius: radius.full, marginLeft:"auto" },
  onlineText: { fontSize:12, fontWeight:"600" },
  tabs: { flexDirection:"row", backgroundColor: colors.white,
    borderBottomWidth:1, borderBottomColor: colors.border },
  tab: { flex:1, paddingVertical: spacing.md, alignItems:"center" },
  tabActive: { borderBottomWidth:2, borderBottomColor: colors.primary },
  tabText: { fontSize:12, color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight:"700" },
  mapContainer: { flex:1 },
  map: { flex:1 },
  centered: { flex:1, alignItems:"center", justifyContent:"center" },
  loadingText: { color: colors.textSecondary, marginTop: spacing.md },
  markerChild: { backgroundColor: colors.white, borderRadius: radius.full, padding:4, ...shadow.sm },
  refreshBtn: { position:"absolute", bottom: spacing.xl, alignSelf:"center",
    backgroundColor: colors.primary, paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md, borderRadius: radius.full },
  refreshBtnText: { color: colors.white, fontWeight:"700" },
  listContainer: { flex:1, padding: spacing.md },
  historyItem: { flexDirection:"row", alignItems:"flex-start", paddingVertical: spacing.sm },
  timelineDot: { width:12, height:12, borderRadius:6,
    backgroundColor: colors.primary, marginTop:4 },
  historyTime: { fontSize:13, color: colors.textSecondary },
  historyPlace: { fontSize:15, fontWeight:"600", color: colors.textPrimary },
  zoneCard: { flexDirection:"row", alignItems:"center",
    backgroundColor: colors.white, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm },
  zoneEmoji: { fontSize:32 },
  zoneName: { fontSize:15, fontWeight:"700", color: colors.textPrimary },
  zoneRadius: { fontSize:12, color: colors.textSecondary },
  activeZonePill: { backgroundColor: colors.secondaryLight,
    paddingHorizontal:10, paddingVertical:4, borderRadius: radius.full },
  activeZoneText: { color: colors.secondary, fontSize:12, fontWeight:"700" },
  addZoneBtn: { backgroundColor: colors.primaryLight,
    padding: spacing.md, borderRadius: radius.md,
    alignItems:"center", marginTop: spacing.md },
  addZoneBtnText: { color: colors.primary, fontWeight:"700" },
});
