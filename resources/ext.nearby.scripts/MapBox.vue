<template>
	<div>
		<div id="nearby-pages-map"></div>
		<div style="display: none">
			<span>{{ latitude }}</span>, <span>{{ longitude }}</span>
		</div>
	</div>
</template>

<script>
/* global L */
var URL = 'https://www.openstreetmap.org/copyright',
	ATTRIBUTION = '&copy; <a href="' + URL + '">OpenStreetMap</a> contributors';

/**
 * A good old fashioned mediawiki ui button
 * @module Button
 * @param {boolean} primary whether the button should be considered primary
 */
module.exports = {
	name: 'mapbox',
	props: [ 'latitude', 'longitude' ],
	data: function () {
		return {
			query: null,
			currentPosition: [
				this.latitude,
				this.longitude
			],
			map: false
		};
	},
	methods: {
		setLatLng: function ( latitude, longitude ) {
			this.currentPosition = [
				latitude, longitude
			];
			this.map.setView( this.currentPosition );
		}
	},
	updated: function () {
		this.query.then( function () {
			this.setLatLng( this.latitude, this.longitude );
		}.bind( this ) );
	},
	mounted: function () {
		var vm = this;
		this.query = mw.loader.using( 'mapbox' ).then( function () {
			vm.map = L.map( 'nearby-pages-map', {
				dragging: true,
				zoom: 13,
				center: [ vm.latitude || 0, vm.longitude || 0 ]
			} );
			L.tileLayer( 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=en', {
				attribution: ATTRIBUTION
			} ).addTo( vm.map );
			vm.map.on( 'dragend', function () {
				var center = vm.map.getCenter();
				this.latitude = center.lat;
				this.longitude = center.lng;
				vm.$emit( 'drag', this.latitude, this.longitude );
			} );
		} );
	}
};
</script>

<style lang="less">
#nearby-pages-map {
	height: 100%;
	width: 100%;
	background: white;
	float: right;
}
</style>
