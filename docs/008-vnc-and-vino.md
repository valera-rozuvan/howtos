# VNC and Vino

On the client:

1. Install the client: `sudo aptitude install xtightvncviewer`.
2. Setup SSH port forwarding: `ssh -L 12345:localhost:5900 user_name@123.123.123.123 -p 7001`. Edit username and IP.
3. In a separate terminal, start the client: `vncviewer localhost:12345 > /var/log/vnc-client.log 2>&1 &`.

On the server:

1. Install the server: `sudo aptitude install vino`.
2. Make sure SSH port is open. In our example it's 7001. Also, make sure client can connect via SSH (authorized key).
3. Start the server:

```shell
#!/bin/bash

export DISPLAY=:0

gsettings set org.gnome.Vino view-only false
gsettings set org.gnome.Vino prompt-enabled false
gsettings set org.gnome.Vino require-encryption false

/usr/lib/vino/vino-server > /var/log/vino-server.log 2>&1 &

echo "Done!"
exit 0
```

The above can be done via SSH. No need to have physical access to the server.

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/008-vnc-and-vino.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
