# Small and fast static file server - lighttpd

So you want to quickly share a file on your LAN with some other PC. Under Linux you can use the small static file server [lighttpd](https://www.lighttpd.net/).

First install deps. Assuming you are on a Debian based system, you can do:

```shell
sudo aptitude install lighttpd lighttpd-doc
```

Then create a config file `~/lighttpd.conf` with the contents:

```text
server.document-root = "/home/{{USER}}/temp_file_serve/"
server.port = 10001
```

Replace `{{USER}}` above with your system user.

Then place some file in the folder `/home/{{USER}}/temp_file_serve/`. For example `test.txt`.

Final step is to run the static server. Do so with command:

```shell
lighttpd -D -f ~/lighttpd.conf
```

That's it! Assuming your PC (with the file `test.txt`) has the IP `192.168.0.10`, you can access the file from another PC on your LAN by running the command:

```shell
curl -s http://192.168.0.10:10001/test.txt | less
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/023-small-and-fast-static-file-server-lighttpd.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
