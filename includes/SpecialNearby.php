<?php

namespace NearbyPages;

use Html;
use SpecialPage;
use MediaWiki\MediaWikiServices;

/**
 * Provide the Special page "Nearby" with location based articles
 */
class SpecialNearby extends SpecialPage {
	public function __construct() {
		parent::__construct( 'Nearby' );
		$this->listed = true;
		$services = MediaWikiServices::getInstance();
		$this->config = $services->getService( 'MobileFrontend.Config' );
	}

	/**
	 * Render Special Page Nearby
	 * @param string|null $par Parameter submitted as subpage
	 */
	public function execute( $par = '' ) {
		parent::execute( $par );
		$out = $this->getOutput();
		// set config
		$out->addJsConfigVars( [
			'wgNearbyRange' => $this->config->get( 'NearbyRange' ),
		] );
		$out->addModuleStyles( [
			'ext.nearbypages.images',
			'ext.nearby.styles'
		] );
		$out->addModules( [
			'ext.nearby.scripts'
		] );
		$out->setPageTitle( $this->msg( 'nearby-pages-title' ) );

		$html = Html::openElement( 'div', [
				'id' => 'mw-nearby-pages',
				'class' => 'mw-nearby-pages'
			] )
			. Html::element( 'div', [
				'class' => 'mw-nearby-pages__image-info'
			] )
			. Html::element( 'h3', [
					'class' => 'mw-nearby-pages__image-info__heading'
				],
				$this->msg( 'nearby-pages-info-heading' )->text()
			)
			. Html::element( 'div', [
					'class' => 'mw-nearby-pages__image-info__description'
				],
				$this->msg( 'nearby-pages-info-description' )->text()
			)
			. Html::openElement( 'div', [] )
				. Html::element( 'button',
					[
						'id' => 'mw-nearby-pages__activate',
						'disabled' => true,
						'class' => 'mw-ui-button mw-ui-progressive'
					],
					$this->msg( 'nearby-pages-info-show-button' )->text()
				)
			. Html::closeElement( 'div' )
			. Html::closeElement( 'div' )

			. Html::openElement( 'div',
				[
					'class' => 'content-unstyled',
					'id' => 'mw-nearby-pages',
				]
			) .
			Html::openElement( 'noscript' ) .
			Html::errorBox(
				Html::element( 'h2', [],
					$this->msg( 'nearby-pages-requirements' )->text() ) .
				Html::element( 'p', [],
					$this->msg( 'nearby-pages-requirements-guidance' )->text() )
			) .
			Html::closeElement( 'noscript' );
			Html::closeElement( 'div' );

		$out->addHTML( $html );
	}

	/**
	 * @return string
	 */
	protected function getGroupName() {
		return 'pages';
	}
}