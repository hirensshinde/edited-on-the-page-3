document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  var menuBtn = document.getElementById('menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  // Project filter tabs
  var tabs = document.querySelectorAll('.filter-tab');
  var cards = document.querySelectorAll('#project-grid .project-card');
  if (tabs.length && cards.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        var filter = tab.getAttribute('data-filter');
        cards.forEach(function (card) {
          var tags = card.getAttribute('data-tags') || '';
          if (filter === 'all' || tags.indexOf(filter) !== -1) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
