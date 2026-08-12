(function () {
    'use strict';

    var currentCategory = 'All Products';

    function encodeImagePath(path) {
        return path.split('/').map(function (part, i) {
            return i === 0 ? part : encodeURIComponent(part);
        }).join('/');
    }

    function buildProductSummary(product) {
        if (product.action_type === 'call') {
            return 'Unlocked, Verified Specs, Physical Stock at 354 Richmond Rd';
        }
        if (product.flavors && product.flavors.length) {
            return 'Available Flavors: ' + product.flavors.slice(0, 3).join(', ');
        }
        return 'In Stock & Ready for In-Store Pickup';
    }

    function buildActionHtml(product, index) {
        if (product.action_type === 'call') {
            return '<a href="tel:02037159418" class="btn-call-shop"><i class="fa-solid fa-phone"></i> CALL STORE FOR PRICE & STOCK</a>';
        }
        if (product.flavors && product.flavors.length) {
            return '<button type="button" onclick="openFlavorModal(' + index + ')" class="btn-view-flavors"><i class="fa-solid fa-eye"></i> VIEW AVAILABLE FLAVORS</button>';
        }
        return '';
    }

    function renderCatalogue() {
        var grid = document.getElementById('catalogueGrid');
        if (!grid || typeof productsData === 'undefined') return;

        var fragment = document.createDocumentFragment();

        productsData.forEach(function (product, index) {
            var card = document.createElement('div');
            card.className = 'catalogue-card';
            card.setAttribute('data-category', product.category);
            card.setAttribute('data-name', product.name.toLowerCase());

            card.innerHTML =
                '<div class="catalogue-card-image">' +
                    '<span class="category-tag-badge">' + product.category + '</span>' +
                    '<img src="' + encodeImagePath(product.image) + '" alt="' + product.name.replace(/"/g, '&quot;') + '" loading="lazy" decoding="async">' +
                '</div>' +
                '<div class="catalogue-card-content">' +
                    '<h3>' + product.name + '</h3>' +
                    '<p class="product-summary-text">' + buildProductSummary(product) + '</p>' +
                    buildActionHtml(product, index) +
                    '<span class="in-stock-badge">In stock</span>' +
                '</div>';

            fragment.appendChild(card);
        });

        grid.innerHTML = '';
        grid.appendChild(fragment);
    }

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

        modalImg.src = encodeImagePath(product.image);
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

        renderCatalogue();

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
