import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config';

const Required = () => (
  <span className='AddBookmark__required'>*</span>
)

class EditBookmark extends Component {
  static contextType = BookmarksContext;

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      url: "",
      description: "",
			rating: 1,
			error: null
    };
  }

  InputChanged(field, content) {
    this.setState({
      [field]: content
    });
  }

  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId;
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
    	.then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error
          })
        }
        return res.json()
      })
      .then(data => {
				this.setState({
          title: data.title,
          url: data.url,
          description: data.description,
          rating: Number(data.rating)
        });
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  handleSubmit = e => {
    e.preventDefault()
		// get the form fields from the event
		const { bookmarkId } = this.props.match.params;
    const {title, url, description, rating} = this.state;
    const bookmark = {
			id: Number(bookmarkId), 
			title, 
			url, 
			description, 
			rating: Number(rating)
		};
    this.setState({ error: null })
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      mode: 'no-cors',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error
          })
        }
      })
      .then(() => {
        this.resetFields(bookmark)
        this.context.updateBookmark(bookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({ error })
      })
  }

	resetFields = (newFields) => {
    this.setState({
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || '',
    })
	}
	
  handleClickCancel = () => {
    this.props.history.push('/')
  }

  render() {
    const { error } = this.state
    return (
      <section className='AddBookmark'>
        <h2>Edit bookmark</h2>
        <form
          className='AddBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
							id='title'
							placeholder="Title" 
							required
							value={this.state.title}
              onChange={e => this.InputChanged("title", e.target.value)}/>
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder="url" 
              required
	            value={this.state.url}
  	          onChange={e => this.InputChanged("url", e.target.value)}/>
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
							id='description'
							placeholder="description" 
	            value={this.state.description}
  	          onChange={e => this.InputChanged("description", e.target.value)}/>
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              min='1'
              max='5'
							required
							value={this.state.rating}
	            onChange={e => this.InputChanged("rating", e.target.value)}/>
          </div>
          <div className='AddBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
