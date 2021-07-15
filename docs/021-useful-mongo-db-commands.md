# Useful MongoDB commands

1. Update all documents in a collection - set undefined (`null`) properties to some value:

```
db.collection_name.update( { "prop1" : null }, { $set: { "prop1" : [] } }, { multi : true } );
```
