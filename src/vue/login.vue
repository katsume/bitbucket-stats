<template>
<a :href="href">Login</a>
</template>

<script>
import API from '../js/api';

export default {
	computed: {
		href: function(){
			return API.getLoginUrl();
		}
	}
};
</script>
