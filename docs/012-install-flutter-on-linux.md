# Install & run Flutter on Linux

We assume that we want to setup Flutter on a modern Debian based Linux distro. Like Debian, Ubuntu, Mint, etc. We also assume that the Flutter version you are trying to install is `1.22.5`, or similar. In the future, things might change for Flutter. Last assumption, is that you are running Bash. If some of the assumptions are wrong, you might have to adapt the below steps.

1. If your system supports KVM, install it. Check [guide from Google](https://developer.android.com/studio/run/emulator-acceleration#vm-linux-check-kvm), or if you are running Mint you can try:

```shell
sudo apt install -y virt-manager virt-viewer qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
```

2. You need the Flutter SDK. Go follow the [official Flutter installation](https://flutter.dev/docs/get-started/install/linux) instructions. When you get to the step of running `flutter doctor`, stop, and do all the remaining steps in this HOWTO.

3. Install Android Studio from [official Android Studio](https://developer.android.com/studio) site.

4. When you can run Android Studio, go to `Configure -> Plugins`, and install the `Dart` and `Flutter` plugins.

5. Restart Android Studio, create a new Flutter based project, and try to run it in the Android simulator. You should be able to.

6. Install and configure JAVA version 8. This is required for the current Flutter version. You can do:

```shell
sudo apt install openjdk-8-jdk openjdk-8-jre
```

7. Add necessary paths and variables to your environment. Place the following in your `~/.bashrc` file:

```text
export PATH="$PATH:/home/valera/bin/flutter/bin"
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64/"
export ANDROID_SDK="/home/valera/Android/Sdk"
export PATH="$ANDROID_SDK/emulator:$ANDROID_SDK/tools:$PATH"
```

8. Finally, open a new terminal (for the Bash settings to come into effect), and run:

```shell
flutter doctor --android-licenses
flutter doctor
```

9. Additionally, you can launch an Android emulator from the CLI by running:

```shell
emulator -noaudio -avd Pixel_3a_API_30_x86
```

(assuming that `Pixel_3a_API_30_x86` emulator is installed on your system)

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/012-install-flutter-on-linux.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
