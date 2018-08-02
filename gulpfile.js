var gulp = require('gulp');
var imageResize = require('gulp-image-resize');


gulp.task('default', function () {
    gulp.src('512.png')
      .pipe(imageResize({
        width : 192,
        height : 192,
        crop : true,
        upscale : false
      }))
      .pipe(gulp.dest('./img'));
  });