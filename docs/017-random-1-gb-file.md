# Random 1GB file

To create a random file (random name, random data) that is 1GB in size, you can use:

```shell
dd \
  if=/dev/urandom \
  of=/some_folder/`tr -dc A-Za-z0-9 </dev/urandom | head -c 26` \
  iflag=fullblock \
  oflag=direct \
  bs=64M \
  count=16 \
  status=progress
```

Note that you need to replace `some_folder` in the above command to the actual folder where you want the random files to be generated.

The sub command `tr -dc A-Za-z0-9 </dev/urandom | head -c 26` simply generates a random string containing 26 characters.

If you want to loop the command, and create `N` random files, you can use the following:

```shell
for i in {1..N}; do COMMAND; done
```

Where `COMMAND` should be replaced with the command to create 1 random file.

## Sample bash script

Here is a Bash script that will create 869 random files, each being 1GB in size. Make sure to properly set `FOLDER_TO_FILL`.

```shell
#!/bin/bash

FOLDER_TO_FILL=/some/system/path

for i in {1..869}; do
echo "Writing random file ${i} of 869:"
  dd \
    if=/dev/urandom \
    of=$FOLDER_TO_FILL/`tr -dc A-Za-z0-9 </dev/urandom | head -c 26` \
    iflag=fullblock \
    oflag=direct \
    bs=64M \
    count=16 \
    status=progress
done

echo "done; without errors ;)"
exit 0
```

## Using dcfldd tool

There is a tool available to write random data to a device called [dcfldd](https://github.com/resurrecting-open-source-projects/dcfldd). You can install it on any Linux system. For example, on a Debian based system:

```shell
sudo apt-get install dcfldd
```

Then figure out the device name from `dmesg` or `gparted`. Once you know the device name (for example `/dev/sda`), you can completely overwrite it with random data:

```shell
sudo dcfldd \
  if=/dev/urandom \
  of=/dev/sda \
  statusinterval=10 \
  status=progress \
  bs=10M \
  conv=notrunc
```

After the device is completely wiped, use `gparted` to format it with a new file system.

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/017-random-1-gb-file.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
