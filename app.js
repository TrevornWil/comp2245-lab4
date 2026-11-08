document.addEventListener('DOMContentLoaded', () => {

    fetch('subjects.php')
        .then(response => {

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(subjects => {
            const subjectSelect = document.getElementById('subject');

            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.name;
                subjectSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Failed to load subjects:', error);
        });
});