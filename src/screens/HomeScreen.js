import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, radius, shadow } from "../theme";
import { t } from "../i18n/translations";

const DEMO_CHILDREN = [
  { id: "1", name: "أحمد / Ahmed", age: 10, online: true, battery: 72,
    screenTime: "3h 20m", location: "المنزل", avatar: "👦", alerts: 1 },
  { id: "2", name: "سارة / Sara", age: 8, online: false, battery: 45,
    screenTime: "1h 15m", location: "المدرسة", avatar: "👧", alerts: 0,
    lastSeen: "منذ ٢٠ دقيقة" },
];

export default function HomeScreen({ navigation }) {
  const [lang, setLang] = useState("ar");
  const [children] = useState(DEMO_CHILDREN);
  const isAr = lang === "ar";

  useEffect(() => { AsyncStorage.getItem("lang").then(v => v && setLang(v)); }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t(lang,"goodMorning") :
                   hour < 18 ? t(lang,"goodAfternoon") : t(lang,"goodEvening");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, isAr && styles.rtl]}>
        <View>
          <Text style={styles.greeting}>{greeting} 👋</Text>
          <Text style={styles.subtitle}>{t(lang,"myChildren")}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("Settings")}>
          <Text style={styles.addBtnText}>+ {t(lang,"addChild")}</Text>
        </TouchableOpacity>
      </View>

      {children.map(child => (
        <TouchableOpacity key={child.id} style={[styles.childCard, shadow.md]}
          onPress={() => navigation.navigate("Location", { child })} activeOpacity={0.85}>
          <View style={[styles.row, isAr && styles.rtl]}>
            <View style={[styles.row, isAr && styles.rtl, {flex:1}]}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarText}>{child.avatar}</Text>
                <View style={[styles.statusDot,
                  { backgroundColor: child.online ? colors.online : colors.offline }]} />
              </View>
              <View style={{ marginHorizontal: spacing.sm }}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childMeta}>
                  {child.online ? `📍 ${child.location}` : `🕐 ${child.lastSeen}`}
                </Text>
              </View>
            </View>
            {child.alerts > 0 && (
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>{child.alerts}</Text>
              </View>
            )}
            <Text style={[styles.statusText,
              {color: child.online ? colors.online : colors.offline}]}>
              {t(lang, child.online ? "online" : "offline")}
            </Text>
          </View>

          <View style={[styles.statsRow, isAr && styles.rtl]}>
            {[
              { icon:"🔋", val: child.battery+"%", lbl: t(lang,"battery") },
              { icon:"📱", val: child.screenTime, lbl: t(lang,"screenTime") },
              { icon:"🔔", val: child.alerts,     lbl: t(lang,"alerts") },
            ].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={styles.statDivider} />}
                <View style={styles.stat}>
                  <Text style={styles.statIcon}>{s.icon}</Text>
                  <Text style={styles.statValue}>{s.val}</Text>
                  <Text style={styles.statLabel}>{s.lbl}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          <View style={[styles.actionsRow, isAr && styles.rtl]}>
            {[
              { icon:"📍", lbl: t(lang,"location"), screen:"Location" },
              { icon:"🖼", lbl: t(lang,"media"),    screen:"Media" },
              { icon:"📲", lbl: t(lang,"apps"),     screen:"Apps" },
            ].map(a => (
              <TouchableOpacity key={a.screen} style={styles.actionBtn}
                onPress={() => navigation.navigate(a.screen, { child })}>
                <Text style={styles.actionIcon}>{a.icon}</Text>
                <Text style={styles.actionLabel}>{a.lbl}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  header: { flexDirection:"row", justifyContent:"space-between",
    alignItems:"center", marginBottom: spacing.lg },
  rtl: { flexDirection: "row-reverse" },
  greeting: { fontSize: 22, fontWeight: "700", color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  addBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, borderRadius: radius.full },
  addBtnText: { color: colors.primary, fontWeight: "600", fontSize: 13 },
  childCard: { backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.md },
  row: { flexDirection:"row", alignItems:"center" },
  avatarBox: { width:50, height:50, borderRadius:radius.full,
    backgroundColor: colors.primaryLight, alignItems:"center", justifyContent:"center" },
  avatarText: { fontSize: 26 },
  statusDot: { width:12, height:12, borderRadius:6, position:"absolute",
    bottom:0, right:0, borderWidth:2, borderColor: colors.white },
  childName: { fontSize: 17, fontWeight: "700", color: colors.textPrimary },
  childMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  statusText: { fontSize: 12, fontWeight: "600" },
  alertBadge: { backgroundColor: colors.danger, width:20, height:20,
    borderRadius:10, alignItems:"center", justifyContent:"center", marginHorizontal: spacing.sm },
  alertBadgeText: { color: colors.white, fontSize:11, fontWeight:"700" },
  statsRow: { flexDirection:"row", backgroundColor: colors.background,
    borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md, justifyContent:"space-around" },
  stat: { alignItems:"center", flex:1 },
  statIcon: { fontSize: 18, marginBottom: 2 },
  statValue: { fontSize: 15, fontWeight: "700", color: colors.textPrimary },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  statDivider: { width:1, backgroundColor: colors.border },
  actionsRow: { flexDirection:"row", marginTop: spacing.md, justifyContent:"space-around" },
  actionBtn: { alignItems:"center", flex:1 },
  actionIcon: { fontSize: 22 },
  actionLabel: { fontSize: 11, color: colors.primary, marginTop: 4, fontWeight: "600" },
});
