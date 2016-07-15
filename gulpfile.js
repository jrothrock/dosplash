var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var del = require('del');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');
// SERVER

gulp.task('clean', function(){
    return del('dist')
});


gulp.task('build:server', function () {
	var tsProject = ts.createProject('server/tsconfig.json');
    var tsResult = gulp.src('server/**/*.ts')
		.pipe(sourcemaps.init())
        .pipe(ts(tsProject))
	return tsResult.js
        .pipe(concat('server.js'))
        .pipe(sourcemaps.write()) 
		.pipe(gulp.dest('dist'))
});

// CLIENT

var cssNPMDependencies = [
	'bootstrap/dist/css/bootstrap.css',
	'font-awesome/css/font-awesome.min.css',
	'notie/dist/notie.css',
	'font-awesome/fonts/fontawesome-webfont.eot',
	'font-awesome/fonts/fontawesome-webfont.svg',
	'font-awesome/fonts/fontawesome-webfont.ttf',
	'font-awesome/fonts/fontawesome-webfont.woff',
	'font-awesome/fonts/fontawesome-webfont.woff2'
]

var jsNPMDependencies = [
	'zepto/zepto.min.js',
	'notie/dist/notie.min.js',
    'systemjs/dist/system.src.js',
    'es6-shim/es6-shim.min.js',
    'systemjs/dist/system-polyfills.js',
    'angular2/bundles/angular2-polyfills.js',
    'angular2/bundles/http.js',
    'rxjs/bundles/Rx.js',
    'angular2/bundles/angular2.dev.js',
    'angular2/bundles/router.dev.js'
] 

gulp.task('build:index', function(){

	var mappedCSSPaths = cssNPMDependencies.map(function(file){return path.resolve('node_modules', file)}); 
    var mappedJSPaths = jsNPMDependencies.map(function(file){return path.resolve('node_modules', file)}); 

    var copyCSSNPMDependencies = gulp.src(mappedCSSPaths, {base:'node_modules'})
        .pipe(gulp.dest('dist/vendor/css'))

    var copyJSNPMDependencies = gulp.src(mappedJSPaths, {base:'node_modules'})
        .pipe(gulp.dest('dist/vendor/js'))
     
    var copyIndex = gulp.src('client/**/*.html')
        .pipe(gulp.dest('dist'))
    return [copyCSSNPMDependencies, copyJSNPMDependencies, copyIndex];
});

gulp.task('build:app', function(){
    var tsProject = ts.createProject('client/tsconfig.json');
    var tsResult = gulp.src('client/**/*.ts')
		.pipe(sourcemaps.init())
        .pipe(ts(tsProject))
    var appCSS = gulp.src('client/**/*.scss')
	    .pipe(sass().on('error', sass.logError))
	    .pipe(gulp.dest('dist'));
	var appImages = gulp.src('client/app/assets/images/*')
		.pipe(gulp.dest('dist/app/assets/images'));
	var tsResultCopy = tsResult.js
        .pipe(sourcemaps.write()) 
		.pipe(gulp.dest('dist'));
	return [tsResultCopy, appCSS, appImages];
});

gulp.task('build:images', () =>
	gulp.src('uploads/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/app/assets/images'))
);

var watchFiles = ['client/**/*.ts', 'client/**/*.scss', 'client/index.html', 'server/**/*.ts', 'client/**/*.html']

var started = false;

gulp.task('watch', function(){
 gulp.watch(watchFiles, ['build']);
 started = false;
});

gulp.task('build', function(callback){
    runSequence('clean', 'build:server', 'build:index', 'build:app', 'build:images', callback);
});

gulp.task('start-server', ['build', 'watch'], function (cb) {
	if(!started){
		exec('node dist/server.js', {maxBuffer: 5000*1024}, function (err, stdout, stderr) {
	    console.log(stdout);
	    console.log(stderr);
	    cb(err);
	    started = true;
	  });
	}
});