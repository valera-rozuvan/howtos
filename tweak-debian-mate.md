# Tweak Debian Mate

Some useful tips for making the user experience better in a default install of Debian Mate. Please note: these tips are based on how I prefer to have my desktop environment. Your millage may vary.

## Remove desktop icons

Install `mate-tweak` package. Run it, and un-check the desktop icons.

## Enable touchpad tap-to-click

Add `Option "Tapping" "on"` to file `/usr/share/X11/xorg.conf.d/40-libinput.conf`, for the `touchpad` section.

## Add `ru`, and `ua` keyboard layouts

Install `keyboard-configuration`, and add to the file `/etc/default/keyboard` the following:

```
XKBMODEL="pc105"
XKBLAYOUT="us,ru,ua"
XKBVARIANT=""
XKBOPTIONS="grp:alt_shift_toggle"
BACKSPACE="guess"
```

