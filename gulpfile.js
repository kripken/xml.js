var gulp = require('gulp')
, spawn = require('child_process').spawn
;

gulp.task('clean', [], function (cb) {
	spawn('./script/clean', [], {
		stdio: 'inherit'
	}).on('close', cb);
});

gulp.task('libxml2', ['clean'], function (cb) {
	spawn('./script/libxml2', [], {
		stdio: 'inherit'
	}).on('close', cb);
});

gulp.task('test', [], function (cb) {
	spawn('./script/test', [], {
		stdio: 'inherit'
	}).on('close', cb);
});

gulp.task('compile', [], function (cb) {
	spawn('./script/compile', [
	], {
		stdio: 'inherit'
	}).on('close', cb);
});
