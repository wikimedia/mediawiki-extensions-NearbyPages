// eslint-disable no-implicit-globals
var Vue = require( 'vue' ).default || require( 'vue' ),
	App = require( './App.vue' );

// @ts-ignore
Vue.createMwApp( App, {} )
	.mount( document.getElementById( 'mw-nearby-pages' ) );
