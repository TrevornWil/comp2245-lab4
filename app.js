document.addEventListener('DOMContentLoaded', () => {
    const subjectSelect = document.getElementById('subject');
    const form = document.querySelector('form');
    const searchInput = document.getElementById('q');
    const availableCheckbox = document.getElementById('available');
    const tableBody = document.querySelector('#results tbody');
    const statusDiv = document.getElementById('status');

    fetch('subjects.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(subjects => {
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.name;
                subjectSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Failed to load subjects:', error);
            statusDiv.textContent = 'Failed to load subject categories.';
        });

    function loadBooks() {
        const params = new URLSearchParams(new FormData(form)).toString();
        
        statusDiv.textContent = 'Loading books...';

        fetch(`books.php?${params}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server returned status ${response.status}`);
                }
                return response.json();
            })
            .then(books => {

                tableBody.replaceChildren();
                books.forEach(book => {
                    const row = document.createElement('tr');

                    const titleCell = document.createElement('td');
                    titleCell.textContent = book.title;
                    row.appendChild(titleCell);

                    const authorCell = document.createElement('td');
                    authorCell.textContent = book.author;
                    row.appendChild(authorCell);

                    const yearCell = document.createElement('td');
                    yearCell.textContent = book.year;
                    row.appendChild(yearCell);

                    const subjectCell = document.createElement('td');
                    subjectCell.textContent = book.subject;
                    row.appendChild(subjectCell);

                    const availableCell = document.createElement('td');
                    availableCell.textContent = `${book.available} of ${book.copies}`;
                    
                    if (book.available === 0) {
                        availableCell.classList.add('out');
                    }
                    row.appendChild(availableCell);

                    tableBody.appendChild(row);
                });

                if (books.length === 0) {
                    statusDiv.textContent = 'No books match your search.';
                } else if (books.length === 1) {
                    statusDiv.textContent = '1 book found.';
                } else {
                    statusDiv.textContent = `${books.length} books found.`;
                }
            })
            .catch(error => {
                console.error('Failed to load books:', error);
                statusDiv.textContent = 'Error loading book results. Please try again later.';
            });
    }

    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    loadBooks();
    form.addEventListener('submit', event => {
        event.preventDefault();
        loadBooks();
    });

    subjectSelect.addEventListener('change', loadBooks);
    availableCheckbox.addEventListener('change', loadBooks);
    searchInput.addEventListener('input', debounce(loadBooks, 300));
});