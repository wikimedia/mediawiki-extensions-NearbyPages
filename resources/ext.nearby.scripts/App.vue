<template>
	<!-- eslint-disable vue/html-self-closing -->
	<!-- self closing tags are preferred but not used here because of https://github.com/parcel-bundler/parcel/issues/1294 -->
	<div class="mw-vue-nearby">
		<div class="mw-vue-nearby__main">
			<div v-if="!interacted"
				class="mw-vue-nearby__bootscreen">
				<div class="mw-vue-nearby__image"></div>
				<h3 class="mw-vue-nearby__heading">
					{{ msg( 'nearby-pages-info-heading' ) }}
				</h3>
				<div class="mw-vue-nearby__description">
					{{ msg( 'nearby-pages-info-description' ) }}
				</div>
			</div>
			<div v-bind:class="contentClass">
				<errorbox v-if="error" v-bind:message="error"></errorbox>
				<pagelist
					v-if="pages.length"
					v-bind:pages="pages"
					class="mw-vue-nearby__pagelist">
				</pagelist>
			</div>

			<mapbox v-if="mapEnabled"
				class="mw-vue-nearby__map"
				v-bind:latitude="latitude"
				v-bind:longitude="longitude"
				v-on:drag="loadPages"></mapbox>
		</div>
		<div class="mw-vue-nearby__footer">
			<mw-button primary="true" v-on:click="showNearbyArticles">
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
	mapBoxSupported = mw.loader.getState( 'mapbox' ) !== null &&
		mw.config.get( 'wgNearbyExplorer' ),
	locationProvider = require( './locationProvider.js' );

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

	components: {
		'mw-button': require( './Button.vue' ),
		mapbox: require( './MapBox.vue' ),
		pagelist: require( './PageList.vue' ),
		errorbox: require( './Errorbox.vue' )
	},

	/**
	 * @return {AppData}
	 */
	data: function () {
		return {
			includeRandomButton: mw.config.get( 'wgNearbyRandomButton' ),
			pages: [],
			interacted: false,
			mapExplorerEnabled: mapBoxSupported,
			latitude: 0.1,
			longitude: 0.1,
			error: false
		};
	},

	computed: {
		/**
		 * @return {boolean}
		 */
		mapEnabled: function () {
			return this.mapExplorerEnabled && this.interacted;
		},
		/**
		 * @return {Object}
		 */
		contentClass: function () {
			return {
				' mw-vue-nearby__content': this.mapExplorerEnabled
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

		/**
		 * reset app data.
		 */
		reset: function () {
			this.error = false;
			this.interacted = true;
			this.pages = proxyPages();
			this.latitude = 0;
			this.longitude = 0;
		},

		/**
		 * @param {string} msg
		 */
		showError: function ( msg ) {
			this.reset();
			this.error = mw.msg( msg );
		},
		/**
		 * @param {string} title
		 */
		loadPagesNearTitle: function ( title ) {
			this.reset();
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
			this.reset();
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
		 * @return {jQuery.Deferred}
		 */
		loadPagesFromPromise: function ( promise ) {
			return promise.then( function ( result ) {
				var pages = result.pages;

				this.error = pages.length ? false : mw.msg( 'nearby-pages-noresults' );
				this.pages = pages;
				this.latitude = result.latitude;
				this.longitude = result.longitude;
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

		router.addRoute( coordinateRegex, function ( latitude, longitude ) {
			vm.loadPages( latitude, longitude );
		} );

		router.addRoute( pageRegex, function ( title ) {
			vm.loadPagesNearTitle( title );
		} );

		router.checkRoute();
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
	height: 100%;
	padding-bottom: @gutter-end;

	&__bootscreen {
		width: 100%;
	}

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

	&__main {
		height: 100%;
	}

	&__content {
		height: 100%;
		min-height: 500px;
	}

	&__map {
		// only revealed if enough space
		display: none;
		box-sizing: border-box;
		width: 400px;
		height: 400px;
		box-sizing: border-box;
		z-index: 1;
		position: absolute;
		top: 2px;
		right: 2px;
	}

	&__footer {
		position: fixed;
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

@media all and (min-width: 1200px) {
	.mw-vue-nearby__map {
		display: block;
	}

	.mw-vue-nearby__content {
		height: 100%;
		margin-right: 400px;
	}

}
</style>
