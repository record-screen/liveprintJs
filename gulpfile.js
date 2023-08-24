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
    gulp.src(['node_modules/moment/moment.js',
        'node_modules/rrweb/dist/rrweb.js', 'src/*.js'])
        .pipe(gp_concat('concat.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename('uglify.js'))
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
