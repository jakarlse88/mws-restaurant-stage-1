let gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	server = require('gulp-server-livereload'),
	plumber = require('gulp-plumber'),
	gutil = require('gulp-util'),
	notify = require('gulp-notify');

gulp.task('sass', () => {
	gulp.src('scss/**/*.scss')
		.pipe(plumber({ errorHandler: (err) => {
			notify.onError({
				title: `Gulp error in ${err.plugin}`,
				message: err.toString()
			})(err);

			gutil.beep();
		}}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(concat('styles.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('css/'));
});

gulp.task('watch', ['sass'], () => {
	gulp.watch('scss/**/*.scss', ['sass']);
});

gulp.task('webserver', () => {
	gulp.src('.')
		.pipe(plumber({ errorHandler: (err) => {
			notify.onError({
				title: `Gulp error in ${err.plugin}`,
				message: err.toString()
			})(err);

			gutil.beep();
		}}))
		.pipe(server({
			livereload: true,
			open: true,
			log: 'debug',
			clientConsole: true,
		}));
});

gulp.task('default', ['sass', 'webserver', 'watch']);