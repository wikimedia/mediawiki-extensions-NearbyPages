module.exports = {
	WvuiTypeaheadSuggestion: {
		name: 'wvui-typeahead-suggestion-mock',
		props: {
			urlGenerator: Object
		},
		render: function ( h ) {
			var url = this.urlGenerator.generateUrl( { id: '1' } );
			return h( 'div', [
				'mock suggestion ' + Math.random() + url
			] );
		}
	},
	WvuiButton: {
		name: 'wvui-button-mock',
		nativeOn: {
			click: this.nativeClickHandler
		},
		render: function ( h ) {
			var self = this;
			return h( 'button', {
				on: {
					click: function ( event ) {
						self.$emit( 'click', event );
					}
				}
			}, [ 'mock btn ' + Math.random() ] );
		}
	}
};
