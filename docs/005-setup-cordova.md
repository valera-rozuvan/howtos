# Setup Cordova on an empty Debian/Ubuntu box

Some steps might need some modifications. Make sure you understand what each
command does before you execute it!

## Step by step guide

1. Install Node.js LTS:

```shell
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.9/install.sh | bash
nvm install 8.11.1
```

2. Check that Node.js and NPM are available:

```shell
node --version
npm --version
```

3. Download Java SE Development Kit 8u172:

```text
http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
```

4. Create installer, install Java:

```shell
sudo aptitude install -y java-package
make-jpkg jdk-8u172-linux-x64.tar.gz
sudo dpkg -i oracle-java8-jdk_8u172_amd64.deb
javac -version
```

5. Add `JAVA_HOME` environment variable. Check what the path to JAVA home is:

```shell
sudo update-alternatives --config java
```

Add `JAVA_HOME` variable to `.bashrc` file:

```text
export JAVA_HOME="/usr/lib/jvm/oracle-java8-jdk-amd64"
```

6. Install Gradle:

```shell
wget https://downloads.gradle.org/distributions/gradle-4.6-bin.zip
sudo mkdir /opt/gradle
sudo unzip -d /opt/gradle gradle-4.6-bin.zip
```

And add Gradle to `PATH`. Add to `.bashrc` file:

```text
export PATH=$PATH:/opt/gradle/gradle-4.6/bin
```

7. Check that Gradle is available:

```shell
gradle --version
```

8. Download, extract, and install Android SDK:

```shell
wget https://dl.google.com/android/repository/sdk-tools-linux-3859397.zip
unzip sdk-tools-linux-3859397.zip
mkdir ~/android_sdk
mv ./tools ~/android_sdk/
cd ~/android_sdk/
tools/bin/sdkmanager --update
```

9. Add Android SDK to path. Append the following lines to your `.bashrc` file:

```text
export ANDROID_HOME=$HOME/android_sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

10. Check that Android tools are available:

```shell
adb --version
```

11. Install necessary Android SDK packages:

```shell
tools/bin/sdkmanager \
  "extras;android;m2repository" \
  "build-tools;26.0.3" \
  "build-tools;27.0.3" \
  "platforms;android-26" \
  "platforms;android-27"
```

12. Install Cordova:

```shell
npm install cordova -g
```

13. Check that Cordova is working:

```shell
cordova -v
```

14. Create and build a simple `Hello, world!` project:

```shell
mkdir dev
cd dev/
cordova create hello com.example.hello HelloWorld
cd hello/
cordova platform add android
cordova platform ls
cordova requirements
cordova build android
```

15. Install generated APK to device via USB:

```shell
cordova run android
```

## Helpful links

See [Cordova for Android: Links on setting up a dev environment](https://github.com/valera-rozuvan/bookmarks-md/blob/master/android/cordova.md).

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/005-setup-cordova.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
