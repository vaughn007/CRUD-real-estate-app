var mongoose = require("mongoose");


var homeSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   address: String,
   city: String,
   bedrooms: String,
   bathrooms: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});



module.exports = mongoose.model("home", homeSchema);

// var mongoose = require("mongoose");
 
// var homeSchema = new mongoose.Schema({
//    name: String,
//    image: String,
//    description: String,
//    comments: [
//       {
//          type: mongoose.Schema.Types.ObjectId,
//          ref: "Comment"
//       }
//    ]
// });
 
// module.exports = mongoose.model("home", homeSchema);




/*var mongoose = require('mongoose');

//schem set up
var homeSchema = new mongoose.Schema({
    name: "String",
    image: "String",
    description: "String"
});

module.exports = mongoose.model("home", homeSchema); //we will get this model when rquire is used */