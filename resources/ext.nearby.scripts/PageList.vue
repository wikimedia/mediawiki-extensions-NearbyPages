<template>
	<div class="mw-vue-page-list">
		<cdx-card
			v-for="card in pagesToSuggestions"
			:key="card.pageid"
			:url="card.url"
			:force-thumbnail="true"
			:thumbnail="card.thumbnail"
		>
			<template #title>
				{{ card.label }}
			</template>
			<template #description>
				{{ card.description }}
			</template>
			<template #supporting-text>
				<!-- Link will only work if device supports https://en.wikipedia.org/wiki/Geo_URI_scheme */ -->
				<a :href="card.geoURI" class="mw-vue-page-list__card-proximity">
					<cdx-icon :icon="supportingIcon"></cdx-icon> {{ card.proximity }}
				</a>
			</template>
		</cdx-card>
	</div>
</template>

<script>
const { CdxCard, CdxIcon } = require( '@wikimedia/codex' );
const cdxIconMapPin = require( './icons.json' ).cdxIconMapPin;
const vue = require( 'vue' );

// @vue/component
module.exports = exports = vue.defineComponent( {
	name: 'PageList',
	compatConfig: {
		MODE: 3
	},
	components: {
		CdxCard,
		CdxIcon
	},
	props: {
		supportingIcon: {
			type: String,
			default: cdxIconMapPin
		},
		pages: {
			type: Array,
			default: () => []
		},
		supportsGeoUrlProtocol: {
			type: Boolean,
			// Chrome and FF will refuse navigation to such pages on desktop.
			// TODO this is only used for the unit tests, maybe it can be handled differently there?
			// eslint-disable-next-line vue/no-boolean-default
			default: !!( navigator.userAgent.match( /Chrome/ ) || navigator.userAgent.match( /Firefox/ ) )
		}
	},
	computed: {
		/**
		 * @return {Array}
		 */
		pagesToSuggestions: function () {
			const supportsGeoUrlProtocol = this.supportsGeoUrlProtocol;
			return this.pages.map( ( page ) => ( {
				url: page.url,
				id: page.id,
				label: page.title,
				proximity: page.proximity,
				description: page.description,
				geoURI: supportsGeoUrlProtocol ? page.geoURI : undefined,
				thumbnail: page.thumbnail ? {
					mimetype: 'image/jpeg',
					width: 200,
					height: 150,
					url: page.thumbnail.source
				} : null
			} ) );
		}
	}
} );
</script>

<style lang="less">
// To access Codex design tokens and mixins inside Vue files, import MediaWiki skin variables.
@import 'mediawiki.skin.variables.less';

.mw-vue-page-list {
	font-size: 16px;

	.cdx-card {
		width: 100%;
		margin-bottom: 10px;
		box-sizing: border-box;
	}
}

@supports ( display: grid ) {
	@media all and ( min-width: @min-width-breakpoint-desktop ) {
		.mw-vue-page-list {
			display: grid;
			grid-template-columns: repeat( 3, 1fr );
			grid-auto-rows: 1fr;
			gap: 10px 10px;

			.cdx-card {
				width: auto;
				margin-bottom: 0;
			}
		}
	}
}

</style>
