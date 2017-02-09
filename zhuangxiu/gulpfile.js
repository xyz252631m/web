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
	notify = require('gulp-notify');//提示信息
var src = "src";
var dest = "js";
// 检查js
gulp.task('lint', function () {
	var list = [src + "/assist.js", src + "/date.js", src + "/day-public.js", src + "/desire.js", src + "/downTip.js",
		src + "/overdueTip.js", src + "/reApply.js"
	];
	return gulp.src(list)
		.pipe(change(src))
		.pipe(jshint())
		//.pipe(jshint.reporter('default'))
		.pipe(notify({message: 'lint task ok'}));
});
//js 合并
gulp.task('js_concat', function () {
	//core
	var ps = ["core", "config", "drag", "event", "elem", "alert"];
	//plugins
	var plugins = src + "/plugin/*.js"; //["banner","hr","textNav","imgAd","goodsList"];
	var list = [];
	ps.forEach(function (item) {
		item = src + "/" + item + ".js";
		list.push(item);
	});
	//plugins.forEach(function (item) {
	//	item = src + "/plugin/" + item + ".js";
	//	list.push(item);
	//});
	list.push(plugins);
	list.push(src + "/init.js");
	return [
		gulp.src(list)
			.pipe(concat('zhx.js'))
			.pipe(gulp.dest(dest))
			//.pipe(uglify())
			//.pipe(gulp.dest(dest))
			.pipe(notify({message: 'js zhx task ok'})),
		gulp.src(list)
			.pipe(concat('zhx.min.js'))
			.pipe(gulp.dest(dest))
			.pipe(uglify())
			//.pipe(gulp.dest(dest))
			.pipe(notify({message: 'js zhx.min task ok'}))
		//gulp.src([src + '/day-public.js', src + '/desire.js'])
		//	.pipe(concat('desire.js'))
		//	.pipe(gulp.dest(dest))
		//	.pipe(notify({message: 'js desire task ok'})),
		//gulp.src([src + '/day-public.js', src + '/downTip.js'])
		//	.pipe(concat('downTip.js'))
		//	.pipe(gulp.dest(dest))
		//	.pipe(notify({message: 'js downTip task ok'})),
		//gulp.src([src + '/day-public.js', src + '/overdueTip.js'])
		//	.pipe(concat('overdueTip.js'))
		//	.pipe(gulp.dest(dest))
		//	.pipe(notify({message: 'js overdueTip task ok'})),
		//gulp.src([src + '/day-public.js', src + '/reApply.js'])
		//	.pipe(concat('reApply.js'))
		//	.pipe(gulp.dest(dest))
		//	.pipe(notify({message: 'js reApply task ok'}))
	]
});
//js 复制
gulp.task('js_other', function () {
	//var list = [src + "/*.js", "!" + src + "/day-public.js",
	//	"!" + src + "/assist.js", "!" + src + "/desire.js",
	//	"!" + src + "/downTip.js", "!" + src + "/overdueTip.js",
	//	"!" + src + "/reApply.js"
	//];
	var list = [src + '/index.js'];
	return gulp.src(list)
		.pipe(gulp.dest(dest))
		.pipe(connect.reload())
		.pipe(notify({message: 'js task ok'}));
})
//js 压缩
gulp.task('js_min', function () {
	return gulp.src(dest + "/zhx.js")
		.pipe(uglify())
		.pipe(rename("zhx.min.js"))
		.pipe(gulp.dest(dest))
		.pipe(notify({message: 'js zhx.min task ok'}))
})
gulp.task('js_watch', function () {
	var list = ["js_concat", "js_other"];
	gulp.watch([src + '/*.js', src + '/plugin/*.js'], list);
})