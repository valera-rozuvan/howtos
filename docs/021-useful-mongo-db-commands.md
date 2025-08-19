# Useful MongoDB commands

1. Update all documents in a collection - set undefined (`null`) properties to some value:

```javascript
db.collection_name.update( { "prop1" : null }, { $set: { "prop1" : [] } }, { multi : true } );
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/021-useful-mongo-db-commands.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
