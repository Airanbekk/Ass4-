const express = require("express");
const router = express.Router();
const axios = require("axios");

const OPEN_LIBRARY_API_URL = "https://openlibrary.org";

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

module.exports = router;
