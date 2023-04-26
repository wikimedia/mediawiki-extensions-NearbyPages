// eslint-disable no-implicit-globals
const Vue = require( 'vue' ),
	config = require( './config.json' ),
	App = require( './App.vue' ).default || require( './App.vue' );

/**
 * @return {Object}
 */
const defaultProps = () => {
	return {
		apiOptions: {
			range: config.NearbyRange,
			// T117159
			language: config.PageContentLanguage || 'en',
			namespaces: config.NearbyPagesNamespaces,
			wikidata: config.NearbyPagesWikidataCompatibility
		},
		randomButton: config.NearbyRandomButton
	};
};

function main() {
	// @ts-ignore
	Vue.createMwApp( App, {
		props: defaultProps()
	} )
		.mount( document.getElementById( 'mw-nearby-pages' ) );
}

main();
