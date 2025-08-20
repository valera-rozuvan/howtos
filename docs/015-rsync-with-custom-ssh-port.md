# rsync with custom SSH port

```shell
rsync -cav --delete --progress -e 'ssh -p 7001' valera@192.168.0.1:/home/valera/temp/ ./temp
```

Some explanation on what the various command options mean:

```text
-c, --checksum              skip based on checksum, not mod-time & size
-a, --archive               archive mode; equals -rlptgoD (no -H,-A,-X)
-v, --verbose               increase verbosity
    --delete                delete extraneous files from dest dirs
    --progress              show progress during transfer
-e, --rsh=COMMAND           specify the remote shell to use
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/015-rsync-with-custom-ssh-port.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
