/**
 * External dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { Text } from '@woocommerce/experimental';
import { recordEvent } from '@woocommerce/tracks';
import { AbbreviatedCard } from '@woocommerce/components';
import { useSelect } from '@wordpress/data';
import { OPTIONS_STORE_NAME } from '@woocommerce/data';
import { box, comment, page } from '@wordpress/icons';
import { createSlotFill } from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	getLowStockCount,
	getOrderStatuses,
	getUnreadOrders,
} from '../../../../homescreen/activity-panel/orders/utils';
import { getUnapprovedReviews } from '../../../../homescreen/activity-panel/reviews/utils';
import { isWCAdmin } from '../../../../dashboard/utils';
import { Bell } from './icons/bell';

const EXTENDED_TASK_LIST_ID = 'extended_task_list';
const ORDER_PANEL_ID = 'orders-panel';
const REVIEWS_PANEL_ID = 'reviews-panel';
const STOCK_PANEL_ID = 'stock-panel';

export const ABBREVIATED_NOTIFICATION_SLOT_NAME = 'AbbreviatedNotification';

export const AbbreviatedNotificationsPanel = ( { thingsToDoNextCount } ) => {
	const {
		ordersToProcessCount,
		reviewsToModerateCount,
		stockNoticesCount,
		isSetupTaskListHidden,
		isExtendedTaskListHidden,
	} = useSelect( ( select ) => {
		const { getOption } = select( OPTIONS_STORE_NAME );
		const orderStatuses = getOrderStatuses( select );
		return {
			ordersToProcessCount: getUnreadOrders( select, orderStatuses ),
			reviewsToModerateCount: getUnapprovedReviews( select ),
			stockNoticesCount: getLowStockCount( select ),
			isSetupTaskListHidden:
				getOption( 'woocommerce_task_list_hidden' ) === 'yes',
			isExtendedTaskListHidden:
				getOption( 'woocommerce_extended_task_list_hidden' ) === 'yes',
		};
	} );

	const trackAbbreviatedCardClick = ( name ) => {
		recordEvent( 'activity_panel_click', {
			task: name,
		} );
	};

	const { Slot } = createSlotFill( ABBREVIATED_NOTIFICATION_SLOT_NAME );
	const isWCAdminPage = isWCAdmin( window.location.href );

	return (
		<div className="woocommerce-abbreviated-notifications">
			{ thingsToDoNextCount > 0 && ! isExtendedTaskListHidden && (
				<AbbreviatedCard
					className="woocommerce-abbreviated-notification"
					icon={ <Bell /> }
					href={ `admin.php?page=wc-admin#${ EXTENDED_TASK_LIST_ID }` }
					onClick={ () =>
						trackAbbreviatedCardClick( 'thingsToDoNext' )
					}
					type={ isWCAdminPage ? 'wc-admin' : 'wp-admin' }
				>
					<Text as="h3">
						{ __( 'Things to do next', 'woocommerce-admin' ) }
					</Text>
					<Text>
						{ sprintf(
							/* translators: Things the user has to do */
							_n(
								'You have %d new thing to do',
								'You have %d new things to do',
								thingsToDoNextCount,
								'woocommerce-admin'
							),
							thingsToDoNextCount
						) }
					</Text>
				</AbbreviatedCard>
			) }
			{ ordersToProcessCount > 0 && isSetupTaskListHidden && (
				<AbbreviatedCard
					className="woocommerce-abbreviated-notification"
					icon={ page }
					href={ `admin.php?page=wc-admin&opened_panel=${ ORDER_PANEL_ID }` }
					onClick={ () =>
						trackAbbreviatedCardClick( 'ordersToProcess' )
					}
					type={ isWCAdminPage ? 'wc-admin' : 'wp-admin' }
				>
					<Text as="h3">
						{ __( 'Orders to fulfill', 'woocommerce-admin' ) }
					</Text>
					<Text>
						{ sprintf(
							/* translators: Number of orders the user has to fulfill */
							_n(
								'You have %d order to fulfill',
								'You have %d orders to fulfill',
								ordersToProcessCount,
								'woocommerce-admin'
							),
							ordersToProcessCount
						) }
					</Text>
				</AbbreviatedCard>
			) }
			{ reviewsToModerateCount > 0 && isSetupTaskListHidden && (
				<AbbreviatedCard
					className="woocommerce-abbreviated-notification"
					icon={ comment }
					href={ `admin.php?page=wc-admin&opened_panel=${ REVIEWS_PANEL_ID }` }
					onClick={ () =>
						trackAbbreviatedCardClick( 'reviewsToModerate' )
					}
					type={ isWCAdminPage ? 'wc-admin' : 'wp-admin' }
				>
					<Text as="h3">
						{ __( 'Reviews to moderate', 'woocommerce-admin' ) }
					</Text>
					<Text>
						{ sprintf(
							/* translators: Number of reviews the user has to moderate */
							_n(
								'You have %d review to moderate',
								'You have %d reviews to moderate',
								reviewsToModerateCount,
								'woocommerce-admin'
							),
							reviewsToModerateCount
						) }
					</Text>
				</AbbreviatedCard>
			) }
			{ stockNoticesCount > 0 && isSetupTaskListHidden && (
				<AbbreviatedCard
					className="woocommerce-abbreviated-notification"
					icon={ box }
					href={ `admin.php?page=wc-admin&opened_panel=${ STOCK_PANEL_ID }` }
					onClick={ () =>
						trackAbbreviatedCardClick( 'stockNotices' )
					}
					type={ isWCAdminPage ? 'wc-admin' : 'wp-admin' }
				>
					<Text as="h3">
						{ __( 'Inventory to review', 'woocommerce-admin' ) }
					</Text>
					<Text>
						{ __(
							'You have inventory to review and update',
							'woocommerce-admin'
						) }
					</Text>
				</AbbreviatedCard>
			) }
			{ ! isExtendedTaskListHidden && <Slot /> }
		</div>
	);
};

export default AbbreviatedNotificationsPanel;
