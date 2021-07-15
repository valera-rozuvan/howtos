# Sync 2 directories

```
rsync -cav --delete --progress "/dir/A/" "/dir/B"
```

Some explanation on what the various command options mean:

```
-c, --checksum              skip based on checksum, not mod-time & size
-a, --archive               archive mode; equals -rlptgoD (no -H,-A,-X)
-v, --verbose               increase verbosity
    --delete                delete extraneous files from dest dirs
    --progress              show progress during transfer
```

Note the ending `slash` in the first directory path above (`"/dir/A/"`). The above command will make directory `B` the same as directory `A`, DELETING any file in `B` that is not present in `A`.
