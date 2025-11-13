document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');
    const tableRows = document.querySelectorAll('.data-table tbody tr');

    // --- Event Listeners ---

    // Logout Button
    document.getElementById('logout-button').addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            alert('Logging out...');
            // In a real application, you would redirect or perform logout action here
            // window.location.href = '/login';
        }
    });

    // Add Administrator Button
    document.getElementById('add-admin-button').addEventListener('click', () => {
        alert('Opening "Add Administrator" modal or navigating...');
        // In a real application, this would open a modal or navigate to a new page
        // e.g., window.location.href = '/admin/new';
    });

    // Export CSV Button
    document.getElementById('export-csv-button').addEventListener('click', () => {
        alert('Exporting data to CSV...');
        // In a real application, you would trigger a CSV download here
        // This would typically involve a server-side process
    });

    // Search and Filter Functionality
    function applyFilterAndSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedFilter = filterSelect.value;

        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowData = {
                name: cells[1].textContent.toLowerCase(),
                subject: cells[2].textContent.toLowerCase(),
                adminId: cells[3].textContent.toLowerCase(),
                email: cells[4].textContent.toLowerCase(),
                gender: cells[5].textContent.toLowerCase()
            };

            let match = false;

            if (selectedFilter === 'all') {
                // Search all columns if 'Add filter' is selected
                match = Object.values(rowData).some(text => text.includes(searchTerm));
            } else {
                // Search specific column
                if (rowData[selectedFilter] && rowData[selectedFilter].includes(searchTerm)) {
                    match = true;
                }
            }

            row.style.display = match ? '' : 'none';
        });
    }

    searchInput.addEventListener('input', applyFilterAndSearch);
    filterSelect.addEventListener('change', applyFilterAndSearch);

    // Initial application of filter in case of pre-filled search/filter
    applyFilterAndSearch();

    // --- Sidebar Item Highlighting ---
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
});