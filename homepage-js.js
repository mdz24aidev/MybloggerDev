//<![CDATA[
    document.addEventListener('DOMContentLoaded', function() {
        const searchIcon = document.getElementById('search-icon');
        const searchInput = document.getElementById('search-input');
        const menu = document.getElementById('menu');

        searchIcon.addEventListener('click', function() {
            searchInput.classList.toggle('active');
            menu.classList.toggle('hidden');

            if (searchInput.classList.contains('active')) {
                searchInput.focus();
            }
        });
    });
    //]]>
