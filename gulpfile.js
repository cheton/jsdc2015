var pkg = require('./package.json'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    rimraf = require('gulp-rimraf'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    browserify = require('browserify'),
    transform = require('vinyl-transform'),
    uglify = require('gulp-uglify'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    through = require('through'),
    opn = require('opn'),
    path = require('path'),
    isDist = process.argv.indexOf('serve') === -1,
    mainBowerFiles = require('main-bower-files'),
    runSequence = require('run-sequence');

gulp.task('reveal', ['reveal-css', 'reveal-js', 'reveal-lib', 'reveal-plugin']);

gulp.task('reveal-css', function() {
    return gulp.src('node_modules/reveal.js/css/**/*')
        .pipe(gulp.dest('dist/vendor/reveal/css'));
});

gulp.task('reveal-js', function() {
    return gulp.src('node_modules/reveal.js/js/**/*')
        .pipe(gulp.dest('dist/vendor/reveal/js'));
});

gulp.task('reveal-lib', function() {
    return gulp.src('node_modules/reveal.js/lib/**/*')
        .pipe(gulp.dest('dist/vendor/reveal/lib'));
});

gulp.task('reveal-plugin', function() {
    return gulp.src('node_modules/reveal.js/plugin/**/*')
        .pipe(gulp.dest('dist/vendor/reveal/plugin'));
});

gulp.task('videos', function() {
    return gulp.src('src/videos/**/*')
        .pipe(gulp.dest('dist/videos'));
});

gulp.task('js', function() {
    return gulp.src('src/scripts/index.js')
        .pipe(isDist ? through() : plumber())
        .pipe(transform(function(filename) {
            var b = browserify(filename);
            return b.bundle();
        }))
        .pipe(uglify())
        .pipe(rename('app.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(connect.reload());
});

gulp.task('html', function() {
    return gulp.src('src/index.html')
        .pipe(isDist ? through() : plumber())
        .pipe(rename('index.html'))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('bower', function() {
    var options = {
        checkExistence: true,
        debugging: true,
        paths: {
            bowerDirectory: 'bower_components',
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        }
    };
    return gulp.src(mainBowerFiles(options), { base: 'bower_components/' })
        .pipe(gulp.dest('src/vendor/'))
        .pipe(gulp.dest('dist/vendor/'));
});

gulp.task('css', function() {
    return gulp.src(['src/styles/*.styl'])
        .pipe(isDist ? through() : plumber())
        .pipe(stylus({
          // Allow CSS to be imported from node_modules and bower_components
          'include css': true,
          'paths': ['./node_modules', './bower_components']
        }))
        //.pipe(autoprefixer('last 2 versions', { map: false }))
        //.pipe(isDist ? csso() : through())
        .pipe(gulp.dest('src/styles'))
        .pipe(rename('app.css'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(connect.reload());
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest('dist/images'))
        .pipe(connect.reload());
});

gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(rimraf());
});

gulp.task('clean:html', function() {
    return gulp.src('dist/index.html')
        .pipe(rimraf());
});

gulp.task('clean:js', function() {
  return gulp.src('dist/**/*.js')
    .pipe(rimraf());
});

gulp.task('clean:css', function() {
  return gulp.src('dist/**/*.css')
    .pipe(rimraf());
});

gulp.task('clean:images', function() {
  return gulp.src('dist/images/**/*.{png,jpg,gif}')
    .pipe(rimraf());
});

gulp.task('connect', ['build'], function(done) {
  connect.server({
    root: 'dist',
    livereload: true
  });

  opn('http://localhost:8080', done);
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/styles/**/*.styl', ['css','js']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch([
    'src/scripts/**/*.js',
  ], ['js']);
});

gulp.task('build', function(callback) {
    runSequence(
        'clean',
        'bower',
        [ 'reveal', 'videos', 'css', 'js', 'html', 'images' ]
    );
});
gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['build']);
