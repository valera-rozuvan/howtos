# Install & run Flutter on Linux

We assume that we want to setup Flutter on a modern Debian based Linux distro. Like Debian, Ubuntu, Mint, etc. We also assume that the Flutter version you are trying to install is `1.22.5`, or similar. In the future, things might change for Flutter. Last assumption, is that you are running Bash. If some of the assumptions are wrong, you might have to adapt the below steps.

0. If your system supports KVM, install it. Check [guide from Google](https://developer.android.com/studio/run/emulator-acceleration#vm-linux-check-kvm), or if you are running Mint you can try:

```
sudo apt install -y virt-manager virt-viewer qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
```

1. You need the Flutter SDK. Go follow the [official Flutter installation](https://flutter.dev/docs/get-started/install/linux) instructions. When you get to the step of running `flutter doctor`, stop, and do all the remaining steps in this HOWTO.

2. Install Android Studio from [official Android Studio](https://developer.android.com/studio) site.

3. When you can run Android Studio, go to `Configure -> Plugins`, and install the `Dart` and `Flutter` plugins.

4. Restart Android Studio, create a new Flutter based project, and try to run it in the Android simulator. You should be able to.

5. Install and configure JAVA version 8. This is required for the current Flutter version. You can do:

```
sudo apt install openjdk-8-jdk openjdk-8-jre
```

6. Add necessary paths and variables to your environment. Place the following in your `~/.bashrc` file:

```
export PATH="$PATH:/home/valera/bin/flutter/bin"
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64/"
export ANDROID_SDK="/home/valera/Android/Sdk"
export PATH="$ANDROID_SDK/emulator:$ANDROID_SDK/tools:$PATH"
```

7. Finally, open a new terminal (for the Bash settings to come into effect), and run:

```
flutter doctor --android-licenses
flutter doctor
```

8. Additionally, you can launch an Android emulator from the CLI by running:

```
emulator -noaudio -avd Pixel_3a_API_30_x86
```

(assuming that `Pixel_3a_API_30_x86` emulator is installed on your system)
