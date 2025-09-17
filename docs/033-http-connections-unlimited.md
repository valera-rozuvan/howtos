# HTTP connections unlimited

Ever thought about how to craft a HTTP connection? Without tools such as `curl` or `wget`. For the purposes of testing some edge case of the HTTP1.1 protocol. Let's use the tools [netcat](https://en.wikipedia.org/wiki/Netcat) and [openssl](https://en.wikipedia.org/wiki/OpenSSL) for this purpose.

## without TLS

Plain HTTP request, POST to `example.com` port `80`:

```shell
connectToHost="example.com 80" ; \
dataToPost='{ data: "" }' ; \
dataLen=$(expr length "${dataToPost}" ) ; \
echo "data: ${dataToPost}" ; \
echo "data length: ${dataLen}" ; \
  ( printf "POST /test HTTP/1.1\r\n" ; \
    printf "Host: %s\r\n" "${connectToHost}" ; \
    printf "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0\r\n" ; \
    printf "Content-Length: %d\r\n" "$((dataLen+1))" ; \
    printf "Content-Type: application/x-www-form-urlencoded\r\n" ; \
    printf "\r\n" ; \
    printf "%s" "${dataToPost}" ; \
    sleep 1.5 ) | nc ${connectToHost}
```

## with TLS

HTTPs request (using certificates), POST to `example.com` port `443`:

```shell
connectToHost="example.com:443" ; \
dataToPost='{ data: "" }' ; \
dataLen=$(expr length "${dataToPost}" ) ; \
echo "data: ${dataToPost}" ; \
echo "data length: ${dataLen}" ; \
  ( printf "POST /test HTTP/1.1\r\n" ; \
    printf "Host: %s\r\n" "${connectToHost}" ; \
    printf "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0\r\n" ; \
    printf "Content-Length: %d\r\n" "$((dataLen+1))" ; \
    printf "Content-Type: application/x-www-form-urlencoded\r\n" ; \
    printf "\r\n" ; \
    printf "%s" "${dataToPost}" ; \
    sleep 1.5 ) | openssl s_client -connect ${connectToHost}
```

## some notes

In both of the above commands - you can see each line ends with `; \`. This makes it possible to just copy the multi-line Bash snippet, and paste into a terminal. It will run just fine.

Also, note the explicit new line `printf "\r\n"` being sent to the server. This is part of the HTTP standard, which implies that after a new line, there will be no more headers, and only the request body will follow.

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/033-http-connections-unlimited.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
