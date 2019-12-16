const axios= require('axios');
const qs= require('qs');

const clientId= 'aNzgkXHNLTabVJau3L';
const tokenKey= 'token';

const authorizeURL= 'https://bitbucket.org/site/oauth2/authorize';
const baseURL= 'https://api.bitbucket.org/2.0';

const Client= (()=>{
	let instance= null;
	return {
		getInstance: function(){
			if(instance){
				return instance;
			}
			return instance=axios.create({
				baseURL: baseURL,
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem(tokenKey)}`
				}
			});
		}
	};
})();

const _commits= async (username, repoSlug)=>{
	let buf= [];
	let res= null;
	let page= 1;
	do {
		res= await Client.getInstance().get(`/repositories/${username}/${repoSlug}/commits?page=${page++}`);
		buf= buf.concat(res.data.values);
	} while(res.data.next);
	return buf;
};

const _diffstat= async (username, repoSlug, spec)=>{
	let buf= [];
	let res= null;
	let page= 1;
	do {
		res= await Client.getInstance().get(`/repositories/${username}/${repoSlug}/diffstat/${spec}?page=${page++}`);
		buf= buf.concat(res.data.values);
	} while(res.data.next);

	if(!buf.length){
		return {
			files: [],
			linesAdded: 0,
			linesRemoved: 0
		}
	}

	return {
		files: buf.map((file)=>{
			return file.status==='removed' ? file.old.path : file.new.path;
		}),
		linesAdded: buf.map((file)=>{
			return Number(file.lines_added);
		}).reduce((acc, cur)=>{
			return acc+cur;
		}),
		linesRemoved: buf.map((file)=>{
			return Number(file.lines_removed);
		}).reduce((acc, cur)=>{
			return acc+cur;
		})
	};
};

export default {
	validateToken: ()=>{
		return new Promise((resolve, reject)=>{
			let token= sessionStorage.getItem(tokenKey);
			if(!token){
				reject();
				return;
			}
			resolve(token);
		});
	},
	getLoginUrl: ()=>{
		return authorizeURL+'?'+qs.stringify({
			client_id: clientId,
			response_type: 'token'
		});
	},
	saveToken: (token)=>{
		if(!token){
			return;
		}
		sessionStorage.setItem(tokenKey, token);
	},
	user: async ()=>{
		const res= await Client.getInstance().get('/user');
		return res.data;
	},
	teams: async ()=>{
		let buf= [];
		let page= 1;
		do {
			const res= await Client.getInstance().get(`/teams?role=member&page=${page}`);
			buf= buf.concat(res.data.values);
			if(!res.data.next){
				return buf;
			}
		} while(page++);
	},
	repositories: async (username)=>{
		let buf= [];
		let page= 1;
		do {
			const res= await Client.getInstance().get(`/repositories/${username}?page=${page}`);
			buf= buf.concat(res.data.values);
			if(!res.data.next){
				return buf;
			}
		} while(page++);
	},
	commits: async (username, repoSlug)=>{
		const commits= await _commits(username, repoSlug);

		const promises= commits.map((commit)=>{
			return _diffstat(username, repoSlug, commit.hash);
		});
		const stats= await Promise.all(promises);

		commits.forEach((commit, i)=>{
			commit.stats= stats[i];
		});
		return commits;
	}
};
