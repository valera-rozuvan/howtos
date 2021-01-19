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
sd 8:0:0:0: [sda] Attached SCSI disk
EXT4-fs (sda1): mounting ext3 file system using the ext4 subsystem
EXT4-fs (sda1): mounted filesystem with ordered data mode. Opts: (null)
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

To eliminate currently existing partition table on the drive and create a new empty table, use the o option:

```
Command (m for help): o
```

That will return something like this:

```
Building a new DOS disklabel with disk identifier 0x2a43cc04.
Changes will remain in memory only, until you decide to write them.
After that, of course, the previous content won't be recoverable.
```

Now write the changes to with w option:

```
Command (m for help): w
```

That, if all went well, return this:

```
The partition table has been altered!
Calling ioctl() to re-read partition table.
Syncing disks.
```

6. Create a new partition.

Create a new primary partition that will contain the data encrypted with LUKS. For this, use fdisk again:

```
fdisk /dev/sda
```

Use the n option to create the new partition:

```
Command (m for help): n
```

Use the p option to make the new partition as primary (default option, pressing Enter is sufficient):

```
Partition type:
p   primary (0 primary, 0 extended, 4 free)
e   extended
Select (default p): p
```

The new primary partition will be the first (default option, pressing Enter is sufficient):

```
Partition number (1-4, default 1): 1
```

Indicate what will be the first sector of the new partition (the lowest default, pressing Enter is sufficient):

```
First sector (2048-1953525167, default 2048): 2048
```

Indicate which one will be the last sector of the new partition. In this case, a single primary partition will occupy the entire storage unit (the highest value default, pressing Enter is sufficient):

```
Last sector, +sectors or +size{K,M,G} (2048-1953525167, default 1953525167): 1953525167
```

Now you must write all changes, with w option:

```
Command (m for help): w
```

That, if all went well, return this:

```
The partition table has been altered!
Calling ioctl() to re-read partition table.
Syncing disks.
```

The new partition will now be accessible at `/dev/sda1`.

7. Encrypt the new partition.

Use the `cryptsetup` command with the `luksFormat` option to encrypt the new LUKS partition:

```
cryptsetup luksFormat /dev/sda1
```

It will ask if you are sure (escribre YES, in capitals) and a passphrase or a long-and-complex-password twice:

```
WARNING!
========
This will overwrite data on /dev/sda1 irrevocably.

Are you sure? (Type uppercase yes): YES
Enter LUKS passphrase: some_random_string
Verify passphrase: some_random_string
```

8. Format the new encrypted partition.

Use the `cryptsetup` command again but this time with the `luksOpen` option to decrypt the partition. You should also give it a unique name for the mapping, in this example we will use the name `LUKS0001`:

```
cryptsetup luksOpen /dev/sda1 LUKS0001
```

That prompted the assigned password in the previous step:

```
Enter passphrase for /dev/sda1: some_random_string
```

To format as EXT4

```
mkfs.ext4 /dev/mapper/LUKS0001 -L data
```

The `-L` option is used to provide a recognizable name to the unit.

Finally, close the partition:

```
cryptsetup luksClose LUKS0001
```

9. Testing

Now disconnect the storage device and reconnect. If all goes well, and depending on your desktop environment and how you have it configured, before you can access the contents of the storage device you must provide the assigned password.
