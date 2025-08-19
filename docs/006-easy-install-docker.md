# Easy Install Docker

Official instructions on how to install Docker on Debian can be found here:

- [Get Docker CE for Debian](https://docs.docker.com/install/linux/docker-ce/debian/)

The quick command is:

```shell
sudo apt-get install -y \
     apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common && \
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add - && \
sudo add-apt-repository \
     "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
     $(lsb_release -cs) \
     stable" && \
sudo apt-get update && \
sudo apt-get install -y docker-ce docker-compose
```

Check that Docker is running:

```shell
sudo docker run hello-world
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/006-easy-install-docker.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
