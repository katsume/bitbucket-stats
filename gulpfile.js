const	path= require('path');

const	gulp= require('gulp'),
			del= require('del'),
			plumber= require('gulp-plumber'),
			named= require('vinyl-named'),
			webpack= require('webpack'),
			webpackStream= require('webpack-stream');

const	src= path.resolve(__dirname, 'src'),
			dest= path.resolve(__dirname, 'build');

gulp.task('clean', ()=>{
	return del([path.join(dest, 'js', '*.*')]);
});

gulp.task('webpack', ()=>{
	return gulp.src([
			path.join(src, 'js', 'index.js')
		])
		.pipe(plumber())
		.pipe(named())
		.pipe(webpackStream({
			mode: (process.env.NODE_ENV==='production')?'production':'development',
			module: {
				rules: [
					{
						test: /\.js?$/,
						exclude: /(node_modules)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env']
							}
						}
					}
				]
			},
			plugins: [
			]
		}, webpack))
		.pipe(gulp.dest(path.join(dest, 'js')));
});

gulp.task('build',
	gulp.series('clean', gulp.parallel('webpack'))
);

gulp.task('watch', ()=>{

	gulp.watch(
		path.join(src, 'js', '**'),
		gulp.series('webpack')
	);

});
