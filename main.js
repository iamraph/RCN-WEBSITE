class WebsiteController {
    constructor() {
        this.state = {
            theme: localStorage.getItem('theme') || 'light',
            currentTestimonial: 0,
            portfolioFilter: 'all'
        };
        
        this.data = {
            navItems: [
                { text: 'HOME', url: 'index.html' },
                { text: 'ABOUT', url: 'about.html' },
                { text: 'PORTFOLIO', url: 'portfolio.html' },
                { text: 'CONTACT', url: 'contact.html' }
            ],
            services: [
                {
                    icon: 'fas fa-code',
                    title: 'Web Development',
                    description: 'Custom websites built with clean, efficient code.'
                },
                {
                    icon: 'fas fa-paint-brush',
                    title: 'UI/UX Design',
                    description: 'Intuitive user interfaces and experiences.'
                },
                {
                    icon: 'fas fa-mobile-alt',
                    title: 'Responsive Design',
                    description: 'Websites that work perfectly on any device.'
                }
            ],
            portfolioItems: [
                {
                    title: 'E-commerce Website',
                    category: 'web',
                    image: 'images/portfolio/project1.jpg',
                    description: 'Web Design'
                },
                // ...add more portfolio items
            ]
        };

        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.renderNavigation();
            this.renderServices();
            this.renderPortfolio();
            this.initializeEventListeners();
            this.initializeTheme();
        });
    }

    renderNavigation() {
        const navList = document.querySelector('#navLinks ul');
        if (!navList) return;

        navList.innerHTML = this.data.navItems
            .map(item => `
                <li><a href="${item.url}">${item.text}</a></li>
            `).join('');
    }

    renderServices() {
        const servicesGrid = document.querySelector('.services-grid');
        if (!servicesGrid) return;

        servicesGrid.innerHTML = this.data.services
            .map(service => `
                <div class="service-card" data-aos="fade-up">
                    <div class="service-icon">
                        <i class="${service.icon}"></i>
                    </div>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            `).join('');
    }

    renderPortfolio() {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;

        portfolioGrid.innerHTML = this.data.portfolioItems
            .map(item => `
                <div class="portfolio-item" data-category="${item.category}" data-aos="fade-up">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="portfolio-overlay">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <a href="#" class="portfolio-link">
                            <i class="fas fa-link"></i>
                        </a>
                    </div>
                </div>
            `).join('');
    }

    initializeEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Portfolio filter
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePortfolioFilter(e));
        });

        // Mobile menu
        const menuBtn = document.querySelector('.fa-bars');
        const closeBtn = document.querySelector('.fa-times');
        if (menuBtn && closeBtn) {
            menuBtn.addEventListener('click', () => this.toggleMobileMenu(true));
            closeBtn.addEventListener('click', () => this.toggleMobileMenu(false));
        }
    }

    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.state.theme);
        localStorage.setItem('theme', this.state.theme);
    }

    handlePortfolioFilter(e) {
        const filter = e.target.dataset.filter;
        this.state.portfolioFilter = filter;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        document.querySelectorAll('.portfolio-item').forEach(item => {
            const shouldShow = filter === 'all' || item.dataset.category === filter;
            item.style.display = shouldShow ? 'block' : 'none';
        });
    }

    toggleMobileMenu(show) {
        const navLinks = document.getElementById('navLinks');
        if (navLinks) {
            navLinks.style.right = show ? '0' : '-200px';
        }
    }
}

// Initialize the website
const website = new WebsiteController();
