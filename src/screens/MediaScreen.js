import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, radius, shadow } from "../theme";
import { t } from "../i18n/translations";

const { width } = Dimensions.get("window");
const IMG_SIZE = (width - spacing.md * 2 - spacing.sm * 2) / 3;

export default function MediaScreen() {
  const [lang, setLang] = useState("ar");
  const [photos, setPhotos] = useState([]);
  const [permission, setPermission] = useState(null);
  const [stats, setStats] = useState({ total: 0, lastDate: "-" });
  const isAr = lang === "ar";

  useEffect(() => {
    AsyncStorage.getItem("lang").then(v => v && setLang(v));
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setPermission(status);
    if (status === "granted") loadPhotos();
  };

  const loadPhotos = async () => {
    const album = await MediaLibrary.getAssetsAsync({
      mediaType: "photo", first: 30,
      sortBy: [MediaLibrary.SortBy.creationTime],
    });
    setPhotos(album.assets);
    if (album.assets.length > 0) {
      const last = new Date(album.assets[0].creationTime * 1000);
      setStats({ total: album.totalCount, lastDate: last.toLocaleDateString("ar-MA") });
    }
  };

  if (permission !== "granted") {
    return (
      <View style={styles.permContainer}>
        <Text style={styles.permIcon}>🖼</Text>
        <Text style={styles.permTitle}>{t(lang,"permissionRequired")}</Text>
        <Text style={styles.permDesc}>
          {lang === "ar"
            ? "لعرض صور الهاتف، يلزم منح إذن الوصول للمعرض"
            : "Pour voir les photos, accordez l'accès à la galerie"}
        </Text>
        <TouchableOpacity style={styles.grantBtn} onPress={checkPermission}>
          <Text style={styles.grantBtnText}>{t(lang,"grantPermission")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.statsRow, isAr && styles.rtl]}>
        {[
          { val: stats.total, lbl: t(lang,"totalPhotos") },
          { val: photos.length, lbl: t(lang,"recentPhotos") },
          { val: stats.lastDate, lbl: t(lang,"lastPhoto") },
        ].map((s, i) => (
          <View key={i} style={[styles.statCard, shadow.sm]}>
            <Text style={styles.statValue}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.lbl}</Text>
          </View>
        ))}
      </View>

      {photos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📷</Text>
          <Text style={styles.emptyText}>{t(lang,"noPhotos")}</Text>
        </View>
      ) : (
        <FlatList data={photos} keyExtractor={item => item.id} numColumns={3}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.photoItem}>
              <Image source={{ uri: item.uri }} style={styles.photo} />
            </TouchableOpacity>
          )} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.background },
  rtl: { flexDirection:"row-reverse" },
  statsRow: { flexDirection:"row", padding: spacing.md, gap: spacing.sm },
  statCard: { flex:1, backgroundColor: colors.white, borderRadius: radius.md,
    padding: spacing.md, alignItems:"center" },
  statValue: { fontSize:18, fontWeight:"700", color: colors.primary },
  statLabel: { fontSize:11, color: colors.textSecondary, marginTop:2, textAlign:"center" },
  grid: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  photoItem: { margin: spacing.xs / 2 },
  photo: { width: IMG_SIZE, height: IMG_SIZE, borderRadius: radius.sm },
  permContainer: { flex:1, alignItems:"center", justifyContent:"center",
    padding: spacing.xl, backgroundColor: colors.background },
  permIcon: { fontSize:60, marginBottom: spacing.md },
  permTitle: { fontSize:20, fontWeight:"700", color: colors.textPrimary, marginBottom: spacing.sm },
  permDesc: { fontSize:14, color: colors.textSecondary, textAlign:"center",
    marginBottom: spacing.lg, lineHeight:22 },
  grantBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md, borderRadius: radius.full },
  grantBtnText: { color: colors.white, fontWeight:"700", fontSize:15 },
  empty: { flex:1, alignItems:"center", justifyContent:"center" },
  emptyIcon: { fontSize:48, marginBottom: spacing.md },
  emptyText: { fontSize:16, color: colors.textSecondary },
});
