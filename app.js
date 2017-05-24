#!/usr/bin/env node
//config
// console.log('\x1B[36m%s\x1B[0m', info);  //cyan  
// console.log('\x1B[33m%s\x1b[0m:', path);  //yellow  
// var styles = {  
//     'bold'          : ['\x1B[1m',  '\x1B[22m'],  
//     'italic'        : ['\x1B[3m',  '\x1B[23m'],  
//     'underline'     : ['\x1B[4m',  '\x1B[24m'],  
//     'inverse'       : ['\x1B[7m',  '\x1B[27m'],  
//     'strikethrough' : ['\x1B[9m',  '\x1B[29m'],  
//     'white'         : ['\x1B[37m', '\x1B[39m'],  
//     'grey'          : ['\x1B[90m', '\x1B[39m'],  
//     'black'         : ['\x1B[30m', '\x1B[39m'],  
//     'blue'          : ['\x1B[34m', '\x1B[39m'],  
//     'cyan'          : ['\x1B[36m', '\x1B[39m'],  
//     'green'         : ['\x1B[32m', '\x1B[39m'],  
//     'magenta'       : ['\x1B[35m', '\x1B[39m'],  
//     'red'           : ['\x1B[31m', '\x1B[39m'],  
//     'yellow'        : ['\x1B[33m', '\x1B[39m'],  
//     'whiteBG'       : ['\x1B[47m', '\x1B[49m'],  
//     'greyBG'        : ['\x1B[49;5;8m', '\x1B[49m'],  
//     'blackBG'       : ['\x1B[40m', '\x1B[49m'],  
//     'blueBG'        : ['\x1B[44m', '\x1B[49m'],  
//     'cyanBG'        : ['\x1B[46m', '\x1B[49m'],  
//     'greenBG'       : ['\x1B[42m', '\x1B[49m'],  
//     'magentaBG'     : ['\x1B[45m', '\x1B[49m'],  
//     'redBG'         : ['\x1B[41m', '\x1B[49m'],  
//     'yellowBG'      : ['\x1B[43m', '\x1B[49m']  
// };  
var gulp = require('gulp'), 
    minifycss = require('gulp-minify-css'),
    clc = require('cli-color'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'), // check js syntac
    rename = require('gulp-rename'), // rename the files
    notify = require('gulp-notify'), // notify the msg during running tasks
		path = require('path'),
		copy = require('./copy.js'),
		runSequence = require('run-sequence').use(gulp);

gulp.task('minifycss', function() {
  return gulp.src(path.resolve(__dirname)+'/css/*.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss({compatibility: 'ie7'}))
    .pipe(gulp.dest(path.resolve(__dirname)+'/output_css'))
    .pipe(notify({ message: 'minifycss task complete' }));
});

//js压缩
gulp.task('minifyjs', function() { 
  return gulp.src(path.resolve(__dirname)+'/js/*.js')
    .pipe(jshint.reporter('default'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify({mangle: {except: ['require', 'exports', 'module', '$']}}))
    .pipe(gulp.dest(path.resolve(__dirname)+'/output_js'))
    .pipe(notify({ message: 'minifyjs task complete' }));
});


gulp.task('clean', function() { 
  return gulp.src([path.resolve(__dirname)+'/output_css/*.css', path.resolve(__dirname)+'/output_js/*.js'], {read: false})
    .pipe(clean());
});

// gulp.task('clean_dir', function(){
// 	return gulp.src([path.resolve(__dirname)+'/js/*.js', path.resolve(__dirname)+'/css/*.css'], {read: false})
//     .pipe(clean());
// });

gulp.task('jshint', function() {
  return gulp.src(path.resolve(__dirname)+'/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('complete!'));
});
gulp.task('check', function(){
	if(process.cwd() != path.resolve(__dirname)){
		return gulp.src([path.resolve(__dirname)+'/js/*.js', path.resolve(__dirname)+'/css/*.css'], {read: false});
	}else{
		return;
	}
});

//目标路径复制到cli目录
gulp.task('copy_js', function(){
	copy.copy('js');
});

//cli目录复制出去
gulp.task('write_js', function(){
	copy.write('js');
});

//目标路径复制到cli目录
gulp.task('copy_css', function(){
	copy.copy('css');
});

//cli目录复制出去
gulp.task('write_css', function(){
	copy.write('css');
});



var inputArgs = process.argv.splice(2),
	inputType = inputArgs[0],
	inputTarget = inputArgs[1];

switch(inputType){
	case 'mixin':
		switch(inputTarget){
			case '-js':
			console.log(clc.green('task minifyjs......start......'));
			var start = (new Date()).getTime();
			if(process.cwd() != path.resolve(__dirname)){
				runSequence('copy_js', 'minifyjs', 'write_js', function(){
					console.log(clc.yellow('command done took '+((new Date()).getTime() - start) +' ms'));
				});
			}else{
				runSequence('clean', 'minifyjs', function(){
					console.log(clc.yellow('command done took '+((new Date()).getTime() - start) +' ms'));
				});
			}
			break;
			
			case '-css':
			console.log(clc.green('task minifycss......start......'));
				var start = (new Date()).getTime();
				if(process.cwd() != path.resolve(__dirname)){
					runSequence('copy_css', 'minifycss', 'write_css', function(){
						console.log(clc.yellow('command done took '+((new Date()).getTime() - start) +' ms'));
					});
				}else{
					runSequence('clean', 'minifycss', function(){
						console.log(clc.yellow('command done took '+((new Date()).getTime() - start) +' ms'));
					});
				}
			break;

			default:
				console.log('cant find command called: ' + clc.red('mixin '+inputTarget));
		}
		
	break;
	case 'otherCommond':
		
		break;
	default:
		//cli-color:api
		// var error = clc.red.bold;
		// var warn = clc.yellow;
		// var notice = clc.blue;
		// clc.red.bgWhite.underline('Underlined red text on white background.'));
		console.log(clc.red('cant find command called:['+ inputArgs+']'));
}