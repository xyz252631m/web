// 引入 gulp
var gulp = require('gulp');
// 引入组件
var htmlmin = require('gulp-htmlmin'), //html压缩
	imagemin = require('gulp-imagemin'),//图片压缩
	pngcrush = require('imagemin-pngcrush'),
	minifycss = require('gulp-minify-css'),//css压缩
	jshint = require('gulp-jshint'),//js检测
	uglify = require('gulp-uglify'),//js压缩
	concat = require('gulp-concat'),//文件合并
	connect = require('gulp-connect'), //包含服务器插件
	rename = require('gulp-rename'),//文件更名
	change = require('gulp-changed'),
	notify = require('gulp-notify'),//提示信息
	plumber = require('gulp-plumber');	//不中断
var src = "src";
var dest = "js";
//js 合并
gulp.task('js_concat', function () {
	//core
	var ps = ["fn","core", "config", "drag", "data","event", "elem", "alert"];
	//plugins
	var plugins = src + "/plugin/*.js";
	var list = [];
	ps.forEach(function (item) {
		item = src + "/" + item + ".js";
		list.push(item);
	});
	list.push(plugins);
	list.push(src + "/init.js");
	return [
		gulp.src(list)
			.pipe(concat('zhx.js'))
			 .pipe(plumber()) 
			.pipe(gulp.dest(dest))
			//.pipe(uglify())
			//.pipe(gulp.dest(dest))
			.pipe(notify({message: 'js zhx task ok'})),
		gulp.src(list)
			.pipe(concat('zhx.min.js'))
			 .pipe(plumber()) 
			//.pipe(gulp.dest(dest))
			.pipe(uglify({
				mangle: true,//类型：Boolean 默认：true 是否修改变量名
				compress: true,//类型：Boolean 默认：true 是否完全压缩
				//preserveComments: all //保留所有注释
			}))
			.pipe(gulp.dest(dest))
			.pipe(notify({message: 'js zhx.min task ok'}))
	]
});
//js 复制
gulp.task('js_other', function () {
	var list = [src + '/index.js',src + '/preview.js',src + '/search.js'];
	return gulp.src(list)
		.pipe(gulp.dest(dest))
		.pipe(connect.reload())
		.pipe(notify({message: 'js task ok'}));
})
gulp.task('js_watch', function () {
	var list = ["js_concat", "js_other"];
	gulp.watch([src + '/*.js', src + '/plugin/*.js'], list);
})