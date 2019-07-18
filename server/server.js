const express = require('express');
const app = express();
const port = 5000;

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const DB_NAME = 'mottemotte';
const COLLECTION_NAME = 'dev'; 

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(DB_NAME);
  
  app.get('/api/getData', (req, res) => {
    console.log(req.query, 'API GETDATA');
    findDocuments(db, (docs)=> {
      res.send(JSON.stringify(docs)); 
    });
  });

});

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(COLLECTION_NAME);
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log(`Found the following ${docs.length} records`);
    // console.log(docs)
    callback(docs);
  });
}



app.get('/', (req, res) => res.send('Hello World!'))




app.listen(port, () => console.log(`Example app listening on port ${port}!`))