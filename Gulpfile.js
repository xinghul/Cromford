"use strict";

let gulp = require("gulp")
,   plumber = require("gulp-plumber")
,   nodemon = require("gulp-nodemon")
,   webpack = require("webpack-stream");

const webpackConfig = require("./webpack.config.js");

gulp.task("webpack", function() {
  return gulp
    .src("app/javascripts/app.jsx")
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest("app/javascripts"));
});

gulp.task("webpack:watch", function() {
  return gulp
    .src("app/javascripts/app.jsx")
    .pipe(webpack(Object.assign({watch: true}, webpackConfig)))
    .pipe(plumber())
    .pipe(gulp.dest("app/javascripts"));
});

gulp.task("watch:server", function() {
  nodemon({ 
      script: "nodemon.js", 
      ext: "js", 
      ignore: ["gulpfile.js", "app/*", "test/*", "node_modules/*"] 
    })
    .on("change", function () {})
    .on("restart", function () {
      console.log("Server restarted");
    });
})

gulp.task("default", ["webpack"], function() {
  console.log("Build succeeded.");
});

gulp.task("watch", ["webpack:watch", "watch:server"], function() {
  console.log("Build succeeded.");
});