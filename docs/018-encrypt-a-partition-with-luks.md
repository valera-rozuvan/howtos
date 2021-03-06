# Encrypt a partition with LUKS

1. Extract all USB storage devices.

This is a safety precaution, so that you don't accidentally wipe the wrong device.

2. Connect the storage device to encrypt.

3. Determine which unit was assigned to the device to encrypt.

Use the `dmesg` command to get the name assigned to the recently connected device:

```
dmesg
```

You should see something along the lines of:

```
[117440.510553] sd 1:0:0:0: [sda] 30253056 512-byte logical blocks: (15.5 GB/14.4 GiB)
[117440.510797] sd 1:0:0:0: [sda] Write Protect is off
[117440.510798] sd 1:0:0:0: [sda] Mode Sense: 45 00 00 00
[117440.511013] sd 1:0:0:0: [sda] Write cache: disabled, read cache: enabled, doesn't support DPO or FUA
[117441.956462]  sda: sda1
[117441.957616] sd 1:0:0:0: [sda] Attached SCSI removable disk
```

Thus, in this example, the unit will be the `sda` (`/dev/sda`) and the first and only partition will be the `sda1` (`/dev/sda1`).

4. Unmount the partition.

```
umount /dev/sda1
```

5. Delete the partition table and create a new one.

```
fdisk /dev/sda
```

To eliminate currently existing partition table on the drive and create a new empty table, use the `o` option:

```
Command (m for help): o
```

That will return something like this:

```
Created a new DOS disklabel with disk identifier 0x8988023c.
```

Now write the changes to with `w` option:

```
Command (m for help): w
```

That, if all went well, return this:

```
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

6. Create a new partition.

Create a new primary partition that will contain the data encrypted with LUKS. For this, use `fdisk` again:

```
fdisk /dev/sda
```

Use the `n` option to create the new partition:

```
Command (m for help): n
```

Use the `p` option to make the new partition as primary (default option, pressing `Enter` is sufficient):

```
Partition type
   p   primary (0 primary, 0 extended, 4 free)
   e   extended (container for logical partitions)
Select (default p): p
```

The new primary partition will be the first (default option, pressing `Enter` is sufficient):

```
Partition number (1-4, default 1): 1
```

Indicate what will be the first sector of the new partition (the lowest default, pressing `Enter` is sufficient):

```
First sector (2048-30253055, default 2048):
```

Indicate which one will be the last sector of the new partition. In this case, a single primary partition will occupy the entire storage unit (the highest value default, pressing `Enter` is sufficient):

```
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-30253055, default 30253055):
```

If it asks if you want to remove the old partition signature, answer `Yes`:

```
Created a new partition 1 of type 'Linux' and of size 14,4 GiB.
Partition #1 contains a vfat signature.

Do you want to remove the signature? [Y]es/[N]o: Yes

The signature will be removed by a write command.
```

Now you must write all changes, with `w` option:

```
Command (m for help): w
```

That, if all went well, return this:

```
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

The new partition will now be accessible at `/dev/sda1`.

7. Encrypt the new partition.

Use the `cryptsetup` command with the `luksFormat` option to encrypt the new LUKS partition:

```
cryptsetup luksFormat /dev/sda1
```

It will ask if you are sure (answer `YES`, in capitals), and ask you for a passphrase twice:

```
WARNING!
========
This will overwrite data on /dev/sda1 irrevocably.

Are you sure? (Type uppercase yes): YES
Enter passphrase for /dev/sda1: some_random_string
Verify passphrase: some_random_string
```

8. Format the new encrypted partition.

Use the `cryptsetup` command again but this time with the `luksOpen` option to decrypt the partition. You should also give it a unique name for the mapping, in this example we will use the name `CRYPT_USB`:

```
cryptsetup luksOpen /dev/sda1 CRYPT_USB
```

That prompted the assigned password in the previous step:

```
Enter passphrase for /dev/sda1: some_random_string
```

To format as EXT4

```
mkfs.ext4 /dev/mapper/CRYPT_USB -L data
```

The `-L` option is used to provide a recognizable name to the unit (`data` in this case).

You should see something like this:

```
mke2fs 1.45.5 (07-Jan-2020)
Creating filesystem with 3777280 4k blocks and 944704 inodes
Filesystem UUID: 125f7d1e-8031-486a-b820-e641282109e2
Superblock backups stored on blocks:
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208

Allocating group tables: done
Writing inode tables: done
Creating journal (16384 blocks): done
Writing superblocks and filesystem accounting information: done
```

Finally, close the partition:

```
cryptsetup luksClose CRYPT_USB
```

9. Testing

Now disconnect the storage device and reconnect. If all goes well, and depending on your desktop environment and how you have it configured, before you can access the contents of the storage device you must provide the assigned password.
