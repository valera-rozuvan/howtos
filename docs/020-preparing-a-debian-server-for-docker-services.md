# Preparing a Debian server for Docker services

OK! So first up is to make sure that the server is up to date.

```
aptitude update
update upgrade -y
shutdown -r now
```

Next we create a regular user. Running things under the root user increases the chance of the server being compromised or of botching the server altogether.

You can use the Bash script

