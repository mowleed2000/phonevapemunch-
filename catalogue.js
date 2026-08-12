(function () {
    'use strict';

    var currentCategory = 'All Products';

    function selectCategory(cat, el) {
        currentCategory = cat;
        document.querySelectorAll('.sidebar-nav-item').forEach(function (item) {
            item.classList.remove('active');
        });
        if (el) {
            el.classList.add('active');
        }
        filterProducts();
    }

    function filterProducts() {
        var searchInput = document.getElementById('catalogueSearch');
        var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        var cards = document.querySelectorAll('.catalogue-card');

        cards.forEach(function (card) {
            var catMatch = currentCategory === 'All Products' || card.getAttribute('data-category') === currentCategory;
            var nameMatch = (card.getAttribute('data-name') || '').includes(query);
            card.style.display = catMatch && nameMatch ? 'flex' : 'none';
        });
    }

    function openFlavorModal(index) {
        if (typeof productsData === 'undefined') return;
        var product = productsData[index];
        if (!product) return;

        var modalImg = document.getElementById('modalImg');
        var modalCat = document.getElementById('modalCat');
        var modalTitle = document.getElementById('modalTitle');
        var chipsWrap = document.getElementById('modalChips');
        var modal = document.getElementById('flavorModal');

        if (!modalImg || !modalCat || !modalTitle || !chipsWrap || !modal) return;

        modalImg.src = encodeURI(product.image);
        modalCat.innerText = product.category;
        modalTitle.innerText = product.name;

        chipsWrap.innerHTML = '';
        var flavors = product.flavors && product.flavors.length ? product.flavors : ['Popular In-Store Flavor Selection'];
        flavors.forEach(function (flavor) {
            var chip = document.createElement('span');
            chip.className = 'flavor-chip-tag';
            chip.innerText = flavor;
            chipsWrap.appendChild(chip);
        });

        modal.style.display = 'flex';
    }

    function closeFlavorModal() {
        var modal = document.getElementById('flavorModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    window.selectCategory = selectCategory;
    window.filterProducts = filterProducts;
    window.openFlavorModal = openFlavorModal;
    window.closeFlavorModal = closeFlavorModal;

    window.addEventListener('click', function (e) {
        var modal = document.getElementById('flavorModal');
        if (modal && e.target === modal) {
            closeFlavorModal();
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        if (!document.getElementById('catalogueGrid')) return;

        var params = new URLSearchParams(window.location.search);
        var category = params.get('category');
        if (!category) return;

        var targetCategory = category;
        if (category === 'Laptops') targetCategory = 'Tablets & Laptops';
        if (category === 'Vapes') targetCategory = 'Vapes & Pod Systems';

        var foundItem = null;
        document.querySelectorAll('.sidebar-nav-item').forEach(function (item) {
            if (item.textContent.trim().indexOf(targetCategory) !== -1) {
                foundItem = item;
            }
        });

        if (foundItem) {
            selectCategory(targetCategory, foundItem);
        }
    });
})();
