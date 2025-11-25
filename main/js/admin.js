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

/* script.js */

document.addEventListener('DOMContentLoaded', function() {
    const layoutContainer = document.querySelector('.table-and-details-layout');
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    const detailsPanel = document.getElementById('user-details-panel');
    const closeBtn = document.getElementById('close-panel-btn');

    // 行をクリックした時の処理
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // 選択状態の切り替え
            tableRows.forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');

            // 1. まずレイアウトを変更してパネルの枠を作る (display: blockにする)
            layoutContainer.classList.add('is-open');

            // 2. パネルを一度透明に戻す（連続クリック時のリセット用）
            detailsPanel.classList.remove('active');

            // 3. 少し待ってから「ふわっ」とさせる (display反映待ち)
            setTimeout(() => {
                detailsPanel.classList.add('active');
            }, 50);
            
            // ★ここで詳細データを書き換える処理を入れる
            // updateUserDetails(this.dataset.userId); 
        });
    });

    // 閉じるボタンをクリックした時の処理
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            // パネルを消す
            detailsPanel.classList.remove('active');
            
            // 選択解除
            tableRows.forEach(r => r.classList.remove('selected'));

            // 少し待ってからレイアウトを元に戻す（アニメーション余韻）
            setTimeout(() => {
                layoutContainer.classList.remove('is-open');
            }, 200);
        });
    }
});