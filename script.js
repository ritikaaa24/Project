document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. THEME SWITCHER (DARK/LIGHT MODE)
       ========================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check localStorage or browser preferences for default theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        const initialTheme = systemPrefersDark ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', initialTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Show brief toast notification on theme switch
        showToast(`Switched to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode`);
    });

    /* ==========================================
       2. TYPING EFFECT (HERO SECTION)
       ========================================== */
    const typingTextSpan = document.getElementById('typing-text');
    const roles = ["Full-Stack Developer", "Software Engineer", "Problem Solver", "AI Enthusiast"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingTextSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // speed up backspacing
        } else {
            typingTextSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // normal typing speed
        }

        // Handle states
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start the typing loop
    if (typingTextSpan) {
        setTimeout(typeEffect, 1000);
    }

    /* ==========================================
       3. RESPONSIVE MOBILE NAVIGATION MENU
       ========================================== */
    const hamburgerMenuBtn = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMobileMenu() {
        hamburgerMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('open');
    }

    if (hamburgerMenuBtn) {
        hamburgerMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when nav-links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    /* ==========================================
       4. NAVBAR SCROLL STYLE & ACTIVE PAGE TRACK
       ========================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Navbar blur addition
        if (scrollPos > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active navbar items
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    /* ==========================================
       5. SCROLL TRIGGER ANIMATIONS (INTERSECTION OBSERVER)
       ========================================== */
    const animElements = document.querySelectorAll('.fade-in-element');
    const progressLines = document.querySelectorAll('.progress-line');

    const scrollObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                
                // If it's a skill category card, animate its progress bars
                if (entry.target.classList.contains('skill-category')) {
                    const bars = entry.target.querySelectorAll('.progress-line');
                    bars.forEach(bar => {
                        const targetPct = bar.getAttribute('data-percentage');
                        const progressIndicator = bar.querySelector('span');
                        progressIndicator.style.width = targetPct;
                    });
                }
                
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, scrollObserverOptions);

    // Observe fade-in elements
    animElements.forEach(el => scrollObserver.observe(el));
    
    // Also register skill cards for progress trigger
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(cat => scrollObserver.observe(cat));

    /* ==========================================
       6. PORTFOLIO GALLERY FILTERS
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active style from other filter buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Re-trigger visual fade
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* ==========================================
       7. PROJECT DATA & DETAIL MODAL DIALOG
       ========================================== */
    const projectData = {
        '1': {
            title: 'AI Coding Companion',
            category: 'Artificial Intelligence',
            tech: ['HTML5', 'Vanilla CSS', 'JavaScript', 'Node.js', 'LLM API'],
            desc: 'A web-based interactive companion that guides junior developers through code templates. It reviews coding patterns in real-time, suggests CSS variables alignment, validates responsive styles, and provides custom coding hints to ensure quality code without copy-pasting code directly.',
            github: 'https://github.com/ritikamaurya',
            demo: '#'
        },
        '2': {
            title: 'EcoTrack Dashboard',
            category: 'Web Development',
            tech: ['React.js', 'Chart.js', 'Node.js', 'MongoDB', 'CSS3'],
            desc: 'EcoTrack is a full-featured carbon footprint tracking system designed to educate users on their environment impacts. It incorporates responsive custom dashboards built in SVGs, charts highlighting monthly emissions, habit tracking widgets, and community goals sharing panels.',
            github: 'https://github.com/ritikamaurya',
            demo: '#'
        },
        '3': {
            title: 'AetherCart E-Commerce',
            category: 'Web Development',
            tech: ['JavaScript (ES6)', 'HTML5', 'Vanilla CSS', 'LocalStore API'],
            desc: 'A modern, dynamic storefront mimicking high-end glassmorphism layouts. It features full responsive product filtering cards, an active shopping cart with live state count updates, dynamic pricing calculations, slide-out side sheets, and full dark-theme switches.',
            github: 'https://github.com/ritikamaurya',
            demo: '#'
        },
        '4': {
            title: 'Zenith Design System',
            category: 'UI/UX Design',
            tech: ['Figma', 'CSS variables', 'Style Guide', 'Storybook'],
            desc: 'Zenith is a premium styling package and design system built with custom modular CSS variables, enabling instant adjustments in layouts. It defines clear standards for frosted glass ratios, custom responsive media query sizes, and includes a kit of accessible web elements.',
            github: 'https://github.com/ritikamaurya',
            demo: '#'
        }
    };

    const modal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-body-content');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

    function openModal(projectId) {
        const project = projectData[projectId];
        if (!project) return;

        // Construct HTML content inside modal
        let tagsHtml = '';
        project.tech.forEach(t => {
            tagsHtml += `<span class="tech-tag">${t}</span>`;
        });

        modalContent.innerHTML = `
            <div class="modal-project-header">
                <h2>${project.title}</h2>
            </div>
            <div class="modal-project-meta">
                <strong>Category:</strong> <span class="gradient-text">${project.category}</span>
                <div class="modal-project-tags">${tagsHtml}</div>
            </div>
            <div class="modal-project-body">
                <p>${project.desc}</p>
            </div>
            <div class="modal-project-links">
                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-small">
                    <i class="fa-brands fa-github"></i> View GitHub
                </a>
                <a href="${project.demo}" class="btn btn-secondary btn-small">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Preview
                </a>
            </div>
        `;

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Restore background scroll
    }

    viewDetailsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectId = e.target.getAttribute('data-project');
            openModal(projectId);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close modal on background overlay clicks
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    /* ==========================================
       8. CONTACT FORM VALIDATION & FEEDBACK
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const formFields = {
        name: { input: document.getElementById('form-name'), error: document.getElementById('name-error') },
        email: { input: document.getElementById('form-email'), error: document.getElementById('email-error') },
        subject: { input: document.getElementById('form-subject'), error: document.getElementById('subject-error') },
        message: { input: document.getElementById('form-message'), error: document.getElementById('message-error') }
    };

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    function validateField(field) {
        const input = field.input;
        const val = input.value.trim();
        const parent = input.parentElement;

        let isValid = true;

        if (input.type === 'email') {
            if (val === '') {
                field.error.textContent = 'Email address is required';
                isValid = false;
            } else if (!validateEmail(val)) {
                field.error.textContent = 'Please enter a valid email address';
                isValid = false;
            }
        } else {
            if (val === '') {
                isValid = false;
            }
        }

        if (!isValid) {
            parent.classList.add('invalid');
        } else {
            parent.classList.remove('invalid');
        }

        return isValid;
    }

    // Input event listeners to clear error styles on input edits
    Object.keys(formFields).forEach(key => {
        const field = formFields[key];
        field.input.addEventListener('input', () => {
            if (field.input.value.trim() !== '') {
                field.input.parentElement.classList.remove('invalid');
            }
        });
    });

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let formValid = true;

            // Validate all inputs
            Object.keys(formFields).forEach(key => {
                const isValid = validateField(formFields[key]);
                if (!isValid) {
                    formValid = false;
                }
            });

            if (formValid) {
                // Show submission feedback
                const submitBtn = document.getElementById('form-submit-btn');
                const btnOriginalText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
                
                // Simulate network latency
                setTimeout(() => {
                    showToast('Thank you! Your message has been sent successfully.');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = btnOriginalText;
                    
                    // Reset placeholder-shown floating logic manually for custom textarea/inputs
                    document.querySelectorAll('.form-group').forEach(grp => {
                        grp.classList.remove('invalid');
                    });
                }, 1500);
            } else {
                showToast('Please fix the errors in the form before submitting.', true);
            }
        });
    }

    /* ==========================================
       9. TOAST NOTIFICATION UTILITY
       ========================================== */
    const toast = document.getElementById('toast-notification');
    const toastText = document.getElementById('toast-message-text');
    let toastTimeout;

    function showToast(message, isError = false) {
        clearTimeout(toastTimeout);
        
        toastText.textContent = message;
        
        // Handle icons and styling
        const toastIcon = toast.querySelector('.toast-icon');
        if (isError) {
            toast.classList.add('toast-error');
            toastIcon.className = 'fa-solid fa-circle-xmark toast-icon';
        } else {
            toast.classList.remove('toast-error');
            toastIcon.className = 'fa-solid fa-circle-check toast-icon';
        }

        toast.classList.add('show');

        // Dismiss after 4 seconds
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    /* ==========================================
       10. BACK TO TOP BUTTON TRIGGERS
       ========================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
