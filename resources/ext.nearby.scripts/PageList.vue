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
const codex = require( '@wikimedia/codex' );
const cdxIconMapPin = require( './icons.json' ).cdxIconMapPin;
const vue = require( 'vue' );

module.exports = exports = vue.defineComponent( {
	name: 'pagelist',
	props: {
		supportingIcon: {
			type: String,
			default: cdxIconMapPin
		},
		pages: Array,
		supportsGeoUrlProtocol: {
			type: Boolean,
			// Chrome and FF will refuse navigation to such pages on desktop.
			default: !!( navigator.userAgent.match( /Chrome/ ) || navigator.userAgent.match( /Firefox/ ) )
		}
	},
	computed: {
		/**
		 * @return {Array}
		 */
		pagesToSuggestions: function () {
			const supportsGeoUrlProtocol = this.supportsGeoUrlProtocol;
			return this.pages.map( function ( page ) {
				return {
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
				};
			} );
		}
	},
	components: {
		cdxCard: codex.CdxCard,
		cdxIcon: codex.CdxIcon
	}
} );
</script>

<style lang="less">
@import 'variables.less';

.mw-vue-page-list {
	font-size: 16px;

	.cdx-card {
		width: 100%;
		margin-bottom: 10px;
		box-sizing: border-box;
	}
}

@supports ( display: grid ) {
	@media all and ( min-width: @width-breakpoint-desktop )  {
		.mw-vue-page-list {
			display: grid;
			grid-template-columns: repeat( 3, 1fr );
			grid-auto-rows: 1fr;
			row-gap: 10px;
			column-gap: 10px;

			.cdx-card {
				width: auto;
				margin-bottom: 0;
			}
		}
	}
}

</style>
