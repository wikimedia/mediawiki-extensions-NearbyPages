<template>
	<div class="mw-vue-nearby">
		<div v-if="pages.length === 0">
			<div class="mw-vue-nearby__image"></div>
			<h3 class="mw-vue-nearby__heading">
				{{ msg( 'nearby-pages-info-heading' ) }}
			</h3>
			<div class="mw-vue-nearby__description">
				{{ msg( 'nearby-pages-info-description' ) }}
			</div>
		</div>

		<div v-if="error">
			<errorbox v-bind:message="error"></errorbox>
		</div>

		<pagelist
			v-if="pages.length"
			v-bind:pages="pages"
			class="mw-vue-nearby__pagelist">
		</pagelist>

		<div class="mw-vue-nearby__footer">
			<mw-button v-bind:primary="true" v-on:click="showNearbyArticles">
				{{ msg( 'nearby-pages-info-show-button' ) }}
			</mw-button>

			<mw-button v-if="includeRandomButton" v-on:click="showRandomNearbyArticles">
				{{ msg( 'nearby-pages-info-show-random' ) }}
			</mw-button>
		</div>
	</div>
</template>

<script>
var api = require( './api.js' ),
	apiOptions = {
		range: mw.config.get( 'wgNearbyRange' ),
		// T117159
		language: mw.config.get( 'wgPageContentLanguage' ) || 'en',
		namespaces: mw.config.get( 'wgNearbyPagesNamespaces' ),
		wikidata: mw.config.get( 'wgNearbyPagesWikidataCompatibility' )
	},
	router = require( 'mediawiki.router' ),
	locationProvider = require( './locationProvider.js' );

/**
 * @param {App} vm
 * @return {Function}
 */
function showPagesNearPageHandler( vm ) {
	return function ( title ) {
		vm.loadPagesNearTitle( title );
	};
}

/**
 * @param {App} vm
 * @return {Function}
 */
function showPagesNearLocationHandler( vm ) {
	return function ( latitude, longitude ) {
		vm.loadPages( latitude, longitude );
	};
}

/**
 * @return {Card[]}
 */
function proxyPages() {
	// Use Array.fill when ES6 support available.
	var arr = Array.apply( null, Array( 50 ) );
	return arr.map( function () {
		return { title: '' };
	} );
}

// @vue/component
/**
 * The main App component
 * @module App
 */
module.exports = {
	name: 'App',
	props: {
		title: String
	},
	test: {
		showPagesNearPageHandler: showPagesNearPageHandler,
		showPagesNearLocationHandler: showPagesNearLocationHandler
	},

	components: {
		'mw-button': require( './Button.vue' ),
		pagelist: require( './PageList.vue' ),
		errorbox: require( './Errorbox.vue' )
	},

	/**
	 * @return {AppData}
	 */
	data: function () {
		return {
			includeRandomButton: mw.config.get( 'NearbyRandomButton' ),
			pages: [],
			error: false
		};
	},

	methods: {
		/**
		 * @param {string} key
		 * @return {Message}
		 */
		msg: function ( key ) {
			return mw.msg( key );
		},

		reset: function () {
			this.error = false;
		},

		/**
		 * @param {string} msg
		 */
		showError: function ( msg ) {
			this.error = mw.msg( msg );
			this.pages = [];
		},
		/**
		 * @param {string} title
		 */
		loadPagesNearTitle: function ( title ) {
			router.navigateTo( null, {
				path: '#/page/' + title,
				useReplaceState: true
			} );
			this.loadPagesFromPromise(
				api.getPagesNearbyPage( title, apiOptions )
			);
		},
		/**
		 * @param {string} lat
		 * @param {string} lng
		 */
		loadPages: function ( lat, lng ) {
			router.navigateTo( null, {
				path: '#/coord/' + lat + ',' + lng,
				useReplaceState: true
			} );
			this.loadPagesFromPromise(
				api.getPagesAtCoordinates( lat, lng, apiOptions )
			);
		},

		/**
		 * @param {jQuery.Deferred} promise that will resolve to pages
		 */
		loadPagesFromPromise: function ( promise ) {
			this.pages = proxyPages();
			promise.then( function ( result ) {
				var pages = result.pages;
				this.error = pages.length ? false : mw.msg( 'nearby-pages-noresults' );
				this.pages = pages;
			}.bind( this ), function () {
				this.showError( 'nearby-pages-error' );
			}.bind( this ) );
		},

		showRandomNearbyArticles: function () {
			var vm = this;
			this.reset();
			locationProvider.getRandomLocation().then( function ( coordinate ) {
				vm.loadPages( coordinate.latitude, coordinate.longitude );
			} );
		},

		showNearbyArticles: function () {
			var vm = this;
			this.reset();

			locationProvider.getCurrentPosition().then( function ( coordinate ) {
				vm.loadPages( coordinate.latitude, coordinate.longitude );
			}, function ( msg ) {
				switch ( msg ) {
					case locationProvider.ERROR_SERVICE_UNAVAILABLE:
						return vm.showError( 'nearby-pages-location-unavailable' );
					case locationProvider.ERROR_PERMISSION_DENIED:
						return vm.showError( 'nearby-pages-permission-denied' );
					case locationProvider.ERROR_POSITION_UNAVAILABLE:
					case locationProvider.ERROR_TIMEOUT:
						return vm.showError( 'nearby-pages-location-unavailable' );
					default:
						return vm.showError( 'nearby-pages-error' );
				}
			} );
		}
	},

	mounted: function () {
		var vm = this,
			pageRegex = /^\/page\/(.+)$/,
			coordinateRegex = /^\/coord\/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;

		router.addRoute( coordinateRegex, showPagesNearLocationHandler( vm ) );
		router.addRoute( pageRegex, showPagesNearPageHandler( vm ) );
		router.checkRoute();
		if ( this.title ) {
			vm.loadPagesNearTitle( this.title );
		}
	}
};
</script>

<style lang="less">
@gutter-end: 60px;
@nearbyImageSize: 154px;
@colorGray7: #72777d;

.mw-vue-nearby {
	position: relative;
	min-height: 90vh;
	padding-bottom: @gutter-end;

	&__heading {
		font-size: 1em;
		padding: 0 0 10px;
		text-align: center;
	}

	&__description {
		color: @colorGray7;
		margin-bottom: 20px;
		text-align: center;
	}

	&__image {
		margin: 0 auto 20px;
		min-width: @nearbyImageSize;
		min-height: @nearbyImageSize;
		background-repeat: no-repeat;
		background-position: center;
	}

	&__footer {
		text-align: center;
		box-sizing: border-box;
	}

	&__pagelist + &__footer {
		position: sticky;
		bottom: 0;
		background: #fff;
		left: 0;
		right: 0;
		border: solid 1px #eee;
		height: @gutter-end;
		padding: 12px 0 0;
		z-index: 2;
	}
}
</style>
