const gulp = require('gulp');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const del = require('del');
const concat = require('gulp-concat');
const runSequence = require('run-sequence');
const exec = require('child_process').exec;
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const imageResize = require('gulp-image-resize');

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

const cssNPMDependencies = [
	'bootstrap/dist/css/bootstrap.css',
	'font-awesome/css/font-awesome.min.css',
	'notie/dist/notie.css',
	'font-awesome/fonts/fontawesome-webfont.eot',
	'font-awesome/fonts/fontawesome-webfont.svg',
	'font-awesome/fonts/fontawesome-webfont.ttf',
	'font-awesome/fonts/fontawesome-webfont.woff',
	'font-awesome/fonts/fontawesome-webfont.woff2'
]

const jsNPMDependencies = [
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

const watchFiles = ['client/**/*.ts', 'client/**/*.scss', 'client/index.html', 'server/**/*.ts', 'client/**/*.html']


gulp.task('watch', function(){
 gulp.watch(watchFiles, ['build']);
 started = false;
});

gulp.task('build', function(callback){
    runSequence('clean', 'build:server', 'build:index', 'build:app', 'build:images', callback);
});

gulp.task('start-server', ['build', 'watch'], function (cb) {
		exec('node dist/server.js', {maxBuffer: 10000*5000}, function (err, stdout, stderr) {
	    console.log(stdout);
	    console.log("stderr" + stderr);
	    cb(err);
	    if(err){
	    	console.log(err);
	    }
	  });
});