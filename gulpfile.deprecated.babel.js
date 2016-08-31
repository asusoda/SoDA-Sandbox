'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import clean from 'gulp-clean';

gulp.task('default', () => {
    gulp.src('bin/**/*')
        .pipe(babel())
        .pipe(gulp.dest('dist/bin/'));
    gulp.src('routes/**/*')
        .pipe(babel())
        .pipe(gulp.dest('dist/routes/'));
    gulp.src('views/**/*')
        .pipe(babel({ plugins: ['transform-react-jsx'] }))
        .pipe(gulp.dest('dist/views/'));
    gulp.src('public/**/*')
        .pipe(gulp.dest('dist/public/'));
    gulp.src('public/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist/public/'));
    gulp.src('app.js')
        .pipe(babel())
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean', () => {
    gulp.src('dist/', {read: false})
        .pipe(clean());
})
