import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useAudioPlayer } from "expo-audio";

type CounterDisplayProps = {
  count: number;
  onAdd: () => void;
  onMinus: () => void;
  onReset: () => void;
  onResetAnimation: (index: number) => void; // 👈 new
};

export default function CounterDisplay({
  count,
  onAdd,
  onMinus,
  onReset,
  onResetAnimation, // 👈 new
}: CounterDisplayProps) {

  const addPlayer       = useAudioPlayer(require("@/assets/sounds/Pikmin.mp3"));
  const minusPlayer     = useAudioPlayer(require("@/assets/sounds/Pikmin.mp3"));
  const addHoldPlayer   = useAudioPlayer(require("@/assets/sounds/gangnam.mp3"));
  const minusHoldPlayer = useAudioPlayer(require("@/assets/sounds/gangnam (mp3cut.net).mp3"));

  const resetPlayers = [
    useAudioPlayer(require("@/assets/sounds/ReturnByDeath.mp3")),
    useAudioPlayer(require("@/assets/sounds/ms xp startup.mp3")),
    useAudioPlayer(require("@/assets/sounds/Gay Echo sound effect.mp3")),
    useAudioPlayer(require("@/assets/sounds/HKSFX.mp3")),
  ];

  const addIntervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const minusIntervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoldingAdd      = useRef(false);
  const isHoldingMinus    = useRef(false);
  const holdTimeoutAddRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdTimeoutMinusRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shakeAnim     = useRef(new Animated.Value(0)).current;
  const shakeLoopRef  = useRef<Animated.CompositeAnimation | null>(null);

  const startShake = () => {
    shakeLoopRef.current?.stop();
    shakeAnim.setValue(0);
    shakeLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue:  5, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -5, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue:   8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue:  -4, duration: 50, useNativeDriver: true }),
      ])
    );
    shakeLoopRef.current.start();
  };

  const stopShake = () => {
    shakeLoopRef.current?.stop();
    shakeLoopRef.current = null;
    Animated.spring(shakeAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 200,
      friction: 8,
    }).start();
  };

  const HOLD_DELAY = 300;

  const startPress = (
    action: () => void,
    tapPlayer: ReturnType<typeof useAudioPlayer>,
    holdPlayer: ReturnType<typeof useAudioPlayer>,
    isHolding: React.MutableRefObject<boolean>,
    intervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>,
    holdTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
  ) => {
    isHolding.current = false;
    tapPlayer.seekTo(0);
    tapPlayer.play();
    action();

    holdTimeoutRef.current = setTimeout(() => {
      isHolding.current = true;
      tapPlayer.pause();
      holdPlayer.seekTo(0);
      holdPlayer.loop = true;
      holdPlayer.play();
      startShake();
      intervalRef.current = setInterval(() => {
        action();
      }, 150);
    }, HOLD_DELAY);
  };

  const endPress = (
    tapPlayer: ReturnType<typeof useAudioPlayer>,
    holdPlayer: ReturnType<typeof useAudioPlayer>,
    isHolding: React.MutableRefObject<boolean>,
    intervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>,
    holdTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
  ) => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (isHolding.current) {
      holdPlayer.loop = false;
      holdPlayer.pause();
      stopShake();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    isHolding.current = false;
  };

  const handleReset = () => {
    const index = Math.floor(Math.random() * resetPlayers.length);
    resetPlayers[index].seekTo(0);
    resetPlayers[index].play();
    onResetAnimation(index); // 👈 fire matching animation
    onReset();
  };

  return (
    <View style={styles.childWrapper}>

      <View style={styles.childLabel}>
        <Text style={styles.childLabelText}>COUNTER DISPLAY</Text>
      </View>

      <View style={styles.childBody}>

        <Animated.Text style={[styles.countDisplay, { transform: [{ translateX: shakeAnim }] }]}>
          {count}
        </Animated.Text>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#99BC85" }]}
          onPressIn={() => startPress(onAdd, addPlayer, addHoldPlayer, isHoldingAdd, addIntervalRef, holdTimeoutAddRef)}
          onPressOut={() => endPress(addPlayer, addHoldPlayer, isHoldingAdd, addIntervalRef, holdTimeoutAddRef)}
        >
          <Text style={styles.btnText}>Add Count</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#BFD8AF" }]}
          onPressIn={() => startPress(onMinus, minusPlayer, minusHoldPlayer, isHoldingMinus, minusIntervalRef, holdTimeoutMinusRef)}
          onPressOut={() => endPress(minusPlayer, minusHoldPlayer, isHoldingMinus, minusIntervalRef, holdTimeoutMinusRef)}
        >
          <Text style={styles.btnText}>Minus Count</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "rgb(158, 206, 131)" }]}
          onPress={handleReset}
        >
          <Text style={styles.btnText}>Reset Count</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  childWrapper: {
    borderWidth: 3,
    borderColor: "#99BC85",
    borderRadius: 14,
    overflow: "hidden",
    width: "100%",
  },
  childLabel: {
    backgroundColor: "#BFD8AF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  childLabelText: {
    color: "#111",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 0.4,
  },
  childBody: {
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  countDisplay: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 10,
  },
  btn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});