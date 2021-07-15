# rsync with custom SSH port

```
rsync -cav --delete --progress -e 'ssh -p 7001' valera@192.168.0.1:/home/valera/temp/ ./temp
```

Some explanation on what the various command options mean:

```
-c, --checksum              skip based on checksum, not mod-time & size
-a, --archive               archive mode; equals -rlptgoD (no -H,-A,-X)
-v, --verbose               increase verbosity
    --delete                delete extraneous files from dest dirs
    --progress              show progress during transfer
-e, --rsh=COMMAND           specify the remote shell to use
```
