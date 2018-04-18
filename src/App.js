import React from 'react'
import { Link, Route } from 'react-router-dom'
import { throttle } from 'throttle-debounce'
import * as BooksAPI from './BooksAPI'
import './App.css'
import ListBooks from './ListBooks';



// const bookies = [];

class BooksApp extends React.Component {

  state = {
    shelvedBooks: [],
    queriedBooks: [],
    query: '',
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    // showSearchPage: false
  }

  componentDidMount() {
    BooksAPI.getAll()
    .then((shelvedBooks) => {
      console.log(shelvedBooks);
      this.setState(() => ({
        shelvedBooks
      }))
    })
  }
  globalUpdate = (book, value) => {
    const { shelvedBooks }  = this.state;
    //make a hard copy
    var currentShelved = shelvedBooks.slice();
    BooksAPI.update(book.id, value)
    .then((result) => {
      var isNew = true;
      shelvedBooks.forEach((elem) => {
        if(book.id === elem.id) {
          isNew = false;
        }
      })
      book.shelf = value;
      if(isNew) {
        currentShelved.push(book)
      } else {
        currentShelved = currentShelved.map((elem => {
          if(elem.id === book.id) {
            elem.shelf = value
          }
          return elem;
        }))
      }
      currentShelved = currentShelved.filter((book) => {
        return book.shelf !== 'none';
      })

      this.setState((prevState) => ({
        shelvedBooks: currentShelved
      }
      ))
    })
  }
  updateBook = (book, shelf) => {
    BooksAPI.update(book, shelf)
    .then((shelves) => {
      this.setState((currentState) => ({
          books: currentState.books.map((elem) => {
            if(elem.id === book.id) {
              elem.shelf = shelf;
            }
          })
      }))
    })
  }
  updateQuery = (value) => {
    // if(this.state.query === value) {
    //   console.log('No need to fetch again')
    //   return;
    // } else {
      // if(value === '') {
      //   this.setState(() => ({
      //     query: value,
      //     queriedBooks: []
      //   }))
      //   return
      // } else {
      //   this.setState(() => ({
      //     query: value.trim()
      //   }))
      //    this.fetchQuery(value);
      //  }
      // if(value === this.state.query) {
      //
      // } else {
        this.setState({query: value}, () => {
          this.autocompleteSearchThrottled(this.state.query);
        })
      // }
    // }
  }
  fetchQuery = (value) => {
    const { queriedBooks, query } = this.state;
    console.log('Calling fetchQuery')
    if(value === '') {
      this.setState(() => ({
        queriedBooks: []
      }))
      return
    }
    BooksAPI.search(value)
    .then((books) => {
      try {
        if(JSON.stringify(queriedBooks) !== JSON.stringify(books)) {
          this.setState(() => ({
            queriedBooks: books
          }))
        }
      } catch(e) {
        this.setState(() => ({
          queriedBooks: []
        }))
      }
    })
  }
  autocompleteSearchThrottled = throttle(500, false, this.fetchQuery);
  render() {
    return (
      <div className="app">
        <Route exact path='/search' render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to='/'>Close</Link>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input
                  id="searchInput"
                  type="text"
                  placeholder="Search by title or author"
                  value={this.state.query}
                  onChange={(event) => this.updateQuery(event.target.value)}
                />

              </div>
            </div>
            <div className="search-books-results">
              {
                this.state.queriedBooks.length !== 0 && (
                  <ListBooks
                    shelfData={this.state.queriedBooks}
                    onListUpdate={this.globalUpdate}
                  />
                )
              }
            </div>
          </div>
        )} />
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ListBooks
                      shelf='currentlyReading'
                      shelfData={this.state.shelvedBooks.filter((book) => book.shelf === 'currentlyReading')}
                      onListUpdate={this.globalUpdate}
                    />
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want To Read</h2>
                  <div className="bookshelf-books">
                    <ListBooks
                      shelf='wantToRead'
                      shelfData={this.state.shelvedBooks.filter((book) => book.shelf === 'wantToRead')}
                      onListUpdate={this.globalUpdate}
                    />
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ListBooks
                      shelf='read'
                      shelfData={this.state.shelvedBooks.filter((book) => book.shelf === 'read')}
                      onListUpdate={this.globalUpdate}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to='/search'>Add a book</Link>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
