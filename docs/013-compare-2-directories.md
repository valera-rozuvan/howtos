# Compare 2 directories

1. First count number of files in a directory (recursively):

```shell
find DIR_1 -type f | wc -l
```

1. Then do the comparison, using `pv` to see progress:

```shell
diff -rqs DIR_1 DIR_2 | pv -l -s NUM_FILES > /tmp/logfile
```

Where `NUM_FILES` should be replaced with the number you got from the 1st command.

1. When `diff` finishes, you can run the following command to see if different files were found:

```shell
cat /tmp/logfile | grep -iv "identical"
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/013-compare-2-directories.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
