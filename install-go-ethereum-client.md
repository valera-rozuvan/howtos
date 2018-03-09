Install go-ethereum client
==========================

1. Install [go-lang](https://golang.org) latest version ([original instructions](https://golang.org/doc/install)):
```
cd ~/temp
wget https://dl.google.com/go/go1.10.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.10.linux-amd64.tar.gz
rm -rf go1.10.linux-amd64.tar.gz
```

2. Add `go` binary to `PATH`. To update `~/.bashrc` file, run:
```
echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.bashrc
```

3. Login and logout (or run `source ~/.bashrc`) so that changes propagate to `PATH`.

4. Clone and build [go-ethereum](https://github.com/ethereum/go-ethereum) latest version:
```
cd ~
mkdir dev
cd dev
git clone https://github.com/ethereum/go-ethereum.git
cd go-ethereum
git checkout v1.8.1
make -j 2 geth
```

5. Make a symbolic link to `geth` so that you can run it from anywhere (**adjust the source path as necessary!**):
```
sudo ln -s /home/ubuntu/dev/go-ethereum/build/bin/geth /usr/bin/geth
```
