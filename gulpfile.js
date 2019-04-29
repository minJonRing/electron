    
// 加载gulp
const gulp = require('gulp');
// 加载处理Sass文件的gulp插件
const sass = require('gulp-sass');

// 定义默认任务
gulp.task('watch', function () {
  // ★ 监视style.scss文件的变化
  gulp.watch('./scss/*.scss', function () {
    console.log(1)
    // 一旦style.scss的内容发生变化，则进行下面的处理

    // 读取style.scss文件的内容
    return gulp.src('./scss/*.scss')
    // 进行Sass文件的编译
      .pipe(sass({
        outputStyle: 'expanded'
      })
      // 定义Sass文件编译过程中发生错误的响应处理(如果没有它，一旦发生错误则直接退出脚本)
      .on('error', sass.logError))
      // 编译后的css文件保存在css目录下
      .pipe(gulp.dest('./assets/css'));
  });
});