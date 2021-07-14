<template>
	<div class="mw-vue-page-list">
		<div v-for="(suggestion, i) in pagesToSuggestions"
			:key="i"
			class="mw-vue-page-list__card">
			<wvui-typeahead-suggestion
				:suggestion="suggestion"
				:url-generator="generator"
				:show-description="true"
				query=""
				:show-thumbnail="true"
			>
			</wvui-typeahead-suggestion>
			<a :href="suggestion.geoURI" class="mw-vue-page-list__card-proximity">
				{{ suggestion.proximity }}
			</a>
		</div>
	</div>
</template>

<script>
module.exports = {
	name: 'pagelist',
	props: {
		pages: Array,
		supportsGeoUrlProtocol: {
			type: Boolean,
			// Chrome and FF will refuse navigation to such pages on desktop.
			default: !!( navigator.userAgent.match( /Chrome/ ) || navigator.userAgent.match( /Firefox/ ) )
		},
		cardUrl: {
			type: String,
			default: ''
		}
	},
	computed: {
		/**
		 * @return {Object}
		 */
		generator: function () {
			var cardUrl = this.cardUrl;
			return {
				/**
				 * @param {Card} suggestion
				 * @return {string}
				 */
				generateUrl: function ( suggestion ) {
					return cardUrl.replace( '$1', suggestion.id );
				}
			};
		},
		/**
		 * @return {Array}
		 */
		pagesToSuggestions: function () {
			var supportsGeoUrlProtocol = this.supportsGeoUrlProtocol;
			return this.pages.map( function ( page ) {
				return {
					id: page.id,
					title: page.title,
					proximity: page.proximity,
					description: page.description,
					geoURI: supportsGeoUrlProtocol ? page.geoURI : undefined,
					thumbnail: page.thumbnail ? {
						mimetype: 'image/jpeg',
						width: 200,
						height: 150,
						url: page.thumbnail.source
					} : null
				};
			} );
		}
	},
	components: {
		'wvui-typeahead-suggestion': require( 'wvui' ).WvuiTypeaheadSuggestion
	}
};
</script>

<style lang="less">
@import 'variables.less';

.mw-vue-page-list {
	font-size: 14px;

	&__card {
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	.wvui-typeahead-suggestion {
		min-height: 60px;
	}

	&__card-proximity {
		position: absolute;
		color: @colorGray7;
		font-size: 10px;
		min-width: 36px;
		background: white;
		bottom: 0;
		left: 12px;
		text-align: center;
	}
}

@borderRadius: 2px;
@media all and ( min-width: @width-breakpoint-tablet ) {
	.mw-vue-page-list {
		display: flex;
		flex-flow: row wrap;
		align-items: center;

		&__card-proximity {
			right: 8px;
			left: auto;
			min-width: auto;
			bottom: -5px;
			padding: 0 8px;
		}

		&__card {
			margin-right: 1%;
			border: 1px solid rgba(0,0,0,0.2);
			margin-bottom: 10px;
			position: relative;
			border-radius: 2px;

			// Apply radius to top & bottom cards when stacked
			&:first-child {
				border-radius: @borderRadius @borderRadius 0 0;
			}

			&:last-child {
				border-radius: 0 0 @borderRadius @borderRadius;
			}
		}
	}
}

@media all and ( min-width: @width-breakpoint-desktop ) {
	.mw-vue-page-list__card {
		width: 30%;
	}
}
</style>
