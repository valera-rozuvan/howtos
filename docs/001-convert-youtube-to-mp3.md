# How to convert YouTube video to MP3 audio file for listening

We want to download a YouTube video, extract audio from it, and then convert it to an MP3.

## download the video

Use [youtube-dl](https://rg3.github.io/youtube-dl/) for retrieving a YouTube video.

**UPDATE**: Now it's 2025, and it seems that `youtube-dl` project on GitHub is [not well maintained](https://github.com/ytdl-org/youtube-dl/commits/master/). As of 2025-08-20, last commit was made three months ago. However, there is an active fork [yt-dlp](https://github.com/yt-dlp/yt-dlp). So best to use that for actual video retrieval.

## extract the audio

Use [ffmpeg](https://www.ffmpeg.org/) to extract audio from the video file, and save it as a WAV audio file. The command is:

```shell
ffmpeg -i input.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 output.wav
```

## convert to MP3

Use [LAME](https://en.wikipedia.org/wiki/LAME) to convert the WAV file to an MP3 file. The command is:

```shell
lame --preset extreme input.wav output.mp3
```

Now your `output.mp3` MP3 file is ready to be transferred to your MP3 player 😊

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/001-convert-youtube-to-mp3.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
