/*
* @Author: shine
* @Date:   2017-05-22 16:55:56
* @Last Modified by:   hs
* @Last Modified time: 2017-05-24 16:56:46
* @desc: file copy
*/

'use strict';
var fs = require('fs'),
		path = require('path'),
		config = require('./../config.js'),
		clc = require('cli-color');

//遍历函数
function travel(dir, callback) {
  fs.readdirSync(dir).forEach(function(file) {
    var pathname = path.join(dir, file);
    if(fs.statSync(pathname).isDirectory()) {
      travel(file, callback);
    }else {
      callback(file);
    }
  });
}

//moudle
var copy = {
	write: function(type){
		var self = this;
		var i = 1;
		travel(config.output[type]['path'], function(filename){
			self.doCopy(type, filename);
			console.log(clc.bgCyan('done  '+i+'.'+filename));
			i++;
		}, function(){
			console.log('write done');
		});
	},
	copy:function(type){
		var self = this;
		self.cleanDir('output', type);
		self.cleanDir('input', type);
		travel(path.join(process.cwd()), function(filename){
			if(!/\.min/.test(filename)){
				self.doDir(type, filename);
			}
		}, function(){
			console.log('copy done');
		});
	},
	doDir:function(type, filename){
		var fileReadStream = fs.createReadStream(path.join(process.cwd())+'/'+filename);
		var fileWriteStream = fs.createWriteStream(config.input[type]['path']+'/'+filename);
		fileReadStream.pipe(fileWriteStream);
		// fileWriteStream.on('close', function(){  
		// 	console.log('done:'+filename);    
		// });  
	},
	doCopy:function(type, filename){
		var fileReadStream = fs.createReadStream(config.output[type]['path']+'/'+filename);  
		var fileWriteStream = fs.createWriteStream(path.join(process.cwd())+'/'+filename);
		fileReadStream.pipe(fileWriteStream);
		// fileWriteStream.on('close', function(){  
		// 	console.log('done:'+filename);    
		// });  
	},
	cleanDir:function(workType, type){
		//删除旧文件
		travel(path.join(config[workType][type]['path']), function(filename){
			fs.unlinkSync(config[workType][type]['path'] + '/' + filename);
		});
	}
};

module.exports = copy;