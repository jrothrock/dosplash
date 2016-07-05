var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var del = require('del');
var concat = require('gulp-concat')
var runSequence = require('run-sequence');

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
	'bootstrap/dist/css/bootstrap.css'
]

var jsNPMDependencies = [
	'zepto/zepto.min.js',
    'systemjs/dist/system.src.js',
    'es6-shim/es6-shim.min.js',
    'systemjs/dist/system-polyfills.js',
    'angular2/bundles/angular2-polyfills.js',
    'angular2/bundles/http.js',
    'rxjs/bundles/Rx.js',
    'angular2/bundles/angular2.dev.js',
    'angular2/bundles/router.dev.js',
] 

gulp.task('build:index', function(){

	var mappedCSSPaths = cssNPMDependencies.map(function(file){return path.resolve('node_modules', file)}); 
    var mappedJSPaths = jsNPMDependencies.map(function(file){return path.resolve('node_modules', file)}); 

    var copyCSSNPMDependencies = gulp.src(mappedCSSPaths, {base:'node_modules'})
        .pipe(gulp.dest('dist/vendor/css'))

    var copyJSNPMDependencies = gulp.src(mappedJSPaths, {base:'node_modules'})
        .pipe(gulp.dest('dist/vendor/js'))
     
 
    var copyIndex = gulp.src('client/index.html')
        .pipe(gulp.dest('dist'))
    return [copyCSSNPMDependencies, copyJSNPMDependencies, copyIndex];
});

gulp.task('build:app', function(){
    var tsProject = ts.createProject('client/tsconfig.json');
    var tsResult = gulp.src('client/**/*.ts')
		.pipe(sourcemaps.init())
        .pipe(ts(tsProject))
	return tsResult.js
        .pipe(sourcemaps.write()) 
		.pipe(gulp.dest('dist'))
});

gulp.task('build', function(callback){
    runSequence('clean', 'build:server', 'build:index', 'build:app', callback);
});

var packagePaths = [ 'dist/**',
					'!node_modules',
					'!client',
					'!server',
					'!gulpfile.js',
					'!package.json']


gulp.task('default', ['build']);