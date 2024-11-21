<?php

namespace NearbyPages;

use MediaWiki\Html\Html;
use MediaWiki\Html\TemplateParser;
use MediaWiki\SpecialPage\SpecialPage;

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
		$out->addModuleStyles( [
			'ext.nearby.images',
			'mediawiki.codex.messagebox.styles',
			'ext.nearby.styles'
		] );
		$out->addModules( [
			'ext.nearby.scripts'
		] );
		$out->setPageTitleMsg( $this->msg( 'nearby-pages-title' ) );

		$tp = new TemplateParser( __DIR__ . '/templates' );
		$html = $tp->processTemplate( 'Nearby', [
			'html-error-noscript' => Html::errorBox(
				$this->msg( 'nearby-pages-requirements-guidance' )->parse(),
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
