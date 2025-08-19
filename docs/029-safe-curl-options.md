# safe curl options

Many a times you see on project sites an option to quickly bootstrap the project by running a [curl](https://curl.se/) command, and piping to [bash](https://www.gnu.org/software/bash/). I discourage people from doing this. Instead, it's better to download the script, study it, and only then execute it. There is always a chance that the remote system has been compromised, and you don't want to run malicious code!

Let's consider the project [rust](https://www.rust-lang.org/). In the getting started guide, they provide the following code snippet to start using `rust`:

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Well, to instruct `curl` to download the file for inspection, just pass the `-o` flag:

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o rustup-install.sh
```

Then use any friendly editor to open the file `rustup-install.sh` and read the code inside.

## explanation of options

Here is an explanation of what some of the `curl` options above do:

```text
--proto '=https'
--proto <protocols>
       Tells  curl to use the listed protocols for its initial retrieval. Protocols are evaluated left to
       right, are comma separated, and are each a protocol name or 'all', optionally prefixed by zero  or
       more modifiers. Available modifiers are:

       +  Permit  this  protocol  in  addition  to protocols already permitted (this is the default if no
          modifier is used).

       -  Deny this protocol, removing it from the list of protocols already permitted.

       =  Permit only this protocol (ignoring the  list  already  permitted),  though  subject  to  later
          modification by subsequent entries in the comma separated list.

--tlsv1.2
       (TLS) Force curl to use TLS version 1.2 or later when connecting to a remote TLS server.

       In old versions of curl this option was documented to allow _only_ TLS 1.2. That behavior was
       inconsistent depending on the TLS library. Use --tls-max if you want to set a maximum TLS version.

-sSf
-s, --silent
       Silent or quiet mode. Don't show progress meter or error messages.  Makes Curl mute.

-S, --show-error
       When used with -s it makes curl show an error message if it fails.

-f, --fail
       (HTTP)  Fail  silently  (no  output at all) on server errors. This is mostly done to better enable
       scripts etc to better deal with failed attempts. In normal cases  when  a  HTTP  server  fails  to
       deliver  a  document,  it  returns an HTML document stating so (which often also describes why and
       more). This flag will prevent curl from outputting that and return error 22.

       This method is not fail-safe and there are occasions where non-successful response codes will slip
       through, especially when authentication is involved (response codes 401 and 407).

-o rustup-install.sh
-o, --output <file>
       Write output to the given file instead of stdout.

```

## tell curl to follow redirects

If you want `curl` to follow redirects when downloading something, specify the URL to download using the `-L` option. Updating the above command, we get:

```shell
curl --proto '=https' --tlsv1.2 -sSf -L https://sh.rustup.rs -o rustup-install.sh
```

Where:

```text
-L, --location
       (HTTP) If the server reports that the requested page has moved to a different location
       (indicated with a Location: header and a 3XX response code), this option makes curl redo
       the request to the new place. If used together with -i, --show-headers or -I, --head,
       headers from all requested pages are shown.

       When authentication is used, or when sending a cookie with "-H Cookie:", curl only sends
       its credentials to the initial host. If a redirect takes curl to a different host, it
       does not get the credentials passed on. See --location-trusted on how to change this.

       Limit the amount of redirects to follow by using the --max-redirs option.
```

## references

See full list of `curl` options at [curl man page](https://curl.se/docs/manpage.html).

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/029-safe-curl-options.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
