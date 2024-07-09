import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 4000;
app.use(bodyParser.json());





let books = [
    { id: 1, title: "1984", author: "George Orwell", pages: 328 },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", pages: 281 }
];

let users = [
    { userId: 1, favorites: [1, 2] }
];

// GET /books
app.get('/books', (req, res) => {
    res.json(books);
});

// GET /books/:id
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id == req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// GET /favorites/users/:userId
app.get('/favorites/users/:userId', (req, res) => {
    const user = users.find(u => u.userId == req.params.userId);
    if (user) {
        const favoriteBooks = user.favorites.map(favId => books.find(book => book.id === favId));
        res.json({ userId: user.userId, favorites: favoriteBooks });
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// POST /books
app.post('/books', (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages
    };
    books.push(newBook);
    res.json({ id: newBook.id, message: "Book added successfully" });
});

// POST /favorites/users/:userId
app.post('/favorites/users/:userId', (req, res) => {
    const user = users.find(u => u.userId == req.params.userId);
    const bookId = req.body.bookId;
    if (user && books.find(b => b.id == bookId)) {
        user.favorites.push(bookId);
        res.json({ message: "Book added to favorites" });
    } else {
        res.status(404).json({ message: "User or Book not found" });
    }
});

// DELETE /books/:id
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id == req.params.id);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        res.json({ message: "Book deleted successfully" });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// DELETE /favorites/users/:userId
app.delete('/favorites/users/:userId', (req, res) => {
    const user = users.find(u => u.userId == req.params.userId);
    const bookId = req.body.bookId;
    if (user && user.favorites.includes(bookId)) {
        user.favorites = user.favorites.filter(favId => favId !== bookId);
        res.json({ message: "Book removed from favorites" });
    } else {
        res.status(404).json({ message: "User or Book not found" });
    }
});

// PUT /books/:id
app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.id == req.params.id);
    if (book) {
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.pages = req.body.pages || book.pages;
        res.json({ message: "Book updated successfully" });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// PUT /favorites/users/:userId
app.put('/favorites/users/:userId', (req, res) => {
    const user = users.find(u => u.userId == req.params.userId);
    const newUserId = req.body.userId;
    if (user && newUserId) {
        users.push({ userId: newUserId, favorites: user.favorites });
        res.json({ message: "Book shared successfully" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// GET /books/analytics
app.get('/books/analytics', (req, res) => {
    // For the sake of example, we return static data.
    const analytics = {
        bookId: 1,
        totalReads: 150,
        mostPopularSection: "Chapter 1",
        uniqueReaders: 75
    };
    res.json(analytics);
});

// GET /books/qrcode
app.get('/books/qrcode', (req, res) => {
    // For the sake of example, we return a static QR code URL.
    const qrCode = {
        bookId: 1,
        qrcodeUrl: "https://example.com/qrcodes/1.png"
    };
    res.json(qrCode);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



