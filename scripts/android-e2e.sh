#!/usr/bin/env bash
set -Eeuo pipefail

# Give Maestro's accessibility driver time to attach to a cold CI emulator.
export MAESTRO_DRIVER_STARTUP_TIMEOUT="${MAESTRO_DRIVER_STARTUP_TIMEOUT:-180000}"

# The emulator action exports EMULATOR_PORT; local runs default to emulator-5554.
EMULATOR_SERIAL="${ANDROID_SERIAL:-emulator-${EMULATOR_PORT:-5554}}"
export ANDROID_SERIAL="$EMULATOR_SERIAL"

# Keep CI defaults while allowing alternate APKs and flow directories locally.
APK_PATH="${ANDROID_E2E_APK_PATH:-android/app/build/outputs/apk/release/app-release.apk}"
MAESTRO_FLOWS_PATH="${MAESTRO_FLOWS_PATH:-.maestro/flows}"

adb_cmd() {
  adb -s "$EMULATOR_SERIAL" "$@"
}

# Keep CI failure evidence bounded and close to the run that produced it.
DIAGNOSTICS_DIR="${RUNNER_TEMP:-/tmp}/sciora-android-e2e"
mkdir -p "$DIAGNOSTICS_DIR"

capture_diagnostics() {
  local exit_code=$?

  {
    echo "Sciora Android E2E diagnostics"
    echo "Exit code: $exit_code"
    echo "Emulator: $EMULATOR_SERIAL"
    echo
    echo "ADB devices:"
    adb devices -l || true
    echo
    echo "ADB state:"
    adb_cmd get-state || true
    echo
    echo "Boot status:"
    adb_cmd shell getprop sys.boot_completed || true
    echo
    echo "Input service:"
    adb_cmd shell service check input || true
    echo
    echo "Focused activity:"
    adb_cmd shell dumpsys activity activities | tail -n 120 || true
  } > "$DIAGNOSTICS_DIR/device-state.txt" 2>&1

  # Upload only the recent logcat tail instead of an unbounded full device log.
  adb_cmd logcat -d -t 3000 -v threadtime > "$DIAGNOSTICS_DIR/logcat.txt" 2>&1 || true
  printf '%s\n' "$exit_code" > "$DIAGNOSTICS_DIR/exit-status.txt"
}
trap capture_diagnostics EXIT

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
  BOOT_STATUS="$(timeout 10s adb -s "$EMULATOR_SERIAL" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)"
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

# sys.boot_completed may be set just before Android registers InputManagerService.
# Wait for the service itself so UI automation does not race framework startup.
INPUT_SERVICE_STATUS=""
for attempt in {1..30}; do
  INPUT_SERVICE_STATUS="$(adb_cmd shell service check input 2>/dev/null || true)"
  case "$INPUT_SERVICE_STATUS" in
    *": found"*) break ;;
  esac
  INPUT_SERVICE_STATUS=""
  sleep 2
done

if [[ -z "$INPUT_SERVICE_STATUS" ]]; then
  echo "Android input service did not become available after boot." >&2
  adb_cmd shell service list 2>/dev/null | grep -i input || true
  exit 1
fi

if [[ ! -s "$APK_PATH" ]]; then
  echo "Release APK is missing or empty: $APK_PATH" >&2
  exit 1
fi

if [[ ! -d "$MAESTRO_FLOWS_PATH" ]]; then
  echo "Maestro flow directory does not exist: $MAESTRO_FLOWS_PATH" >&2
  exit 1
fi

adb_cmd logcat -c

timeout --signal=TERM --kill-after=30s 90s \
  adb -s "$EMULATOR_SERIAL" install -r "$APK_PATH"

timeout --signal=TERM --kill-after=30s 12m \
  maestro test "$MAESTRO_FLOWS_PATH"
