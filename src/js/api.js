const axios= require('axios');
const qs= require('qs');

const clientId= 'aNzgkXHNLTabVJau3L';

const storageKey= 'token';

const authorizeUrl= 'https://bitbucket.org/site/oauth2/authorize';
const host= 'https://api.bitbucket.org/2.0';

export default {
	validateToken: ()=>{
		return new Promise((resolve, reject)=>{
			let token= sessionStorage.getItem(storageKey);
			if(!token){
				reject();
				return;
			}
			resolve(token);
		});
	},
	getLoginUrl: ()=>{
		return authorizeUrl+'?'+qs.stringify({
			client_id: clientId,
			response_type: 'token'
		});
	},
	saveToken: (token)=>{
		if(!token){
			return;
		}
		sessionStorage.setItem(storageKey, token);
	},
	get: (endpoint, params)=>{
		return new Promise((resolve, reject)=>{
			axios
				.get(host+endpoint, {
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem(storageKey)}`
					},
					params: params||{}
				})
				.then((response)=>{
					resolve(response.data);
				})
				.catch(reject);
		});
	}
};
