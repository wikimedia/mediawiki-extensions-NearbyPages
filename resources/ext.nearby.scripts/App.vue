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

		<page-list
			v-if="pages.length"
			:pages="pages"
			class="mw-vue-nearby__pagelist">
		</page-list>

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
const api = require( './api.js' );
const PageList = require( './PageList.vue' );
const { CdxButton, CdxMessage } = require( '@wikimedia/codex' );
const Vue = require( 'vue' );
const router = require( 'mediawiki.router' );
const locationProvider = require( './locationProvider.js' );

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
		title: '\u200e ',
		description: '\u200e '
	} );
}

/**
 * The main App component
 *
 * @module App
 */
// @vue/component
module.exports = exports = Vue.defineComponent( {
	name: 'App',
	compatConfig: {
		MODE: 3
	},
	components: {
		CdxButton,
		CdxMessage,
		PageList: PageList.name ? PageList : PageList.default
	},
	props: {
		title: {
			type: String,
			default: null
		},
		randomButton: {
			type: Boolean
		},
		apiOptions: {
			type: Object,
			default: () => ( {
				range: 10000,
				language: 'en',
				namespaces: [ 0 ],
				wikidata: false
			} )
		}
	},
	test: {
		showHomeHandler: showHomeHandler,
		showPagesNearPageHandler: showPagesNearPageHandler,
		showPagesNearLocationHandler: showPagesNearLocationHandler
	},

	/**
	 * @return {AppData}
	 */
	data: function () {
		return {
			includeRandomButton: this.randomButton,
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
				api.getPagesNearbyPage( title, this.apiOptions )
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
				api.getPagesAtCoordinates( lat, lng, this.apiOptions )
			);
		},

		/**
		 * @param {jQuery.Deferred} promise that will resolve to pages
		 */
		loadPagesFromPromise: function ( promise ) {
			this.pages = proxyPages();
			promise.then( ( result ) => {
				const pages = result.pages;
				this.error = pages.length ? false : mw.msg( 'nearby-pages-noresults' );
				this.pages = pages;
			}, () => {
				this.showError( 'nearby-pages-error' );
			} );
		},

		showRandomNearbyArticles: function () {
			const vm = this;
			this.reset();
			locationProvider.getRandomLocation().then( ( coordinate ) => {
				vm.loadPages( coordinate.latitude, coordinate.longitude );
			} );
		},

		showNearbyArticles: function () {
			const vm = this;
			this.reset();

			locationProvider.getCurrentPosition().then( ( coordinate ) => {
				vm.loadPages( coordinate.latitude, coordinate.longitude );
			}, ( msg ) => {
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
			// eslint-disable-next-line security/detect-unsafe-regex
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
// To access Codex design tokens and mixins inside Vue files, import MediaWiki skin variables.
@import 'mediawiki.skin.variables.less';

@gutter-end: 60px;
@gutter-end-with-random: 100px;
@nearbyImageSize: 154px;

.mw-vue-nearby {
	position: relative;
	background-color: var( --background-color-base, @background-color-base );
	min-height: 90vh;
	padding-bottom: @gutter-end;

	&__heading {
		font-size: 1em;
		padding: 0 0 10px;
		text-align: center;
	}

	&__description {
		color: var( --color-subtle, @color-subtle );
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
		background-color: var( --background-color-base, @background-color-base );
		left: 0;
		right: 0;
		border: @border-width-base @border-style-base #eaecf0;
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
