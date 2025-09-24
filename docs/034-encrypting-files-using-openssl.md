# using OpenSSL to encrypt strings and files on Linux

OpenSSL is a powerful cryptography toolkit. Did you know that you can use OpenSSL tools directly to encrypt files or strings? This HOWTO will provide you with some tips on this matter.

## encrypt and decrypt strings

First we can start by encrypting simple string. The following command will encrypt the string `This is my super secret text!`, and output the encrypted contents using `Base64` encoding:

```shell
echo "This is my super secret text!" | openssl enc -A -base64
```

with the output similar to:

```text
VGhpcyBpcyBteSBzdXBlciBzZWNyZXQgdGV4dCEK
```

Longer message to encrypt:

```shell
(
  printf "Aragorn sped on up the hill.\n" ; \
  printf "Every now and again he bent to the ground.\n" ; \
  printf "Hobbits go light, and their footprints are not easy even for a Ranger to read, but not far from the top a spring crossed the path, and in the wet earth he saw what he was seeking.\n" ; \
  printf "\n" ; \
  printf "'I read the signs aright,' he said to himself. 'Frodo ran to the hill-top. I wonder what he saw there? But he returned by the same way, and went down the hill again.'\n" ; \
) | openssl enc -A -base64
```

with the output similar to:

```text
QXJhZ29ybiBzcGVkIG9uIHVwIHRoZSBoaWxsLgpFdmVyeSBub3cgYW5kIGFnYWluIGhlIGJlbnQgdG8gdGhlIGdyb3VuZC4KSG9iYml0cyBnbyBsaWdodCwgYW5kIHRoZWlyIGZvb3RwcmludHMgYXJlIG5vdCBlYXN5IGV2ZW4gZm9yIGEgUmFuZ2VyIHRvIHJlYWQsIGJ1dCBub3QgZmFyIGZyb20gdGhlIHRvcCBhIHNwcmluZyBjcm9zc2VkIHRoZSBwYXRoLCBhbmQgaW4gdGhlIHdldCBlYXJ0aCBoZSBzYXcgd2hhdCBoZSB3YXMgc2Vla2luZy4KCidJIHJlYWQgdGhlIHNpZ25zIGFyaWdodCwnIGhlIHNhaWQgdG8gaGltc2VsZi4gJ0Zyb2RvIHJhbiB0byB0aGUgaGlsbC10b3AuIEkgd29uZGVyIHdoYXQgaGUgc2F3IHRoZXJlPyBCdXQgaGUgcmV0dXJuZWQgYnkgdGhlIHNhbWUgd2F5LCBhbmQgd2VudCBkb3duIHRoZSBoaWxsIGFnYWluLicK
```

To decrypt the encoded string back to its original message we need to reverse the order and add the `-d` option for decryption:

```shell
echo "VGhpcyBpcyBteSBzdXBlciBzZWNyZXQgdGV4dCEK" | openssl enc -d -base64
```

with the output:

```text
This is my super secret text!
```

For the longer text:

```shell
echo "QXJhZ29ybiBzcGVkIG9uIHVwIHRoZSBoaWxsLgpFdmVyeSBub3cgYW5kIGFnYWluIGhlIGJlbnQgdG8gdGhlIGdyb3VuZC4KSG9iYml0cyBnbyBsaWdodCwgYW5kIHRoZWlyIGZvb3RwcmludHMgYXJlIG5vdCBlYXN5IGV2ZW4gZm9yIGEgUmFuZ2VyIHRvIHJlYWQsIGJ1dCBub3QgZmFyIGZyb20gdGhlIHRvcCBhIHNwcmluZyBjcm9zc2VkIHRoZSBwYXRoLCBhbmQgaW4gdGhlIHdldCBlYXJ0aCBoZSBzYXcgd2hhdCBoZSB3YXMgc2Vla2luZy4KCidJIHJlYWQgdGhlIHNpZ25zIGFyaWdodCwnIGhlIHNhaWQgdG8gaGltc2VsZi4gJ0Zyb2RvIHJhbiB0byB0aGUgaGlsbC10b3AuIEkgd29uZGVyIHdoYXQgaGUgc2F3IHRoZXJlPyBCdXQgaGUgcmV0dXJuZWQgYnkgdGhlIHNhbWUgd2F5LCBhbmQgd2VudCBkb3duIHRoZSBoaWxsIGFnYWluLicK" | openssl enc -d -base64
```

with the output:

```text
Aragorn sped on up the hill.
Every now and again he bent to the ground.
Hobbits go light, and their footprints are not easy even for a Ranger to read, but not far from the top a spring crossed the path, and in the wet earth he saw what he was seeking.

'I read the signs aright,' he said to himself. 'Frodo ran to the hill-top. I wonder what he saw there? But he returned by the same way, and went down the hill again.'
```

## adding a password in the mix

To require that OpenSSL use a password, we specify some encryption algorithm to be used (let's try `aes-256` in `cbc` mode):

```shell
echo "This is my super secret text!" | openssl enc -aes-256-cbc -A -base64
```

you will be prompted for a password to use. We will use the string `password` as the password. The output will be a pseudo random looking string:

```text
U2FsdGVkX1/jhEok32IJFL+XaJz8sxe7wl4e4TjKe3dRXWKfWvb1xvqg0wbpV+Hg
```

Also - you probably got a warning like this:

```text
*** WARNING : deprecated key derivation used.
Using -iter or -pbkdf2 would be better.
```

## using a stronger key derivation function

Let's fix the warning in the previous step by using `PBKDF2` key derivation:

```shell
echo "This is my super secret text!" | openssl enc -aes-256-cbc -pbkdf2 -A -base64
```

with the output similar to:

```text
U2FsdGVkX18dpmY9MGPrcF3N2qhUp8BuG0aspK+QpUWaZ0XCruMF/BtNbfS1YnfZ
```

To decrypt this, you would do:

```shell
echo "U2FsdGVkX18dpmY9MGPrcF3N2qhUp8BuG0aspK+QpUWaZ0XCruMF/BtNbfS1YnfZ" | openssl enc -aes-256-cbc -pbkdf2 -d -base64
```

with the output:

```text
This is my super secret text!
```

## some more ciphers you can use

The cipher `-aes-256-cbc` is just one option. Some more `aes-256` modes that are available (streamable cipher modes):

```text
-aes-256-cfb
-aes-256-cfb1
-aes-256-cfb8
-aes-256-ctr
-aes-256-ecb
-aes-256-ofb
```

If you want to use something other than `aes-256`, you can get all available ciphers by checking:

```shell
openssl enc -ciphers
```

## specifying a password other than stdin

There are several options available to pass in a password. Use the option `-pass` to specify how a password should be received. For example:

```shell
echo "This is my super secret text!" | openssl enc -pass "pass:password" -aes-256-cbc -pbkdf2 -A -base64
```

More generally, the command line option is `-pass arg`, where arg can be one of:

```text
pass:password123
  The actual password is password123.

env:var123
  Obtain the password from the environment variable var123.

file:pathname
  The first line of pathname is the password.

fd:number
  Read the password from the file descriptor number.
  This can be used to send the data via a pipe for example.
```

## encrypting and decrypting files

To encrypt a file:

```shell
openssl enc \
  -pass "pass:password" \
  -aes-256-cbc \
  -pbkdf2 \
  -in ./secret_file.txt \
  -out ./secret_file.txt.encrypted
```

Then to decrypt the file:

```shell
openssl enc \
  -pass "pass:password" \
  -aes-256-cbc \
  -pbkdf2 \
  -d \
  -in ./secret_file.txt.encrypted \
  -out ./secret_file.txt.decrypted
```

At this point the files `secret_file.txt` and `secret_file.txt.decrypted` should match bit for bit. You can verify this by comparing their checksums:

```shell
sha256sum secret_file.txt
sha256sum secret_file.txt.decrypted
```

## encrypting and decrypting directories

We will use `tar` for creating an archive from a folder, and compress with `lzma`. We will pipe it to `openssl` for encryption. Try this:

```shell
tar --lzma -cvp ./folder_to_encrypt | openssl enc -pass "pass:password" -aes-256-cbc -pbkdf2 -out ./encrypted_folder.img
```

To decrypt:

```shell
openssl enc -pass "pass:password" -aes-256-cbc -pbkdf2 -d -in ./encrypted_folder.img | tar --lzma -x
```

## salt versus nosalt

In all of the above examples, there was some behind-the-scenes magic going on :) I want to draw your attention to one aspect of it. The `salt` bit.

Consider the following command line (note the extra `-p` flag, which prints the encryption parameters used):

```shell
echo 'Hello, world!' | openssl enc -aes-256-cbc -pbkdf2 -a -salt -k hello -p
```

If you run that command several times, you will see that each time a different salt is used, and the resulting encrypted string is different:

```text
$ echo 'Hello, world!' | openssl enc -aes-256-cbc -pbkdf2 -a -salt -k hello -p
salt=9D265FC810577A16
key=FED4451A123A6C04890C3E8C3E830202AB8BE69CEE02BA7899485A4FE195E79D
iv =589738E391FBA82FD6F566623C81C1C9
U2FsdGVkX1+dJl/IEFd6FqmJFysC95Vd8Rje8S7rzt0=

$ echo 'Hello, world!' | openssl enc -aes-256-cbc -pbkdf2 -a -salt -k hello -p
salt=0C2DDB3DB3C61216
key=C4D55B54C67BD956BACF8F7D93C23B95BDFF79D93D141124BB8104F50C99B134
iv =923D12C2ADF0A8D2F1A044865659AD4A
U2FsdGVkX18MLds9s8YSFvkMHIIHTpowz8vEMpVcb6I=

$ echo 'Hello, world!' | openssl enc -aes-256-cbc -pbkdf2 -a -salt -k hello -p
salt=80D2A8B9F1F7A547
key=B22C8EFC06DB20017A817F000CA0CE24D86F3FC6FF52760222D072D112A012E6
iv =03E1F0CCDD4C166B647336F237FBD4E0
U2FsdGVkX1+A0qi58felR+lomBgsHcvWiLs6nW146+0=
```

If you want to get reproducible encrypted strings - you need to turn off the `salt`, by passing the `-nosalt` option:

```shell
echo 'Hello, world!' | openssl enc -aes-256-cbc -pbkdf2 -a -nosalt -k hello -p
```

Running the above command several times, you will see that each time the output is the same:

```text
key=F8143D3FA993AEC44D36C42ECE3B259E2F93544B3557F7DBCEC03693CBBA6929
iv =FEC680D19AEC1FFA7FDC8743BBD3BE48
15p8T+vigKswlUQAaTN3iQ==
```

## using asymmetric cryptography

Let's generate a private and a public key using `openssl`:

```shell
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 > private.pem
openssl rsa < private.pem -pubout > public.pem
```

Note the key size of `16384`. The larger the key - the large the file you can encrypt using asymmetric cryptography.

Let's create some file to test the encryption:

```shell
echo "Hello, world!" > ./file_to_encrypt
```

To encrypt the file:

```shell
openssl pkeyutl -encrypt -pubin -inkey ./public.pem -in ./file_to_encrypt -out ./file_to_encrypt.encrypted
```

To decrypt the file:

```shell
openssl pkeyutl -decrypt -inkey ./private.pem -in ./file_to_encrypt.encrypted -out ./file_to_encrypt.decrypted
```

Let's verify that the input file and the decrypted file match:

```shell
sha256sum ./file_to_encrypt
sha256sum ./file_to_encrypt.decrypted
```

You should get the same checksum `d9014c4624844aa5bac314773d6b689ad467fa4e1d1a50a1b8a99d5a95f72ff5`.

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/034-encrypting-files-using-openssl.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
