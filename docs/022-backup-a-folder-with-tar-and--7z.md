# Backup a folder with tar and 7z

First, make sure you have `7z` available. On Debian-based systems you can install 7z via:

```shell
sudo apt-get install p7zip-full p7zip-rar
```

Now, to backup the folder `./your-folder`, you can do so via:

```shell
tar -cvf - ./your-folder | 7z a -si your-folder.tar.7z
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/022-backup-a-folder-with-tar-and--7z.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
