import React, { Component } from 'react';
import './App.css';
import * as BooksAPI from './BooksAPI'

class Book extends Component {
  state = {
    shelf: this.props.bookData.shelf
  }
  changeShelf = (book, value) => {
    if(this.props.onBookUpdate) {
      this.props.onBookUpdate(book, value)
    }
  }
  render() {
    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${this.props.bookData.imageLinks.thumbnail})` }}></div>
          <div className="book-shelf-changer">
            <select value={this.state.shelf} onChange={(e) => this.changeShelf(this.props.bookData, e.target.value)}>
              <option value="none" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{this.props.bookData.title}</div>
        {
          this.props.bookData.authors && (
              <div className="book-authors">{this.props.bookData.authors}</div>
          )
        }
      </div>
    )
  }
}

export default Book;
