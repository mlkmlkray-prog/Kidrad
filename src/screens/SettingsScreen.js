import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, TextInput, Alert, Clipboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, radius, shadow } from "../theme";
import { t } from "../i18n/translations";

const DEVICE_CODE = "KG-" + Math.random().toString(36).substr(2,6).toUpperCase();

export default function SettingsScreen() {
  const [lang, setLang] = useState("ar");
  const [notifs, setNotifs] = useState(true);
  const [screenLimit, setScreenLimit] = useState("3");
  const [bedtime, setBedtime] = useState("21:00");
  const isAr = lang === "ar";

  useEffect(() => { AsyncStorage.getItem("lang").then(v => v && setLang(v)); }, []);

  const switchLang = async newLang => {
    setLang(newLang);
    await AsyncStorage.setItem("lang", newLang);
  };

  const copyCode = () => {
    Clipboard.setString(DEVICE_CODE);
    Alert.alert("✅", t(lang,"codeCopied"));
  };

  const save = () => Alert.alert("✅", t(lang,"saved"));

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isAr && styles.rtlText]}>{title}</Text>
      <View style={[styles.sectionCard, shadow.sm]}>{children}</View>
    </View>
  );

  const Row = ({ label, children, isLast }) => (
    <View style={[styles.row, !isLast && styles.rowBorder, isAr && styles.rtl]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View>{children}</View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Section title={"🌐 " + t(lang,"language")}>
        <Row label={t(lang,"language")} isLast>
          <View style={[styles.langRow, isAr && styles.rtl]}>
            {["ar","fr"].map(l => (
              <TouchableOpacity key={l}
                style={[styles.langBtn, lang===l && styles.langBtnActive]}
                onPress={() => switchLang(l)}>
                <Text style={[styles.langBtnText, lang===l && styles.langBtnTextActive]}>
                  {l==="ar" ? "🇲🇦 العربية" : "🇫🇷 Français"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Row>
      </Section>

      <Section title={"🔗 " + t(lang,"connect")}>
        <View style={styles.codeSection}>
          <Text style={[styles.codeTitle, isAr && styles.rtlText]}>{t(lang,"connectionGuide")}</Text>
          {[1,2,3].map(i => (
            <Text key={i} style={[styles.step, isAr && styles.rtlText]}>{t(lang,`step${i}`)}</Text>
          ))}
          <View style={[styles.codeBox, isAr && styles.rtl]}>
            <Text style={styles.deviceCode}>{DEVICE_CODE}</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={copyCode}>
              <Text style={styles.copyBtnText}>📋 {t(lang,"copyCode")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Section>

      <Section title={"⏱ " + t(lang,"screenTimeLimit")}>
        <Row label={t(lang,"screenTimeLimit")}>
          <View style={[styles.inputRow, isAr && styles.rtl]}>
            <TextInput style={styles.input} value={screenLimit}
              onChangeText={setScreenLimit} keyboardType="numeric" maxLength={2} />
            <Text style={styles.inputUnit}>{t(lang,"hours")}</Text>
          </View>
        </Row>
        <Row label={t(lang,"bedtime")} isLast>
          <TextInput style={styles.input} value={bedtime}
            onChangeText={setBedtime} placeholder="21:00" />
        </Row>
      </Section>

      <Section title={"🔔 " + t(lang,"notifications")}>
        <Row label={t(lang,"notifications")} isLast>
          <Switch value={notifs} onValueChange={setNotifs}
            trackColor={{false: colors.border, true: colors.secondary+"66"}}
            thumbColor={notifs ? colors.secondary : colors.textMuted} />
        </Row>
      </Section>

      <TouchableOpacity style={[styles.saveBtn, shadow.md]} onPress={save}>
        <Text style={styles.saveBtnText}>💾 {t(lang,"save")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  section: { marginBottom: spacing.lg },
  sectionTitle: { fontSize:13, fontWeight:"700", color: colors.textSecondary,
    letterSpacing:0.5, marginBottom: spacing.sm, marginHorizontal: spacing.sm },
  rtlText: { textAlign:"right" },
  sectionCard: { backgroundColor: colors.white, borderRadius: radius.lg, overflow:"hidden" },
  row: { flexDirection:"row", alignItems:"center", justifyContent:"space-between", padding: spacing.md },
  rowBorder: { borderBottomWidth:1, borderBottomColor: colors.border },
  rtl: { flexDirection:"row-reverse" },
  rowLabel: { fontSize:15, color: colors.textPrimary, flex:1 },
  langRow: { flexDirection:"row", gap: spacing.sm },
  langBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.full, borderWidth:1, borderColor: colors.border },
  langBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  langBtnText: { fontSize:13, color: colors.textSecondary },
  langBtnTextActive: { color: colors.white, fontWeight:"700" },
  codeSection: { padding: spacing.md },
  codeTitle: { fontSize:15, fontWeight:"700", color: colors.textPrimary, marginBottom: spacing.sm },
  step: { fontSize:13, color: colors.textSecondary, marginBottom: spacing.sm, lineHeight:20 },
  codeBox: { flexDirection:"row", alignItems:"center", justifyContent:"space-between",
    backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm },
  deviceCode: { fontSize:22, fontWeight:"800", color: colors.primary, letterSpacing:2 },
  copyBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, borderRadius: radius.full },
  copyBtnText: { color: colors.primary, fontSize:13, fontWeight:"700" },
  inputRow: { flexDirection:"row", alignItems:"center", gap: spacing.sm },
  input: { borderWidth:1, borderColor: colors.border, borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    fontSize:15, minWidth:60, textAlign:"center", color: colors.textPrimary },
  inputUnit: { fontSize:13, color: colors.textSecondary },
  saveBtn: { backgroundColor: colors.primary, padding: spacing.md+2,
    borderRadius: radius.full, alignItems:"center", marginTop: spacing.md },
  saveBtnText: { color: colors.white, fontWeight:"800", fontSize:16 },
});
