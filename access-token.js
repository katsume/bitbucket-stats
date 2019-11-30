const request= require('request');

const url= 'https://bitbucket.org/site/oauth2/access_token';
const auth= {
	user: process.env.CLIENT_ID,
	pass: process.env.CLIENT_SECRET
};

const parse= (body)=>{

	const json= JSON.parse(body);

	return {
		access_token: json.access_token,
		refresh_token: json.refresh_token,
		expires: Date.now()+10*1000
	};
};

module.exports= {
	request: (code)=>{

		return new Promise((resolve, reject)=>{

			request.post({
				url: url,
				auth: auth,
				form: {
					grant_type: 'authorization_code',
					code: code
				}
			}, (err, res, body)=>{

				if(err || res.statusCode!==200){
					reject();
					return;
				}

				resolve(parse(body));
			});
		});
	},
	refresh: (tokens)=>{

		return new Promise((resolve, reject)=>{

			if(Date.now()<tokens.expires){
				resolve(tokens);
				return;
			}

			request.post({
				url: url,
				auth: auth,
				form: {
					grant_type: 'refresh_token',
					refresh_token: tokens.refresh_token
				}
			}, (err, res, body)=>{

				if(err || res.statusCode!==200){
					reject();
					return;
				}

				resolve(parse(body));
			});
		});
	}
};
