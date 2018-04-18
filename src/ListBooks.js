import React, { Component } from 'react';
import './App.css';
import Book from './Book';

class ListBooks extends Component {
  updateList = (book, value) => {
    if(this.props.onListUpdate) {
      this.props.onListUpdate(book, value)
    }
  }
  renderBookCallback = (book) => {
    if(this.props.shelf) {
      if(book.shelf === this.props.shelf) {
          return
          <li key={book.id}>
            <Book
              key={`book_${book.id}`}
              bookData={book}
              onBookUpdate={this.updateList}
            />
          </li>
      }
      return false;
    }
    return
    <li key={book.id}>
      <Book
        key={`book_${book.id}`}
        bookData={book}
        onBookUpdate={this.updateList}
      />
    </li>
  }
  render() {
    return (
      <ol className="books-grid">
        {
          this.props.shelfData.map((book) => (
            <li key={book.id}>
              <Book
                key={`book_${book.id}`}
                bookData={book}
                onBookUpdate={this.updateList}
              />
            </li>
          ))
        }
      </ol>
    )
  }
}

export default ListBooks;
