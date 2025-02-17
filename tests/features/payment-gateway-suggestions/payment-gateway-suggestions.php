<?php
/**
 * Test the class that parses the payment suggestions.
 *
 * @package WooCommerce\Admin\Tests\PaymentGatewaySuggestions
 */

use Automattic\WooCommerce\Admin\Features\PaymentGatewaySuggestions\Init as PaymentGatewaySuggestions;
use Automattic\WooCommerce\Admin\Features\PaymentGatewaySuggestions\DefaultPaymentGateways;
use Automattic\WooCommerce\Admin\Features\PaymentGatewaySuggestions\DataSourcePoller;

/**
 * class WC_Tests_PaymentGatewaySuggestions_Init
 */
class WC_Tests_PaymentGatewaySuggestions_Init extends WC_Unit_Test_Case {

	/**
	 * Set up.
	 */
	public function setUp() {
		parent::setUp();

		add_filter(
			'transient_' . PaymentGatewaySuggestions::SPECS_TRANSIENT_NAME,
			function( $value ) {
				if ( $value ) {
					return $value;
				}

				return array(
					array(
						'id' => 'default-gateway',
					),
				);
			}
		);
	}

	/**
	 * Tear down.
	 */
	public function tearDown() {
		parent::tearDown();
		PaymentGatewaySuggestions::delete_specs_transient();
		remove_all_filters( 'transient_' . PaymentGatewaySuggestions::SPECS_TRANSIENT_NAME );
	}

	/**
	 * Add test specs.
	 */
	public function get_mock_specs() {
		return array(
			array(
				'id'         => 'mock-gateway',
				'is_visible' => (object) array(
					'type'      => 'base_location_country',
					'value'     => 'ZA',
					'operation' => '=',
				),
			),
		);
	}

	/**
	 * Test that default gateways are provided when remote sources don't exist.
	 */
	public function test_get_default_specs() {
		remove_all_filters( 'transient_' . PaymentGatewaySuggestions::SPECS_TRANSIENT_NAME );
		add_filter(
			DataSourcePoller::FILTER_NAME,
			function() {
				return array();
			}
		);
		$specs    = PaymentGatewaySuggestions::get_specs();
		$defaults = DefaultPaymentGateways::get_all();
		remove_all_filters( DataSourcePoller::FILTER_NAME );
		$this->assertEquals( $defaults, $specs );
	}

	/**
	 * Test that specs are read from cache when they exist.
	 */
	public function test_specs_transient() {
		set_transient(
			PaymentGatewaySuggestions::SPECS_TRANSIENT_NAME,
			array(
				array(
					'id' => 'mock-gateway1',
				),
				array(
					'id' => 'mock-gateway2',
				),
			)
		);
		$suggestions = PaymentGatewaySuggestions::get_suggestions();
		$this->assertCount( 2, $suggestions );
	}

	/**
	 * Test that non-matched suggestions are not shown.
	 */
	public function test_non_matching_suggestions() {
		update_option( 'woocommerce_default_country', 'US' );
		set_transient(
			PaymentGatewaySuggestions::SPECS_TRANSIENT_NAME,
			$this->get_mock_specs()
		);
		$suggestions = PaymentGatewaySuggestions::get_suggestions();
		$this->assertCount( 0, $suggestions );
	}

	/**
	 * Test that matched suggestions are shown.
	 */
	public function test_matching_suggestions() {
		update_option( 'woocommerce_default_country', 'ZA' );
		set_transient(
			PaymentGatewaySuggestions::SPECS_TRANSIENT_NAME,
			$this->get_mock_specs()
		);
		$suggestions = PaymentGatewaySuggestions::get_suggestions();
		$this->assertEquals( 'mock-gateway', $suggestions[0]->id );
	}

	/**
	 * Test that the transient is deleted on locale change.
	 */
	public function test_delete_transient_on_locale_change() {
		set_transient(
			PaymentGatewaySuggestions::SPECS_TRANSIENT_NAME,
			array(
				array(
					'id' => 'mock-gateway',
				),
			)
		);

		add_filter(
			'get_available_languages',
			function( $languages ) {
				$languages[] = 'zh_TW';
				return $languages;
			}
		);

		$wp_locale_switcher = new WP_Locale_switcher();
		$wp_locale_switcher->switch_to_locale( 'zh_TW' );

		$suggestions = PaymentGatewaySuggestions::get_suggestions();

		$wp_locale_switcher->switch_to_locale( 'en_US' );

		$this->assertEquals( 'default-gateway', $suggestions[0]->id );
	}

	/**
	 * Test that the locale is filter based on current store locale.
	 */
	public function test_localization() {
		$wp_locale_switcher = new WP_Locale_switcher();
		$wp_locale_switcher->switch_to_locale( 'en_US' );

		$specs = array(
			(object) array(
				'id'      => 'mock-gateway',
				'locales' => array(
					(object) array(
						'locale' => 'en_US',
						'title'  => 'Mock Gateway',
					),
					(object) array(
						'locale' => 'zh_TW',
						'title'  => '測試付款方式',
					),
				),
			),
		);

		$localized_specs = PaymentGatewaySuggestions::localize( $specs );
		$this->assertEquals( 'Mock Gateway', $localized_specs[0]->title );
		$this->assertCount( 1, $localized_specs );
	}
}
