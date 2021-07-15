# Compare 2 directories

1. First count number of files in a directory (recursively):

```
find DIR_1 -type f | wc -l
```

2. Then do the comparison, using `pv` to see progress:

```
diff -rqs DIR_1 DIR_2 | pv -l -s NUM_FILES > /tmp/logfile
```

Where `NUM_FILES` should be replaced with the number you got from the 1st command.

3. When `diff` finishes, you can run the following command to see if different files were found:

```
cat /tmp/logfile | grep -iv "identical"
```
