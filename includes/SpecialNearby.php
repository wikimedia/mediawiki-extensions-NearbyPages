<?php

namespace NearbyPages;

use Html;
use SpecialPage;
use TemplateParser;

/**
 * Provide the Special page "Nearby" with location based articles
 */
class SpecialNearby extends SpecialPage {

	public function __construct() {
		parent::__construct( 'Nearby' );
	}

	/**
	 * Render Special Page Nearby
	 * @param string|null $par Parameter submitted as subpage
	 */
	public function execute( $par = '' ) {
		$this->setHeaders();
		$this->outputHeader();
		$out = $this->getOutput();
		// set config
		$config = $this->getConfig();
		$out->addJsConfigVars( [
			'wgNearbyPagesWikidataCompatibility' => $config->get( 'NearbyPagesWikidataCompatibility' ),
			'wgNearbyPagesNamespaces' => $config->get( 'NearbyPagesNamespaces' ),
			'wgNearbyRange' => $config->get( 'NearbyRange' ),
			'wgNearbyRandomButton' => $config->get( 'NearbyRandomButton' ),
			'wgNearbyPagesUrl' => $config->get( 'NearbyPagesUrl' ),
		] );
		$out->addModuleStyles( [
			'ext.nearby.images',
			'ext.nearby.styles'
		] );
		$out->addModules( [
			'ext.nearby.scripts'
		] );
		$out->setPageTitle( $this->msg( 'nearby-pages-title' ) );

		$tp = new TemplateParser( __DIR__ . '/templates' );
		$html = $tp->processTemplate( 'Nearby', [
			'html-error-noscript' => Html::errorBox(
				$this->msg( 'nearby-pages-requirements-guidance' )->text(),
				$this->msg( 'nearby-pages-requirements' )->text()
			)
		] );

		$out->addHTML( $html );
	}

	/**
	 * @return string
	 */
	protected function getGroupName() {
		return 'pages';
	}
}
