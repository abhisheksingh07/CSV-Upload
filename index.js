'use strict';
let express = require('express');
let session = require('express-session');
let csv = require("fast-csv");
let json2csv = require('json2csv');
const mongoose = require('mongoose');
let ssn ;
let Part = require("../model/part");
let Machine = require("../model/MachineName");
let Sub = require("../model/MachineSubcategory");

module.exports = function(app) {
app.get('/', function(req, res) {
         ssn=req.session;
		 console.log(ssn);
		res.render('product');
		
    }); 
		
app.post('/', function(req,res){
		 
	console.log(req.files);	
	if (!req.files)
	return res.status(400).send('No files were uploaded.');
	
	let partFile = req.files.file;
	

	let parts = [];
	let newMachine = new Machine({
		Category:req.body.Category
	});
   	let b = [];
	newMachine.save( function(err,data){
		if(err) throw err;
		let a = data._id;
		//csv file upload function
		csv.fromString(partFile.data.toString(), {
		 headers: true,
		 ignoreEmpty: true
	 	}).on("data", function(data){
		 data['_id'] = new mongoose.Types.ObjectId();
		 parts.push(data);
	 }).on("end", function(){
		Part.create(parts, function(err, result) { //this function creates the part collection in db
		if (err) throw err;
		console.log("Hello"+result+"HEllo dozers");
		for(let i =0; i<result.length; i++){
		b.push(result[i]._id);
		}
		console.log(b);
		let newSub = new Sub({
		ModelName:req.body.ModelName,
		MainCategory:a,
		Spid:b
		})
		newSub.save();
		res.send(parts.length + ' authors have been successfully uploaded.');
		let modelName = Sub.findOne({"ModelName": req.body.ModelName}, function(err,data){
		console.log(data);
		let a = data.ModelName;
		console.log(a);
		 });
		 });
	 });
		
	});
	})	
	};
