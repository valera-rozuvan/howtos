# Backup a folder with tar and 7z

First, make sure you have `7z` available. On Debian-based systems you can install 7z via:

```
sudo apt-get install p7zip-full p7zip-rar
```

Now, to backup the folder `./your-folder`, you can do so via:

```
tar -cvf - ./your-folder | 7z a -si your-folder.tar.7z
```
