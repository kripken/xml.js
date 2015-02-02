var gulp = require('gulp')
, rimraf = require('rimraf')
, mkdirp = require('mkdirp')
, child_process = require('child_process')
;

gulp.task('rm -rf ./build', [], function (cb) {
	rimraf('./build', cb);
});

gulp.task('mkdir -p ./build', ['rm -rf ./build'], 
	function (cb) {
		mkdirp('./build', cb);
});

gulp.task('rm -rf ./libxml2/m4', ['mkdir -p ./build'],
	function (cb) {
		rimraf('./libxml2/m4', cb);
});

gulp.task('mkdir -p ./libxml2/m4', ['rm -rf ./libxml2/m4'],
	function (cb) {
		mkdirp('./libxml2/m4', cb);
});

gulp.task('clean', [
	'rm -rf ./build',
	'rm -rf ./libxml2/m4'
]);

gulp.task('mkdirs', [
	'mkdir -p ./build',
	'mkdir -p ./libxml2/m4'
]);

gulp.task('compile-libxml2', ['clean', 'mkdirs'], function (cb) {
	child_process.spawn('./script/libxml2', [], {
		stdio: 'inherit'
	}).on('close', cb);
});
gulp.task('compile-test', [], function (cb) {
	console.log(process.cwd());
	child_process.spawn('emcc', [
		'-O2',
		'-s EMULATE_FUNCTION_POINTER_CASTS=1',
		'./build/xmllint.o',
		'./build/.libs/libxml2.a',
		'./libz.a',
		'-o xmllint.test.js',
		'--embed-file',
		'./test/test.xml',
		'--embed-file',
		'./test/test.xsd'
	], {
		cwd: process.cwd(),
		stdio: 'inherit'
	}).on('close', cb);
});
