# Update fork PR

How to update a forked repo from an upstream with git rebase (to update your PR). Suppose your PR branch is `patch-1` for repository `django/django`. You would do:

```
git remote add upstream https://github.com/django/django.git
git fetch upstream master
git rebase upstream/master
git push origin master --force
```

Then update your PR:

```
git checkout patch-1
git rebase master
git push --force origin patch-1
```
