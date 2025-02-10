const express = require("express");
const router = express.Router();
const axios = require("axios");

const OPEN_LIBRARY_API_URL = "https://openlibrary.org";
let cachedRandomBook = null;
let lastUpdated = null;

// 📖 Получить разные издания книги по ISBN
router.get("/editions/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`${OPEN_LIBRARY_API_URL}/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
        const editions = response.data[`ISBN:${isbn}`] || {};
        
        res.render("editions", { editions, user: req.session.user || null });
    } catch (error) {
        console.error("Error fetching editions:", error);
        res.status(500).render("error", { message: "Error retrieving book editions", user: req.session.user || null });
    }
});

// 📚 Получить список книг автора
router.get("/author/:authorKey", async (req, res) => {
    try {
        const authorKey = req.params.authorKey;
        const response = await axios.get(`${OPEN_LIBRARY_API_URL}/authors/${authorKey}/works.json`);
        const books = response.data.entries || [];

        res.render("authorBooks", { books, user: req.session.user || null });
    } catch (error) {
        console.error("Error fetching author books:", error);
        res.status(500).render("error", { message: "Error retrieving books by author", user: req.session.user || null });
    }
});

// 📖 Случайная книга на день
router.get("/random", async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split("T")[0]; // Текущая дата (YYYY-MM-DD)
        if (!cachedRandomBook || lastUpdated !== currentDate) {
            const response = await axios.get(`${OPEN_LIBRARY_API_URL}/subjects/fiction.json?limit=100`);
            const books = response.data.works || [];
            if (books.length > 0) {
                cachedRandomBook = books[Math.floor(Math.random() * books.length)];
                lastUpdated = currentDate;
            }
        }
        
        res.render("randomBook", { book: cachedRandomBook, user: req.session.user || null });
    } catch (error) {
        console.error("Error fetching random book:", error);
        res.status(500).render("error", { message: "Error retrieving random book", user: req.session.user || null });
    }
});

module.exports = router;
