const {series} = require('gulp');
const gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');


function installDependencies(cb) {
    cb();
}

const formProofEnvironmentApis = {
    staging: 'https://bright-source-jxr9r.ampt.app/api',
    production: 'https://intelligent-src-r12j9.ampt.app/api'
};




function build(cb) {
    console.log('Build')
    gulp.src(['node_modules/rrweb/dist/rrweb.js', 'src/formproof.js', 'src/tfaValidation.js', 'src/saveRecording.js', 'src/blackListPhone.js', 'src/utils/send2faCode.js', "src/utils/validate2faCode.js",
        "src/utils/verifyPhoneBlackListApi.js", "src/utils/saveRecordings.js"])
        .pipe(gp_concat('formproof-concat.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename('formproof.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist'));
    cb();
}
function buildStaging(cb) {
    gulp.src(['node_modules/rrweb/dist/rrweb.js', 'src/formproof.js', 'src/tfaValidation.js', 'src/saveRecording.js', 'src/blackListPhone.js', 'src/utils/send2faCode.js', "src/utils/validate2faCode.js",
        "src/utils/verifyPhoneBlackListApi.js", "src/utils/saveRecordings.js"])
        .pipe(gp_concat('formproof-concat.js'))
        .pipe(replace(/let baseApi = '.*?';/, `let baseApi = '${formProofEnvironmentApis['staging']}';`)) // Replace baseApi based on environment
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename('formproof.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist'));
    cb();
}

function buildProduction(cb) {
    gulp.src(['node_modules/rrweb/dist/rrweb.js', 'src/formproof.js', 'src/tfaValidation.js', 'src/saveRecording.js', 'src/blackListPhone.js', 'src/utils/send2faCode.js', "src/utils/validate2faCode.js",
        "src/utils/verifyPhoneBlackListApi.js", "src/utils/saveRecordings.js"])
        .pipe(gp_concat('formproof-concat.js'))
        .pipe(replace(/let baseApi = '.*?';/, `let baseApi = '${formProofEnvironmentApis['production']}';`)) // Replace baseApi based on environment
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
    gulp.watch(['src/formproof.js', 'src/tfaValidation.js', 'src/saveRecording.js', 'src/blackListPhone.js', 'src/utils/send2faCode.js', 'src/utils/validate2faCode.js', "src/utils/verifyPhoneBlackListApi.js",
        "src/utils/saveRecordings.js"], build);
}

function watchBuildBlackList() {
    gulp.watch(['src/blackListPhone.js'], buildBlackList);
}

exports.build = build;
exports.buildBlackList = buildBlackList;
exports.watch = watch;
exports.watchBuildBlackList = watchBuildBlackList;

exports.default = series(build);
exports.default = series(buildStaging);
exports.default = series(buildBlackList);
