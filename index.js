'use strict';
var express = require('express');
var session = require('express-session');
var csv = require("fast-csv");
var json2csv = require('json2csv');
var mongoose = require('mongoose');
var ssn ;
var Part = require("../model/part");
var Machine = require("../model/MachineName");
var Sub = require("../model/MachineSubcategory");

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
	
	var partFile = req.files.file;
	

	var parts = [];
		
	// csv
	 // .fromString(partFile.data.toString(), {
		 // headers: true,
		 // ignoreEmpty: true
	 // })
	 // .on("data", function(data){
		 // data['_id'] = new mongoose.Types.ObjectId();
		 
		 // parts.push(data);
	 // })
	 // .on("end", function(){
		// Part.create(parts, function(err, documents) {
			// if (err) throw err;
			
			// res.send(parts.length + ' authors have been successfully uploaded.');
		 // });
	 // });
	
	var newMachine = new Machine({
		Category:req.body.Category
	});
   let b = [];
	newMachine.save( function(err,data){
		if(err) throw err;
		var a = data._id;
		csv
	 .fromString(partFile.data.toString(), {
		 headers: true,
		 ignoreEmpty: true
	 })
	 .on("data", function(data){
		 data['_id'] = new mongoose.Types.ObjectId();
		 
		 parts.push(data);
	 })
	 .on("end", function(){
		Part.create(parts, function(err, result) {
			if (err) throw err;
		console.log("Hello"+result+"HEllo dozers");
		for(var i =0; i<result.length; i++){
			b.push(result[i]._id);
		
		}
		
        console.log(b);
				
			var newSub = new Sub({
		ModelName:req.body.ModelName,
		MainCategory:a,
		Spid:b
	})
			newSub.save();
			
			
			res.send(parts.length + ' authors have been successfully uploaded.');
			 var modelName = Sub.findOne({"ModelName": req.body.ModelName}, function(err,data){
			 console.log(data);
			 var a = data.ModelName;
			 console.log(a);
			 
		 });
		 });
	 });
		
	});
	
	
})	
	
	

};