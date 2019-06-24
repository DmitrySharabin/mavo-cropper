const { src, dest, watch, parallel, series } = require('gulp');

const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

function browserSyncTask() {
    browserSync.init({
        server: {
            baseDir: './',
            index: 'test.html'
        },
    });
}

function cssTask() {
    return src('src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./'))
        .pipe(browserSync.stream());
}

function buildCSS() {
    return src('src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano(({
            preset: ['default', {
                discardComments: {
                    removeAll: true,
                },
            }]
        })))
        .pipe(dest('./'));
}

function jsTask() {
    return src('src/**/*.js')
        .pipe(dest('./'))
        .pipe(browserSync.stream());
}

function minifyJS() {
    return src('src/**/*.js')
        .pipe(terser())
        .pipe(dest('./'));
}

function watchFiles(cb) {
    watch('src/**/*.scss', cssTask);
    watch('src/**/*.js', jsTask);
    watch('./**/*.html').on('change', browserSync.reload);
    cb();
}

exports.build = series(buildCSS, minifyJS);

exports.default = parallel(browserSyncTask, cssTask, jsTask, watchFiles);
