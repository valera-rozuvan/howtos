# Sync 2 directories

```
rsync -avu --delete --progress "/dir/A/" "/dir/B"
```

Note the ending `slash` in the first directory path above (`"/dir/A/"`). The above command will make directory `B` the same as directory `A`, DELETING any file in `B` that is not present in `A`.
