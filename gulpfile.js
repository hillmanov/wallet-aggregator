var path          = require('path'),
    _             = require('lodash'),
    gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    concat        = require('gulp-concat'),
    less          = require('gulp-less'),
    gulpif        = require('gulp-if'),
    minimist      = require('minimist'),
    rimraf        = require('gulp-rimraf'),
    runSequence   = require('run-sequence'),
    templateCache = require('gulp-angular-templatecache'),
    ngAnnotate    = require('gulp-ng-annotate'),
    jade          = require('gulp-jade'),

    base          = 'src',
    dest          = 'dist',

    appLess       = applyPrefix(base, ['/less/main.less', '/less/**/*.less']),
    appJs         = applyPrefix(base, ['/js/app/*.js', '/js/app/angular/**/app.js', '/js/app/**/*.js', ]),
    appJsLibFiles = applyPrefix(base, ['/js/lib/jquery.min.js', '/js/lib/angular.js', '/js/lib/**/*.js']),
    appJadeFiles  = applyPrefix(base, ['/js/app/**/*.jade']),

    argv          = minimist(process.argv.slice(2)),
    compile       = argv.compile;

//////////////////////////////////////////////////
// Gulp tasks
//////////////////////////////////////////////////
gulp.task('default', function(cb) {
  runSequence(
    'clean',
    ['scripts:app', 'scripts:app:lib', 'templates:app', 'less:app' ],
    'run',
    cb
  );
});

gulp.task('clean', function(cb) {
    return gulp.src(dest).pipe(rimraf());
});

gulp.task('templates:app', function() {
  return gulp.src(appJadeFiles)
          .pipe(jade({locals: {}}))
          .pipe(templateCache({
            "module": 'walletAggregator',
            "root": '',
            base: function(file) {
              return 'templates/' + path.basename(file.relative);
            }
          }))
          .pipe(gulp.dest(dest + '/templates/'));
});

gulp.task('scripts:app', function() {
  return gulp.src(appJs)
          .pipe(ngAnnotate())
          .pipe(concat('app.js'))
          .pipe(gulp.dest(dest + '/js/'));
});

gulp.task('scripts:app:lib', function() {
   return gulp.src(appJsLibFiles)
            .pipe(concat('lib.js'))
            .pipe(gulp.dest(dest + '/js/'));
});

gulp.task('less:app', function() {
  return gulp.src(appLess[0])
            .pipe(less())
            .pipe(gulp.dest(dest + '/css/'));
});

gulp.task('run', function() {

  if (compile) {
    gutil.log("Build complete. Exiting.");
    process.exit();
  }

  gulp.watch(appJadeFiles,          ['templates:app']);
  gulp.watch(_.last(appJs),         ['scripts:app']);
  gulp.watch(_.last(appJsLibFiles), ['scripts:app:lib']);
  gulp.watch(appLess,               ['less:app']);
});

function applyPrefix(prefix, patterns) {
  return _.map(patterns, function(pattern) {
    if (pattern.indexOf('!') >= 0) {
      return '!' + prefix + pattern.replace('!', '');
    }
    return prefix + pattern;
  });
}
