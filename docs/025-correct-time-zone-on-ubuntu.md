# Set proper time zone on a Debian-based Linux distro

This is working on Ubuntu 24.10. Also, this should work on a recent Debian based distro.

First, make sure you are getting automatic date and time updates via NTP:

```shell
sudo systemctl enable systemd-timesyncd.service
sudo systemctl start systemd-timesyncd.service
sudo timedatectl set-ntp true
```

Second, set your preferred time zone. For example, for New York (USA):

```shell
sudo timedatectl set-timezone "America/New_York"
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/025-correct-time-zone-on-ubuntu.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
