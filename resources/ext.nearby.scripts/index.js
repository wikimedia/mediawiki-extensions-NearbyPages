// eslint-disable no-implicit-globals
const Vue = require( 'vue' ),
	config = require( './config.json' ),
	App = require( './App.vue' ).default || require( './App.vue' );

/**
 * @return {Object}
 */
const defaultProps = () => ( {
	apiOptions: {
		range: config.NearbyRange,
		// T117159
		language: mw.config.get( 'wgPageContentLanguage' ) || 'en',
		namespaces: config.NearbyPagesNamespaces,
		wikidata: config.NearbyPagesWikidataCompatibility
	},
	randomButton: config.NearbyRandomButton
} );

function main() {
	const createApp = Vue.createMwApp || Vue.createApp;
	// @ts-ignore
	createApp( App, defaultProps() )
		.mount( document.getElementById( 'mw-nearby-pages' ) );
}

main();
