var express = require('express');
var path = require('path');
var app = express();
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var events = require('events');
// var req = require("./node_modules/req/node_modules/request");
var debugLog = require('debug-log')('pds');
var debug = require('debug')('http')
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var twilio = require('twilio/lib');
var client = twilio('AC0a67c4ddd5f316ca8ca0915ff733e2ba', 'a009f36d454e7daeeebd99c4adf995e1');
var multer  = require('multer');

var db = mongojs('contactList',['contactList']);
db.on('connect', function () {
    console.log('database connected')
})

app.use(express.static('public'));

debug('booting %s', app);
app.use(express.static(path.join(process.cwd(),"/../Client")));
app.use(bodyParser.json());

app.listen(3000);
debug('listening');
console.log("server running on port 3000");

//API to get all the contacts information
app.get("/contactlist",function(req,res){
	
	console.log("i received a get request");
	db.contactList.find(function(err,docs){
		console.log("documents",docs);
		res.json(docs);
	}
	
	);
});


//function to store the image to the destination
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
	 console.log("file: ",file); 
    cb(null,'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

//function call to upload the image  
var upload = multer({ storage: storage })

//API to create the contact along with storing the image as well as the form data together in the DB.
app.post('/contactlist', upload.single('file'), function (req, res, next){

  // req.file is the `avatar` file 
  // req.body will hold the text fields, if there were any 
  
  var eventEmitter = new events.EventEmitter();
  //console.log('ffff',req.file.originalname);
	eventEmitter.on('saveFormData', function(formData,formFilePath){
		console.log("body Content",formData);		
		
		db.contactList.insert(req.body.userData,function(err,doc){
			if(err){
				console.log("Err: ",err);
				res.status(500).json({message: "Unexpected Error", data:{}, res: false});
			}else {
				console.log('DOC :',doc);
				var uniqueContactID = doc._id;
				 eventEmitter.emit('saveImage_UrltoContact',uniqueContactID);
			}			
		});		
	});
	
	 eventEmitter.on('saveImage_UrltoContact', function(uniqueContactID){
		var id = uniqueContactID;
		var fpath = "/imagePlaceholder.jpg";
		if(typeof req.file !== "undefined"){
			fpath = "/uploads/"+req.file.originalname;
		}		
		db.contactList.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {filePath:fpath}},new: true},
		function(err,doc){
		console.log('final_Doc',doc)
		res.status(200).json({message: "Success", data:doc, res: true});
		
	});
		 });
	if(typeof req.body.userData !== "undefined"){
		eventEmitter.emit('saveFormData',req.body,req.file);
	} else {
		res.status(200).json({message: "No Data", data:{}, res: true});
	}	
});

//API to delete a contact
app.delete("/contactlist/:id",function(req,res){
	var id = req.params.id;
	console.log(id);
	db.contactList.remove({_id: mongojs.ObjectId(id)}, function(err,doc){
		res.json(doc);
	})
});

//API to get single contact information.
app.get("/contactlist/:id",function(req,res){
	var id = req.params.id;
	console.log(id);
	db.contactList.findOne({_id: mongojs.ObjectId(id)}, function(err,doc){
		if(err){
			console.log("Edit ERR: ",err);
		} else {
			console.log("editResponse :",doc);
			res.json(doc);
		}		
	});
});


//API to update one contact
app.post("/contactlistUpdate/:id", upload.single('file'),function(req,res){
	var id = req.params.id;
	
	
	var updateDoc = {  
      $set:{  
         firstName:req.body.userData.firstName,
         lastName:req.body.userData.lastName,
         phoneNumber:req.body.userData.phoneNumber,
         email:req.body.userData.email         
      }
   }
   
   if(typeof req.file !== "undefined"){
		fpath = "/uploads/"+req.file.originalname;
		updateDoc.$set.filePath = fpath;	
	}	
	console.log(req.body, req.params);
	db.contactList.findAndModify({query: {_id: mongojs.ObjectId(id)},
	update: updateDoc ,new: true},
		function(err,doc){
		res.json(doc);
	});
}); 