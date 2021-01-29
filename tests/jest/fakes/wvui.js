module.exports = {
	WvuiTypeaheadSuggestion: {
		name: 'wvui-typeahead-suggestion-mock',
		render: function ( h ) {
			return h( 'div', [
				'mock suggestion ' + Math.random()
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
