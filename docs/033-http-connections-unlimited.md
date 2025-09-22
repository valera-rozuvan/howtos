# HTTP connections unlimited

Ever thought about how to craft a HTTP connection? Without tools such as `curl` or `wget`. For the purposes of testing some edge case of the HTTP1.1 protocol. Let's use the tools [netcat](https://en.wikipedia.org/wiki/Netcat) (`nc`) and [openssl](https://en.wikipedia.org/wiki/OpenSSL) for this purpose.

## without TLS

Plain HTTP request, POST to `google.com` port `80`, **NOTE** that we target an IP address (the `google.com` bit is specified in the header `Host` in the request body):

```shell
#!/bin/bash

HostDomain="google.com" ; \
HostIP="216.58.215.110" ; \
HostPort="80" ; \
dataToPost='{ data: "" }' ; \
dataLen=$(expr length "${dataToPost}" ) ; \
  ( printf "POST /api HTTP/1.1\r\n" ; \
    printf "Host: %s\r\n" "${HostDomain}" ; \
    printf "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0\r\n" ; \
    printf "Connection: close\r\n" ; \
    printf "Content-Length: %d\r\n" "$((dataLen+1))" ; \
    printf "Content-Type: application/x-www-form-urlencoded\r\n" ; \
    printf "\r\n" ; \
    printf "%s" "${dataToPost}" ; \
    sleep 1.5 ) | nc ${HostIP} ${HostPort}
```

## with TLS

HTTPs request (using certificates), POST to `google.com` port `443`, **NOTE** that we target an IP address (the `google.com` bit is specified in the header `Host` in the request body):

```shell
#!/bin/bash

HostDomain="google.com" ; \
HostIP="216.58.215.110" ; \
HostPort="443" ; \
dataToPost='{ data: "" }' ; \
dataLen=$(expr length "${dataToPost}" ) ; \
  ( printf "POST /test HTTP/1.1\r\n" ; \
    printf "Host: %s\r\n" "${HostDomain}" ; \
    printf "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0\r\n" ; \
    printf "Connection: close\r\n" ; \
    printf "Content-Length: %d\r\n" "$((dataLen+1))" ; \
    printf "Content-Type: application/x-www-form-urlencoded\r\n" ; \
    printf "\r\n" ; \
    printf "%s" "${dataToPost}" ; \
    sleep 1.5 ) | openssl s_client -connect ${HostIP}:${HostPort}
```

## some notes

In both of the above commands - you can see each line ends with `; \`. This makes it possible to just copy the multi-line Bash snippet, and paste into a terminal. It will run just fine (as long as your shell is `bash`).

Also, note the explicit new line `printf "\r\n"` being sent to the server. This is part of the HTTP standard, which implies that after a new line, there will be no more headers, and only the request body will follow.

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/033-http-connections-unlimited.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
