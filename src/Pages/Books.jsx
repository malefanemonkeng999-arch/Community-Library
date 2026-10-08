import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";

function Books() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books");

    return savedBooks
      ? JSON.parse(savedBooks)
      : [
          {
            id: 1,
            title: "Programming Fundamentals",
            author: "John Smith",
            genre: "Programming",
            isbn: "111222333",
            quantity: 4,
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");

  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !author || !genre || !isbn || !quantity) {
      alert("Please fill in all fields.");
      return;
    }

    if (Number(quantity) < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    if (editingId !== null) {
      setBooks(
        books.map((book) =>
          book.id === editingId
            ? {
                ...book,
                title,
                author,
                genre,
                isbn,
                quantity: Number(quantity),
              }
            : book
        )
      );

      setEditingId(null);
    } else {
      const newBook = {
        id: Date.now(),
        title,
        author,
        genre,
        isbn,
        quantity: Number(quantity),
      };

      setBooks([...books, newBook]);
    }

    clearForm();
  };

  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");
    setQuantity("");
    setEditingId(null);
  };

  const handleEdit = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setIsbn(book.isbn);
    setQuantity(book.quantity);
    setEditingId(book.id);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (confirmDelete) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  return (
    <div>
      <Navbar />

      <main className="books-page">

        <div className="page-header">
          <h1>Book Management</h1>
          <p>Add, update and manage books in the library.</p>
        </div>

        <div className="book-form-section">

          <h2>
            {editingId !== null
              ? "Update Book"
              : "Add New Book"}
          </h2>

          <form onSubmit={handleSubmit} className="book-form">

            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
              />
            </div>

            <div className="form-group">
              <label>Author</label>

              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
              />
            </div>

            <div className="form-group">
              <label>Genre</label>

              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Enter genre"
              />
            </div>

            <div className="form-group">
              <label>ISBN</label>

              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="Enter ISBN"
              />
            </div>

            <div className="form-group">
              <label>Initial Quantity</label>

              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>

            <div className="book-form-buttons">

              <button
                type="submit"
                className="primary-button"
              >
                {editingId !== null
                  ? "Update Book"
                  : "Add Book"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        <div className="books-table-section">

          <h2>Books List</h2>

          {books.length === 0 ? (
            <p>No books available.</p>
          ) : (
            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>ISBN</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {books.map((book) => (

                    <tr key={book.id}>

                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{book.isbn}</td>
                      <td>{book.quantity}</td>

                      <td className="action-buttons">

                        <button
                          className="edit-button"
                          onClick={() => handleEdit(book)}
                        >
                          Update
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default Books;
