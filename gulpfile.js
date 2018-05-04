var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

var cdnUrl = [
  [ '../builds/fonts/', 'https://s.anw.red/font/' ],
  [ 'assets/vue.js', 'https://s.anw.red/js/vue.min.js' ],
  [ 'assets/', 'https://s.anw.red/anyway.2017/' ]
];

gulp.task('default', function() {

	gulp.src('index.html')
		.pipe(plugins.cacheBust({
	        type: 'MD5',
	        basePath: './'
	    	}))
		.pipe(plugins.batchReplace(cdnUrl))
    .pipe(plugins.htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('builds'));

	gulp.src('assets/*.css')
		.pipe(plugins.cleanCss({compatibility: 'ie8'}))
    .pipe(plugins.batchReplace(cdnUrl))
    .pipe(gulp.dest('builds'));

  gulp.src('assets/main.js')
    .pipe(plugins.uglify())
    .pipe(gulp.dest('builds'));

});

gulp.task('watch', function() {
	gulp.watch(['*','*/*'], ['default']);
 });
