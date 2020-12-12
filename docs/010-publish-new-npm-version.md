# Publish new NPM version

```
git add .
git commit -m "New feature."
git push origin master
npm version patch
git push origin master
git push origin --tags
npm login
npm publish
```
