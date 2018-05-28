Initial setup of Amazon EC2 Ubuntu instance
===========================================

1. Install [aptitude](https://wiki.debian.org/Aptitude), and update system:
```
sudo apt-get install -y aptitude
sudo aptitude update
sudo aptitude upgrade -y
```

2. Reboot instance:
```
sudo shutdown -r now
```

3. Install essential packages (some might be already installed):
```
sudo aptitude install -y git \
  python2.7-dev python2.7 \
  wget curl \
  build-essential \
  screen \
  ufw \
  rsync
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

6.5 Install `pip3`:
```
curl -sS https://bootstrap.pypa.io/get-pip.py | sudo python3
```

7. Install [glances](https://github.com/nicolargo/glances) monitoring tool:
```
sudo pip install glances
```

8. Enable 4GB Swap partition (see [original instructions](https://stackoverflow.com/questions/17173972/how-do-you-add-swap-to-an-ec2-instance)):
```
sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=4096
sudo /sbin/mkswap /var/swap.1
sudo chmod 600 /var/swap.1
sudo /sbin/swapon /var/swap.1
```

9. Enable Swap partition during boot. To update `/etc/fstab` file, run:
```
echo "/var/swap.1   swap    swap    defaults        0   0" | sudo tee -a /etc/fstab
```

10. Reboot instance:
```
sudo shutdown -r now
```

11. Configure rules for [ufw](https://launchpad.net/ufw), and enable it:

```
sudo ufw allow 22   # enable SSH
sudo ufw allow 873  # enable rsync
sudo ufw enable
```
