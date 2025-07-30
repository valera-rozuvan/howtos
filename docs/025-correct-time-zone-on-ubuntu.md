# Correct time zone on Ubuntu

This is working on Ubuntu 24.10. Also, this should work on arecent Debian based distro.

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
