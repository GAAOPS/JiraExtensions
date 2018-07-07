var gulp = require('gulp');
var ts = require('gulp-typescript');
 
gulp.task('default', function () {
    return gulp.src('*.ts')
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'git-branch-name-copy-helper.user.js'
        }))
        .pipe(gulp.dest('.'));
});