/**
 * External dependencies
 */
import {
	Suspense,
	lazy,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {
	useUserPreferences,
	NOTES_STORE_NAME,
	OPTIONS_STORE_NAME,
} from '@woocommerce/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ActivityHeader from '../header/activity-panel/activity-header';
import { ActivityPanel } from './activity-panel';
import { Column } from './column';
import InboxPanel from '../inbox-panel';
import { IntroModal as NavigationIntroModal } from '../navigation/components/intro-modal';
import StatsOverview from './stats-overview';
import { StoreManagementLinks } from '../store-management-links';
import TaskListPlaceholder from '../task-list/placeholder';
import {
	WELCOME_MODAL_DISMISSED_OPTION_NAME,
	WELCOME_FROM_CALYPSO_MODAL_DISMISSED_OPTION_NAME,
} from './constants';
import { WelcomeFromCalypsoModal } from './welcome-from-calypso-modal';
import { WelcomeModal } from './welcome-modal';
import './style.scss';
import '../dashboard/style.scss';

const TaskList = lazy( () =>
	import( /* webpackChunkName: "task-list" */ '../task-list' )
);

export const Layout = ( {
	defaultHomescreenLayout,
	isBatchUpdating,
	query,
	requestingTaskList,
	taskListComplete,
	bothTaskListsHidden,
	shouldShowWelcomeModal,
	shouldShowWelcomeFromCalypsoModal,
	isTaskListHidden,
	updateOptions,
} ) => {
	const userPrefs = useUserPreferences();
	const twoColumns =
		( userPrefs.homepage_layout || defaultHomescreenLayout ) ===
		'two_columns';
	const [ showInbox, setShowInbox ] = useState( true );

	const isTaskListEnabled = bothTaskListsHidden === false;
	const isDashboardShown = ! query.task;

	if ( isBatchUpdating && ! showInbox ) {
		setShowInbox( true );
	}

	const isWideViewport = useRef( true );
	const maybeToggleColumns = useCallback( () => {
		isWideViewport.current = window.innerWidth >= 782;
	}, [] );

	useLayoutEffect( () => {
		maybeToggleColumns();
		window.addEventListener( 'resize', maybeToggleColumns );

		return () => {
			window.removeEventListener( 'resize', maybeToggleColumns );
		};
	}, [ maybeToggleColumns ] );

	const shouldStickColumns = isWideViewport.current && twoColumns;
	const shouldShowStoreLinks = taskListComplete || isTaskListHidden;

	const renderColumns = () => {
		return (
			<>
				<Column shouldStick={ shouldStickColumns }>
					<ActivityHeader
						className="your-store-today"
						title={ __( 'Your store today', 'woocommerce-admin' ) }
						subtitle={ __(
							"To do's, tips, and insights for your business",
							'woocommerce-admin'
						) }
					/>
					<ActivityPanel />
					{ isTaskListEnabled && renderTaskList() }
					<InboxPanel />
				</Column>
				<Column shouldStick={ shouldStickColumns }>
					<StatsOverview />
					{ shouldShowStoreLinks && <StoreManagementLinks /> }
				</Column>
			</>
		);
	};

	const renderTaskList = () => {
		const isSingleTask = Boolean( query.task );

		if ( requestingTaskList && ! isSingleTask ) {
			return <TaskListPlaceholder />;
		}

		return (
			<Suspense
				fallback={ isSingleTask ? null : <TaskListPlaceholder /> }
			>
				<TaskList query={ query } userPreferences={ userPrefs } />
			</Suspense>
		);
	};

	return (
		<div
			className={ classnames( 'woocommerce-homescreen', {
				'two-columns': twoColumns,
			} ) }
		>
			{ isDashboardShown ? renderColumns() : renderTaskList() }
			{ shouldShowWelcomeModal && (
				<WelcomeModal
					onClose={ () => {
						updateOptions( {
							[ WELCOME_MODAL_DISMISSED_OPTION_NAME ]: 'yes',
						} );
					} }
				/>
			) }
			{ shouldShowWelcomeFromCalypsoModal && (
				<WelcomeFromCalypsoModal
					onClose={ () => {
						updateOptions( {
							[ WELCOME_FROM_CALYPSO_MODAL_DISMISSED_OPTION_NAME ]:
								'yes',
						} );
					} }
				/>
			) }
			{ window.wcAdminFeatures.navigation && <NavigationIntroModal /> }
		</div>
	);
};

Layout.propTypes = {
	/**
	 * If the task list option is being fetched.
	 */
	requestingTaskList: PropTypes.bool.isRequired,
	/**
	 * If the task list has been completed.
	 */
	taskListComplete: PropTypes.bool,
	/**
	 * If the task list is hidden.
	 */
	bothTaskListsHidden: PropTypes.bool,
	/**
	 * Page query, used to determine the current task if any.
	 */
	query: PropTypes.object.isRequired,
	/**
	 * If the welcome modal should display
	 */
	shouldShowWelcomeModal: PropTypes.bool,
	/**
	 * If the welcome from Calypso modal should display.
	 */
	shouldShowWelcomeFromCalypsoModal: PropTypes.bool,
	/**
	 * Dispatch an action to update an option
	 */
	updateOptions: PropTypes.func.isRequired,
};

export default compose(
	withSelect( ( select ) => {
		const { isNotesRequesting } = select( NOTES_STORE_NAME );
		const { getOption, isResolving, hasFinishedResolution } = select(
			OPTIONS_STORE_NAME
		);

		const welcomeFromCalypsoModalDismissed =
			getOption( WELCOME_FROM_CALYPSO_MODAL_DISMISSED_OPTION_NAME ) ===
			'yes';
		const welcomeFromCalypsoModalDismissedResolved = hasFinishedResolution(
			'getOption',
			[ WELCOME_FROM_CALYPSO_MODAL_DISMISSED_OPTION_NAME ]
		);
		const fromCalypsoUrlArgIsPresent = !! window.location.search.match(
			'from-calypso'
		);

		const shouldShowWelcomeFromCalypsoModal =
			welcomeFromCalypsoModalDismissedResolved &&
			! welcomeFromCalypsoModalDismissed &&
			fromCalypsoUrlArgIsPresent;

		const welcomeModalDismissed =
			getOption( WELCOME_MODAL_DISMISSED_OPTION_NAME ) === 'yes';

		const welcomeModalDismissedHasResolved = hasFinishedResolution(
			'getOption',
			[ WELCOME_MODAL_DISMISSED_OPTION_NAME ]
		);

		const shouldShowWelcomeModal =
			welcomeModalDismissedHasResolved &&
			! welcomeModalDismissed &&
			welcomeFromCalypsoModalDismissedResolved &&
			! welcomeFromCalypsoModalDismissed;

		const defaultHomescreenLayout =
			getOption( 'woocommerce_default_homepage_layout' ) ||
			'single_column';
		const isTaskListHidden =
			getOption( 'woocommerce_task_list_hidden' ) === 'yes';

		return {
			defaultHomescreenLayout,
			isBatchUpdating: isNotesRequesting( 'batchUpdateNotes' ),
			shouldShowWelcomeModal,
			shouldShowWelcomeFromCalypsoModal,
			isTaskListHidden,
			bothTaskListsHidden:
				isTaskListHidden &&
				getOption( 'woocommerce_extended_task_list_hidden' ) === 'yes',
			requestingTaskList:
				isResolving( 'getOption', [
					'woocommerce_task_list_complete',
				] ) ||
				isResolving( 'getOption', [
					'woocommerce_task_list_hidden',
				] ) ||
				isResolving( 'getOption', [
					'woocommerce_extended_task_list_hidden',
				] ),
			taskListComplete:
				! isResolving( 'getOption', [
					'woocommerce_task_list_complete',
				] ) && getOption( 'woocommerce_task_list_complete' ) === 'yes',
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		updateOptions: dispatch( OPTIONS_STORE_NAME ).updateOptions,
	} ) )
)( Layout );
