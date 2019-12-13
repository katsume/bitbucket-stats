<template>
	<div>
		<p>{{ teamname }}</p>
		<p>{{ repositories.length }} repositories</p>
		<p>{{ files }} files</p>
		<p>{{ linesAdded }} additions</p>
		<p>{{ linesRemoved }} deletions</p>
		<div v-if="repositories.length">
			<div
				v-for="(repository, i) in repositories"
				:key="i"
				class=""
				style="display:none;">
				<Repository
					:username="teamname"
					:name="repository.slug"
					v-on:update-files="filesHandler"
					v-on:update-lines-added="linesAddedHandler"
					v-on:update-lines-removed="linesRemovedHandler"
				></Repository>
			</div>
		</div>
	</div>
</template>

<script>
import API from '../js/api';

import Repository from './repository.vue';

export default {
	data: function(){
		return {
			repositories: [],
			files: 0,
			linesAdded: 0,
			linesRemoved: 0
		};
	},
	props: [
		'teamname'
	],
	components: {
		Repository
	},
	methods: {
		filesHandler: function(val){
			this.files+= val;
		},
		linesAddedHandler: function(val){
			this.linesAdded+= val;
		},
		linesRemovedHandler: function(val){
			this.linesRemoved+= val;
		}
	},
	mounted: async function(){
		this.repositories= await API.repositories(this.teamname);
	}
};
</script>
