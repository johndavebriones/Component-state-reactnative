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

  // Index 0 — ReturnByDeath: red flash
  const redFlashAnim = useRef(new Animated.Value(0)).current;

  // Index 1 — ms xp startup: blue-white Windows glow
  const blueGlowAnim = useRef(new Animated.Value(0)).current;

  // Index 2 — Gay Echo: rainbow strobe
  const rainbowAnim = useRef(new Animated.Value(0)).current;

  // Index 3 — HKSFX: full-screen shake (translateX + translateY)
  const shakeX = useRef(new Animated.Value(0)).current;
  const shakeY = useRef(new Animated.Value(0)).current;

  const triggerAnimation = (index: number) => {

    if (index === 0) {
      // Red flash — fast in, slow fade out
      redFlashAnim.setValue(1);
      Animated.sequence([
        Animated.timing(redFlashAnim, { toValue: 1, duration: 40,  useNativeDriver: false }),
        Animated.timing(redFlashAnim, { toValue: 0, duration: 600, useNativeDriver: false }),
      ]).start();

    } else if (index === 1) {
      // Blue-white Windows glow — pulses twice then fades
      blueGlowAnim.setValue(0);
      Animated.sequence([
        Animated.timing(blueGlowAnim, { toValue: 1,   duration: 80,  useNativeDriver: false }),
        Animated.timing(blueGlowAnim, { toValue: 0.3, duration: 120, useNativeDriver: false }),
        Animated.timing(blueGlowAnim, { toValue: 1,   duration: 80,  useNativeDriver: false }),
        Animated.timing(blueGlowAnim, { toValue: 0,   duration: 400, useNativeDriver: false }),
      ]).start();

    } else if (index === 2) {
      // Rainbow strobe — cycles through 6 colors
      rainbowAnim.setValue(0);
      Animated.sequence([
        Animated.timing(rainbowAnim, { toValue: 1, duration: 70,  useNativeDriver: false }),
        Animated.timing(rainbowAnim, { toValue: 2, duration: 70,  useNativeDriver: false }),
        Animated.timing(rainbowAnim, { toValue: 3, duration: 70,  useNativeDriver: false }),
        Animated.timing(rainbowAnim, { toValue: 4, duration: 70,  useNativeDriver: false }),
        Animated.timing(rainbowAnim, { toValue: 5, duration: 70,  useNativeDriver: false }),
        Animated.timing(rainbowAnim, { toValue: 6, duration: 300, useNativeDriver: false }),
      ]).start();

    } else if (index === 3) {
      // HKSFX: violent full-screen shake then snap back
      shakeX.setValue(0);
      shakeY.setValue(0);
      Animated.sequence([
        Animated.parallel([
          Animated.timing(shakeX, { toValue:  12, duration: 40, useNativeDriver: true }),
          Animated.timing(shakeY, { toValue:  -8, duration: 40, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(shakeX, { toValue: -14, duration: 40, useNativeDriver: true }),
          Animated.timing(shakeY, { toValue:  10, duration: 40, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(shakeX, { toValue:  10, duration: 35, useNativeDriver: true }),
          Animated.timing(shakeY, { toValue:  -6, duration: 35, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(shakeX, { toValue: -8,  duration: 35, useNativeDriver: true }),
          Animated.timing(shakeY, { toValue:   8, duration: 35, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(shakeX, { toValue:  5,  duration: 30, useNativeDriver: true }),
          Animated.timing(shakeY, { toValue:  -4, duration: 30, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.spring(shakeX, { toValue: 0, useNativeDriver: true, tension: 200, friction: 8 }),
          Animated.spring(shakeY, { toValue: 0, useNativeDriver: true, tension: 200, friction: 8 }),
        ]),
      ]).start();
    }
  };

  const handleAdd   = () => setCount((prev) => prev + 1);
  const handleMinus = () => setCount((prev) => prev - 1);
  const handleReset = () => setCount(0);

  // Interpolations
  const redOpacity = redFlashAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["rgba(200,0,0,0)", "rgba(200,0,0,0.55)"],
  });

  const blueGlowColor = blueGlowAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["rgba(30,100,255,0)", "rgba(180,220,255,0.6)"],
  });

  const rainbowColor = rainbowAnim.interpolate({
    inputRange:  [0,                    1,                       2,                       3,                       4,                       5,                       6],
    outputRange: [
      "rgba(0,0,0,0)",
      "rgba(255,0,0,0.45)",
      "rgba(255,165,0,0.45)",
      "rgba(255,255,0,0.45)",
      "rgba(0,200,80,0.45)",
      "rgba(80,80,255,0.45)",
      "rgba(0,0,0,0)",
    ],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>

        {/* Index 3 — HKSFX: the shake wraps the whole card */}
        <Animated.View style={{ width: "100%", alignItems: "center", transform: [{ translateX: shakeX }, { translateY: shakeY }] }}>
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
                onResetAnimation={triggerAnimation}
              />
            </View>

          </View>
        </Animated.View>

      </ScrollView>

      {/* Index 0 — ReturnByDeath: red flash overlay */}
      <Animated.View
        pointerEvents="none"
        style={[styles.overlay, { backgroundColor: redOpacity }]}
      />

      {/* Index 1 — ms xp startup: blue-white glow overlay */}
      <Animated.View
        pointerEvents="none"
        style={[styles.overlay, { backgroundColor: blueGlowColor }]}
      />

      {/* Index 2 — Gay Echo: rainbow strobe overlay */}
      <Animated.View
        pointerEvents="none"
        style={[styles.overlay, { backgroundColor: rainbowColor }]}
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
});``