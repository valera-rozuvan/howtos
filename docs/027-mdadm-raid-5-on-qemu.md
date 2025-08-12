# mdadm Raid 5 on QEMU

I recently had to solve the challenge of running a [Raid 5](https://en.wikipedia.org/wiki/RAID) array inside a [QEMU](https://www.qemu.org/) virtual machine using [mdadm](https://github.com/md-raid-utilities/mdadm). A lot of googling and trial and error produces an acceptable result, so I will share just the important bits here.

## creating the disk files on the host

Assuming you know how to launch a QEMU machine, and setup a Linux distro on it, we will go to the next steps of attaching additional virtual drives to the machine. We will create four disk files in the [qcow2](https://www.qemu.org/docs/master/interop/qcow2.html) format:

```shell
qemu-img create -f qcow2 ./disk-1.qcow2 3G
qemu-img create -f qcow2 ./disk-2.qcow2 3G
qemu-img create -f qcow2 ./disk-3.qcow2 3G
qemu-img create -f qcow2 ./disk-4.qcow2 3G
```

It's assumed that you already have a `./disk-0.qcow2` disk file for the guest OS.

## attaching the disks to a VM

A virtual disk can be attached to a QEMU VM in SCSI mode by passing the following params on the command line:

```text
-device scsi-hd,drive=drive0,bus=scsi0.0,channel=0,scsi-id=0,lun=0
-drive file=/home/valera/qemu-stuff/mdadm/xubuntu.qcow2,if=none,id=drive0
```

Now, we can construct the whole command to launch the VM, and attach all our five disks. The first disk contains the installed OS, while the other four are empty disks (created specifically for the Raid 5 array). Please adapt to your own use case, for example change the file paths. The full command:

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
    -drive file=/home/valera/qemu-stuff/mdadm/disk-0.qcow2,if=none,id=drive0 \
    -device scsi-hd,drive=drive1,bus=scsi0.0,channel=0,scsi-id=1,lun=0 \
    -drive file=/home/valera/qemu-stuff/mdadm/disk-1.qcow2,if=none,id=drive1 \
    -device scsi-hd,drive=drive2,bus=scsi0.0,channel=0,scsi-id=2,lun=0 \
    -drive file=/home/valera/qemu-stuff/mdadm/disk-2.qcow2,if=none,id=drive2 \
    -device scsi-hd,drive=drive3,bus=scsi0.0,channel=0,scsi-id=3,lun=0 \
    -drive file=/home/valera/qemu-stuff/mdadm/disk-3.qcow2,if=none,id=drive3 \
    -device scsi-hd,drive=drive4,bus=scsi0.0,channel=0,scsi-id=4,lun=0 \
    -drive file=/home/valera/qemu-stuff/mdadm/disk-4.qcow2,if=none,id=drive4
```

If the VM started up OK, with no errors, then all went well.

## setting up the disks on the guest

At this point, the disks should be available to the guest (inside the VM). For example, check with the utility [gparted](https://gparted.org/), and observe that you have additionally four unformatted devices `/dev/sdb`, `/dev/sdc`, `/dev/sdd`, and `/dev/sde`. You can also test the performance of each device by running:

```shell
sudo hdparm -Tt /dev/sdb
sudo hdparm -Tt /dev/sdc
sudo hdparm -Tt /dev/sdd
sudo hdparm -Tt /dev/sde
```

I decided to go hard core, create one primary partition on each device, and use individual partitions for the Raid 5 array. It's also possible to use the whole device, but then you don't have so much control over sector alignment. There are a lot of discussions about sector aligning, and the performance benefits from doing this, I suggest one starts with [Fun With 4K Sectors](https://juliansimioni.com/blog/fun-with-4k-sectors/) read (see [archived](https://web.archive.org/web/20240227082139/https://juliansimioni.com/blog/fun-with-4k-sectors/) version).

PLEASE NOTE: For virtual machines, sector alignment for partitions should not really matter in terms of performance. After all - everything is virtual :-) I am documenting it here, because it is applicable in real life. When setting up Raid arrays outside of VMs, performance does matter. Also, I am not an expert on this (yet!), so please take my assumptions with a grain of salt.

Using [parted](https://wiki.archlinux.org/title/Parted) utility, for each drive, apply the following strategy:

```text
$ sudo parted -a optimal /dev/sdb
(parted) mklabel gpt
(parted) unit s
(parted) mkpart primary 2048s 100%
(parted) align-check opt 1
1 aligned
(parted) set 1 raid on
(parted) quit
```

Now you have four partitions ready for `mdadm` to consume. Let's move on to the next step!

# setting up mdadm on the guest

It's time to install the `mdadm` util:

```shell
sudo apt install mdadm
```

Then create the array:

```shell
sudo mdadm --create --metadata 1.0 --verbose /dev/md127 --chunk=512 --level=5 --raid-devices=4 /dev/sdb1 /dev/sdc1 /dev/sdd1 /dev/sde1
```

The command will exit right away, but behind the scenes the `mdadm` is building the array. You can monitor the process by running:

```shell
cat /proc/mdstat
```

And observe something like:

```text
Personalities : [linear] [multipath] [raid0] [raid1] [raid6] [raid5] [raid4] [raid10]
md127 : active raid5 sdc[3] sdb[1] sda[0]
      209582080 blocks super 1.2 level 5, 512k chunk, algorithm 2 [3/2] [UU_]
      [>....................]  recovery =  0.9% (957244/104791040) finish=18.0min speed=95724K/sec

unused devices: <none>
```

Run this command a couple of times, and make sure the arrow reaches the end of the progress bar.

Next, create a file system on the array:

```shell
sudo mkfs.ext4 -F /dev/md127
```

Create a mount point to attach the new file system:

```shell
sudo mkdir -p /mnt/md127
```

You can mount the file system with the following:

```shell
sudo mount /dev/md127 /mnt/md127
```

Check whether the new space is available:

```shell
df -h -x devtmpfs -x tmpfs
```

Check that there is an entry for `/mnt/md127` in the output. You can also change to the mounted path, and try creating a file!

## configure auto start of array at boot time

Before changing/saving mdadm configuration, make sure that the array is fully assembled:

```shell
cat /proc/mdstat
```

You should **NOT** see a progress bar. The array should be complete at this point.

Now, you can automatically scan the active array and append to the config file `/etc/mdadm/mdadm.conf`:

```shell
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
```

If you want the array to be available during the early boot process, you can update the initramfs (initial RAM file system):

```shell
sudo update-initramfs -u
```

Add the new file system mount options to the `/etc/fstab` file for automatic mounting at boot:

```shell
echo '/dev/md127 /mnt/md127 ext4 defaults,nofail,discard 0 0' | sudo tee -a /etc/fstab
```

Restart the VM, and check that you have your Raid 5 array automatically mounted, and available to work with.

## checking the array (scrubbing)

Open two terminals. In one terminal run the command:

```shell
sudo watch -n 1 cat /proc/mdstat
```

This will periodically display the updated contents of the file `/proc/mdstat`.

In the other terminal run the command:

```shell
sudo echo "check" | sudo tee -a /sys/block/md127/md/sync_action
```

After you launch the command, you can immediately see the result in the other terminal. The progress for the check should start.

## some statistics about the array

You can see the status of each drive in the array, among other things, from the output of the command:

```shell
sudo mdadm -D /dev/md127
```

You can also examine part of the array:

```shell
sudo mdadm --examine /dev/sdb1
```

Take note of the drive's UUID - look for `Device UUID` in the output.

## references

While doing this research, the following resources have been of most help:

1. [Setting up a Linux mdadm raid array with 4k sector disks and LVM.](https://dennisfleurbaaij.blogspot.com/2013/01/setting-up-linux-mdadm-raid-array-with.html)
2. [How To Create RAID Arrays with mdadm on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-create-raid-arrays-with-mdadm-on-ubuntu)
3. [RAID (mdadm) - Flags necessary?](https://askubuntu.com/questions/250288/raid-mdadm-flags-necessary)
4. [Check RAID software: my status](https://serverfault.com/questions/721364/check-raid-software-my-status)
5. [mdadm RAID implementation with GPT partitioning](https://unix.stackexchange.com/questions/318098/mdadm-raid-implementation-with-gpt-partitioning/320330#320330)
6. [HTGWA: Create a RAID array in Linux with mdadm](https://www.jeffgeerling.com/blog/2021/htgwa-create-raid-array-linux-mdadm)
