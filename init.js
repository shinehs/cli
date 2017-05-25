#!/usr/bin/env node
/*
* @Author: shine
* @Date:   2017-05-24 15:39:46
* @Last Modified by:   hs
* @Last Modified time: 2017-05-24 16:48:14
* @desc: tools
*/
'use strict';
var clc = require('cli-color'),
		gulp = require('./task/task.js'),
		path = require('path'),
		runSequence = require('run-sequence').use(gulp),
		inputArgs = process.argv.splice(2),
		workType = inputArgs[0],
		order = inputArgs[1];

function doQueueTask(type, dirType){
	var start = (new Date()).getTime();
	if(dirType){
		runSequence('copy_'+type, 'minify'+type, 'write_'+type, function(){
			console.log(clc.green('command copy '+type+' done took '+((new Date()).getTime() - start) +' ms......'));
		});
	}else{
		runSequence('clean', 'minify'+type, function(){
			console.log(clc.green('command copy '+type+' done took '+((new Date()).getTime() - start) +' ms......'));
		});
	}
}
switch(workType){
	case 'mixin':
		switch(order){
			case '-js':
				console.log(clc.yellow('task minifyjs......start......'));
				doQueueTask('js', process.cwd() != path.resolve(__dirname)?true:false);
			break;
			
			case '-css':
				console.log(clc.yellow('task minifycss......start......'));
				doQueueTask('css', process.cwd() != path.resolve(__dirname)?true:false);
			break;

			default:
				console.log('cant find command called: ' + clc.red('mixin '+order));
		}
	break;

	case 'otherCommond':
		//TODO
	break;

	default:
		console.log(clc.red('cant find command called:['+ inputArgs+']'));
}
