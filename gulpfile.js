let gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    server = require('gulp-server-livereload');

gulp.task('sass', () => {
    gulp.src('scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css/'));
})

gulp.task('watch', ['sass'], () => {
    gulp.watch('scss/**/*.scss', ['sass']);
})

gulp.task('webserver', () => {
    gulp.src('.')
        .pipe(server({
            livereload: true,
            open: true,
            log: 'debug',
            clientConsole: true
        }));
})
