# Preparing a Debian server for Docker services

OK! So first up is to make sure that the server is up to date.

```shell
aptitude update
update upgrade -y
shutdown -r now
```

Next we create a regular user. Running things under the root user increases the chance of the server being compromised or of botching the server altogether.

To be continued...

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/020-preparing-a-debian-server-for-docker-services.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
