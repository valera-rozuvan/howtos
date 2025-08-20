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

## setting up mdadm on the guest

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

Open three terminals. In one terminal run the command:

```shell
sudo watch -n 1 cat /proc/mdstat
```

This will periodically display the updated contents of the file `/proc/mdstat`.

In the second terminal run the command:

```shell
sudo watch -n 1 cat /sys/block/md127/md/mismatch_cnt
```

This will periodically display the number of mismatches found (meaning that there is some data integrity issues).

In the third terminal run the command:

```shell
sudo echo "check" | sudo tee -a /sys/block/md127/md/sync_action
```

After you launch the command, you can immediately see the result in the other two terminals. The progress for the check should start.

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

## checking the file system of the array

It's assumed that `ext4` fs was used on the Raid array. Also, it's assumed that the Raid array itself has no errors. Be sure to first unmount the fs:

```shell
sudo unmount /dev/md127
```

Then run the fs checker:

```shell
sudo e2fsck -vf /dev/md127
```

Observe some messages from the checker. It all is OK, you can mount the fs back:

```shell
sudo mount /dev/md127
```

## replacing a drive in array

Suppose you have some hints that a drive in the array is bad (or about to become bad). For example, data integrity questions, mechanical failure is about to happen, or something else. You want to take it out of the array, and change it to a new drive. Let's go through the process on the drive `/dev/sdc`.

We will tell `mdadm` to mark the drive as failed, then remove it from the array, and also clear the superblock. The last item will make `mdadm` recreate the data on the drive from other good drives, if you decide to re-add it back.

```shell
sudo mdadm --manage /dev/md127 --fail /dev/sdc1
sudo mdadm --manage /dev/md127 --remove /dev/sdc1
sudo mdadm --zero-superblock /dev/sdc1
```

**NOTE**: If you get some error that a drive can't be "hot removed", issue the command `sudo echo "frozen" | sudo tee -a /sys/block/md127/md/sync_action` first. Then try again to remove the drive.

After the three above commands above, you should see the message:

```text
mdadm: set /dev/sdc1 faulty in /dev/md127
mdadm: hot removed /dev/sdc1 from /dev/md127
```

Now you can do anything you want with the drive `/dev/sdc`. Once ready to add it back to the array, make sure it's properly formatted (there is a primary partition on it - refer to the beginning of this guide), and run the command:

```shell
sudo mdadm --manage /dev/md127 --add /dev/sdc1
```

This operation will trigger a `check`, and the new drive will be inserted in the array, and populated with data from the other 3 drives.

## references

While doing this research, the following resources have been of most help:

1. [Setting up a Linux mdadm raid array with 4k sector disks and LVM.](https://dennisfleurbaaij.blogspot.com/2013/01/setting-up-linux-mdadm-raid-array-with.html)
1. [How To Create RAID Arrays with mdadm on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-create-raid-arrays-with-mdadm-on-ubuntu)
1. [RAID (mdadm) - Flags necessary?](https://askubuntu.com/questions/250288/raid-mdadm-flags-necessary)
1. [Check RAID software: my status](https://serverfault.com/questions/721364/check-raid-software-my-status)
1. [mdadm RAID implementation with GPT partitioning](https://unix.stackexchange.com/questions/318098/mdadm-raid-implementation-with-gpt-partitioning/320330#320330)
1. [HTGWA: Create a RAID array in Linux with mdadm](https://www.jeffgeerling.com/blog/2021/htgwa-create-raid-array-linux-mdadm)
1. [Arch Linux wiki: RAID](https://wiki.archlinux.org/title/RAID)
1. [mdadm.conf(5) — Linux manual page](https://man7.org/linux/man-pages/man5/mdadm.conf.5.html) and [mdadm(8) — Linux manual page](https://man7.org/linux/man-pages/man8/mdadm.8.html)

Resources specifically on rescue/corruption/repair/rebuild of `mdadm` Raid arrays:

1. [Rebuilding Raid array](https://serverfault.com/questions/927759/rebuilding-raid-array)
1. [Data integrity check question](https://www.reddit.com/r/linuxadmin/comments/18vty5b/data_integrity_check_question/)
1. [Battle testing ZFS, Btrfs and mdadm+dm-integrity](https://unixdigest.com/articles/battle-testing-zfs-btrfs-and-mdadm-dm.html)
1. [MDADM fails to hot remove disk](https://www.linuxquestions.org/questions/linux-newbie-8/mdadm-fails-to-hot-remove-disk-657518/)
1. [How to check mdadm RAID5 integrity after power failure/random reboot](https://unix.stackexchange.com/questions/531229/how-to-check-mdadm-raid5-integrity-after-power-failure-random-reboot)
1. [mdadm repair single chunk / sector](https://superuser.com/questions/1346523/mdadm-repair-single-chunk-sector)
1. [MDADM RAID5 Recovery and corruption detection suggestions](https://forums.gentoo.org/viewtopic-p-7482410.html)
1. [File system corrupt after re-adding software RAID 1 member after test. Why?](https://superuser.com/questions/1402239/file-system-corrupt-after-re-adding-software-raid-1-member-after-test-why)
1. [How to properly wipe data from a replaced raid drive and solve couldnt open /dev/sdX for write - not zeroing](https://www.claudiokuenzler.com/blog/1217/wipe-erase-data-replaced-raid-drive-couldnt-open-for-write-not-zeroing)
1. [Finding files on a RAID5 ext4 filesystem associated to bad blocks on one HDD](https://superuser.com/questions/1747207/finding-files-on-a-raid5-ext4-filesystem-associated-to-bad-blocks-on-one-hdd)
1. [The Butter goes on top (Safe BTRFS raid5/6)](https://forum.rockstor.com/t/the-butter-goes-on-top-safe-btrfs-raid5-6/2089)

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/027-mdadm-raid-5-on-qemu.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
