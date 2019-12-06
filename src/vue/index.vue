<template>
	<div v-if="user">
		<h1>{{ user.username }}</h1>
		<div v-if="teams.length">
			<div
				v-for="(team, i) in teams"
				:key="i"
				class="">

			</div>
		</div>
	</div>
</template>

<script>
import API from '../js/api';

export default {
	data: function(){
		return {
			user: null,
			teams: []
		};
	},
	mounted: function(){
		API.get('/user').then((user)=>{
			this.user= user;
		});
		API.get('/teams', {role: 'member'}).then((teams)=>{
			this.teams= teams;
		});
	}
};
</script>
