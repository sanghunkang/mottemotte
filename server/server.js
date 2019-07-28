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
var db;
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  db = client.db(DB_NAME);
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

// HOW TO ENSURE CALL FROM DIFFERENT CLIENT RETURN DIFFERENT CACHED DATA?
var cachedData = {};


function updateCacheData() {
  return 
}

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/getData', (req, res) => {
  console.log(req.query, 'API GETDATA');
  cachedData
  findDocuments(db, (docs)=> {
    res.send(JSON.stringify(docs)); 
  });
});

app.get('/api/insertJob', (req, res)=> {
  console.log(req.query, 'API:INSERT JOB')
  // insertDocuement(db, (doc)=> {
  
  res.send(JSON.stringify({'item': 'test'}));
  // });
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`))