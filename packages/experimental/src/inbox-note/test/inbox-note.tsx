/**
 * External dependencies
 */
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { InboxNoteCard } from '../inbox-note';

jest.mock( 'react-visibility-sensor', () =>
	jest.fn().mockImplementation( ( { children, onChange } ) => {
		return (
			<>
				<button onClick={ () => onChange( true ) }>
					Trigger change
				</button>
				{ children }
			</>
		);
	} )
);

describe( 'InboxNoteCard', () => {
	const note = {
		id: 1,
		name: 'wc-admin-wc-helper-connection',
		type: 'info',
		title: 'Connect to WooCommerce.com',
		content: 'Connect to get important product notifications and updates.',
		status: 'unactioned',
		date_created: '2020-05-10T16:57:31',
		actions: [
			{
				id: 1,
				name: 'connect',
				label: 'Connect',
				query: '',
				status: 'unactioned',
				primary: false,
				url: 'http://test.com',
			},
			{
				id: 2,
				name: 'learnmore',
				label: 'Learn More',
				query: '',
				status: 'unactioned',
				primary: false,
				url: 'http://test.com',
			},
		],
		layout: 'plain',
		image: '',
		date_created_gmt: '2020-05-10T16:57:31',
		is_deleted: false,
	};
	const lastRead = 1589285995243;

	it( 'should render the defined action buttons', () => {
		const { queryByText } = render(
			<InboxNoteCard
				key={ note.id }
				note={ note }
				lastRead={ lastRead }
			/>
		);
		expect( queryByText( 'Connect' ) ).toBeInTheDocument();
		expect( queryByText( 'Learn More' ) ).toBeInTheDocument();
	} );

	it( 'should render a dismiss button', () => {
		const { queryByText } = render(
			<InboxNoteCard
				key={ note.id }
				note={ note }
				lastRead={ lastRead }
			/>
		);
		expect( queryByText( 'Dismiss' ) ).toBeInTheDocument();
	} );

	it( 'should render a notification type banner', () => {
		const bannerNote = { ...note, layout: 'banner' };
		const { container } = render(
			<InboxNoteCard
				key={ bannerNote.id }
				note={ bannerNote }
				lastRead={ lastRead }
			/>
		);
		const listNoteWithBanner = container.querySelector( '.banner' );
		expect( listNoteWithBanner ).not.toBeNull();
	} );

	it( 'should render a notification type thumbnail', () => {
		const thumbnailNote = { ...note, layout: 'thumbnail' };
		const { container } = render(
			<InboxNoteCard
				key={ thumbnailNote.id }
				note={ thumbnailNote }
				lastRead={ lastRead }
			/>
		);
		const listNoteWithThumbnail = container.querySelector( '.thumbnail' );
		expect( listNoteWithThumbnail ).not.toBeNull();
	} );

	it( 'should render a read notification', () => {
		const noteWithoutActions = { ...note, actions: [] };
		const { container } = render(
			<InboxNoteCard
				key={ note.id }
				note={ noteWithoutActions }
				lastRead={ lastRead }
			/>
		);
		const unreadNote = container.querySelector( '.message-is-unread' );
		const readNote = container.querySelector(
			'.woocommerce-inbox-message'
		);
		expect( unreadNote ).toBeNull();
		expect( readNote ).not.toBeNull();
	} );

	it( 'should render an unread notification', () => {
		const olderLastRead = 1584015595000;
		const noteWithoutActions = { ...note, actions: [] };
		const { container } = render(
			<InboxNoteCard
				key={ note.id }
				note={ noteWithoutActions }
				lastRead={ olderLastRead }
			/>
		);
		const unreadNote = container.querySelector( '.message-is-unread' );
		expect( unreadNote ).not.toBeNull();
	} );

	it( 'should not render any notification', () => {
		const deletedNote = { ...note, is_deleted: true };
		const { container } = render(
			<InboxNoteCard
				key={ note.id }
				note={ deletedNote }
				lastRead={ lastRead }
			/>
		);
		const unreadNote = container.querySelector(
			'.woocommerce-inbox-message'
		);
		expect( unreadNote ).toBeNull();
	} );

	describe( 'callbacks', () => {
		it( 'should call onDismiss with note type when "Dismiss this message" is clicked', () => {
			const onDismiss = jest.fn();
			const { getByText } = render(
				<InboxNoteCard
					key={ note.id }
					note={ note }
					lastRead={ lastRead }
					onDismiss={ onDismiss }
				/>
			);
			userEvent.click( getByText( 'Dismiss' ) );
			userEvent.click( getByText( 'Dismiss this message' ) );
			expect( onDismiss ).toHaveBeenCalledWith( note, 'note' );
		} );

		it( 'should call onDismiss with all type when "Dismiss all messages" is clicked', () => {
			const onDismiss = jest.fn();
			const { getByText } = render(
				<InboxNoteCard
					key={ note.id }
					note={ note }
					lastRead={ lastRead }
					onDismiss={ onDismiss }
				/>
			);
			userEvent.click( getByText( 'Dismiss' ) );
			userEvent.click( getByText( 'Dismiss all messages' ) );
			expect( onDismiss ).toHaveBeenCalledWith( note, 'all' );
		} );

		it( 'should call onNoteActionClick with specific action when action is clicked', () => {
			const onNoteActionClick = jest.fn();
			const { getByText } = render(
				<InboxNoteCard
					key={ note.id }
					note={ note }
					lastRead={ lastRead }
					onNoteActionClick={ onNoteActionClick }
				/>
			);
			userEvent.click( getByText( 'Learn More' ) );
			expect( onNoteActionClick ).toHaveBeenCalledWith(
				note,
				note.actions[ 1 ]
			);
		} );

		it( 'should call onBodyLinkClick with innerLink if link within content is clicked', () => {
			const onBodyLinkClick = jest.fn();
			const noteWithInnerLink = {
				...note,
				content:
					note.content +
					' <a href="http://somewhere.com">Somewhere</a>',
			};
			const { getByText } = render(
				<InboxNoteCard
					key={ noteWithInnerLink.id }
					note={ noteWithInnerLink }
					lastRead={ lastRead }
					onBodyLinkClick={ onBodyLinkClick }
				/>
			);
			userEvent.click( getByText( 'Somewhere' ) );
			expect( onBodyLinkClick ).toHaveBeenCalledWith(
				noteWithInnerLink,
				'http://somewhere.com/'
			);
		} );

		it( 'should call onVisible when visiblity sensor calls it', () => {
			const onVisible = jest.fn();
			const { getByText } = render(
				<InboxNoteCard
					key={ note.id }
					note={ note }
					lastRead={ lastRead }
					onNoteVisible={ onVisible }
				/>
			);
			expect( onVisible ).not.toHaveBeenCalled();
			userEvent.click( getByText( 'Trigger change' ) );
			expect( onVisible ).toHaveBeenCalledWith( note );
		} );

		it( 'should call onVisible when visiblity sensor calls it, but only once', () => {
			const onVisible = jest.fn();
			const { getByText } = render(
				<InboxNoteCard
					key={ note.id }
					note={ note }
					lastRead={ lastRead }
					onNoteVisible={ onVisible }
				/>
			);
			userEvent.click( getByText( 'Trigger change' ) );
			userEvent.click( getByText( 'Trigger change' ) );
			userEvent.click( getByText( 'Trigger change' ) );
			expect( onVisible ).toHaveBeenCalledTimes( 1 );
		} );
	} );
} );
