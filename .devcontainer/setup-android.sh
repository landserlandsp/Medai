#!/usr/bin/env bash
set -euo pipefail

export ANDROID_HOME="${HOME}/android-sdk"
export ANDROID_SDK_ROOT="${HOME}/android-sdk"

if [ -z "${JAVA_HOME:-}" ] && command -v java >/dev/null 2>&1; then
  export JAVA_HOME="$(dirname "$(dirname "$(readlink -f "$(command -v java)")")")"
fi
if [ -z "${JAVA_HOME:-}" ] && [ -d "/usr/lib/jvm/java-17-openjdk" ]; then
  export JAVA_HOME="/usr/lib/jvm/java-17-openjdk"
fi

export PATH="$JAVA_HOME/bin:$PATH:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/cmdline-tools/latest/bin"

mkdir -p "$ANDROID_HOME"

if [ ! -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
  echo "Installing Android command line tools..."
  if ! command -v sudo >/dev/null 2>&1; then
    apk add --no-cache sudo
  fi
  sudo -n apk add --no-cache curl unzip bash which gcompat libstdc++ >/dev/null 2>&1 || true

  rm -rf /tmp/cmdline-tools /tmp/cmdline-tools.zip
  curl -L "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip" -o /tmp/cmdline-tools.zip
  mkdir -p /tmp/cmdline-tools
  unzip -q /tmp/cmdline-tools.zip -d /tmp/cmdline-tools

  rm -rf "$ANDROID_HOME/cmdline-tools"
  mkdir -p "$ANDROID_HOME/cmdline-tools"

  if [ -d "/tmp/cmdline-tools/cmdline-tools" ]; then
    cp -a /tmp/cmdline-tools/cmdline-tools/. "$ANDROID_HOME/cmdline-tools/"
  else
    cp -a /tmp/cmdline-tools/. "$ANDROID_HOME/cmdline-tools/"
  fi

  mkdir -p "$ANDROID_HOME/cmdline-tools/latest"
  cp -a "$ANDROID_HOME/cmdline-tools/bin" "$ANDROID_HOME/cmdline-tools/latest/"
  cp -a "$ANDROID_HOME/cmdline-tools/lib" "$ANDROID_HOME/cmdline-tools/latest/"
  cp -a "$ANDROID_HOME/cmdline-tools/NOTICE.txt" "$ANDROID_HOME/cmdline-tools/latest/"
  cp -a "$ANDROID_HOME/cmdline-tools/source.properties" "$ANDROID_HOME/cmdline-tools/latest/"
fi

if [ ! -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
  echo "ERROR: sdkmanager is not available in $ANDROID_HOME/cmdline-tools/latest" >&2
  exit 1
fi

echo "Installing Android SDK packages..."
yes | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$ANDROID_HOME" \
  "platform-tools" \
  "platforms;android-34" \
  "build-tools;34.0.0" \
  "cmdline-tools;latest" >/tmp/sdkmanager.log 2>&1 || {
    cat /tmp/sdkmanager.log || true
    exit 1
  }

yes | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$ANDROID_HOME" --licenses >/tmp/sdkmanager-licenses.log 2>&1 || {
    cat /tmp/sdkmanager-licenses.log || true
  }

cat > /workspaces/Medai/android/MedAIApp/local.properties <<EOF
sdk.dir=${ANDROID_HOME}
EOF

echo "Android SDK setup complete."
