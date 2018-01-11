var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReaplce = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');
var copy = require('copy');

var config = {
  dist: 'dist/',
  src: 'src/',
  cssin: 'src/css/**/*.css',
  jsIn: 'src/js/**/*.js',
  jsVendorIn: 'src/vendor/*.js',
  imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
  htmlin: 'src/*.html',
  scssin: 'src/scss/**/*.scss',
  cssout: 'dist/css/',
  jsout: 'dist/js/',
  imgout: 'dist/img/',
  htmlout: 'dist/',
  scssout: 'src/css/',
  cssoutname: 'style.css',
  jsOutName: 'script.js',
  jsVendorOutName: 'vendor.js',
  cssreplaceout: 'css/style.css',
  jsreplaceout: 'js/script.js',
  vendors: ['node_modules/handlebars/dist/handlebars.min.js']
};

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('serve', ['sass', 'js'], function() {
  browserSync({
    server: config.dist
  });

  gulp.watch(config.jsIn, ['js']);
  gulp.watch(config.scssin, ['sass']);
  gulp.watch(config.cssin, ['css', 'reload']);
  gulp.watch([config.htmlin], ['html', 'reload']);
});

gulp.task('sass', function() {
  return gulp.src(config.scssin)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 3 versions']
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.scssout))
      .pipe(browserSync.stream());
});

gulp.task('css', function() {
  return gulp.src(config.cssin)
      .pipe(concat(config.cssoutname))
      .pipe(cleanCSS())
      .pipe(gulp.dest(config.cssout));
});

gulp.task('js', function() {
  return gulp.src(config.jsIn)
      .pipe(concat(config.jsOutName))
      //.pipe(uglify())
      .pipe(gulp.dest(config.jsout));
});

gulp.task('jsVendor', function() {
  return copy.each(config.vendors, 'src/vendor/', {flatten: true}, function(err) {
    if (err) return console.log(err);
    return gulp.src(config.jsVendorIn)
        .pipe(concat(config.jsVendorOutName))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsout));
  });
});

gulp.task('img', function() {
  return gulp.src(config.imgin)
      .pipe(changed(config.imgout))
      .pipe(imagemin())
      .pipe(gulp.dest(config.imgout));
});

gulp.task('html', function() {
  return gulp.src(config.htmlin)
      .pipe(htmlReaplce({
        'css': config.cssreplaceout
        // 'js': config.jsreplaceout
      }))
      .pipe(htmlMin({
        sortAttributes: true,
        sortClassName: true,
        collapseWhitespace: true
      }))
      .pipe(gulp.dest(config.dist))
});

gulp.task('clean', function() {
  return del([config.dist]);
});

gulp.task('build', function() {
  sequence('clean', ['html', 'jsVendor', 'js', 'css', 'img']);
});

gulp.task('default', ['serve']);