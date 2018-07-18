
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'SZHM19';

// Use connect method to connect to the server
module.exports = {
    // 发送信息并跳转页面
    mess(response,message,url){
        response.setHeader('content-type','text/html');
        response.send(`<script>alert("${message}");window.location.href="${url}"</script>`);
    },
    // 增加
    insert(collectionName,docs,callback){
       MongoClient.connect(url, function(err, client) {
       
         const db = client.db(dbName);
         const collection = db.collection(collectionName);
         // Insert some documents
         collection.insertOne(docs,(err,result)=>{
             callback(err,result);
             client.close();
         });
       
       });
   },
    // 查询
    find(collectionName,query,callback){
        MongoClient.connect(url, function(err, client) {
        
          const db = client.db(dbName);
          const collection = db.collection(collectionName);
          // Insert some documents
          collection.find(query).toArray((err,docs)=>{
              callback(err,docs);
              client.close();
          });
        
        });
    },
    // 删除
    delete(collectionName,query,callback){
        MongoClient.connect(url, function(err, client) {
        
          const db = client.db(dbName);
          const collection = db.collection(collectionName);
          // Insert some documents
          collection.deleteOne(query,(err,result)=>{
              callback(err,result);
              client.close();
          });
        
        });
    },
    // 修改
    update(collectionName,query,doc,callback){
        MongoClient.connect(url, function(err, client) {
        
          const db = client.db(dbName);
          const collection = db.collection(collectionName);
          // Insert some documents
          collection.updateOne(query,{
              $set:doc
          },(err,result)=>{
              callback(err,result);
              client.close();
          });
        
        });
    },

}