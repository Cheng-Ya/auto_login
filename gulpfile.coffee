gulp = require 'gulp'
coffee = require 'gulp-coffee'
less = require 'gulp-less'
browserify = require 'gulp-browserify'

lessDir = 'src/less'
coffeeDir = 'src/coffee'
cssDir = 'dist/css'
jsDir = 'dist/js'

compliceCoffee = ->
  gulp.src coffeeDir + '/*.coffee'
    .pipe coffee {bare: true}
    .pipe gulp.dest jsDir
gulp.task 'complice-coffee',compliceCoffee

compliceLess = ->
  gulp.src lessDir + '/*.less'
    .pipe less()
    .pipe gulp.dest cssDir
gulp.task 'complice-less',compliceLess

compliceBrowserify = ->
  gulp.src ['dist/js/content_scripts.js']
    .pipe browserify {
      insertGlobals: true
    }
    .pipe gulp.dest './dist/js/bundle'
gulp.task 'complice-browserify',compliceBrowserify

gulp.task 'watch',->
  gulp.watch lessDir + '/*.less',['complice-less']
  gulp.watch coffeeDir + '/*.coffee',['complice-coffee']
  gulp.watch 'dist/js/content_scripts.js',['complice-browserify']

gulp.task 'default',['complice-coffee','complice-less','complice-browserify','watch']
