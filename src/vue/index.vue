<template>
	<div>
		<nav class="navbar bg-primary">
			<span class="navbar-brand">&nbsp;</span>
		</nav>
		<div
			v-if="user"
			class="container py-4">

			<div class="row align-items-center">
				<div class="col-2 text-center">
					<img :src="user.links.avatar.href" alt="" class="img-fluid w-75">
				</div>
				<div class="col-10">
					<h1 class="">{{ user.display_name }}</h1>
					<p class="text-muted">{{ user.username }}</p>
				</div>
			</div>
		</div>

		<div
			v-if="teams.length"
			class="">
			<div
				v-for="(team, i) in teams"
				:key="i"
				class="">
				<Team
					:user-id="user.uuid"
					:team="team"
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
