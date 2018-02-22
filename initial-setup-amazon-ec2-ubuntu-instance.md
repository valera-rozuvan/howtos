Initial setup of Amazon EC2 Ubuntu instance
===========================================

1. Install [aptitude](https://wiki.debian.org/Aptitude), and update system:
```
sudo apt-get install aptitude
sudo aptitude update
sudo aptitude upgrade
```

2. Reboot instance.

3. Install essential packages (some might be already installed):
```
sudo aptitude install git \
  python2.7-dev python2.7 \
  wget curl \
  build-essential \
  screen
```

4. Create local `temp` directory:
```
mkdir ~/temp
```

5. Make sure [Python](https://www.python.org/) is available via the `python` command:
```
sudo ln -s /usr/bin/python2.7 /usr/bin/python

```

6. Install [pip](https://pypi.python.org/pypi/pip) for Python:
```
cd ~/temp
wget https://bootstrap.pypa.io/get-pip.py
sudo python get-pip.py
rm -rf get-pip.py
```

6. Install [glances](https://github.com/nicolargo/glances) monitoring tool:
```
sudo pip install glances
```

7. Enable 16GB Swap partition (see [original instructions](https://stackoverflow.com/questions/17173972/how-do-you-add-swap-to-an-ec2-instance)):
```
sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=16384
sudo /sbin/mkswap /var/swap.1
sudo chmod 600 /var/swap.1
sudo /sbin/swapon /var/swap.1
```

8. Enable Swap partition during boot. Add the following line to `/etc/fstab` file:
```
/var/swap.1   swap    swap    defaults        0   0
```

9. Reboot instance.

10. Install [ufw](https://launchpad.net/ufw), and configure it:

```
sudo aptitude install ufw
sudo ufw allow 22   # enable SSH
sudo ufw allow 873  # enable rsync
sudo ufw enable
```
