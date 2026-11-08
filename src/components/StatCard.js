import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, shadow } from "../theme";

export default function StatCard({ icon, label, value, bg }) {
  return (
    <View style={[styles.card, shadow.sm]}>
      <View style={[styles.iconBox, { backgroundColor: bg || colors.primaryLight }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md,
    padding: spacing.md, alignItems: "center", margin: spacing.xs },
  iconBox: { width: 44, height: 44, borderRadius: radius.full,
    alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  icon: { fontSize: 20 },
  value: { fontSize: 20, fontWeight: "700", color: colors.textPrimary },
  label: { fontSize: 12, color: colors.textSecondary, textAlign: "center", marginTop: 2 },
});
