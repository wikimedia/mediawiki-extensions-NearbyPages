<template>
	<div class="mw-vue-card">
		<!-- workaround parcel.js bug by not using self-closing tags -->
		<div class="mw-vue-card__thumb" v-bind:style="thumbnailStyleAttribute"></div>
		<a v-if="title"
			v-bind:title="title"
			class="mw-vue-card__link"
			v-bind:href="href"
			aria-hidden="true"
			tabindex="-1">
		</a>
		<div class="mw-vue-card__detail">
			<h3 class="mw-vue-card__heading">
				{{ title }}
			</h3>
			<p v-for="desc in description"
				v-bind:key="desc"
				class="mw-vue-card__extract">
				{{ desc }}
			</p>
		</div>
	</div>
</template>

<script>
/**
 * A beautiful card inviting the user to go read more about an article.
 * @module Card
 * @param {string} title corresponding to a mediawiki page.
 * @param {CardThumbnail|null} thumbnail corresponding to an associated image
 * @param {string} wikidata description of title
 */
module.exports = {
	props: [ 'title', 'thumbnail', 'description', 'url' ],
	computed: {
		/**
		 * Must be called only if title or url are set.
		 * @return {string} if title is empty '#' otherwise
		 *  the local URI to that title
		 */
		href: function () {
			return this.url ? this.url :
				mw.util.getUrl( this.title );
		},
		/**
		 * @return {string} of valid CSS
		 */
		thumbnailStyleAttribute: function () {
			var thumbUrl = this.thumbnail && this.thumbnail.source;
			if ( thumbUrl ) {
				return 'background-image: url("' + thumbUrl + '")';
			} else {
				return '';
			}
		}
	}
};
</script>

<style lang="less">
.mw-vue-card {
	color: #54595d;
	position: relative;
	background-color: #fff;
	box-sizing: border-box;
	border-bottom: 1px solid #eaecf0;
	margin: 0;
	line-height: 1;
	height: 80px;

	&__thumb {
		background-color: #eaecf0;
		background-repeat: no-repeat;
		background-position: center center;
		background-size: cover;
		float: left;
		height: 100%;
		width: 80px;
		margin-right: 10px;
	}

	&__link {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1;
	}

	&__detail {
		position: relative;
		top: 50%;
		-webkit-transform: translateY(-50%);
		-ms-transform: translateY(-50%);
		transform: translateY(-50%);
	}
}

h3.mw-vue-card__heading {
	font-family: inherit;
	font-size: 1em;
	max-height: 2.6em;
	line-height: 1.3;
	margin: 0;
	overflow: hidden;
	padding: 0;
	position: relative;
	font-weight: 500;
}

.mw-vue-card__extract {
	color: #72777d;
	font-size: 0.8em;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-top: 2px;
}
</style>
