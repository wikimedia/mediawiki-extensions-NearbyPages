<template>
	<div class="mw-vue-page-list">
		<card v-for="page in pages"
			v-bind:key="page.pageid"
			class="mw-vue-page-list__card"
			v-bind:title="page.title"
			v-bind:url="page.url"
			v-bind:description="page.description"
			v-bind:thumbnail="page.thumbnail"
		/>
	</div>
</template>

<script>
module.exports = {
	props: [ 'pages' ],
	components: {
		card: require( './Card.vue' )
	}
};
</script>

<style lang="less">
@width-breakpoint-tablet: 720px;

.mw-vue-page-list {
	font-size: 14px;
}

@borderRadius: 2px;
@media all and ( min-width: @width-breakpoint-tablet ) {
	.mw-vue-page-list {
		display: flex;
		flex-flow: row wrap;
		align-content: flex-start;

		&__card {
			width: 30%;
			margin-right: 1%;
			border: 1px solid rgba(0,0,0,0.2);
			margin-bottom: 10px;
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
