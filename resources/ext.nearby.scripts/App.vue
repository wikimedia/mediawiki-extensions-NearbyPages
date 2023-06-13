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
			<cdx-message type="error">
				{{ error }}
			</cdx-message>
		</div>

		<pagelist
			v-if="pages.length"
			:pages="pages"
			class="mw-vue-nearby__pagelist">
		</pagelist>

		<div :class="footerClass">
			<cdx-button
				action="progressive"
				:disabled="isShowNearbyButtonDisabled"
				v-on:click="showNearbyArticles">
				{{ msg( 'nearby-pages-info-show-button' ) }}
			</cdx-button>

			<cdx-button v-if="includeRandomButton" v-on:click="showRandomNearbyArticles">
				{{ msg( 'nearby-pages-info-show-random' ) }}
			</cdx-button>
		</div>
	</div>
</template>

<script>
const api = require( './api.js' ),
	PageList = require( './PageList.vue' ),
	codex = require( '@wikimedia/codex' ),
	Vue = require( 'vue' ),
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
		vm.loadPagesNearTitle( decodeURIComponent( title ) );
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
 * Resets the app to initial state with no pages.
 *
 * @param {App} vm
 * @return {Function}
 */
function showHomeHandler( vm ) {
	return function () {
		vm.clearPages();
	};
}

/**
 * @return {Card[]}
 */
function proxyPages() {

	return Array( 50 ).fill( {
		title: '‎ ',
		description: '‎ '
	} );
}

// @vue/component
/**
 * The main App component
 *
 * @module App
 */
module.exports = exports = Vue.defineComponent( {
	name: 'App',
	compatConfig: {
		MODE: 3
	},
	props: {
		title: String
	},
	test: {
		showHomeHandler: showHomeHandler,
		showPagesNearPageHandler: showPagesNearPageHandler,
		showPagesNearLocationHandler: showPagesNearLocationHandler
	},

	components: {
		CdxButton: codex.CdxButton,
		pagelist: PageList.name ? PageList : PageList.default,
		CdxMessage: codex.CdxMessage
	},

	/**
	 * @return {AppData}
	 */
	data: function () {
		return {
			includeRandomButton: mw.config.get( 'wgNearbyRandomButton' ),
			pages: [],
			error: false,
			isShowNearbyButtonDisabled: false
		};
	},

	computed: {
		footerClass: function () {
			return {
				'mw-vue-nearby__footer--with-random': this.includeRandomButton,
				'mw-vue-nearby__footer': true
			};
		}
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

		clearPages: function () {
			this.pages = [];
		},

		/**
		 * @param {string} msg
		 */
		showError: function ( msg ) {
			this.error = mw.msg( msg );
			this.pages = [];
		},
		disableShowNearbyButton: function () {
			this.isShowNearbyButtonDisabled = true;
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
				const pages = result.pages;
				this.error = pages.length ? false : mw.msg( 'nearby-pages-noresults' );
				this.pages = pages;
			}.bind( this ), function () {
				this.showError( 'nearby-pages-error' );
			}.bind( this ) );
		},

		showRandomNearbyArticles: function () {
			const vm = this;
			this.reset();
			locationProvider.getRandomLocation().then( function ( coordinate ) {
				vm.loadPages( coordinate.latitude, coordinate.longitude );
			} );
		},

		showNearbyArticles: function () {
			const vm = this;
			this.reset();

			locationProvider.getCurrentPosition().then( function ( coordinate ) {
				vm.loadPages( coordinate.latitude, coordinate.longitude );
			}, function ( msg ) {
				switch ( msg ) {
					case locationProvider.ERROR_SERVICE_UNAVAILABLE:
						return vm.showError( 'nearby-pages-location-unavailable' );
					case locationProvider.ERROR_PERMISSION_DENIED: {
						vm.disableShowNearbyButton();
						return vm.showError( 'nearby-pages-permission-denied' );
					}
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
		const vm = this,
			pageRegex = /^\/page\/(.+)$/,
			coordinateRegex = /^\/coord\/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;

		router.addRoute( coordinateRegex, showPagesNearLocationHandler( vm ) );
		router.addRoute( pageRegex, showPagesNearPageHandler( vm ) );
		router.addRoute( '', showHomeHandler( vm ) );
		router.checkRoute();
		if ( this.title ) {
			vm.loadPagesNearTitle( this.title );
		} else {
			this.clearPages();
		}
	}
} );
</script>

<style lang="less">
@import 'variables.less';
@gutter-end: 60px;
@gutter-end-with-random: 100px;
@nearbyImageSize: 154px;

.mw-vue-nearby {
	position: relative;
	min-height: 90vh;
	padding-bottom: @gutter-end;
	background: white;

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

		> button:first-child {
			margin-bottom: 8px;
		}
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

		&--with-random {
			height: @gutter-end-with-random;
		}
	}

	.cdx-message {
		margin-bottom: 16px;
	}
}
</style>
