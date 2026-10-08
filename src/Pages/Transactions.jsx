import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";

function Transactions() {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedBook, setSelectedBook] = useState("");
  const [quantity, setQuantity] = useState("");
  const [transactionType, setTransactionType] = useState("borrow");

  const [dataLoaded, setDataLoaded] = useState(false);

  const loggedInUser = JSON.parse(
    sessionStorage.getItem("loggedInUser")
  );

  const isStaff =
    loggedInUser &&
    (loggedInUser.role === "Admin" ||
      loggedInUser.role === "Librarian");

  useEffect(() => {
    const savedBooks = localStorage.getItem("books");
    const savedTransactions =
      localStorage.getItem("transactions");

    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem(
        "books",
        JSON.stringify(books)
      );

      localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
      );
    }
  }, [books, transactions, dataLoaded]);

  const handleTransaction = (e) => {
    e.preventDefault();

    if (!selectedBook || !quantity) {
      alert("Please select a book and enter a quantity.");
      return;
    }

    const transactionQuantity = Number(quantity);

    if (transactionQuantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    const book = books.find(
      (book) => book.id === Number(selectedBook)
    );

    if (!book) {
      alert("Book not found.");
      return;
    }

    // Check available copies when borrowing
    if (
      transactionType === "borrow" &&
      transactionQuantity > Number(book.quantity)
    ) {
      alert("Not enough copies available.");
      return;
    }

    let updatedBooks;

    if (transactionType === "add") {
      updatedBooks = books.map((book) =>
        book.id === Number(selectedBook)
          ? {
              ...book,
              quantity:
                Number(book.quantity) +
                transactionQuantity,
            }
          : book
      );
    } else {
      updatedBooks = books.map((book) =>
        book.id === Number(selectedBook)
          ? {
              ...book,
              quantity:
                Number(book.quantity) -
                transactionQuantity,
            }
          : book
      );
    }

    setBooks(updatedBooks);

    const newTransaction = {
      id: Date.now(),
      bookTitle: book.title,
      type:
        transactionType === "add"
          ? "Stock Added"
          : "Borrowed",
      quantity: transactionQuantity,
      date: new Date().toLocaleString(),

      // Save the person who made the transaction
      userId: loggedInUser.id,
      userName: loggedInUser.name,
      membershipId: loggedInUser.membershipId,
    };

    setTransactions((previousTransactions) => [
      newTransaction,
      ...previousTransactions,
    ]);

    setSelectedBook("");
    setQuantity("");

    alert(
      transactionType === "add"
        ? "Stock added successfully."
        : "Book borrowed successfully."
    );
  };

  // Members only see their own borrowing transactions
  const displayedTransactions = isStaff
    ? transactions
    : transactions.filter(
        (transaction) =>
          transaction.userId === loggedInUser.id
      );

  return (
    <div>
      <Navbar />

      <main className="transactions-page">

        <div className="page-header">
          <h1>Transactions</h1>

          <p>
            {isStaff
              ? "Manage book stock and borrowing transactions."
              : "Borrow books and view your borrowing history."}
          </p>
        </div>

        <section className="transaction-form-section">

          <h2>
            {isStaff
              ? "Manage Stock"
              : "Borrow a Book"}
          </h2>

          <form
            onSubmit={handleTransaction}
            className="transaction-form"
          >

            <div className="form-group">
              <label>Book</label>

              <select
                value={selectedBook}
                onChange={(e) =>
                  setSelectedBook(e.target.value)
                }
              >
                <option value="">
                  Select a book
                </option>

                {books.map((book) => (
                  <option
                    key={book.id}
                    value={book.id}
                  >
                    {book.title} - {book.quantity} available
                  </option>
                ))}
              </select>
            </div>

            {/* Staff can choose Add Stock or Borrow */}
            {isStaff && (
              <div className="form-group">
                <label>Transaction Type</label>

                <select
                  value={transactionType}
                  onChange={(e) =>
                    setTransactionType(e.target.value)
                  }
                >
                  <option value="add">
                    Add Stock
                  </option>

                  <option value="borrow">
                    Borrow Book
                  </option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Quantity</label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                placeholder="Enter quantity"
              />
            </div>

            <div className="transaction-form-button">

              <button
                type="submit"
                className="primary-button"
              >
                {isStaff && transactionType === "add"
                  ? "Add Stock"
                  : "Borrow Book"}
              </button>

            </div>

          </form>

        </section>

        <section className="transactions-table-section">

          <h2>
            {isStaff
              ? "Transaction History"
              : "My Borrowing History"}
          </h2>

          {displayedTransactions.length === 0 ? (
            <p>
              {isStaff
                ? "No transactions recorded yet."
                : "You have not borrowed any books yet."}
            </p>
          ) : (
            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Book</th>

                    {isStaff && (
                      <th>Member</th>
                    )}

                    <th>Transaction</th>
                    <th>Quantity</th>
                  </tr>
                </thead>

                <tbody>

                  {displayedTransactions.map(
                    (transaction) => (
                      <tr key={transaction.id}>

                        <td>
                          {transaction.date}
                        </td>

                        <td>
                          {transaction.bookTitle}
                        </td>

                        {isStaff && (
                          <td>
                            {transaction.userName}
                          </td>
                        )}

                        <td>
                          {transaction.type}
                        </td>

                        <td>
                          {transaction.quantity}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Transactions;