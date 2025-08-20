# lint Markdown files

Install the awesome utility [markdownlint](https://github.com/markdownlint/markdownlint):

```shell
sudo apt install markdownlint
```

Your system now should have a binary called `mdl`. Use it on a file:

```shell
mdl /path/to/some/markdown-file.md
```

The `mdl` tool will report any linting errors to the `stdout`. For example,

```text
/path/to/some/markdown-file.md:34: MD013 Line length
/path/to/some/markdown-file.md:30: MD029 Ordered list item prefix
/path/to/some/markdown-file.md:32: MD029 Ordered list item prefix
```

If you want to turn off some linting rules, run:

```shell
mdl -r "~MD013,~MD029" /path/to/some/markdown-file.md
```

Now the `mdl` tool will lint the file, but not trigger warnings for the rules `MD013` and `MD029`.

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/030-lint-markdown-files.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
