var gulp = require("gulp");
var babel = require("gulp-babel");
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");
var rm = require("gulp-rm");
var runSequence = require("run-sequence");
var watch = require("gulp-watch");

var resources = ["src/*.{css,js,xml}", "src/**/*.{css,js,md,xml}"];
var jsFiles = ["src/shared/**/*.js", "src/views/**/*.js"];

gulp.task("jscs", function() {
	gulp.src(jsFiles)
		.pipe(jscs());
});

gulp.task("jshint", function() {
	return gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter());
});

gulp.task("lint", ["jshint", "jscs"]);

gulp.task("compile", function() {
	return gulp.src(jsFiles, { base: "src" })
		.pipe(babel())
		.pipe(gulp.dest("app"));
});

gulp.task("clean", function() {
	return gulp.src("app/**/*", { read: false })
		.pipe(rm());
});

gulp.task("copyAll", ["clean"], function() {
	return gulp.src(["**/*"], { base: "src" })
		.pipe(gulp.dest("app"));
});

gulp.task("copyResources", function() {
	return gulp.src(resources, { base: "src" })
		.pipe(gulp.dest("app"));
});

gulp.task("watch", ["copyAll"], function() {
	return gulp.watch(resources, function() {
		runSequence("copyResources", "compile");
	});
});

gulp.task( "default", ["watch"]);