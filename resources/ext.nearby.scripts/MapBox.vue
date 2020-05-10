<template>
	<div v-bind:class="className">
		<div id="nearby-pages-map"></div>
		<div style="display: none">
			<span>{{latitude}}</span>,<span>{{longitude}}</span>
		</div>
	</div>
</template>

<script>
/**
 * A good old fashioned mediawiki ui button
 * @module Button
 * @param {boolean} primary whether the button should be considered primary
 */
module.exports = {
	name: 'mapbox',
	props: [ 'latitude', 'longitude', 'className' ],
	data: function () {
		return {
			_latitude: this.latitude,
			_longitude: this.longitude,
			map: false
		};
	},
	methods: {
		setLatLng: function ( latitude, longitude ) {
			this._longitude = longitude;
			this._latitude = latitude;
			this.map.setView( [ this._latitude, this._longitude ] );
		}
	},
	updated: function () {
		this.setLatLng( this.latitude, this.longitude );
	},
	mounted: function () {
		var vm = this;
		mw.loader.using( 'mapbox' ).then( function () {
			vm.map = L.map( 'nearby-pages-map', {
				dragging: true,
				zoom: 13,
				center: [ vm.latitude || 0, vm.longitude || 0 ]
			} );
			L.tileLayer( 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=en', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			} ).addTo( vm.map );
			vm.map.on( 'dragend', function () {
				const center = vm.map.getCenter();
				this.latitude = center.lat;
				this.longitude = center.lng
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