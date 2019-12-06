<template>
</template>

<script>
import qs from 'qs';

import API from '../js/api';

export default {
	mounted: function(){
		const query= qs.parse(this.$route.params.query);
		const token= query.access_token;

		API.saveToken(token);

		this.$router.push('/');
	}
};
</script>
