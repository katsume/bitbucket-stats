<template>
	<div>
		<div class="container">

			<div class="row align-items-center">
				<div class="col-2 text-right">
					<!-- <img :src="team.links.avatar.href" alt="" class="img-fluid w-50 rounded-circle"> -->
				</div>
				<div class="col-10 mb-3">
					<h2 class="h3">{{ team.display_name }}</h2>
					<p class="small text-muted">{{ team.username }}</p>
				</div>
			</div>

			<div class="row mb-4">
				<div class="col-10 offset-2">
					<p>
						{{ oldest.toLocaleDateString() }} - {{ newest.toLocaleDateString() }}
					</p>
				</div>
			</div>

			<div class="row mb-4">
				<div class="col-10 offset-2">
					<div class="row">

						<div class="col">
							<div class="border bg-light rounded py-3 d-flex align-items-center">
								<p class="h3 px-4">
									<span class="iconify" data-icon="octicon:repo" data-inline="false"></span>
								</p>
								<p>
									<span class="h1">{{ commitedRepositories.toLocaleString() }}</span><br>
									<span class="text-muted">repositories</span>
								</p>
							</div>
						</div>
						<div class="col">
							<div class="border bg-light rounded py-3 d-flex align-items-center">
								<p class="h3 px-4">
									<span class="iconify" data-icon="octicon:git-commit" data-inline="false"></span>
								</p>
								<p>
									<span class="h1">{{ commits.toLocaleString() }}</span><br>
									<span class="text-muted">commits</span>
								</p>
							</div>
						</div>
						<div class="col">
							<div class="border bg-light rounded py-3 d-flex align-items-center">
								<p class="h3 px-4">
									<span class="iconify" data-icon="octicon:file" data-inline="false"></span>
								</p>
								<p>
									<span class="h1">{{ files.toLocaleString() }}</span><br>
									<span class="text-muted">files</span>
								</p>
							</div>
						</div>

					</div>
				</div>
			</div>

			<div class="row mb-4">
				<div class="col-10 offset-2">
					<div class="row">
						<div class="col">
							<div class="alert alert-success d-flex align-items-center">
								<p class="h5 pr-3">
									<span class="iconify" data-icon="octicon:diff-added" data-inline="false"></span>
								</p>
								<p>
									<span class="h3">{{ linesAdded.toLocaleString() }}</span><br>
									<span class="text-muted">lines added</span>
								</p>
							</div>
						</div>
						<div class="col">
							<div class="alert alert-danger d-flex align-items-center">
								<p class="h5 pr-3">
									<span class="iconify" data-icon="octicon:diff-removed" data-inline="false"></span>
								</p>
								<p>
									<span class="h3">{{ linesRemoved.toLocaleString() }}</span><br>
									<span class="text-muted">lines removed</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="row mb-4">
				<div class="col-10 offset-2">
					<!-- <h3 class="mb-3">Tags</h3> -->
					<ul v-if="tags" class="m-0 p-0" style="list-style-type:none;">
						<li
							v-for="(tag , i) in tags" :key="i"
							class="d-inline-block mr-3 mb-3">
							<span class="btn btn-secondary">
								{{ tag.name }}
								<span class="badge badge-light">{{ tag.count }}</span>
							</span>
						</li>
					</ul>
				</div>
			</div>

			<div class="row mb-4">
				<div class="col-10 offset-2">

					<table
						v-if="repositories.length"
						class="table">
						<thead>
							<th>Name</th>
							<th>Commits</th>
							<th>Files</th>
							<th>Lines added</th>
							<th>Lines removed</th>
						</thead>
						<tbody
							v-for="(repository, i) in repositories" :key="i">
							<Repository
								:user-id="userId"
								:team-name="team.username"
								:repository-name="repository.slug"
								v-on:update-commits="commitsHandler"
								v-on:update-files="filesHandler"
								v-on:update-lines-added="linesAddedHandler"
								v-on:update-lines-removed="linesRemovedHandler"
								v-on:update-newest="newestHandler"
								v-on:update-oldest="oldestHandler"
							></Repository>
						</tbody>
					</table>

				</div>
			</div>

		</div>

	</div>
</template>

<script>
import _ from 'underscore';
import Iconify from '@iconify/iconify';

import API from '../js/api';

import Repository from './repository.vue';

export default {
	data: function(){
		return {

			// repositories: new Array(10),
			// commits: 207,
			// files: 1503,
			// linesAdded: 452099,
			// linesRemoved: 85149,

			repositories: [],
			commitedRepositories: 0,
			commits: 0,
			files: 0,
			linesAdded: 0,
			linesRemoved: 0,

			newest: new Date(0),
			oldest: new Date()
		};
	},
	props: [
		'user-id',
		'team'
	],
	components: {
		Repository
	},
	methods: {
		commitsHandler: function(val){
			this.commits+= val;
			this.commitedRepositories++;
		},
		filesHandler: function(val){
			this.files+= val;
		},
		linesAddedHandler: function(val){
			this.linesAdded+= val;
		},
		linesRemovedHandler: function(val){
			this.linesRemoved+= val;
		},
		newestHandler: function(val){
			if(this.newest<val){
				this.newest= val;
			}
		},
		oldestHandler: function(val){
			if(val<this.oldest){
				this.oldest= val;
			}
		}
	},
	computed: {
		tags: function(){

			const arr= this.repositories.map((repository)=>{
				const description= repository.description||'';
				if(!description){
					return [];
				}
				const tags= description.match(/\[.+?\]/g);
				if(!tags){
					return [];
				}
				return tags.map((tag)=>{
					return tag.replace(/\[(.+?)\]/, '$1')
				});
			}).flat();

			return _.pairs(_.countBy(arr, (tag)=>{
				return tag;
			})).map((elm)=>{
				return {
					name: elm[0],
					count: elm[1]
				}
			}).sort((a, b)=>{
				return b.count-a.count;
			});
		}
	},
	mounted: async function(){
		this.repositories= await API.repositories(this.team.username);
	}
};
</script>
