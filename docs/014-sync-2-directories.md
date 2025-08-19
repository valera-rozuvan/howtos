# Sync 2 directories

```shell
rsync -cav --delete --progress "/dir/A/" "/dir/B"
```

Some explanation on what the various command options mean:

```text
-c, --checksum              skip based on checksum, not mod-time & size
-a, --archive               archive mode; equals -rlptgoD (no -H,-A,-X)
-v, --verbose               increase verbosity
    --delete                delete extraneous files from dest dirs
    --progress              show progress during transfer
```

Note the ending `slash` in the first directory path above (`"/dir/A/"`). The above command will make directory `B` the same as directory `A`, DELETING any file in `B` that is not present in `A`.

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/014-sync-2-directories.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
