# Setup git-shell user

We want to create a Linux user with git repositories in his home directories. External systems should be able to ssh+git to this user's repos, but not be able to do general SSH login with this user.

## create a new user

First, create a new user `vrs`, specify a home directory, and set the default shell to `git-shell`:

```shell
sudo useradd --create-home --base-dir /home/gitreps --shell /usr/bin/git-shell vrs
```

You can see the list of available shells with the command:

```shell
cat /etc/shells
```

Even though `/etc/shells` might not list the shell `/usr/bin/git-shell`, the shell does exists (**if** you have installed `git` on the system).

Later on, if you need to login with the user for some reason, you can do so by assigning the user the `/bin/bash` shell:

```shell
sudo usermod --shell /bin/bash vrs
```

You can check the current user's shell with the command:

```shell
echo $SHELL
```

Now, let's setup the password for `vrs`:

```shell
sudo passwd vrs
```

Let's add our main user to the new user's group `vrs`:

```shell
sudo usermod --append --groups vrs valera
```

## setup new user's home directory

We will clean up the `vrs` home directory, and set proper permissions:

```shell
sudo rm -rf /home/gitreps/.[!.] /home/gitreps/.??*
sudo chmod 0775 /home/gitreps
```

NOTE: permission `0775` translates to `rwxrwxr-x`.

From this point on, our regular user can create directories, and write files to the home directory of `vrs`.

Let's setup the special directory `git-shell-commands`, and copy some boilerplate files from `https://github.com/git/git/tree/master/contrib/git-shell-commands`:

```shell
mkdir /home/gitreps/git-shell-commands

cat > /home/gitreps/git-shell-commands/no-interactive-login <<\EOF
#!/bin/sh
printf '%s\n' "Hi $USER! You've successfully authenticated, but I do not"
printf '%s\n' "provide interactive shell access."
exit 128
EOF



cat > /home/gitreps/git-shell-commands/help <<\EOF
#!/bin/sh

if tty -s
then
	echo "Run 'help' for help, or 'exit' to leave.  Available commands:"
else
	echo "Run 'help' for help.  Available commands:"
fi

cd "$(dirname "$0")"

for cmd in *
do
	case "$cmd" in
	help) ;;
	*) [ -f "$cmd" ] && [ -x "$cmd" ] && echo "$cmd" ;;
	esac
done
EOF



cat > /home/gitreps/git-shell-commands/list <<\EOF
#!/bin/sh

print_if_bare_repo='
	if "$(git --git-dir="$1" rev-parse --is-bare-repository)" = true
	then
		printf "%s\n" "${1#./}"
	fi
'

find -type d -name "*.git" -exec sh -c "$print_if_bare_repo" -- \{} \; -prune 2>/dev/null
EOF



chmod a+x /home/gitreps/git-shell-commands/no-interactive-login
chmod a+x /home/gitreps/git-shell-commands/help
chmod a+x /home/gitreps/git-shell-commands/list
```

Now the setup of the home directory is done!

## setup of ssh

Install the ssh server:

```shell
sudo aptitude install -y openssh-server
```

Proper configs for SSH server:

```shell
rm -rf /etc/ssh_banner
rm -rf /etc/ssh/sshd_config
rm -rf /etc/ssh/ssh_config



cat > /etc/ssh/ssh_config <<\EOF
Host *
    SendEnv LANG LC_*
    HashKnownHosts yes
    GSSAPIAuthentication yes
EOF



cat > /etc/ssh/sshd_config <<\EOF
Port 7001
PermitRootLogin no
StrictModes yes
MaxAuthTries 6
MaxSessions 10
ClientAliveInterval 120

PubkeyAuthentication yes

PasswordAuthentication yes
# PasswordAuthentication no
PermitEmptyPasswords no

ChallengeResponseAuthentication no

UsePAM yes

X11Forwarding no
PrintMotd no

AcceptEnv LANG LC_*
Banner /etc/ssh_banner

AllowUsers vrs
EOF



cat > /etc/ssh/sshd_config <<\EOF
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█
█░░║║║╠─║─║─║║║║║╠─░░█
█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
EOF
```

Now, for the configs to take effect, depending on what your Linux distro is, you will either run (for Debian based distros):

```shell
sudo service ssh restart
```

or on Ubuntu 22.10 and later (and derivative distros):

```shell
sudo systemctl daemon-reload
sudo systemctl restart ssh.socket
```

See discussion at [SSHd now uses socket-based activation (Ubuntu 22.10 and later)](https://discourse.ubuntu.com/t/sshd-now-uses-socket-based-activation-ubuntu-22-10-and-later/30189).

## adding git repositories

The simplest way to create new git repositories, is to use our system user to issue git commands, and then `sudo` to modify the permissions of newly created git repo:

```shell
git init --bare /home/gitreps/new-git-repo.git
sudo chown --recursive vrs:vrs /home/gitreps/
sudo chgrp --recursive vrs /home/gitreps/
```

## working with git repos over SSH

Let's test this setup locally. For ease of use, add an entry to your `~/.ssh/config`:

```text
Host laptop
  Hostname localhost
  Port 7001
  User vrs
  IdentitiesOnly no
```

Then you can clone the git repository:

```shell
mkdir -p ~/dev && cd ~/dev
git clone laptop:new-git-repo.git
```

You will see the SSH banner, and be prompted for a password (the one you set for the user `vrs`). If all was done correctly, you should be able to clone the repo to your local user directory.

If you have a remote machine which can access your system via the network, you can also test the ssh+git workflow from it. Just use the correct IP address of your system.

## checking that regular SSH with git user is not possible

If you try to connect directly via SSH, you should see an error message:

```text
$ ssh -p 7001 vrs@localhost
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█
█░░║║║╠─║─║─║║║║║╠─░░█
█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
vrs@localhost's password:

Last login: Fri Aug 15 05:00:54 2025 from 127.0.0.1
Hi vrs! You've successfully authenticated, but I do not
provide interactive shell access.
Connection to localhost closed.
```

You can however run the defined commands `help`, and `list`:

```text
 ssh -p 7001 vrs@localhost help
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█
█░░║║║╠─║─║─║║║║║╠─░░█
█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
vrs@localhost's password:
Run 'help' for help.  Available commands:
list
no-interactive-login


$ ssh -p 7001 vrs@localhost list
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█
█░░║║║╠─║─║─║║║║║╠─░░█
█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
vrs@localhost's password:
new-git-repo.git


$ ssh -p 7001 vrs@localhost no-interactive-login
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█
█░░║║║╠─║─║─║║║║║╠─░░█
█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
vrs@localhost's password:
Hi vrs! You've successfully authenticated, but I do not
provide interactive shell access.
```

And for any other commands, you will receive a generic `unrecognized command` error:

```text
$ ssh -p 7001 vrs@localhost date
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█
█░░║║║╠─║─║─║║║║║╠─░░█
█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
vrs@localhost's password:
fatal: unrecognized command 'date'
```

## references

Some technical info on git-shell:

- [git-shell](https://git-scm.com/docs/git-shell)
- [Sample programs callable through git-shell](https://github.com/git/git/blob/master/contrib/git-shell-commands/README)
  - [help](https://github.com/git/git/blob/master/contrib/git-shell-commands/help)
  - [list](https://github.com/git/git/blob/master/contrib/git-shell-commands/list)

My SSH setup docs:

- https://github.com/valera-rozuvan/bash-scripts/blob/main/linux-setup/07-setup-ssh-server.sh
- https://github.com/valera-rozuvan/dotfiles/tree/main/openssh-server

Debian SSH docs:

- [SSH](https://wiki.debian.org/SSH)

Recent updates to SSH/SSHD on Ubuntu:

- [SSHd now uses socket-based activation (Ubuntu 22.10 and later)](https://discourse.ubuntu.com/t/sshd-now-uses-socket-based-activation-ubuntu-22-10-and-later/30189)
- [ssh/sshd breaking changes in 24.04](https://askubuntu.com/questions/1550366/ssh-sshd-breaking-changes-in-24-04)
- [SSH connection refused](https://askubuntu.com/questions/1533119/ssh-connection-refused)
- [SSH default port not changing (Ubuntu 22.10 and later)](https://askubuntu.com/questions/1439461/ssh-default-port-not-changing-ubuntu-22-10-and-later)

Passing ssh options to git:

- [Passing ssh options to git clone](https://stackoverflow.com/questions/7772190/passing-ssh-options-to-git-clone)

Git `safe.directory` warnings:

- ["git submodule update" failed with 'fatal: detected dubious ownership in repository at...'](https://stackoverflow.com/questions/72978485/git-submodule-update-failed-with-fatal-detected-dubious-ownership-in-reposit)
- [CVE-2022-24765](https://nvd.nist.gov/vuln/detail/cve-2022-24765)
- [https://github.com/git/git/commit/8959555cee7ec045958f9b6dd62e541affb7e7d9](https://github.com/git/git/commit/8959555cee7ec045958f9b6dd62e541affb7e7d9)
