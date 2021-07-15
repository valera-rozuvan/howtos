# Random 1GB file

To create a random file (random name, random data) that is 1GB in size, you can use:

```
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

```
for i in {1..N}; do COMMAND; done
```

Where `COMMAND` should be replaced with the command to create 1 random file.

## Sample bash script

Here is a Bash script that will create 869 random files, each being 1GB in size. Make sure to properly set `FOLDER_TO_FILL`.

```
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
