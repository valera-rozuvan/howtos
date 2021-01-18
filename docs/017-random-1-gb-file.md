# Random 1GB file

To create a random file (random name, random data) that is 1GB in size, you can use:

```
dd if=/dev/urandom of=/some_folder/`tr -dc A-Za-z0-9 </dev/urandom | head -c 26` iflag=fullblock oflag=direct bs=64M count=16 status=progress
```

If you want to loop the command, and create 14 random files, you can use the following:

```
for i in {1..14}; do COMMAND-HERE; done
```

Where `COMMAND-HERE` should be replaced with the command to create 1 random file.
