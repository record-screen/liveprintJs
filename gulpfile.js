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
    gulp.src(['node_modules/rrweb/dist/rrweb.js', 'src/formproof.js'])
        .pipe(gp_concat('formproof-concat.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename('formproof.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist'));
    cb();
}

function buildBlackList(cb) {
    console.log('Build')
    gulp.src(['src/blackListPhone.js'])
        .pipe(gp_concat('blackListPhone-concat.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename('blackListPhone.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist'));
    cb();
}

function watch() {
    gulp.watch(['src/formproof.js'], build);
}

function watchBuildBlackList() {
    gulp.watch(['src/blackListPhone.js'], buildBlackList);
}

exports.build = build;
exports.buildBlackList = buildBlackList;
exports.watch = watch;
exports.watchBuildBlackList = watchBuildBlackList;

exports.default = series(build);
exports.default = series(buildBlackList);
