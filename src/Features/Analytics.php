<?php
/**
 * WooCommerce Analytics.
 * NOTE: DO NOT edit this file in WooCommerce core, this is generated from woocommerce-admin.
 */

namespace Automattic\WooCommerce\Admin\Features;

use Automattic\WooCommerce\Admin\Loader;
use Automattic\WooCommerce\Admin\API\Reports\Cache;
use Automattic\WooCommerce\Admin\Features\Features;

/**
 * Contains backend logic for the Analytics feature.
 */
class Analytics {
	/**
	 * Option name used to toggle this feature.
	 */
	const TOGGLE_OPTION_NAME = 'woocommerce_analytics_enabled';
	/**
	 * Clear cache tool identifier.
	 */
	const CACHE_TOOL_ID = 'clear_woocommerce_analytics_cache';

	/**
	 * Class instance.
	 *
	 * @var Analytics instance
	 */
	protected static $instance = null;

	/**
	 * Get class instance.
	 */
	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Hook into WooCommerce.
	 */
	public function __construct() {
		add_filter( 'woocommerce_settings_features', array( $this, 'add_feature_toggle' ) );
		add_action( 'update_option_' . self::TOGGLE_OPTION_NAME, array( $this, 'reload_page_on_toggle' ), 10, 2 );
		add_filter( 'woocommerce_admin_preload_options', array( $this, 'preload_options' ) );

		if ( ! Features::is_enabled( 'analytics' ) ) {
			return;
		}

		add_filter( 'woocommerce_component_settings_preload_endpoints', array( $this, 'add_preload_endpoints' ) );
		add_filter( 'woocommerce_admin_get_user_data_fields', array( $this, 'add_user_data_fields' ) );
		add_action( 'admin_menu', array( $this, 'register_pages' ) );
		add_filter( 'woocommerce_debug_tools', array( $this, 'register_cache_clear_tool' ) );
	}

	/**
	 * Add the feature toggle to the features settings.
	 *
	 * @param array $features Feature sections.
	 * @return array
	 */
	public static function add_feature_toggle( $features ) {
		$description = __(
			'Enables WooCommerce Analytics',
			'woocommerce-admin'
		);

		$features[] = array(
			'title'   => __( 'Analytics', 'woocommerce-admin' ),
			'desc'    => $description,
			'id'      => self::TOGGLE_OPTION_NAME,
			'type'    => 'checkbox',
			'default' => 'yes',
			'class'   => '',
		);

		return $features;
	}

	/**
	 * Preload options to prime state of the application.
	 *
	 * @param array $options Array of options to preload.
	 * @return array
	 */
	public function preload_options( $options ) {
		$options[] = self::TOGGLE_OPTION_NAME;

		return $options;
	}

	/**
	 * Reloads the page when the option is toggled to make sure all Analytics features are loaded.
	 *
	 * @param string $old_value Old value.
	 * @param string $value     New value.
	 */
	public static function reload_page_on_toggle( $old_value, $value ) {
		if ( $old_value === $value ) {
			return;
		}

		if ( isset( $_SERVER['REQUEST_URI'] ) ) {
			wp_safe_redirect( wp_unslash( $_SERVER['REQUEST_URI'] ) );
			exit();
		}
	}

	/**
	 * Preload data from the countries endpoint.
	 *
	 * @param array $endpoints Array of preloaded endpoints.
	 * @return array
	 */
	public function add_preload_endpoints( $endpoints ) {
		$endpoints['countries'] = '/wc-analytics/data/countries';
		return $endpoints;
	}

	/**
	 * Adds fields so that we can store user preferences for the columns to display on a report.
	 *
	 * @param array $user_data_fields User data fields.
	 * @return array
	 */
	public function add_user_data_fields( $user_data_fields ) {
		return array_merge(
			$user_data_fields,
			array(
				'categories_report_columns',
				'coupons_report_columns',
				'customers_report_columns',
				'orders_report_columns',
				'products_report_columns',
				'revenue_report_columns',
				'taxes_report_columns',
				'variations_report_columns',
			)
		);
	}

	/**
	 * Register the cache clearing tool on the WooCommerce > Status > Tools page.
	 *
	 * @param array $debug_tools Available debug tool registrations.
	 * @return array Filtered debug tool registrations.
	 */
	public function register_cache_clear_tool( $debug_tools ) {
		$settings_url = add_query_arg(
			array(
				'page' => 'wc-admin',
				'path' => '/analytics/settings',
			),
			get_admin_url( null, 'admin.php' )
		);

		$debug_tools[ self::CACHE_TOOL_ID ] = array(
			'name'     => __( 'Clear analytics cache', 'woocommerce-admin' ),
			'button'   => __( 'Clear', 'woocommerce-admin' ),
			'desc'     => sprintf(
				/* translators: 1: opening link tag, 2: closing tag */
				__( 'This tool will reset the cached values used in WooCommerce Analytics. If numbers still look off, try %1$sReimporting Historical Data%2$s.', 'woocommerce-admin' ),
				'<a href="' . esc_url( $settings_url ) . '">',
				'</a>'
			),
			'callback' => array( $this, 'run_clear_cache_tool' ),
		);

		return $debug_tools;
	}

	/**
	 * Registers report pages.
	 */
	public function register_pages() {
		$report_pages = self::get_report_pages();
		foreach ( $report_pages as $report_page ) {
			if ( ! is_null( $report_page ) ) {
				wc_admin_register_page( $report_page );
			}
		}
	}

	/**
	 * Get report pages.
	 */
	public static function get_report_pages() {
		$overview_page = array(
			'id'       => 'woocommerce-analytics',
			'title'    => __( 'Analytics', 'woocommerce-admin' ),
			'path'     => '/analytics/overview',
			'icon'     => 'dashicons-chart-bar',
			'position' => 56, // After WooCommerce & Product menu items.
		);

		$report_pages = array(
			$overview_page,
			array(
				'id'       => 'woocommerce-analytics-overview',
				'title'    => __( 'Overview', 'woocommerce-admin' ),
				'parent'   => 'woocommerce-analytics',
				'path'     => '/analytics/overview',
				'nav_args' => array(
					'order'  => 10,
					'parent' => 'woocommerce-analytics',
				),
			),
			array(
				'id'       => 'woocommerce-analytics-products',
				'title'    => __( 'Products', 'woocommerce-admin' ),
				'parent'   => 'woocommerce-analytics',
				'path'     => '/analytics/products',
				'nav_args' => array(
					'order'  => 20,
					'parent' => 'woocommerce-analytics',
				),
			),
			array(
				'id'       => 'woocommerce-analytics-revenue',
				'title'    => __( 'Revenue', 'woocommerce-admin' ),
				'parent'   => 'woocommerce-analytics',
				'path'     => '/analytics/revenue',
				'nav_args' => array(
					'order'  => 30,
					'parent' => 'woocommerce-analytics',
				),
			),
			array(
				'id'       => 'woocommerce-analytics-orders',
				'title'    => __( 'Orders', 'woocommerce-admin' ),
				'parent'   => 'woocommerce-analytics',
				'path'     => '/analytics/orders',
				'nav_args' => array(
					'order'  => 40,
					'parent' => 'woocommerce-analytics',
				),
			),
			array(
				'id'       => 'woocommerce-analytics-variations',
				'title'    => __( 'Variations', 'woocommerce-admin' ),
				'parent'   => 'woocommerce-analytics',
				'path'     => '/analytics/variations',
				'nav_args' => array(
					'order'  => 50,
					'parent' => 'woocommerce-analytics',
				),
			),
			array(
				'id'       => 'woocommerce-analytics-categories',
				'title'    => __( 'Categories', 'woocommerce-admin' ),
				'parent'   => 'woocommerce-analytics',
				'path'     => '/analytics/categories',
				'nav_args' => array(
					'order'  => 60,
					'parent' => 'woocommerce-analytics',
				),
			),
			array(
				'id'       => 'woocommerce-analytics-coupons',
				'title'    => __( 'Coupons', 'woocommerce-admin' ),
				'parent'   => 'woocommerce-analytics',
				'path'     => '/analytics/coupons',
				'nav_args' => array(
					'order'  => 70,
					'parent' => 'woocommerce-analytics',
				),
			),
			array(
				'id'       => 'woocommerce-analytics-taxes',
				'title'    => __( 'Taxes', 'woocommerce-admin' ),
				'parent'   => 'woocommerce-analytics',
				'path'     => '/analytics/taxes',
				'nav_args' => array(
					'order'  => 80,
					'parent' => 'woocommerce-analytics',
				),
			),
			array(
				'id'       => 'woocommerce-analytics-downloads',
				'title'    => __( 'Downloads', 'woocommerce-admin' ),
				'parent'   => 'woocommerce-analytics',
				'path'     => '/analytics/downloads',
				'nav_args' => array(
					'order'  => 90,
					'parent' => 'woocommerce-analytics',
				),
			),
			'yes' === get_option( 'woocommerce_manage_stock' ) ? array(
				'id'       => 'woocommerce-analytics-stock',
				'title'    => __( 'Stock', 'woocommerce-admin' ),
				'parent'   => 'woocommerce-analytics',
				'path'     => '/analytics/stock',
				'nav_args' => array(
					'order'  => 100,
					'parent' => 'woocommerce-analytics',
				),
			) : null,
			array(
				'id'     => 'woocommerce-analytics-customers',
				'title'  => __( 'Customers', 'woocommerce-admin' ),
				'parent' => 'woocommerce',
				'path'   => '/customers',
			),
			array(
				'id'       => 'woocommerce-analytics-settings',
				'title'    => __( 'Settings', 'woocommerce-admin' ),
				'parent'   => 'woocommerce-analytics',
				'path'     => '/analytics/settings',
				'nav_args' => array(
					'title'  => __( 'Analytics', 'woocommerce-admin' ),
					'parent' => 'woocommerce-settings',
				),
			),
		);

		return apply_filters( 'woocommerce_analytics_report_menu_items', $report_pages );
	}

	/**
	 * "Clear" analytics cache by invalidating it.
	 */
	public function run_clear_cache_tool() {
		Cache::invalidate();

		return __( 'Analytics cache cleared.', 'woocommerce-admin' );
	}
}
