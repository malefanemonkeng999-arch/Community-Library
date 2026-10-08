import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);

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
  }, []);

  // Calculate total available copies
  const totalAvailableCopies = books.reduce(
    (total, book) =>
      total + Number(book.quantity || 0),
    0
  );

  // Books with low stock
  const lowStockBooks = books.filter(
    (book) => Number(book.quantity || 0) <= 2
  );

  // Member's transactions
  const myTransactions = transactions.filter(
    (transaction) =>
      loggedInUser &&
      transaction.userId === loggedInUser.id
  );

  // Number of books currently borrowed by member
  const myBorrowedBooks = myTransactions
    .filter(
      (transaction) =>
        transaction.type === "Borrowed"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.quantity || 0),
      0
    );

  return (
    <div>
      <Navbar />

      <main className="dashboard">

        <div className="page-header">
          <h1>
            Welcome, {loggedInUser?.name}
          </h1>

          <p>
            {isStaff
              ? "Here is an overview of the library."
              : "Here is an overview of your library activity."}
          </p>
        </div>

        {isStaff ? (
          <>
            {/* STAFF DASHBOARD */}

            <div className="dashboard-cards">

              <div className="dashboard-card">
                <h3>Total Books</h3>
                <p>{books.length}</p>
              </div>

              <div className="dashboard-card">
                <h3>Available Copies</h3>
                <p>{totalAvailableCopies}</p>
              </div>

              <div className="dashboard-card low-stock-card">
                <h3>Low Stock</h3>
                <p>{lowStockBooks.length}</p>
              </div>

            </div>

            <section className="table-section">

              <h2>Recent Transactions</h2>

              {transactions.length === 0 ? (
                <p>
                  No transactions recorded yet.
                </p>
              ) : (
                <div className="table-container">

                  <table>

                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Member</th>
                        <th>Book</th>
                        <th>Transaction</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>

                    <tbody>

                      {transactions
                        .slice(0, 5)
                        .map((transaction) => (
                          <tr key={transaction.id}>

                            <td>
                              {transaction.date}
                            </td>

                            <td>
                              {transaction.userName || "Staff"}
                            </td>

                            <td>
                              {transaction.bookTitle}
                            </td>

                            <td>
                              {transaction.type}
                            </td>

                            <td>
                              {transaction.quantity}
                            </td>

                          </tr>
                        ))}

                    </tbody>

                  </table>

                </div>
              )}

            </section>
          </>
        ) : (
          <>
            {/* MEMBER DASHBOARD */}

            <div className="dashboard-cards">

              <div className="dashboard-card">
                <h3>Books Available</h3>
                <p>{totalAvailableCopies}</p>
              </div>

              <div className="dashboard-card">
                <h3>My Borrowed Books</h3>
                <p>{myBorrowedBooks}</p>
              </div>

              <div className="dashboard-card">
                <h3>My Transactions</h3>
                <p>{myTransactions.length}</p>
              </div>

            </div>

            <section className="table-section">

              <h2>My Borrowing History</h2>

              {myTransactions.length === 0 ? (
                <p>
                  You have not borrowed any books yet.
                </p>
              ) : (
                <div className="table-container">

                  <table>

                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Book</th>
                        <th>Transaction</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>

                    <tbody>

                      {myTransactions
                        .slice(0, 5)
                        .map((transaction) => (
                          <tr key={transaction.id}>

                            <td>
                              {transaction.date}
                            </td>

                            <td>
                              {transaction.bookTitle}
                            </td>

                            <td>
                              {transaction.type}
                            </td>

                            <td>
                              {transaction.quantity}
                            </td>

                          </tr>
                        ))}

                    </tbody>

                  </table>

                </div>
              )}

            </section>
          </>
        )}

      </main>
    </div>
  );
}

export default Dashboard;