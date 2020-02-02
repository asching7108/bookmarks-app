import React from 'react';

const BookmarkContext = React.createContext({
	bookmark: [],
	addBookmark: () => {},
	deleteBookmark: () => {},
	updateBookmark: () => {}
})

export default BookmarkContext;