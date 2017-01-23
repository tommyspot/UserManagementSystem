var gulp = require('gulp'),
    browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
    ts = require('gulp-typescript'),	
    reload = browserSync.reload;
 
gulp.task('default', [], function () {
    console.log("Command:\n   serve - run live reload server");
});
 
gulp.task('serve', [], function () {
    browserSync({
        notify: false,
        server: {
            baseDir: '.'
        }
    });
 
    gulp.watch(['*.html', 'html/*.html'], reload);
    gulp.watch(['*.js'], reload);
	gulp.watch('css/sass/*.scss', ['sass']);
    gulp.watch('js/**/*.ts', ['scripts']);
});

//Compile SASS to CSS
var input = 'css/sass/*.scss';
var output = 'css';

gulp.task('sass', function () {
  return gulp
    .src(input)
    .pipe(sass())
    .pipe(gulp.dest(output))
    .pipe(reload({stream: true}));
});

//Compile TypeScript to Javascript
gulp.task('scripts', function () {
    return gulp.src('js/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            out: 'output.js'
        }))
        .pipe(gulp.dest('js/'))
        .pipe(reload({stream: true}));
});
