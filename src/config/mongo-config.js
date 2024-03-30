// // mongodbUtils.js
// import env from 'dotenv';
// import mongoose from 'mongoose';

// const { MongoClient } = require('mongodb');

// // Connection URI
// const uri = 'mongodb://localhost:27017';

// // Connect to MongoDB and return the database client
// async function connectToMongoDB() {
//   // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//   // await client.connect();
//   // console.log('Connected to MongoDB');
//   // return client;

//  return mongoose
//   .connect(mongoUri)
//   .then(() => {
//     if (process.env.NODE_ENV !== 'test') {
//       app.listen(port, () => {
//         console.log(`Server started on port ${port}`);
//       });
//     }
//   })
//   .catch((err) => {
//     console.log(`db connection error ${err}`);
//   });
// }

// // Get collection from the connected database
// function getCollection(client, dbName, collectionName) {
//   const database = client.db(dbName);
//   const collection = database.collection(collectionName);
//   return collection;
// }

// module.exports = { connectToMongoDB, getCollection };
