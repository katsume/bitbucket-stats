<template>
	<tr>
		<td>{{ repositoryName }}</td>
		<td>{{ commits.length }} commits</td>
		<td>{{ files }} files</td>
		<td>{{ linesAdded }} additions</td>
		<td>{{ linesRemoved }} deletions</td>
	</tr>
</template>

<script>
import _ from 'underscore';

import API from '../js/api';

export default {
	data: function(){
		return {
			commits: []
		}
	},
	props: [
		'user-id',
		'team-name',
		'repository-name'
	],
	computed: {
		files: function(){
			return _.uniq(this.commits.map((commit)=>{
				return commit.stats.files;
			}).flat()).length;
		},
		linesAdded: function(){
			if(!this.commits.length){
				return 0;
			}
			return this.commits.map((commit)=>{
				return commit.stats.linesAdded;
			}).reduce((acc, cur)=>{
				return acc+cur;
			});
		},
		linesRemoved: function(){
			if(!this.commits.length){
				return 0;
			}
			return this.commits.map((commit)=>{
				return commit.stats.linesRemoved;
			}).reduce((acc, cur)=>{
				return acc+cur;
			});
		},
		newest: function(){
			let newest= new Date(0);
			this.commits.forEach((commit)=>{
				const date= new Date(commit.date);
				if(newest<date){
					newest= date;
				}
			});
			return newest;
		},
		oldest: function(){
			let oldest= new Date();
			this.commits.forEach((commit)=>{
				const date= new Date(commit.date);
				if(date<oldest){
					oldest= date;
				}
			});
			return oldest;
		}
	},
	watch: {
		commits: function(val){
			if(val.length){
				this.$emit('update-commits', val.length);
			}
		},
		files: function(val){
			this.$emit('update-files', val);
		},
		linesAdded: function(val){
			this.$emit('update-lines-added', val);
		},
		linesRemoved: function(val){
			this.$emit('update-lines-removed', val);
		},
		newest: function(val){
			this.$emit('update-newest', val);
		},
		oldest: function(val){
			this.$emit('update-oldest', val);
		}
	},
	mounted: async function(){
		this.commits= (await API.commits(this.teamName, this.repositoryName))
			.filter((commit)=>{

				const user= commit.author.user;
				const raw= commit.author.raw;
				const q= this.$route.query;

				const includeUsers=
					q.include_user ?
						(typeof q.include_user==='string' ?
							[q.include_user] :
							q.include_user) :
						[];

				if(user && this.userId===user.uuid){
					return true;
				}
				if(includeUsers.find((includeUser)=>{
					return commit.author.raw.includes(includeUser);
				})){
					return true;
				}

				return false;
			})
			.filter((commit)=>{

				const q= this.$route.query;

				const excludeCommits=
					q.exclude_commit ?
						(typeof q.exclude_commit==='string' ?
							[q.exclude_commit] :
							q.exclude_commit) :
						[];

				if(excludeCommits.find((excludeCommit)=>{
					return commit.hash===excludeCommit;
				})){
					return false;
				}

				return true;
			});
	}
};
</script>
