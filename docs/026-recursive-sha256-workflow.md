# recursive sha256 workflow

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
awk '{print $1}' "/mnt/backup/place/your-directory.sha256sum.txt" | sort | uniq | sha256sum
```

with output:

```text
ebf4be0467b616ad13cd1707566eb4bc08fec12fc3517fafdff30d98a068a16f  -
```

```shell
awk '{print $1}' "/home/valera/your-directory.sha256sum.txt" | sort | uniq | sha256sum
```

with output:

```text
ebf4be0467b616ad13cd1707566eb4bc08fec12fc3517fafdff30d98a068a16f  -
```

## using make for incremental updates of a hashsum file

In theory (and in practice!), using a build system such as `make`, we can automatically update our `sha256sum.txt` file when any of the source files we are tracking change. Since upon changes, the last modified timestamp is updated, make can easily figure out which hashsums need to be updated.

So if we keep a separate folder (we will use `.sha` in this example) full of individual hashsum files (each one corresponding to a source file we are tracking), make can then update only those whose source file is newer than the hashsum file.

The build result will be the final `sha256sum.txt`, which is just a concatenation of all the individual hashsum files.

Considering our example from the top, we are going to write a `Makefile` to work with the source files in the folder `stuff`:

```Makefile
.DEFAULT_GOAL := no_default_target
no_default_target:
	@echo "Error: No default target defined. Please specify a target: sha, check, clean-all, clean-cache, and clean."
	@exit 1

SHAS := $(patsubst stuff/%, .sha/stuff/%, $(shell find stuff/ -type f))

sha: .sha/stuff $(SHAS) stuff.sha256sum.txt stuff.sha256sum.txt.sha

.sha/stuff:
	mkdir -p .sha/stuff

.sha/stuff/%: stuff/%
	mkdir -p "`dirname $@`"
	sha256sum $< > $@

stuff.sha256sum.txt: $(SHAS)
	cat $(SHAS) > stuff.sha256sum.txt
	sort -k2 -o stuff.sha256sum.txt stuff.sha256sum.txt

stuff.sha256sum.txt.sha: stuff.sha256sum.txt
	sha256sum "stuff.sha256sum.txt" > "stuff.sha256sum.txt.sha"

.PHONY: check
check:
	sha256sum --check --warn --quiet "stuff.sha256sum.txt"
	sha256sum --check --warn --quiet "stuff.sha256sum.txt.sha"

.PHONY: clean-all
clean-all: clean-cache clean

.PHONY: clean-cache
clean-cache:
	rm -rf .sha/

.PHONY: clean
clean:
	rm -rf "stuff.sha256sum.txt"
	rm -rf "stuff.sha256sum.txt.sha"
```

Studying the above `Makefile`, I hope the various commands are clear. Run `make sha` to create initial hashsum files. Note that there is also the `stuff.sha256sum.txt.sha` created, with the intent to be able to check the consistency of the `stuff.sha256sum.txt` file. When any files change in the folder `stuff/`, you just run `make sha` again, and the necessary hashsums will be recalculated (and updated in the resulting `stuff.sha256sum.txt` file.

There are two big downsides to this approach. First, the source folder `stuff/` is hard coded. Maybe one can parameterize the `Makefile`, I don't have that much experience with `make` to know for sure.

The other (even bigger) downside is that `make` doesn't accept files (and folders) with spaces (and other special symbols). So you have to make sure that all the sub-folders and files in `stuff/` are named using just alpha-numeric characters and the `-` character.

A simple Bash script to check for illegal characters:

```shell
#!/bin/bash

find "$PWD/" -name "* *"
find "$PWD/" -name "*)*"
find "$PWD/" -name "*(*"
find "$PWD/" -name "*[*"
find "$PWD/" -name "*]*"
find "$PWD/" -name "*}*"
find "$PWD/" -name "*{*"
find "$PWD/" -name "*:*"
find "$PWD/" -name "*;*"
find "$PWD/" -name "*,*"
find "$PWD/" -name "*\$*"
find "$PWD/" -name "*#*"
find "$PWD/" -name "*\\\*"
find "$PWD/" -name "*~*"
find "$PWD/" -name "*\`*"
find "$PWD/" -name "*\'*"
find "$PWD/" -name "*\"*"
find "$PWD/" -name "*\!*"
find "$PWD/" -name "*|*"
find "$PWD/" -name "*@*"
find "$PWD/" -name "*%*"
find "$PWD/" -name "*^*"
find "$PWD/" -name "*&*"
find "$PWD/" -name "*\**"
find "$PWD/" -name "*=*"
find "$PWD/" -name "*+*"
find "$PWD/" -name "*>*"
find "$PWD/" -name "*<*"
find "$PWD/" -name "*\?*"

exit 0
```

## final thoughts

After several iterations of trying different approaches for automation, I decided to go with a small Bash script which satisfies my needs almost 100%. You can find it at [valera-rozuvan/bash-scripts/utils/update-sha256-hashes.sh](https://github.com/valera-rozuvan/bash-scripts/blob/main/utils/update-sha256-hashes.sh).

Remember to backup your data regularly. Enjoy ;)

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/026-recursive-sha256-workflow.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
