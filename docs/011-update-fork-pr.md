# Update fork PR

How to update a forked repo from an upstream with git rebase (to update your PR). Suppose your PR branch is `patch-1` for repository `django/django`. You would do:

```shell
git remote add upstream https://github.com/django/django.git
git fetch upstream master
git rebase upstream/master
git push origin master --force
```

Then update your PR:

```shell
git checkout patch-1
git rebase master
git push --force origin patch-1
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/011-update-fork-pr.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
