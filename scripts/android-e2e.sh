#!/usr/bin/env bash
set -Eeuo pipefail

# Give Maestro's accessibility driver time to attach to a cold CI emulator.
export MAESTRO_DRIVER_STARTUP_TIMEOUT="${MAESTRO_DRIVER_STARTUP_TIMEOUT:-180000}"

# The emulator action exports EMULATOR_PORT; local runs default to emulator-5554.
EMULATOR_SERIAL="${ANDROID_SERIAL:-emulator-${EMULATOR_PORT:-5554}}"
export ANDROID_SERIAL="$EMULATOR_SERIAL"

adb_cmd() {
  adb -s "$EMULATOR_SERIAL" "$@"
}

# ADB can report a newly started emulator as "offline" for a short period.
# wait-for-device alone does not guarantee that the transport is online.
timeout --signal=TERM --kill-after=5s 120s adb -s "$EMULATOR_SERIAL" wait-for-device
ADB_STATE=""
for attempt in {1..60}; do
  ADB_STATE="$(adb_cmd get-state 2>/dev/null || true)"
  if [[ "$ADB_STATE" == "device" ]]; then
    break
  fi
  sleep 2
done

if [[ "$ADB_STATE" != "device" ]]; then
  echo "Android emulator $EMULATOR_SERIAL did not become online (last state: ${ADB_STATE:-unknown})." >&2
  adb devices -l || true
  exit 1
fi

# Verify boot readiness in this single Bash process before installing the APK.
BOOT_STATUS=""
for attempt in {1..45}; do
  BOOT_STATUS="$(timeout 10s adb_cmd shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)"
  if [[ "$BOOT_STATUS" == "1" ]]; then
    break
  fi
  BOOT_STATUS=""
  sleep 2
done

if [[ "$BOOT_STATUS" != "1" ]]; then
  echo "Android emulator did not report sys.boot_completed=1."
  adb devices -l || true
  exit 1
fi

adb_cmd logcat -c

timeout --signal=TERM --kill-after=30s 90s \
  adb_cmd install android/app/build/outputs/apk/release/app-release.apk

timeout --signal=TERM --kill-after=30s 12m \
  maestro test .maestro/flows
