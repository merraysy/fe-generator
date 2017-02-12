'use strict';

var gulp = require('gulp');
var loadGulpPlugins = require('gulp-load-plugins');
var historyApiFallback = require('connect-history-api-fallback');
var autoprefixer = require('autoprefixer');<% if (useCssnext) { %>
var cssnext = require('postcss-cssnext');
var stylelint = require('stylelint');
var cssimport = require('postcss-import');<% } if (!useSass && includeRucksack) { %>
var rucksack = require('rucksack-css');<% } %>
var lost = require('lost');
var lazypipe = require('lazypipe');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var del = require('del');

// Load Gulp plugins
var plugins = loadGulpPlugins();

/**
 * VARS
 */
var clientPath = 'client';
var paths = {
  assets: clientPath + '/assets/**/*',
  images: clientPath + '/assets/images/**/*',
  scripts: [
    clientPath + '/**/!(*.spec|*.mock).js',
    '!' + clientPath + '/lib/**/*'
  ],<% if (useSass) { %>
  styles: clientPath +  '/styles/**/*.sass',
  mainStyle: clientPath + '/styles/main.sass',<% } if (useStylus) { %>
  styles: clientPath +  '/styles/**/*.styl',
  mainStyle: clientPath + '/styles/main.styl',<% } if (useCssnext) { %>
  styles: clientPath +  '/styles/**/*.css',
  mainStyle: clientPath + '/styles/main.css',<% } %>
  views: clientPath + '/**/*.html',
  mainView: clientPath + '/index.html',<% if (!includeUnitTests) { %>
  test: [clientPath + '/**/*.{spec,mock}.js'],<% } if (!useFeFw || useAngularjs) { %>
  bower: clientPath + '/lib',<% } %>
  other: [
    clientPath + '/*',
    '!' + clientPath + '/*.html',
    '!' + clientPath + '/*.js'
  ],
  dist: 'dist'
} // end-paths

var postcssPros = [<% if (useCssnext) { %>
  cssimport(),
  cssnext(),
  stylelint(),<% } if (!useSass) { %>
  lost(),<% } if (!useSass && includeRucksack) { %>
  rucksack(),<% } if (!useCssnext) { %>
  autoprefixer(['last 2 version', 'ie 9'])<% } %>
];

/**
 * Helpers
 */<% if (useAngularjs) { %>
var sortModulesFirst = function(a, b) {
  var module = /\.module\.js$/;
  var aMod = module.test(a.path);
  var bMod = module.test(b.path);
  // inject *.module.js first
  if (aMod === bMod) {
    // either both modules or both non-modules, so just sort normally
    if (a.path < b.path) {
      return -1;
    }
    if (a.path > b.path) {
      return 1;
    }
    return 0;
  } else {
    return (aMod ? -1 : 1);
  }
}; // end-sortModulesFirst
<% } %>

/**
 * Pipes
 */
var styles = lazypipe()<% if (useSass) { %>
  .pipe(function(logErr) {
    return plugins.sass().on('error', logErr);
  }, plugins.sass.logError)<% } if (useStylus) { %>
  .pipe(plugins.stylus)<% } %>
  .pipe(plugins.postcss, postcssPros);

var lintScripts = lazypipe()
  .pipe(plugins.eslint)
  .pipe(plugins.eslint.format)
  .pipe(plugins.eslint.failAfterError);

/**
 * Styles
 */
gulp.task('styles', function() {
  return gulp
    .src(paths.mainStyle)
    .pipe(plugins.plumber())
    .pipe(styles())
    .pipe(gulp.dest('.tmp/styles'));
});

/**
 * Lint
 */
gulp.task('lint:scripts', function() {
  return gulp
    .src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('lint', ['lint:scripts']);

/**
 * Inject
 */
gulp.task('inject:js', function() {
  var scripts = gulp
    .src(paths.scripts, {read: false})<% if (useAngularjs) { %>
    .pipe(plugins.sort(sortModulesFirst))<% } %>;

  return gulp
    .src(paths.mainView)
    .pipe(plugins.inject(
      scripts,
      {
        starttag: '<!-- inject:js -->',
        endtag: '<!-- endinject -->',
        transform: function(filepath) {
          return '<script src="' + filepath.replace('/' + clientPath + '/', '') + '"></script>';
        }
      }
    ))
    .pipe(gulp.dest(clientPath));
});

gulp.task('inject', ['inject:js']);

/**
 * BrowserSync
 */
gulp.task('browser-sync', function() {
  browserSync.init({
    server: [
      clientPath,
      '.tmp'
    ],
    middleware: [ historyApiFallback() ],
    notify: false
  });
});

gulp.task('browser-sync:dist', function() {
  browserSync.init({
    server: [
      paths.dist
    ],
    middleware: [ historyApiFallback() ],
    notify: false
  });
});

/**
 * Watch
 */
gulp.task('watch', function() {
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.views, browserSync.reload);
  gulp.watch(paths.scripts, ['lint:scripts', 'inject:js'])
    .on('change', browserSync.reload);
});

/**
 * HTML
 */
gulp.task('views', function() {
  return gulp
    .src(paths.views)<% if (useAngularjs) { %>
    .pipe(plugins.angularTemplatecache({
      module: 'app'
    }))<% } %>
    .pipe(gulp.dest('.tmp'));
});

/**
 * Clean
 */
gulp.task('clean', function() {
  return del([
    '.tmp',
    'dist'
  ]);
});

/**
 * Assets
 */
gulp.task('assets', function() {
  return gulp
    .src(paths.assets)
    .pipe(gulp.dest(paths.dist + '/assets'));
});

gulp.task('images', function() {
  return gulp
    .src(paths.images)
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(paths.dist + '/assets/images'));
});

/**
 * Other
 */
gulp.task('other', function() {
  return gulp
    .src(paths.other)
    .pipe(gulp.dest(paths.dist));
});

/**
 * Serve
 */
gulp.task('serve', function() {
  runSequence(
    ['clean'],
    ['lint', 'inject'],
    ['styles'],
    ['browser-sync'],
    ['watch']
  );
});

gulp.task('serve:dist', function() {
  gulp.start('browser-sync:dist');
});

/**
 * Build
 */
gulp.task('build', function() {<% if (useAngularjs) { %>
  var appFilter = plugins.filter('**/app.js', { restore: true });<% } %>
  var jsFilter = plugins.filter('**/*.js', { restore: true });
  var cssFilter = plugins.filter('**/*.css', { restore: true });

  return gulp.src(paths.mainView)
    .pipe(plugins.useref({
      searchPath: [clientPath, '.tmp']
    }))<% if (useAngularjs) { %>
    .pipe(appFilter)
      .pipe(plugins.addSrc.append('.tmp/templates.js'))
      .pipe(plugins.concat('scripts/app.js'))
      .pipe(plugins.replace('common/', ''))
      .pipe(plugins.ngAnnotate())
      .pipe(plugins.uglify({ mangle: false }))
    .pipe(appFilter.restore)<% } %>
    .pipe(jsFilter)
      .pipe(plugins.uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
      .pipe(plugins.replace('fonts/', 'assets/fonts/'))
      .pipe(plugins.cssnano())
    .pipe(cssFilter.restore)
    .pipe(gulp.dest(paths.dist));
});

/**
 * Default
 */
gulp.task('default', function() {
  runSequence(
    ['clean'],
    ['lint', 'inject'],
    ['styles', 'views', 'assets', 'images'],
    ['other'],
    ['build']
  );
});
