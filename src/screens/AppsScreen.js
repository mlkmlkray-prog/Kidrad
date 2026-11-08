import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, radius, shadow } from "../theme";
import { t } from "../i18n/translations";

const DEMO_APPS = [
  { id:"1", name:"YouTube",     emoji:"▶️", category:"entertainment", usage:"2h 15m", blocked:false },
  { id:"2", name:"TikTok",      emoji:"🎵", category:"social",        usage:"1h 40m", blocked:false },
  { id:"3", name:"Roblox",      emoji:"🎮", category:"games",         usage:"1h 10m", blocked:false },
  { id:"4", name:"WhatsApp",    emoji:"💬", category:"social",        usage:"45m",    blocked:false },
  { id:"5", name:"Minecraft",   emoji:"⛏️", category:"games",         usage:"30m",    blocked:false },
  { id:"6", name:"Khan Academy",emoji:"📚", category:"education",     usage:"20m",    blocked:false },
  { id:"7", name:"Duolingo",    emoji:"🦉", category:"education",     usage:"15m",    blocked:false },
  { id:"8", name:"Netflix",     emoji:"🎬", category:"entertainment", usage:"10m",    blocked:true  },
];

const CAT_COLORS = {
  social: { bg:"#E3F2FD", text:"#1976D2" },
  games: { bg:"#F3E5F5", text:"#7B1FA2" },
  education: { bg:"#E8F5E9", text:"#388E3C" },
  entertainment: { bg:"#FFF3E0", text:"#F57C00" },
};

export default function AppsScreen() {
  const [lang, setLang] = useState("ar");
  const [apps, setApps] = useState(DEMO_APPS);
  const [filter, setFilter] = useState("all");
  const isAr = lang === "ar";

  useEffect(() => { AsyncStorage.getItem("lang").then(v => v && setLang(v)); }, []);

  const toggleBlock = id => setApps(apps.map(a => a.id === id ? {...a, blocked: !a.blocked} : a));

  const filtered = filter === "all" ? apps
    : filter === "blocked" ? apps.filter(a => a.blocked)
    : apps.filter(a => a.category === filter);

  const totalBlocked = apps.filter(a => a.blocked).length;

  const FILTERS = [
    { key:"all", label: lang==="ar"?"الكل":"Tout" },
    { key:"social", label: t(lang,"social") },
    { key:"games", label: t(lang,"games") },
    { key:"education", label: t(lang,"education") },
    { key:"entertainment", label: t(lang,"entertainment") },
    { key:"blocked", label: t(lang,"blocked") },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.summaryRow, isAr && styles.rtl]}>
        {[
          { val: apps.length, lbl: lang==="ar"?"إجمالي":"Total", bg: colors.primaryLight, color: colors.primary },
          { val: totalBlocked, lbl: t(lang,"blocked"), bg: colors.dangerLight, color: colors.danger },
          { val: apps.length-totalBlocked, lbl: t(lang,"allowed"), bg: colors.secondaryLight, color: colors.secondary },
        ].map((s,i) => (
          <View key={i} style={[styles.summaryCard, {backgroundColor: s.bg}]}>
            <Text style={[styles.summaryNum, {color: s.color}]}>{s.val}</Text>
            <Text style={styles.summaryLabel}>{s.lbl}</Text>
          </View>
        ))}
      </View>

      <FlatList data={FILTERS} horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters} keyExtractor={i => i.key}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.filterChip, filter===item.key && styles.filterChipActive]}
            onPress={() => setFilter(item.key)}>
            <Text style={[styles.filterText, filter===item.key && styles.filterTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )} />

      <FlatList data={filtered} keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const catStyle = CAT_COLORS[item.category] || CAT_COLORS.entertainment;
          return (
            <View style={[styles.appCard, shadow.sm, isAr && styles.rtl, item.blocked && styles.appCardBlocked]}>
              <View style={styles.appIcon}>
                <Text style={styles.appEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.appInfo}>
                <View style={[styles.appTopRow, isAr && styles.rtl]}>
                  <Text style={[styles.appName, item.blocked && styles.appNameBlocked]}>{item.name}</Text>
                  <View style={[styles.catBadge, {backgroundColor: catStyle.bg}]}>
                    <Text style={[styles.catText, {color: catStyle.text}]}>{t(lang,item.category)}</Text>
                  </View>
                </View>
                <Text style={styles.appUsage}>
                  {item.blocked ? "🚫 "+t(lang,"blocked") : "⏱ "+item.usage}
                </Text>
              </View>
              <Switch value={!item.blocked} onValueChange={() => toggleBlock(item.id)}
                trackColor={{false: colors.danger+"44", true: colors.secondary+"44"}}
                thumbColor={item.blocked ? colors.danger : colors.secondary} />
            </View>
          );
        }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.background },
  rtl: { flexDirection:"row-reverse" },
  summaryRow: { flexDirection:"row", padding: spacing.md, gap: spacing.sm },
  summaryCard: { flex:1, borderRadius: radius.md, padding: spacing.md, alignItems:"center" },
  summaryNum: { fontSize:24, fontWeight:"800" },
  summaryLabel: { fontSize:11, color: colors.textSecondary, marginTop:2, textAlign:"center" },
  filters: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: spacing.sm },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.full, backgroundColor: colors.white, borderWidth:1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize:13, color: colors.textSecondary },
  filterTextActive: { color: colors.white, fontWeight:"700" },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  appCard: { flexDirection:"row", alignItems:"center",
    backgroundColor: colors.white, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm },
  appCardBlocked: { opacity: 0.6 },
  appIcon: { width:48, height:48, borderRadius: radius.md,
    backgroundColor: colors.background, alignItems:"center", justifyContent:"center", marginHorizontal: spacing.sm },
  appEmoji: { fontSize:26 },
  appInfo: { flex:1 },
  appTopRow: { flexDirection:"row", alignItems:"center", gap: spacing.sm },
  appName: { fontSize:15, fontWeight:"700", color: colors.textPrimary },
  appNameBlocked: { textDecorationLine:"line-through", color: colors.textMuted },
  catBadge: { paddingHorizontal:8, paddingVertical:2, borderRadius: radius.full },
  catText: { fontSize:11, fontWeight:"600" },
  appUsage: { fontSize:12, color: colors.textSecondary, marginTop:3 },
});
