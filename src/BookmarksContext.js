import React from 'react';

const BookmarkContext = React.createContext({
	bookmark: [],
	addBookmark: () => {},
	deleteBookmark: () => {}
})

export default BookmarkContext;