const querystring= require('querystring');
const path= require('path');

const express= require('express');
const session= require('express-session');
const sassMiddleware = require('node-sass-middleware');

const accessToken= require('./access-token');

const destroy= (req, res)=>{
	req.session.destroy((err)=>{
		res.redirect('/');
	});
};

const app= express();

app.set('view engine', 'ejs');
app.use(sassMiddleware({
	src: path.join(__dirname, 'src'),
	dest: path.join(__dirname, 'build'),
	outputStyle: (process.env.NODE_ENV==='production')?'compressed':'nested'
}));
app.use(express.static('build'));
app.use(session({
	cookie: {
		secure: process.env.NODE_ENV==='production'
	},
	resave: true,
	rolling: true,
	saveUninitialized: true,
	secret: process.env.CLIENT_SECRET
}));

app.get('/', (req, res)=>{

	if(!req.session.tokens){
		res.render('login');
		return;
	}

	Promise
		.resolve(req.session.tokens)
		.then(accessToken.refresh)
		.then((tokens)=>{
			res.render('list', {
				tokens: req.session.tokens
			});
		}, (err)=>{
			destroy(req, res);
		});
});

app.get('/login', (req, res)=>{
	const url= 'https://bitbucket.org/site/oauth2/authorize?';
	const params= {
		client_id: process.env.CLIENT_ID,
		response_type: 'code'
	};
	res.redirect(url+querystring.stringify(params));
});

app.get('/callback', (req, res)=>{

	if(!req.query.code){
		destroy(req, res);
		return;
	}

	Promise
		.resolve(req.query.code)
		.then(accessToken.request)
		.then((tokens)=>{
			req.session.tokens= tokens;
			res.redirect('/');
		}, (err)=>{
			destroy(req, res);
		});
});

app.get('/logout', destroy);

app.listen(process.env.PORT||3000);
