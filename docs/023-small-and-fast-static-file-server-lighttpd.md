# Small and fast static file server - lighttpd

So you want to quickly share a file on your LAN with some other PC. Under Linux you can use the small static file server [lighttpd](https://www.lighttpd.net/).

First install deps. Assuming you are on a Debian based system, you can do:

```
sudo aptitude install lighttpd lighttpd-doc
```

Then create a config file `~/lighttpd.conf` with the contents:

```
server.document-root = "/home/{{USER}}/temp_file_serve/"
server.port = 10001
```

Replace `{{USER}}` above with your system user.

Then place some file in the folder `/home/{{USER}}/temp_file_serve/`. For example `test.txt`.

Final step is to run the static server. Do so with command:

```
lighttpd -D -f ~/lighttpd.conf
```

That's it! Assuming your PC (with the file `test.txt`) has the IP `192.168.0.10`, you can access the file from another PC on your LAN by running the command:

```
curl -s http://192.168.0.10:10001/test.txt | less
```
