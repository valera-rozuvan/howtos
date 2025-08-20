# Recursive sha256 workflow

Suppose you have a directory full of files and sub-directories. And you want to generate a file containing sha256 hashes for each file inside this directory. I.e. you want to do a recursive discovery of files, and capture their hashes (for the purpose of future checks against corruption).

We will be using the Linux `find` command for this. See documentations on the command [here](https://www.man7.org/linux/man-pages/man1/find.1.html) or [here](https://linux.die.net/man/1/find)).

We will demonstrate this on the following file/directory structure:

```text
./
./your-directory/
./your-directory/file1.txt
./your-directory/file2.txt
./your-directory/file3.txt
./your-directory/sub-dir/
./your-directory/sub-dir/file-a.txt
./your-directory/sub-dir/file-b.txt
```

The current working directory is `/home/valera/`. We want to capture all the hashes for files in the directory `your-directory`. We can run the following command:

```shell
find "$PWD/your-directory" -type f \( -exec sha256sum {} \; \) > "your-directory.sha256sum.txt"
```

This will produce the file `your-directory.sha256sum.txt` with the contents:

```text
6b4760c49609f114ac31583abbe8ea311db81e1168224305e7983b09f2489efa  /home/valera/your-directory/file3.txt
243e84bb86dbd338c2bfa7234c854138ae0f527058f25b3936d82b49cc6a57e8  /home/valera/your-directory/sub-dir/file-a.txt
50eb83755353c214c56f58b9dec49c5c24ed82dec4949ea42bf54030da5129b6  /home/valera/your-directory/sub-dir/file-b.txt
258c0f5de27847026784047593de7227d6b80bea3ad65c13e610b41dc3beca8b  /home/valera/your-directory/file2.txt
ccd6283e8c6245465205616d77cfda3f484844d365c086255329993862011c58  /home/valera/your-directory/file1.txt
```

Now, all the files have corresponding hashes. To check the validity of the files (to see if any are corrupt):

```shell
sha256sum --check --warn ./your-directory.sha256sum.txt
```

If all is OK, we will see the following output:

```text
/home/valera/your-directory/file3.txt: OK
/home/valera/your-directory/sub-dir/file-a.txt: OK
/home/valera/your-directory/sub-dir/file-b.txt: OK
/home/valera/your-directory/file2.txt: OK
/home/valera/your-directory/file1.txt: OK
```

## comparing two sha256sum.txt files

Say you have a backup somewhere, with the same contents as the folder `/home/valera/your-directory`. You have two checksum files, each with the `sha256` hashes of all the files. Each `sha256sum.txt` can contain a different order of files, but the hashes themselves should match for each file. Now, how do we compare, and be certain that the files contain the same hashes for matching files?

One quick approach is to get just the hashes from the checksum file, sort them alphabetically, and compute a hash of the results. Do this for both `sha256sum.txt` files, and compare the resulting hashes.

```shell
$ awk '{print $1}' "/mnt/backup/place/your-directory.sha256sum.txt" | sort | sha256sum
ebf4be0467b616ad13cd1707566eb4bc08fec12fc3517fafdff30d98a068a16f  -

$ awk '{print $1}' "/home/valera/your-directory.sha256sum.txt" | sort | sha256sum
ebf4be0467b616ad13cd1707566eb4bc08fec12fc3517fafdff30d98a068a16f  -
```

Remember to backup your data regularly. Enjoy ;)

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/026-recursive-sha256-workflow.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
