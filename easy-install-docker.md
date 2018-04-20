Install Docker
==============

Official instructions on how to install Docker on Debian can be found here:

- [Get Docker CE for Debian](https://docs.docker.com/install/linux/docker-ce/debian/)

The quick command is:

```
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

```
sudo docker run hello-world
```
