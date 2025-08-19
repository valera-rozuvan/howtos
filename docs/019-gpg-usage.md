# GPG usage

Some notes for myself so that I can quickly lookup how to work with GPG.

## Basic commands

To generate a new key:

```shell
gpg --gen-key
```

If you want to have options as to what algorithm to use, and how long the key should be, use the expanded command:

```shell
gpg --full-generate-key
```

To list keys in long format:

```shell
gpg --keyid-format long --list-keys
```

To list keys in short format:

```shell
gpg --keyid-format short --list-keys
```

To get full public key:

```shell
gpg --export -a "User Name <user.name@example.com>"
```

To get full private key:

```shell
gpg --export-secret-key -a "User Name <user.name@example.com>"
```

To get a fingerprint:

```shell
gpg --fingerprint -a "User Name <user.name@example.com>"
```

Note - for all above commands, you can use the hash of the key (short or long version) instead of human readable ID (`User Name <user.name@example.com>`). Also, the flag `-a` instructs GPG to create ascii armored output (i.e. printer friendly, and not binary).

## Git and GPG setup on Linux for signing commits

To enable Git on Linux to sign your commits with GPG, add the following to your `.git/config` file, in the Git repo you want to sign commits in:

```text
[user]
  name = User Name
  email = user.name@example.com
  signingkey = 3178973D
[gpg]
  program = gpg2
[commit]
  gpgsign = true
```

The contents of your `~/.gnupg/gpg-agent.conf` file should be something like:

```text
default-cache-ttl 34560000
max-cache-ttl 34560000

default-cache-ttl-ssh 34560000
max-cache-ttl-ssh 34560000

pinentry-program /usr/bin/pinentry-curses
```

Make sure you install the `pinentry` program, I prefer the `curses` one (it's CLI friendly):

```shell
sudo aptitude install pinentry-curses
```

You need to configure your distro to use the `curses` version of `pinentry`. On Debian-like systems you can do:

```text
$ sudo update-alternatives --config pinentry
[sudo] password for valera:

There are 2 choices for the alternative pinentry (providing /usr/bin/pinentry).

  Selection    Path                      Priority   Status
------------------------------------------------------------
* 0            /usr/bin/pinentry-gnome3   90        auto mode
  1            /usr/bin/pinentry-curses   50        manual mode
  2            /usr/bin/pinentry-gnome3   90        manual mode

Press <enter> to keep the current choice[*], or type selection number: 1
update-alternatives: using /usr/bin/pinentry-curses to provide /usr/bin/pinentry (pinentry) in manual mode
```

Also, setup your shell to use `tty` for GPG (`pinentry`) for entering the passphrase. Add to your `~/.bashrc` file:

```text
export GPG_TTY=$(tty)
```

After all of this is done, when you do a Git commit, GPG will be automatically used to sign it. You can check signatures in Git commits with:

```shell
git log --show-signature
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/019-gpg-usage.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
