'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var mqpacker = require('css-mqpacker');
var rigger = require('gulp-rigger');
var del = require("del");
var server = require("browser-sync").create();
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');


// browser-sync server

gulp.task('server', function(done) {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('sass/**/*.{scss,sass}', gulp.series('style:dev'));
  gulp.watch('*.html', gulp.series('html:update'));
  gulp.watch('template/*.html', gulp.series('html:update'));
  gulp.watch('*.php', gulp.series('php:update'));
  gulp.watch('js/**/*.js', gulp.series('js:update'));
  gulp.watch('img/**/*.{png,jpg,svg,gif}', gulp.series('img:copy'));

  done();
});

// browser-sync server reload

gulp.task('server:reload', function (done) {
  server.reload();
  done();
});

// html assembly

gulp.task('html:assembly', function(done) {
  return gulp.src('*.html')
    .pipe(rigger())
    .pipe(gulp.dest('build/'));

  done();
});

// wath copy

gulp.task('css:copy', function(done) {
  return gulp.src('sass/*.css')
    .pipe(gulp.dest('build/css'));

  done();
});

gulp.task('js:copy', function(done) {
  return gulp.src('js/**/*.js')
    .pipe(gulp.dest('build/js'));

  done();
});

gulp.task('img:copy', function(done) {
  return gulp.src('img/**/*.{png,jpg,svg,ico,jpeg}')
    .pipe(gulp.dest('build/img'));

  done();
});

gulp.task('php:copy', function(done) {
  return gulp.src('*.php')
    .pipe(gulp.dest('build'));

  done();
});

// wath compress

gulp.task('js:compress', function (done) {
  return gulp.src('build/js/script.js')
    .pipe(babel({
    presets: ['@babel/env']
  }))
    .pipe(uglify())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest('build/js'));

  done();
});

// wath update

gulp.task('html:update', gulp.series('html:assembly', 'server:reload'), function(done) {
  done();
});

gulp.task('php:update', gulp.series('php:copy', 'server:reload'), function(done) {
  done();
});

gulp.task('js:update', gulp.series('js:copy', 'js:compress', 'server:reload'), function(done) {
  done();
});

// copy

gulp.task('copy', function(done) {
  return gulp.src([
    'fonts/**/*.{woff,woff2,ttf,eot,svg}',
    'img/**',
    'js/**',
    '*.php',
    '*.html'
  ], {
    base: '.'
  })
    .pipe(gulp.dest('build'));

  done();
});

// clean

gulp.task('clean', function(done) {
  return del('build');

  done();
});

// imagemin

gulp.task('images', function(done) {
  return gulp.src('build/img/**/*.{png,jpg}')
    .pipe(imagemin([
    imagemin.optipng({optimizationlevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
    .pipe(gulp.dest('build/img'));

  done();
});

// style:dev

gulp.task('style:dev', function(done) {
  gulp.src('sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
    autoprefixer({browsers: [
      'last 2 versions'
    ]}),
    mqpacker({
      sort: true
    })
  ]))

    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());

  done();
});

// style:build

gulp.task('style:build', function(done) {
  gulp.src('sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
    autoprefixer({browsers: [
      'last 2 versions'
    ]}),
    mqpacker({
      sort: true
    })
  ]))

    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());

  done();
});

// npm start

gulp.task('build', gulp.series('clean','copy','css:copy','html:assembly','style:dev'));

// npm run build

gulp.task('default', gulp.series('clean','copy','css:copy','images','html:assembly', 'style:build', 'js:compress'));

