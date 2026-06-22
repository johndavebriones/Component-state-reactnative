import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from "react-native";
import CounterDisplay from "@/components/CounterDisplay";

export default function App() {
  const [count, setCount] = useState<number>(100);

  const flashAnim = useRef(new Animated.Value(0)).current;

  const triggerFlash = () => {
    flashAnim.setValue(1);
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 50,  useNativeDriver: false }),
      Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  const handleAdd   = () => setCount((prev) => prev + 1);
  const handleMinus = () => setCount((prev) => prev - 1);
  const handleReset = () => {
    triggerFlash();
    setCount(0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.parentWrapper}>

          <View style={styles.parentLabelContainer}>
            <Text style={styles.parentLabel}>By: John Dave Briones</Text>
          </View>

          <View style={styles.parentBody}>
            <Text style={styles.parentTitle}>Number Counter</Text>

            <View style={styles.stateLocker}>
              <Text style={styles.stateLockerLabel}>STATE LOCKER</Text>
              <Text style={styles.stateLockerCount}>count: {count}</Text>
            </View>

            <CounterDisplay
              count={count}
              onAdd={handleAdd}
              onMinus={handleMinus}
              onReset={handleReset}
            />
          </View>

        </View>
      </ScrollView>

      {/* Full-screen white flash overlay */}
      <Animated.View
        pointerEvents="none"
        style={[styles.flashOverlay, { opacity: flashAnim }]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  page: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  parentWrapper: {
    borderWidth: 3,
    borderColor: "#99BC85",
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#D4E7C5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  parentLabelContainer: {
    backgroundColor: "#BFD8AF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  parentLabel: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 0.4,
  },
  parentBody: {
    padding: 20,
    paddingBottom: 24,
    alignItems: "center",
    gap: 16,
  },
  parentTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
  },
  stateLocker: {
    backgroundColor: "#43a047",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
  },
  stateLockerLabel: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  stateLockerCount: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    zIndex: 999,
  },
});