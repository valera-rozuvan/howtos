How to convert YouTube video to MP3 audio file for listening

1. Use [youtube-dl](https://rg3.github.io/youtube-dl/) for retrieving a YouTube URL.
2. Use [ffmpeg](https://www.ffmpeg.org/) to convert video file to WAV audio file:
    - the command is `ffmpeg -i input.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 output.wav`
3. Use [LAME](https://en.wikipedia.org/wiki/LAME) to convert WAV file to MP3 format:
    - the command is `lame --preset extreme input.wav output.mp3`
