window.onscroll = () => {
    if (window.scrollY > 80) {
        document.querySelector('.header .header__nav').classList.add('active');
    } else {
        document.querySelector('.header .header__nav').classList.remove('active');
    }
};

window.onload = () => {
    if (window.scrollY > 80) {
        document.querySelector('.header .header__nav').classList.add('active');
    } else {
        document.querySelector('.header .header__nav').classList.remove('active');
    }
};



document.addEventListener('DOMContentLoaded', function () {
    let loginForm = document.querySelector('.login-form-container');
    document.querySelector('#login-btn').onclick = () =>{

        loginForm.classList.toggle('active');
    }

    document.querySelector('#close-login-btn').onclick = () =>{

        loginForm.classList.remove('active');
    }


    const searchForm = document.getElementById('searchForm');
    const queryInput = document.getElementById('search-box');
    const resultsDiv = document.getElementById('matchingResults');
    const sortOptions = document.getElementById('sortOptions');


    let allBooks = [];


    // Function: parse CSV data

    function parseCSV(csv) {
        const lines = csv.split("\n");
        const headers = lines[0].split(",");
        const books = [];

        for (let i = 1; i < lines.length; i++) {
            const data = lines[i].split(",");
            if (data.length !== headers.length) continue;

            const book = {};
            headers.forEach((header, index) => {
                book[header.trim()] = data[index].trim();
            });
            books.push(book);
        }

        return books;
    }


    // Load and merge data from JSON and CSV


    fetch('books.json')
        .then(response => response.json())
        .then(jsonBooks => {
            allBooks = jsonBooks;
            fetch('books.csv')
                .then(response => response.text())
                .then(csv => {
                    const csvBooks = parseCSV(csv);

                    allBooks = [...new Map([...allBooks.map(book => [book.title.toLowerCase(), book])].concat(csvBooks.map(book => [book.title.toLowerCase(), book]))).values()];
                    updateBooks();
                });
        });



    // Function: display books
    function displayBooks(books) {
        resultsDiv.innerHTML = '';
        if (books.length === 0) {
            resultsDiv.innerHTML = '<p id="noResults">No results found</p>';
            document.getElementById('featuredBooksHeading').style.display = 'none';
            return;
        }else{
            document.getElementById('featuredBooksHeading').style.display = 'block';
        }
        books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');

            const img = document.createElement('img');
            img.classList.add('book__image');
            img.src = `images/${book.id}.jpg`;
            img.alt = book.title;
            bookDiv.appendChild(img);

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('book-title');
            titleDiv.innerHTML = book.title;

            const authorDiv = document.createElement('div');
            authorDiv.classList.add('book-author');
            authorDiv.innerHTML = book.author;

            const genreDiv = document.createElement('div');
            genreDiv.classList.add('book-genre');
            genreDiv.innerHTML = book.genre;


            const link = document.createElement('a');
            link.classList.add('book-link');
            link.href = `book-details.html?id=${book.id}`;
            link.textContent = 'Read more';


            bookDiv.appendChild(titleDiv);
            bookDiv.appendChild(authorDiv);
            bookDiv.appendChild(genreDiv);
            bookDiv.appendChild(link);

            resultsDiv.appendChild(bookDiv);
        });
    }

    // Function: highlight matches
    function highlight(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="bold-red">$1</span>');
    }

    // Function: filter and sort books
    function updateBooks() {
        const query = queryInput.value.toLowerCase();
        const sortBy = sortOptions.value || 'author';

        const filteredBooks = allBooks.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.genre.toLowerCase().includes(query)
        ).map(book => {
            return {
                ...book,
                title: highlight(book.title, query),
                author: highlight(book.author, query),
                genre: highlight(book.genre, query)
            };
        });

        filteredBooks.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
        displayBooks(filteredBooks);
    }

    // Handling search form submission
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        updateBooks();
    });

    // Handling sorting change
    sortOptions.addEventListener('change', function () {
        updateBooks();
    });

    document.querySelectorAll('.book-image').forEach(img => {
        img.addEventListener('click', function () {
            const bookId = this.id;
            window.location.href = `book-details.html?id=${bookId}`;
        });

    });
});





document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('searchQuery') || '';
    const sortBy = urlParams.get('sortBy') || 'author';
    const searchForm = document.getElementById('searchForm');


    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            const matchingBooks = data.filter(book => {
                return book[sortBy].toLowerCase().includes(searchQuery.toLowerCase());
            });

            displayResults(matchingBooks);
        })

        .catch(error => console.error('Error fetching data:', error));
});

function displayResults(books) {
    const resultsDiv = document.getElementById('matchingResults');
    resultsDiv.innerHTML = '';

    if (books.length === 0) {
        resultsDiv.innerHTML = '<p>No results found</p>';
        return;
    }

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        const bookImage = document.createElement('img');
        bookImage.src = `images/${book.id}.jpg`;
        bookImage.alt = book.title;
        bookImage.classList.add('book__image');

        const bookTitle = document.createElement('h2');
        bookTitle.textContent = book.title;
        bookTitle.classList.add('book__title');

        const bookAuthor = document.createElement('p');
        bookAuthor.textContent = `Author: ${book.author}`;
        bookAuthor.classList.add('book__author');

        const bookGenre = document.createElement('p');
        bookGenre.textContent = `Genre: ${book.genre}`;
        bookGenre.classList.add('book__genre');

        bookDiv.appendChild(bookImage);
        bookDiv.appendChild(bookTitle);
        bookDiv.appendChild(bookAuthor);
        bookDiv.appendChild(bookGenre);

        resultsDiv.appendChild(bookDiv);
    });
}


























