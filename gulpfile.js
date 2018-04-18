var gulp = require('gulp');
var del = require("del");
var connect = require('gulp-connect');
//获取gulp-less模块
var less = require("gulp-less");

// 引入组件
var minifycss = require('gulp-minify-css'),//css压缩
    concat = require('gulp-concat'),//文件合并
    uglify = require('gulp-uglify'),//js压缩
    htmlmin = require('gulp-htmlmin'),
    notify = require('gulp-notify'),//提示信息
    rev = require('gulp-rev'),
    revC = require('gulp-rev-collector') ;

const eslint = require('gulp-eslint');


var src = {
    html: "src/*.html",                          // html 文件
    thirdjs: "src/static/assets/js/*.js",
    pagejs: "src/static/pages/*.js",
    assets: "src/static/assets/**/*",                             // 图片等应用资源
    statichtml: "src/static/html/*.html",                             // 静态html（python）
    less: "src/static/less/*.less" ,                            // 静态html（python）
    staticcss:"src/static/assets/css/*.css",
    staticcsspath:"src/static/assets/css/",
    font:"src/static/assets/fonts/*",
    jspath:"src/static/pages/*.js"
};

var dist = {
    root: "dist/",
    html: "dist/",                          // html 文件
    thirdjs: "dist/static/assets/js/",
    pagejs: "dist/static/pages/",
    assets: "dist/static/assets/",                             // 图片等应用资源
    statichtml: "dist/static/html/",                             // 静态html（python）
    staticcss:"dist/static/assets/css/",
    font:"dist/static/assets/fonts/",
};

var bin = {
    root:"bin/",
    html: "bin/",                          // html 文件
    thirdjs: "bin/static/assets/js/",
    pagejs: "bin/static/pages/",
    assets: "bin/static/assets/",                             // 图片等应用资源
    statichtml: "bin/static/html/",                             // 静态html（python）
    staticcss:"bin/static/assets/css/",
    font:"bin/static/assets/fonts/",                        // 静态html（python）
};

/**
 * ----------------------------------------------------
 *  tasks
 * ----------------------------------------------------
 */

/**
 * clean build dir
 */
function cleandist(done) {
    del.sync(dist.root);
    done();
}


function cleanhtml(done) {
    del.sync("dist/*.html");
    del.sync("dist/static/html/*.html");
    del.sync("dist/static/pages");
    del.sync("dist/static/assets/css");
    done();
}


/**
 * [cleanBin description]
 * @return {[type]} [description]
 */
function cleanBin(done) {
    del.sync(bin.root);
    done();
}

/**
 * [copyAssets description]
 * @return {[type]} [description]
 */
function copyAssets() {
    return gulp.src(src.assets)
        .pipe(gulp.dest(dist.assets));
}


function copybuildAssets() {
    return gulp.src(src.assets)
        .pipe(gulp.dest(bin.assets));
}
function copyFont() {
    return gulp.src(src.font)
        .pipe(gulp.dest(dist.font));
}

function copybuildFont() {
    return gulp.src(src.font)
        .pipe(gulp.dest(bin.font));
}
/**
 * [style description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
// function style() {
//     return gulp.src('src/css/*.css')
//         .pipe(concat('main.css'))
//         .pipe(minifycss())
//         .pipe(rev())
//         .pipe(gulp.dest(bin.style))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest(bin.style))
//         .pipe(notify({message: 'css task ok'}));
// }
//
//
// function styledev() {
//     return gulp.src('src/css/*.css')
//         .pipe(concat('main.css'))
//         .pipe(rev())
//         .pipe(gulp.dest(dist.style))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest(dist.style))
//         .pipe(notify({message: 'css task ok'}));
// }

//Html替换css、js引用文件版本
function revHtml() {
    return gulp.src(['dist/**/*.json', src.html])
        .pipe(revC({
            replaceReved: true,
        }))
        .pipe(gulp.dest(dist.html));
}
//Html替换css、js引用文件版本
function revstaticHtml() {
    return gulp.src(['dist/**/*.json',src.statichtml])
        .pipe(revC({
            replaceReved: true,
        }))
        .pipe(gulp.dest(dist.statichtml));
}

//Html替换css、js引用文件版本
function revtestHtml() {
    return gulp.src(['dist/**/*.json', src.testhtml])
        .pipe(revC({
            replaceReved: true,
        }))
        .pipe(gulp.dest(dist.testhtml));
}


function revbuildstaticHtml() {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src(['bin/**/*.json', src.statichtml])
        .pipe(htmlmin(options))
        .pipe(revC())
        .pipe(gulp.dest(bin.statichtml));
}

function revbuildHtml() {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src(['bin/**/*.json', src.html])
        .pipe(htmlmin(options))
        .pipe(revC())
        .pipe(gulp.dest(bin.html));
}


/**
 * [connectServer description]
 * @return {[type]} [description]
 */
function connectServer(done) {
    connect.server({
        root: dist.root,
        port: 8080,
        livereload: true,
    });
    done();
}

/**
 * [watch description]
 * @return {[type]} [description]
 */



function watch() {
    gulp.watch('src/static/**/*.js').on('change', function (file) {
        console.log("change");
        watchDevelopment(file);
        revHtml();
    });

    gulp.watch("src/static/**/*.less", gulp.series( devless,revHtml));
    gulp.watch("src/static/assets/**/*",copyAssets);
    gulp.watch("src/static/fonts/**/*",copyFont);
    gulp.watch(src.html, revHtml);
    gulp.watch("dist/**/*").on('change', function (file) {
        gulp.src('dist/')
            .pipe(connect.reload());
    });
}

/**
 * default task
 */
gulp.task("default", gulp.series(
   // cleandist,
    cleanhtml,
    //checkjs,
    gulp.parallel(copyAssets,copyFont, devless, webpackDevelopment),
    gulp.parallel(revstaticHtml,revHtml),
    connectServer,
    watch
));

/**
 * production build task
 */
gulp.task("build", gulp.series(
    cleanBin,
    copybuildAssets,
    buildless,
    gulp.parallel(copybuildFont, buildless, webpackProduction),
    revbuildHtml,
    revbuildstaticHtml,
    function (done) {
        console.log('build success');
        done();
    }
));

/**
 * [handleError description]
 * @param  {[type]} err [description]
 * @return {[type]}     [description]
 */
function handleError(err) {
    if (err.message) {
        console.log(err.message)
    } else {
        console.log(err)
    }
    this.emit('end')
}

/**
 * [reload description]
 * @return {[type]} [description]
 */
function reload() {
    connect.reload();
}
//检查js，暂时不适用
function checkjs() {
    return gulp.src(src.jspath)
        .pipe(eslint())
        .pipe(eslint.formatEach('compact', process.stderr))
        .pipe(eslint.failAfterError());
}

//开发js
function webpackDevelopment() {
    return gulp.src('src/static/pages/*.js')
        .pipe(rev())
        .pipe(gulp.dest(dist.pagejs))
        .pipe(rev.manifest())
        .pipe(gulp.dest(dist.pagejs))
        .pipe(notify({message: 'devjs task ok'}));
}
//开发js单独
function watchDevelopment(js) {
    js = js.replace(/\\/g,'/');
    return gulp.src(js)
        .pipe(rev())
        .pipe(gulp.dest(dist.pagejs))
        .pipe(notify({message: '1'}))
        .pipe(rev.manifest())
        .pipe(gulp.dest(dist.pagejs))
        .pipe(notify({message: '2'}))
        .pipe(notify({message: 'devjs task ok'}));
}
//生产js
function webpackProduction() {
    return gulp.src('src/static/pages/*.js')
        .pipe(rev())
        .pipe(uglify())
        .pipe(gulp.dest(bin.pagejs))
        .pipe(rev.manifest())
        .pipe(gulp.dest(bin.pagejs))
        .pipe(notify({message: 'projs task ok'}));
}


//开发模式css
function devless() {
    return  gulp.src(src.less)
       // .pipe(concat('main.css'))
        .pipe(less())
        .pipe(gulp.dest(src.staticcsspath))
        .pipe(rev())
        .pipe(gulp.dest(dist.staticcss))
        .pipe(rev.manifest())
        .pipe(gulp.dest(dist.staticcss))
}
//生产模式css
function buildless() {
    return  gulp.src(src.less)
       // .pipe(concat('main.css'))
        .pipe(less())
        .pipe(gulp.dest(src.staticcsspath))
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest(bin.staticcss))
        .pipe(minifycss())
        .pipe(rev.manifest())
        .pipe(gulp.dest(bin.staticcss))

}



