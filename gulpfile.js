var gulp = require('gulp'),
	gulpPlugins = require('gulp-load-plugins')(),
	runSequence = require('run-sequence'),
	browserSync = require('browser-sync'),
  del = require('del'),
	config = require('./config.json'),
	reload = browserSync.reload,
	$ = gulpPlugins,
	AUTOPREFIXER_BROWSERS = [
		'ie >= 10',
		'ie_mob >= 10',
		'ff >= 30',
		'chrome >= 34',
		'safari >= 7',
		'opera >= 23',
		'ios >= 7',
		'android >= 4.4',
		'bb >= 10'
	];

gulp.task('jshint', function () {
  return gulp.src( config.app.jsDir + '/*.js' )
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter(config.app.js.jsHintReporter))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('styles', function () {
  return gulp.src(config.app.css.sources)
    .pipe($.sourcemaps.init())
    .pipe($.changed(config.app.css.tmpDirectory, {extension: '.css'}))
    .pipe($.stylus())
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(config.app.css.tmpDirectory))
    /*.pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('deploy/styles'))*/
    .pipe($.size({title: 'Styles'}));
});

gulp.task('server', ['styles'], function () {
  browserSync({
    notify: false,    
    logPrefix: 'Initial Layout',    
    server: config.app.server
  });

  gulp.watch(config.files.watch.html, reload);
  gulp.watch(config.files.watch.styles, ['styles', reload]); // edited by Julio 
  gulp.watch(config.files.watch.js, ['jshint']);
  gulp.watch(config.files.watch.img, reload);
});

gulp.task('clean', del.bind(null, config.files.cleanPaths, {dot: true}));

//var assets = $.useref.assets({searchPath: '{.tmp,app}'});

gulp.task('deploy', function () {
  return gulp.src(config.deploy.from, {
    dot: true
  }).pipe(gulp.dest(config.deploy.to))
    .pipe($.size({title: 'copy'}));
});

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['jshint','deploy'], cb);
});

// Load custom tasks from the `tasks` directory
//try { require('require-dir')('tasks'); } catch (err) { console.error(err); }