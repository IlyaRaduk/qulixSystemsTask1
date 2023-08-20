import { deleteAsync } from 'del';
import pkg from 'gulp';
const { src, dest } = pkg;
import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const scss = gulpSass(dartSass);
import clean_css from 'gulp-clean-css';
import rename from 'gulp-rename';
import autoPrefixer from 'gulp-autoprefixer';
import webpack from 'webpack-stream';

let project_folder = "docs";
let source_folder = "#src";

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
        assets: project_folder + "/assets/",
    },
    src: {
        html: source_folder + "/*.html",
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        jsslick: source_folder + "/js/slick.min.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.*",
        assets: source_folder + "/assets/*.*",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: "./" + project_folder + "/"
}

function html() {
    return src(path.src.html)
        .pipe(dest(path.build.html))
}
function css() {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: "expanded",
        }))
        .pipe(autoPrefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true,
        }))
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
}
function js() {
    return src(path.src.js)
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'script.min.js'
            },
            module: {
                rules: [
                    {
                        test: /\.(sass|less|css)$/,
                        use: ["style-loader", "css-loader", 'sass-loader'],
                    },
                ],
            },
        }))
        .pipe(dest(path.build.js))
}
function images() {
    return src(path.src.img)
        .pipe(dest(path.build.img))
}
function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
}
function assets() {
    return src(path.src.assets)
        .pipe(dest(path.build.assets))
}

function watchFiles(params) {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
}

function clean(params) {
    return deleteAsync(path.clean)
}

let build = gulp.series(clean, assets, fonts, images, js, css, html);
let watch = gulp.parallel(build, watchFiles)

export default watch;