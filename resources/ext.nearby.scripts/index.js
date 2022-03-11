// eslint-disable no-implicit-globals
const Vue = require( 'vue' ),
	App = require( './App.vue' ).default || require( './App.vue' );

// @ts-ignore
Vue.createMwApp( App )
	.mount( document.getElementById( 'mw-nearby-pages' ) );
