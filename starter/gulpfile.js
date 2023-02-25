const gulp = require('gulp');
const del = require('del');
const connect = require('gulp-connect');
const gutil = require('gulp-util');

const petiteAppConfig = require('./pa.config.js');


gulp.task('check', async () => {
  if (!petiteAppConfig.projectName || petiteAppConfig.projectName == null) {
    gutil.log(gutil.colors.blue('projectName'), 'has set incorrectly in', gutil.colors.blue('pa.config.js'), '!');
  }
  if (!petiteAppConfig.petiteAppPath || petiteAppConfig.petiteAppPath == null) {
    gutil.log(gutil.colors.blue('petiteAppPath'), 'has set incorrectly in', gutil.colors.blue('pa.config.js'), '!');
  }
  if (!petiteAppConfig.buildDirPath || petiteAppConfig.buildDirPath == null) {
    gutil.log(gutil.colors.blue('buildDirPath'), 'has set incorrectly in', gutil.colors.blue('pa.config.js'), '!');
  }
});


// Init
gulp.task('init', async () => {
  const distDir = petiteAppConfig.buildDirPath+'\\'+petiteAppConfig.projectName;
  await del([distDir],{force: true});
  gulp.src('./src/**/**').pipe(gulp.dest(distDir)).pipe(connect.reload());

});

// Server
gulp.task('server', () => {
  connect.server({
    root: './src/',
    livereload: true
  });
});

// Dev
gulp.task('dev', async () => {
  const distDir = petiteAppConfig.buildDirPath+'\\'+petiteAppConfig.projectName;
  await del([distDir],{force: true});
  gulp.src('./src/**/**').pipe(gulp.dest(distDir)).pipe(connect.reload());
});


gulp.task('watch', () => {
  gulp.watch('./src/', gulp.series('dev'));
});

gulp.task('default',gulp.series(gulp.parallel('check','init','server','watch')));