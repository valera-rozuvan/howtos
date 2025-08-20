# Initial setup of Amazon EC2 Ubuntu instance

1. Install [aptitude](https://wiki.debian.org/Aptitude), and update system:

```shell
sudo apt-get install -y aptitude
sudo aptitude update
sudo aptitude upgrade -y
```

2. Reboot instance:

```shell
sudo shutdown -r now
```

3. Install essential packages (some might be already installed):

```shell
sudo aptitude install -y git \
  python2.7-dev python2.7 \
  wget curl \
  build-essential \
  screen \
  ufw \
  rsync
```

4. Create local `temp` directory:

```shell
mkdir ~/temp
```

5. Make sure [Python](https://www.python.org/) is available via the `python` command:

```shell
sudo ln -s /usr/bin/python2.7 /usr/bin/python

```

6. Install [pip](https://pypi.python.org/pypi/pip) for Python:

```shell
cd ~/temp
wget https://bootstrap.pypa.io/get-pip.py
sudo python get-pip.py
rm -rf get-pip.py
```

7. Install `pip3`:

```shell
curl -sS https://bootstrap.pypa.io/get-pip.py | sudo python3
```

8. Install [glances](https://github.com/nicolargo/glances) monitoring tool:

```shell
sudo pip install glances
```

9. Enable 4GB Swap partition (see [original instructions](https://stackoverflow.com/questions/17173972/how-do-you-add-swap-to-an-ec2-instance)):

```shell
sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=4096
sudo /sbin/mkswap /var/swap.1
sudo chmod 600 /var/swap.1
sudo /sbin/swapon /var/swap.1
```

10. Enable Swap partition during boot. To update `/etc/fstab` file, run:

```shell
echo "/var/swap.1   swap    swap    defaults        0   0" | sudo tee -a /etc/fstab
```

11. Reboot instance:

```shell
sudo shutdown -r now
```

12. Configure rules for [ufw](https://launchpad.net/ufw), and enable it:

```
sudo ufw allow 22   # enable SSH
sudo ufw allow 873  # enable rsync
sudo ufw enable
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/002-initial-setup-amazon-ec2-ubuntu-instance.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
