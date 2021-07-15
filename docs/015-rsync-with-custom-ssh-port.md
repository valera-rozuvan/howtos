# rsync with custom SSH port

```
rsync -rvz --info=progress2 --checksum -e 'ssh -p 7001' --progress valera@192.168.0.246:/home/valera/temp/ ./temp
```
