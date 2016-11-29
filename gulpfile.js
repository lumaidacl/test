var gulp = require('gulp'),
  gulpPlugins = require('gulp-load-plugins'),
  runSequence = require('run-sequence'),
  browserSync = require('browser-sync'),
  del = require('del'),
  config = require('./config.json'),
  reload = browserSync.reload,
  webpack = require('webpack-stream'),
  $ = gulpPlugins(),
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

gulp.task('clean', function(){
    return del([ 'deploy/*', '.temporal' ]);
});

gulp.task('styles', function() {
  return gulp.src(config.projectDirectory + '/' + config.cssBundle)
    .pipe($.sourcemaps.init({debug: true}))
    .pipe($.stylus())
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.temporal/' + config.cssDirectory))
    .pipe($.size({title: 'Styles'}));
});

gulp.task('webpack', function() {
  return gulp.src(config.projectDirectory + '/' + config.jsRawBundle)
    .pipe(webpack({
      output: {
        filename: config.jsBundle
      },
      devtool: 'source-map'
    }))
    .pipe(gulp.dest('.temporal/' + config.jsDirectory));
});

gulp.task('serve', [ 'styles', 'webpack' ], function() {
  browserSync({
    open: false,
    notify: false,
    logPrefix: 'Initial Layout',
    server: {
      baseDir: [ '.temporal', config.projectDirectory ],
      // Middleware for SPA
      middleware: function(req, res, next) {
        if( config.spa ) {
          if(/\S\.{1}(jpg|jpeg|png|svg|css|js|map|ttf|eot|woff|html)/.test(req.url) !== true){
            req.url = '/index.html';
          }
        }
        return next();
      }
    }
  });

  gulp.watch(config.projectDirectory + '/**/*.html', reload);
  gulp.watch(config.projectDirectory + '/**/*.{styl,css}', ['styles', reload]);
  gulp.watch(config.projectDirectory + '/**/*.js', ['webpack',reload]);
  gulp.watch(config.projectDirectory + '/**/*.{jpg,jpeg,png,gif}', reload);
});
