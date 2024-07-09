document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get('id'));

    let allBooks = [];

    // Function: parse CSV data
    function parseCSV(csv) {
        const lines = csv.split("\n");
        const headers = lines[0].split(",");
        const books = [];
        for (let i = 1; i < lines.length; i++) {
            const data = lines[i].split(",");
            const book = {};
            headers.forEach((header, index) => {
                book[header.trim()] = data[index] ? data[index].trim() : '';
            });
            books.push(book);
        }
        return books;
    }
    // Function: find the book by ID
    function findBookById(books, id) {
        return books.find(book => parseInt(book.id) === id);
    }

    // Fetch: JSON and CSV data
    fetch('books.json')
        .then(response => response.json())
        .then(jsonBooks => {
            allBooks = jsonBooks;
            return fetch('books.csv');
        })
        .then(response => response.text())
        .then(csv => {
            const csvBooks = parseCSV(csv);
            allBooks = allBooks.concat(csvBooks);

            const selectedBook = findBookById(allBooks, bookId);


            if (selectedBook) {
                document.getElementById('bookTitle').textContent = selectedBook.title;
                document.getElementById('title').textContent = selectedBook.title;
                document.getElementById('author').textContent = selectedBook.author;
                document.getElementById('genre').textContent = selectedBook.genre;

                const bookImage = document.getElementById('bookImage');
                bookImage.src = `images/${bookId}.jpg`;
                bookImage.alt = selectedBook.title;

            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});