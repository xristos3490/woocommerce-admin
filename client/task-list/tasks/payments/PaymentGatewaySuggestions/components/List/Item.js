/**
 * External dependencies
 */
import classnames from 'classnames';
import { Fragment } from '@wordpress/element';
import { CardBody, CardMedia, CardDivider } from '@wordpress/components';
import { RecommendedRibbon, SetupRequired } from '@woocommerce/onboarding';
import { recordEvent } from '@woocommerce/tracks';
import { Text, useSlot } from '@woocommerce/experimental';

/**
 * Internal dependencies
 */
import { PaymentAction } from '../PaymentAction';

import './List.scss';

export const Item = ( {
	isRecommended,
	markConfigured,
	paymentGateway,
	gatewayIds,
} ) => {
	const {
		image,
		content,
		id,
		plugins = [],
		title,
		loading,
		enabled: isEnabled = false,
		installed: isInstalled = false,
		needsSetup = true,
		requiredSettings,
		settingsUrl: manageUrl,
	} = paymentGateway;

	const connectSlot = useSlot(
		`woocommerce_payment_gateway_connect_${ id }`
	);
	const setupSlot = useSlot( `woocommerce_payment_gateway_setup_${ id }` );

	const hasFills =
		Boolean( connectSlot?.fills?.length ) ||
		Boolean( setupSlot?.fills?.length );
	const hasSetup = Boolean(
		plugins.length || requiredSettings.length || hasFills
	);
	const showRecommendedRibbon = isRecommended && needsSetup;

	const classes = classnames(
		'woocommerce-task-payment',
		'woocommerce-task-card',
		needsSetup && 'woocommerce-task-payment-not-configured',
		'woocommerce-task-payment-' + id
	);

	return (
		<Fragment key={ id }>
			<CardBody
				style={ { paddingLeft: 0, marginBottom: 0 } }
				className={ classes }
			>
				<CardMedia isBorderless>
					<img src={ image } alt={ title } />
				</CardMedia>
				<div className="woocommerce-task-payment__description">
					{ showRecommendedRibbon && <RecommendedRibbon /> }
					<Text as="h3" className="woocommerce-task-payment__title">
						{ title }
						{ isInstalled && needsSetup && !! plugins.length && (
							<SetupRequired />
						) }
					</Text>
					<div className="woocommerce-task-payment__content">
						{ content }
					</div>
				</div>
				<div className="woocommerce-task-payment__footer">
					<PaymentAction
						manageUrl={ manageUrl }
						id={ id }
						hasSetup={ hasSetup }
						needsSetup={ needsSetup }
						isEnabled={ isEnabled }
						isInstalled={ isInstalled }
						hasPlugins={ Boolean( plugins.length ) }
						isRecommended={ isRecommended }
						isLoading={ loading }
						markConfigured={ markConfigured }
						onSetup={ () =>
							recordEvent( 'tasklist_payment_setup', {
								options: gatewayIds,
								selected: id,
							} )
						}
					/>
				</div>
			</CardBody>
			<CardDivider />
		</Fragment>
	);
};
