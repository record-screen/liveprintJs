const {series} = require('gulp');
const gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');


function installDependencies(cb) {
    cb();
}

function build(cb) {
    console.log('Build')
    gulp.src(['node_modules/rrweb/dist/rrweb.js', 'src/*.js'])
        .pipe(gp_concat('liveprint-concat.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename('liveprint.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist'));
    cb();
}

function watch() {
    gulp.watch(['src/*.js'], build);
}

exports.build = build;
exports.watch = watch;

exports.default = series(build);
