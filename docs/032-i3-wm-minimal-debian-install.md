# setup i3-wm with goodies on a minimal Debian install

Some notes on installing [i3-wm](https://i3wm.org/) on a minimal [Debian](https://www.debian.org/) system - and making it more user friendly.

## initial system setup

By default, the Debian minimal install is ... pretty minimal. There are some things I usually do to make life a bit easier.

First, add some system paths to the default `PATH` system variable for the `root` user:

```shell
su
echo "export PATH=$PATH:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" >> ~/.bashrc
```

This will expose a lot of executables for you to run using just their names. For example `shutdown -h now`.

Second, make sure that you have the latest APT updates. Run the update and upgrade commands:

```shell
su
apt-get update
apt-get upgrade
```

Third, I like to use `aptitude` for package management, and `sudo` to run privileged commands as a regular user. So install those dependencies:

```shell
su
apt-get install aptitude sudo
```

Lastly, configure our regular user with `sudo` permissions:

```shell
su
sudoedit /etc/sudoers
```

And add the following line at the end of the file:

```text
valera ALL=(ALL) ALL
```

**NOTE**: replace the username with the one you are using!

## Setup i3-wm and helpers

Install just the bare minimum - X11, the i3 window manager, a terminal, and the `dmenu` launcher (provided by `suckless-tools`):

```shell
sudo aptitude install xorg lxterminal i3-wm suckless-tools
```

## screen brightness

For managing hardware brightness levels we will be using the tool `brightnessctl`:

```shell
sudo aptitude install brightnessctl
```

List devices with ability to change brightness:

```shell
sudo brightnessctl --list
```

Also take note of the maximum and minimum brightness values for each device. In my case, the monitor brightness device is `intel_backlight`. To set the brightness for the monitor to 100%:

```shell
sudo brightnessctl --device=intel_backlight set 852
```

## X11 software brightness level

To change software brightness level:

```shell
xrandr --output "eDP-1" --brightness "1.0"
```

You can pass some insane values like `50.0` - but it will mess up all colors. Software brightness level basically bumps up all non-black colors to white.

## keyboard brightness

In my case, the keyboard brightness device is `tpacpi::kbd_backlight`. I can configure three different states for keyboard brightness:

```shell
sudo brightnessctl --device=tpacpi::kbd_backlight set 0
sudo brightnessctl --device=tpacpi::kbd_backlight set 1
sudo brightnessctl --device=tpacpi::kbd_backlight set 2
```

## set screen resolution

To get available screens and resolutions:

```shell
xrandr
```

Once you have the screen ID, and the desired resolution, you need to figure out the proper modeline. To get a modeline for a desired resolution:

```shell
gtf 1600 900 59.99
```

Now, everything is ready, you can issue the following commands:

```shell
xrandr --newmode "1600x900_59.99"  118.98  1600 1696 1864 2128  900 901 904 932 -HSync +Vsync
xrandr --addmode "eDP-1" "1600x900_59.99"
xrandr --output "eDP-1" --mode "1600x900_59.99"
```

## to get sound

Install PulseAudio and ALSA mixer GUI:

```shell
sudo aptitude install pulseaudio pulseaudio-utils pulseaudio-equalizer alsamixergui
```

Restart the system. Once up, you can inspect and change the volume using:

```shell
alsamixer
```

## mount an encrypt USB with ext4 FS

First - install the crypt package:

```shell
sudo aptitude install cryptsetup
```

Then start observing dmesg with:

```shell
sudo dmesg --human --follow
```

Plugin your physical USB device. In the dmesg logs, you will see the new device name, create a mount point:

```shell
sudo mkdir -p /media/valera/data
```

Open the LUKS encryption on the device:

```shell
sudo cryptsetup luksOpen /dev/sda1 CRYPT_USB
```

And mount:

```shell
sudo mount -t ext4 /dev/mapper/CRYPT_USB /media/valera/data
```

If all went well, unmount first:

```shell
sudo umount /media/valera/data
```

Then turn off LUKS:

```shell
sudo cryptsetup luksClose CRYPT_USB
```

## safely remove a USB drive (power off)

Most USB devices need to be powered off (sent the disconnect command) before they can be unplugged. We can use `udisks2` for this. First, install it:

```shell
sudo aptitude install udisks2
```

Then, once the filesystem is unmounted, you can issue the `power-off` command to the device:

```shell
sudo udisksctl power-off --block-device /dev/sda
```

## disable bluetooth

If you are not using bluetooth, and it just slows down system startup, you can disable the systemd bluetooth service:

```shell
sudo systemctl disable bluetooth.service
```

And set `AutoEnable` to `false` in the file `/etc/bluetooth/main.conf`.

## wifi

When you installed Debian, you probably configured a default WIFI connection to use during installation. Once rebooted into the installed system, you will find that WIFI works out of the box using that same connection. The WIFI `ssid` and `password` are stored in the file `/etc/network/interfaces`. On my system it looks something like this:

```text
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
allow-hotplug wlp4s0
iface wlp4s0 inet dhcp
	wpa-ssid wifispot
	wpa-psk  12345678
```

Also, you will have the `wpa_cli` command available as root. You can check the current status of the WIFI connection:

```shell
sudo wpa_cli status
```

I get something like this:

```text
Selected interface 'wlp4s0'
bssid=5c:a6:a6:a6:a6:a6
freq=2427
ssid=wifispot
id=1
mode=station
wifi_generation=4
pairwise_cipher=CCMP
group_cipher=CCMP
key_mgmt=WPA2-PSK
wpa_state=COMPLETED
ip_address=192.168.0.99
p2p_device_address=7c:7c:7c:7c:7c:7c
address=2a:2a:2a:2a:2a:2a
uuid=90aaaaa97-5bb5-5cc5-8dd8-1e222222221e
```

You can scan for additional WIFI ssids via the command:

```sell
sudo iwlist "wlp4s0" scan | grep -i "essid\|address\|wpa\|auth\|cipher\|freq"
```

I am filtering for the relevant information I need using the `grep` command.

If you want to add a new WIFI network, best to use the text mode of the `wpa_cli` command. Just run it without any arguments:

```shell
sudo wpa_cli
```

You will enter the text command mode, where you can enter the following commands to add a new network (remember, we already have one network with ID `0`, so we will create a new network with ID `1`):

```text
> scan
> scan_results
> add_network
> set_network 1 ssid "vodafone817E"
> set_network 1 psk "my-pass-phrase"
> enable_network 1
> reconnect
> status
> quit
```

Now you can switch between different networks:

```shell
sudo wpa_cli -i "wlp4s0" select_network 0
sudo wpa_cli -i "wlp4s0" select_network 1
```

If there are some connection issues - try:

```shell
sudo wpa_cli reconnect
sudo wpa_cli status
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/032-i3-wm-minimal-debian-install.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
