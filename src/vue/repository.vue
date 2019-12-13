<template>
	<div>
		<p>{{ name }}</p>
		<p>{{ commits.length }} commits</p>
		<p>{{ files }} files</p>
		<p>{{ linesAdded }} additions</p>
		<p>{{ linesRemoved }} deletions</p>
	</div>
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
		'username',
		'name'
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
		}
	},
	watch: {
		files: function(val){
			this.$emit('update-files', val);
		},
		linesAdded: function(val){
			this.$emit('update-lines-added', val);
		},
		linesRemoved: function(val){
			this.$emit('update-lines-removed', val);
		}
	},
	mounted: async function(){
		this.commits= await API.commits(this.username, this.name);
	}
};
</script>
