const express = require("express");
const router = express.Router();
const axios = require("axios");

// Получение похожих книг из Google Books API
router.get("/related/:bookId", async (req, res) => {
    try {
        const { bookId } = req.params;
        const API_KEY = "ТВОЙ_API_КЛЮЧ"; // Можно убрать, если работаешь без ключа

        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}/associated?key=${API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Ошибка получения похожих книг" });
    }
});

// Получение информации о книге по ISBN
router.get("/book/:isbn", async (req, res) => {
    try {
        const { isbn } = req.params;
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Ошибка получения информации о книге" });
    }
});

module.exports = router;
