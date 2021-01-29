<template>
	<div class="mw-vue-page-list">
		<div v-for="(suggestion, i) in pagesToSuggestions"
			:key="i"
			class="mw-vue-page-list__card">
			<wvui-typeahead-suggestion
				:suggestion="suggestion"
				:show-description="true"
				query=""
				:show-thumbnail="true"
			>
			</wvui-typeahead-suggestion>
			<span class="mw-vue-page-list__card-proximity">{{ suggestion.proximity }}</span>
		</div>
	</div>
</template>

<script>
module.exports = {
	name: 'pagelist',
	props: {
		pages: Array
	},
	computed: {
		/**
		 * @return {Array}
		 */
		pagesToSuggestions: function () {
			return this.pages.map( function ( page ) {
				return {
					id: page.pageid,
					title: page.title,
					proximity: page.proximity,
					description: page.description,
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
@width-breakpoint-tablet: 720px;

.mw-vue-page-list {
	font-size: 14px;

	&__card {
		height: 100%;
		box-sizing: border-box;
	}

	&__card-proximity {
		position: absolute;
		right: 8px;
		bottom: -8px;
		font-size: 0.8em;
		background: white;
		padding: 0 8px;
	}
}

@borderRadius: 2px;
@media all and ( min-width: @width-breakpoint-tablet ) {
	.mw-vue-page-list {
		display: flex;
		flex-flow: row wrap;
		align-items: center;

		&__card {
			width: 30%;
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
</style>
