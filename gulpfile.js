const gulp = require("gulp");
const less = require("gulp-less");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const sync = require("browser-sync").create();
const terser = require('gulp-terser');
//styles
const styles = () => {
return gulp.src("source/less/style.less")
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(less())
  .pipe(postcss([
  autoprefixer(),
  csso()
  ]))
  .pipe(rename("style.min.css"))
  .pipe(sourcemap.write("."))
  .pipe(gulp.dest("build/css"))
  .pipe(sync.stream());
}
exports.styles = styles;
// HTML
const html = () => {
return gulp.src("source/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
}
//js terser
const script = () => {
  return gulp.src('source/js/script.js')
    .pipe(terser())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest('build/js'));
}
exports.script = script;
// Copy
const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.svg",
    "!source/img/icons/*.svg",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}
// Clean
const clean = () => {
  return del("build");
};
// Server
const server = (done) => {
sync.init({
  server: {
  baseDir: "build"
  },
  cors: true,
  notify: false,
  ui: false,
});
done();
}
exports.server = server;
// Reload
const reload = (done) => {
  sync.reload();
  done();
}
// Watcher
const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch("source/js/*.js", gulp.series(script));
  gulp.watch("source/*.html", gulp.series(html, reload));
}
// Build
const build = gulp.series(
  clean,
  copy,
  gulp.parallel(
    styles,
    html,
    script,
  ),
);
exports.build = build;
// Default
exports.default = gulp.series(
  clean,
  copy,
  gulp.parallel(
    styles,
    html,
    script,
  ),
  gulp.series(
    server,
    watcher
));
