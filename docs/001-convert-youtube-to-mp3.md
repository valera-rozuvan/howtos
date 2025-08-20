# How to convert YouTube video to MP3 audio file for listening

1. Use [youtube-dl](https://rg3.github.io/youtube-dl/) for retrieving a YouTube URL.
2. Use [ffmpeg](https://www.ffmpeg.org/) to convert video file to WAV audio file:
    - the command is `ffmpeg -i input.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 output.wav`
3. Use [LAME](https://en.wikipedia.org/wiki/LAME) to convert WAV file to MP3 format:
    - the command is `lame --preset extreme input.wav output.mp3`

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/001-convert-youtube-to-mp3.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
