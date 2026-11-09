#!/usr/bin/env bash
set -Eeuo pipefail

export MAESTRO_DRIVER_STARTUP_TIMEOUT=180000
LOGCAT_FILE="/tmp/sciora-logcat.txt"

capture_diagnostics() {
  adb logcat -d > "$LOGCAT_FILE" 2>/dev/null || true
}
trap capture_diagnostics EXIT

adb wait-for-device
adb logcat -c

# android-emulator-runner normally waits for boot, but verify readiness again
# in this same Bash process and tolerate a short ADB reconnect after startup.
BOOT_STATUS=""
for attempt in {1..45}; do
  if BOOT_STATUS="$(timeout 10s adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" &&
    [[ "$BOOT_STATUS" == "1" ]]; then
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

timeout --signal=TERM --kill-after=30s 90s \
  adb install android/app/build/outputs/apk/release/app-release.apk

timeout --signal=TERM --kill-after=30s 12m \
  maestro test .maestro/flows
