// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const themeToggle = document.querySelector('.theme-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll handling
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for navbar styling
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Smooth scrolling and active link handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close mobile menu if open
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Smooth scroll to section
            const section = document.querySelector(this.getAttribute('href'));
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Update active link on scroll
    const sections = document.querySelectorAll('section');

        // Interests section functionality
        const showcaseFilters = document.querySelectorAll('.showcase-filter');
        const showcaseItems = document.querySelectorAll('.showcase-item');
    
        showcaseFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Remove active class from all filters
                showcaseFilters.forEach(f => f.classList.remove('active'));
                // Add active class to clicked filter
                filter.classList.add('active');
            
                const category = filter.getAttribute('data-filter');
            
                showcaseItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 0);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Add intersection observer for interest cards animation
        const interestCards = document.querySelectorAll('.interest-card');
        const interestObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    interestObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        interestCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.5s ease';
            card.style.transitionDelay = `${index * 100}ms`;
            interestObserver.observe(card);
        });

        // Add class for animation when card comes into view
        document.querySelectorAll('.interest-card.reveal').forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// Contact form handling (enhanced)
const contactForm = document.getElementById('contactForm');
const toastRoot = document.getElementById('toast');
const mailtoBtn = document.getElementById('mailtoBtn');
const copyEmailBtn = document.getElementById('copyEmailBtn');
const mailtoLink = document.getElementById('mailtoLink');

function showToast(message, timeout = 3500) {
    if (!toastRoot) return;
    const item = document.createElement('div');
    item.className = 'toast-item';
    item.textContent = message;
    toastRoot.appendChild(item);
    setTimeout(() => {
        item.style.opacity = '0';
        setTimeout(() => item.remove(), 300);
    }, timeout);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(fieldName, message) {
    const el = document.querySelector(`.error[data-for="${fieldName}"]`);
    if (el) el.textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
}

if (copyEmailBtn && mailtoLink) {
    copyEmailBtn.addEventListener('click', async () => {
        const email = mailtoLink.textContent.trim();
        try {
            await navigator.clipboard.writeText(email);
            showToast('Email copied to clipboard');
        } catch (err) {
            // Fallback: select and prompt
            const temp = document.createElement('textarea');
            temp.value = email;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            temp.remove();
            showToast('Email copied to clipboard');
        }
    });
}

if (mailtoBtn && contactForm) {
    mailtoBtn.addEventListener('click', () => {
        // Build mailto using form fields (non-destructive)
        const name = document.getElementById('name').value || '';
        const email = document.getElementById('email').value || '';
        const subject = document.getElementById('subject').value || '';
        const message = document.getElementById('message').value || '';
        const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
        const mailto = `mailto:${mailtoLink.textContent}?subject=${encodeURIComponent(subject)}&body=${body}`;
        window.location.href = mailto;
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        let hasError = false;
        if (!name) { setError('name', 'Please enter your name'); hasError = true; }
        if (!email) { setError('email', 'Please enter your email'); hasError = true; }
        else if (!validateEmail(email)) { setError('email', 'Please enter a valid email'); hasError = true; }
        if (!message) { setError('message', 'Please enter a message'); hasError = true; }

        if (hasError) {
            showToast('Please fix the highlighted errors');
            return;
        }

        // Simulate sending (replace with real request if available)
        showToast('Sending message...');
        const payload = { name, email, subject, message };
        console.log('Contact payload:', payload);

        // Simulate network delay
        setTimeout(() => {
            contactForm.reset();
            showToast('Message sent — thank you!', 4000);
        }, 900);
    });
}

// Add animation for elements when they come into view using Intersection Observer
const observerOptions = {
    threshold: 0.2 // Trigger animation when 20% of the element is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once visible
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Project cards reveal animation and hover effects
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    // Add reveal animation with stagger
    projectCards.forEach((card, index) => {
        card.classList.add('project-reveal');
        card.style.transitionDelay = `${index * 100}ms`;
        observer.observe(card);
    });

    // Add mouse tracking hover effect
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '0px');
            card.style.setProperty('--mouse-y', '0px');
        });
    });

    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            const projects = document.querySelectorAll('.project-card');
            
            projects.forEach(project => {
                if (filter === 'all') {
                    project.style.display = 'flex';
                    setTimeout(() => project.style.opacity = '1', 0);
                } else {
                    const categoryElement = project.querySelector('.project-category');
                    if (categoryElement) {
                        const category = categoryElement.textContent.toLowerCase();
                        if (category.includes(filter.toLowerCase())) {
                            project.style.display = 'flex';
                            setTimeout(() => project.style.opacity = '1', 0);
                        } else {
                            project.style.opacity = '0';
                            setTimeout(() => project.style.display = 'none', 300);
                        }
                    } else {
                        // If no category is found, hide the project
                        project.style.opacity = '0';
                        setTimeout(() => project.style.display = 'none', 300);
                    }
                }
            });
        });
    });
});

// Add dynamic year to footer
// The HTML structure assumes the footer contains a paragraph element (<p>) [3, 11].
const footerParagraph = document.querySelector('footer p');
if (footerParagraph) {
    footerParagraph.innerHTML = 
        `© ${new Date().getFullYear()} Chungu Musaka. All rights reserved.`;
}