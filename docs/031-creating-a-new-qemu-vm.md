# creating a new QEMU VM

We want to run [Debian](https://www.debian.org/) Linux on a virtual machine using [QEMU](https://www.qemu.org/).

## pre-requisites

Create a directory where all of the QEMU stuff will reside:

```shell
mkdir -p ~/qemu-stuff
```

Download the Debian `netinst` ISO image from [https://www.debian.org/CD/netinst/](https://www.debian.org/CD/netinst/). Put it in the `~/qemu-stuff` directory:

```shell
cd ~/qemu-stuff
curl \
  --proto '=https' \
  --tlsv1.2 \
  -sSf \
  -L "https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-13.0.0-amd64-netinst.iso" \
  -o "debian-13.0.0-amd64-netinst.iso"
```

After downloading, check the `sha256` hash:

```shell
sha256sum /home/valera/qemu-stuff/debian-13.0.0-amd64-netinst.iso
```

You should get `e363cae0f1f22ed73363d0bde50b4ca582cb2816185cf6eac28e93d9bb9e1504`.

Install QEMU:

```shell
sudo apt install qemu-system qemu-system-common qemu-system-data qemu-system-gui
```

## create a VM

We are going to have a folder per VM. All the disk files, along with the install script, and the start script, will live in the VM folder. This way it's easy to copy VMs - just copy entire folder, and name it differently. Also, if you are going to run a lot of VMs, best to organize everything so that you don't loose track of what disks belong to which VM, and how to start each VM.

```shell
mkdir -p ~/qemu-stuff/first-vm
cd ~/qemu-stuff/first-vm
```

Let's create a single disk for now:

```shell
qemu-img create -f qcow2 ./disk-0.qcow2 16G
```

Now we can launch QEMU, specify our new disk, and also load the Debian ISO file to the VM's virtual CDROM. Let's create an install script, call it `install-vm.sh`:

```shell
#!/bin/bash

set -o errexit
set -o pipefail

qemu-system-x86_64 \
  -cpu host,pdpe1gb \
  -machine accel=kvm \
  -m 4G \
  -smp 4 \
  -nic user,model=virtio \
  -display gtk \
  -device virtio-scsi-pci,id=scsi0,num_queues=4 \
  -device scsi-hd,drive=drive0,bus=scsi0.0,channel=0,scsi-id=0,lun=0 \
  -drive file=~/qemu-stuff/first-vm/disk-0.qcow2,if=none,id=drive0 \
  -cdrom ~/qemu-stuff/debian-13.0.0-amd64-netinst.iso

echo "Script ran without error."
exit 0
```

And - we install:

```shell
chmod u+x ./install-vm.sh
./install-vm.sh
```

After the installation, machine will reboot. You can stop the machine booting, and issue a `halt` command.

Now let's create the normal start up script `start-vm.sh`, which will exclude the CDROM mounting our Debian ISO:

```shell
#!/bin/bash

set -o errexit
set -o pipefail

qemu-system-x86_64 \
  -cpu host,pdpe1gb \
  -machine accel=kvm \
  -m 4G \
  -smp 4 \
  -nic user,model=virtio \
  -display gtk \
  -device virtio-scsi-pci,id=scsi0,num_queues=4 \
  -device scsi-hd,drive=drive0,bus=scsi0.0,channel=0,scsi-id=0,lun=0 \
  -drive file=~/qemu-stuff/first-vm/disk-0.qcow2,if=none,id=drive0

echo "Script ran without error."
exit 0
```

And - let's start the VM:

```shell
chmod u+x ./start-vm.sh
./start-vm.sh
```

## VM screen resolution

Pass the flag `-vga std` to QEMU. Then inside the guest you will be able to change the default resolution.

Refer to [1](https://unix.stackexchange.com/questions/227876/how-to-set-custom-resolution-using-xrandr-when-the-resolution-is-not-available-i) and [2](https://askubuntu.com/questions/377937/how-do-i-set-a-custom-resolution) for information on changing resolution using `xrandr` tool. Works out of the box on Debian QEMU guests.

## advanced networking

If you want to be able to reach the host from inside the guest VM, we need to change our network card options. We started with a simple:

```text
  -nic user,model=virtio
```

Let's change that to:

```text
  -device rtl8139,netdev=net0
```

and also add some `-netdev` configuration:

```text
  -netdev user,id=net0,net=192.168.76.0/24,dhcpstart=192.168.76.9
```

So the whole start command becomes:

```shell
qemu-system-x86_64 \
  -cpu host,pdpe1gb \
  -machine accel=kvm \
  -m 4G \
  -smp 4 \
  -device rtl8139,netdev=net0 \
  -netdev user,id=net0,net=192.168.76.0/24,dhcpstart=192.168.76.9 \
  -display gtk \
  -device virtio-scsi-pci,id=scsi0,num_queues=4 \
  -device scsi-hd,drive=drive0,bus=scsi0.0,channel=0,scsi-id=0,lun=0 \
  -drive file=~/qemu-stuff/first-vm/disk-0.qcow2,if=none,id=drive0
```

If you run the VM now, you will be able to ping the host machine via:

```shell
ping 192.168.76.2
```

**NOTE**: the ping command should be issue inside the VM (the guest).

Refer to more networking options in [Documentation/Networking](https://wiki.qemu.org/Documentation/Networking) section on the QEMU site.

## transfer files between host and guest via libvirt

There is an awesome project [libvirt](https://libvirt.org/) which enables to share the filesystem between the host and the guest. QEMU supports this using the [virtiofsd](https://qemu-stsquad.readthedocs.io/en/doc-updates/tools/virtiofsd.html). Also see [this](https://www.qemu.org/docs/master/system/devices/vhost-user.html) and [this](https://github.com/Xilinx/qemu/blob/master/hw/virtio/vhost-user-fs-pci.c).

There are some guides out there, such as the [gentoo Virtiofs](https://wiki.gentoo.org/wiki/Virtiofs) guide and the [Standalone virtiofs usage](https://virtio-fs.gitlab.io/howto-qemu.html) guide.

I will describe the approach that is working for me.

First - on the host - install [virtiofsd](https://virtio-fs.gitlab.io/):

```shell
sudo apt install virtiofsd
```

Second - create the host directory which we will pass through to the guest:

```shell
cd /mnt
sudo mkdir ./common_host
sudo chown --recursive valera:valera ./common_host
sudo chgrp --recursive valera ./common_host
```

Third - create a directory for the virtiofsd socket:

```shell
cd /mnt
sudo mkdir ./virtiofsd_socket
sudo chown --recursive valera:valera ./virtiofsd_socket
sudo chgrp --recursive valera ./virtiofsd_socket
```

Fourth - we need the tool [rootlesskit](https://github.com/rootless-containers/rootlesskit):

```shell
sudo apt install rootlesskit
```

Using `rootlesskit` - we will start the `virtiofsd` daemon:

```shell
rootlesskit /usr/libexec/virtiofsd \
  --syslog \
  --socket-path /mnt/virtiofsd_socket/virtiofsd.sock \
  --shared-dir /mnt/common_host \
  --announce-submounts \
  --log-level debug
```

If you see that the daemon started, and is running, then all should be good. You can also check the logs in a separate terminal:

```shell
tail -f /var/log/syslog
```

Make sure everyone can access the socket file:

```shell
chmod --recursive a+rw /mnt/virtiofsd_socket/
```

Now - we can launch the VM with some additional configuration:

```shell
qemu-system-x86_64 \
  -cpu host,pdpe1gb \
  -machine accel=kvm \
  -m 4G \
  -smp 4 \
  -nic user,model=virtio \
  -display gtk \
  -device virtio-scsi-pci,id=scsi0,num_queues=4 \
  -device scsi-hd,drive=drive0,bus=scsi0.0,channel=0,scsi-id=0,lun=0 \
  -drive file=~/qemu-stuff/first-vm/disk-0.qcow2,if=none,id=drive0 \

  # additional configuration for "virtiofs"
  -object memory-backend-memfd,id=mem,size=4G,share=on \
  -numa node,memdev=mem \
  -chardev socket,id=char0,path=/mnt/virtiofsd_socket/virtiofsd.sock \
  -device vhost-user-fs-pci,chardev=char0,tag=mount_tag
```

**NOTE**: remove the comment `# additional configuration for virtiofs` from the above command before running it!

If you see an error such as:

```text
Failed to connect to '/mnt/virtiofsd_socket/virtiofsd.sock': Connection refused
```

make sure that the `virtiofsd` daemon is running. I have found that sometimes it quits unexpectedly.

Once the guest machine has booted up - you can mount the virtual folder with the commands:

```shell
sudo mkdir /mnt/shared_folder
sudo mount -t virtiofs mount_tag /mnt/shared_folder
```

**NOTE**: These two commands should run inside the VM (guest).

Important thing to note - due to the security model - files in the guest should be written as `root`, and on the host they will be available as the regular user who is running the `virtiofsd` daemon (in my case - `valera`).

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/031-creating-a-new-qemu-vm.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
