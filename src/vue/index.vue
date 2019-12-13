<template>
	<div v-if="user">
		<p>{{ user.username }}</p>
		<div v-if="teams.length">
			<div
				v-for="(team, i) in teams"
				:key="i"
				class="">
				<Team
					:username="user.username"
					:teamname="team.username"
				></Team>
			</div>
		</div>
	</div>
</template>

<script>
import API from '../js/api';

import Team from './team.vue';

export default {
	data: function(){
		return {
			user: null,
			teams: []
		};
	},
	components: {
		Team
	},
	mounted: async function(){
		this.user= await API.user();
		this.teams= await API.teams();
	}
};
</script>
