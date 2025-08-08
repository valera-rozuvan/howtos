# Recursive sha256 workflow

Suppose you have a directory full of files and sub-directories. And you want to generate a file containing sha256 hashes for each file inside this directory. I.e. you want to do a recursive discovery of files, and capture their hashes (for the purpose of future checks against corruption).

We will be using the Linux `find` command for this. See documentations on the command [here](https://www.man7.org/linux/man-pages/man1/find.1.html) or [here](https://linux.die.net/man/1/find)).

We will demonstrate this on the following file/directory structure:

```text
./
./your-directory/
./your-directory/file1.txt
./your-directory/file2.txt
./your-directory/file3.txt
./your-directory/sub-dir/
./your-directory/sub-dir/file-a.txt
./your-directory/sub-dir/file-b.txt
```

The current working directory is `/home/valera/`. We want to capture all the hashes for files in the directory `your-directory`. We can run the following command:

```shell
find "$PWD/your-directory" -type f \( -exec sha256sum {} \; \) > "your-directory.sha256sum.txt"
```

This will produce the file `your-directory.sha256sum.txt` with the contents:

```text
6b4760c49609f114ac31583abbe8ea311db81e1168224305e7983b09f2489efa  /home/valera/your-directory/file3.txt
243e84bb86dbd338c2bfa7234c854138ae0f527058f25b3936d82b49cc6a57e8  /home/valera/your-directory/sub-dir/file-a.txt
50eb83755353c214c56f58b9dec49c5c24ed82dec4949ea42bf54030da5129b6  /home/valera/your-directory/sub-dir/file-b.txt
258c0f5de27847026784047593de7227d6b80bea3ad65c13e610b41dc3beca8b  /home/valera/your-directory/file2.txt
ccd6283e8c6245465205616d77cfda3f484844d365c086255329993862011c58  /home/valera/your-directory/file1.txt
```

Now, all the files have corresponding hashes. To check the validity of the files (to see if any are corrupt):

```shell
sha256sum --check --warn ./your-directory.sha256sum.txt
```

If all is OK, we will see the following output:

```text
/home/valera/your-directory/file3.txt: OK
/home/valera/your-directory/sub-dir/file-a.txt: OK
/home/valera/your-directory/sub-dir/file-b.txt: OK
/home/valera/your-directory/file2.txt: OK
/home/valera/your-directory/file1.txt: OK
```

Remember to backup your data regularly. Enjoy ;)
