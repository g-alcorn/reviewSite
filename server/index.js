import app from "./server.js"
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

import RestaurantsDAO from "./dao/restaurantsDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";

dotenv.config();
const port = process.env.PORT || 8000;
async function run() {
  //Initialize connection
  try {
    await MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
      maxPoolSize: 50,
      wtimeoutMS: 2500,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch(e => {
      console.log('error!\n' + e);
    })
    .then(async client => {
      //Initial reference to restaurants DB
      await RestaurantsDAO.injectDB(client);
      await ReviewsDAO.injectDB(client);
      //Init server  
      app.listen(port, () => {
        console.log(`Connected to MongoDB Atlas. Server is listening on Port ${port} :-)`);
      });
    });
    //Verify connection
    await MongoClient.db("admin").command({ ping: 1 });
  } finally {
    await MongoClient.close();
  }
}

run().catch(console.dir);


// client.connect(err => {
//   console.log('connected');
//   console.log(err);
// })
// .catch(e => {
//   console.log(e);
// });

// .catch(err => {
//   console.error(err.stack);
//   process.exit(1);
// })
// .then(async clientData => {
//   //Initial reference to restaurants DB
//   await RestaurantsDAO.injectDB(clientData);
//   await ReviewsDAO.injectDB(clientData);
//   //Init server  
//   app.listen(port, () => {
//     console.log(`Listening on Port ${port}`);
//   });
// });