<?php
/**
 * Test the data source poller for payment gateway suggestions.
 *
 * @package WooCommerce\Admin\Tests\PaymentGatewaySuggestions
 */

use Automattic\WooCommerce\Admin\Features\PaymentGatewaySuggestions\Init as PaymentGatewaySuggestions;
use Automattic\WooCommerce\Admin\Features\PaymentGatewaySuggestions\DataSourcePoller;

/**
 * class WC_Tests_PaymentGatewaySuggestions_DataSourcePoller
 */
class WC_Tests_PaymentGatewaySuggestions_DataSourcePoller extends WC_Unit_Test_Case {
	/**
	 * Set up.
	 */
	public function setUp() {
		parent::setUp();

		add_filter(
			DataSourcePoller::FILTER_NAME,
			function() {
				return array(
					'payment-gateway-suggestions-data-source.json',
				);
			}
		);

		add_filter(
			'pre_http_request',
			function( $pre, $parsed_args, $url ) {
				if ( 'payment-gateway-suggestions-data-source.json' === $url ) {
					return array(
						'body' => wp_json_encode(
							array(
								array(
									'id' => 'mock-gateway1',
								),
								array(
									'id' => 'mock-gateway2',
								),
								array(
									'key' => 'mock-gateway-invalid',
								),
							)
						),
					);
				}

				if ( 'payment-gateway-suggestions-data-source2.json' === $url ) {
					return array(
						'body' => wp_json_encode(
							array(
								array(
									'id' => 'mock-gateway3',
								),
							)
						),
					);
				}

				return $pre;
			},
			10,
			3
		);
	}

	/**
	 * Tear down.
	 */
	public function tearDown() {
		parent::tearDown();
		remove_all_filters( DataSourcePoller::FILTER_NAME );
	}

	/**
	 * Test that a data source can be read.
	 */
	public function test_read_data_source() {
		$data = DataSourcePoller::read_specs_from_data_sources();
		$this->assertArrayHasKey( 'mock-gateway1', $data );
		$this->assertArrayHasKey( 'mock-gateway2', $data );
		$this->assertArrayNotHasKey( 'mock-gateway3', $data );
	}

	/**
	 * Test that an empty array is returned when the data source does not work.
	 */
	public function test_read_invalid_data_source() {
		add_filter(
			DataSourcePoller::FILTER_NAME,
			function() {
				return array(
					'bad-data-source.json',
				);
			},
			20
		);

		$data = DataSourcePoller::read_specs_from_data_sources();
		$this->assertEmpty( $data );
	}

	/**
	 * Test that specs can be merged.
	 */
	public function test_merge_specs() {
		add_filter(
			DataSourcePoller::FILTER_NAME,
			function() {
				return array(
					'payment-gateway-suggestions-data-source.json',
					'payment-gateway-suggestions-data-source2.json',
				);
			},
			20
		);

		$data = DataSourcePoller::read_specs_from_data_sources();
		$this->assertArrayHasKey( 'mock-gateway1', $data );
		$this->assertArrayHasKey( 'mock-gateway2', $data );
		$this->assertArrayHasKey( 'mock-gateway3', $data );
	}

	/**
	 * Test that invalid specs aren't merged.
	 */
	public function test_merge_invalid_specs() {
		$data = DataSourcePoller::read_specs_from_data_sources();
		$this->assertCount( 2, $data );
		$this->assertArrayNotHasKey( 'mock-gateway-invalid', $data );
	}

}
