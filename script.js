document.addEventListener('DOMContentLoaded', function() {

    // Элементтерді анықтау
    const body = document.body;
    const modeToggle = document.getElementById('modeToggle');
    const showDetailsBtn = document.getElementById('showDetailsBtn');
    const fullDetails = document.getElementById('fullDetails');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const aiDemoForm = document.getElementById('aiDemoForm');
    const formMessage = document.getElementById('formMessage');
    const counters = document.querySelectorAll('.counter');
    const statItems = document.querySelectorAll('.stat-item'); 
    
    // Авторизация үшін элементтерді анықтау
    const userLoginTrigger = document.getElementById('userLoginTrigger'); 
    const profileLink = document.getElementById('profileLink');
    const registerBtnHero = document.getElementById('registerBtn'); 

    // Серіктестер Логикасы үшін элементтерді анықтау (Жаңа)
    const partnerButtons = document.querySelectorAll('.partner-logo-btn');
    const partnerDetailsModal = document.getElementById('partnerDetailsModal');
    const partnerNameEl = document.getElementById('partnerName');
    const partnerDescriptionEl = document.getElementById('partnerDescription');
    const partnerLinkEl = document.getElementById('partnerLink');
    const partnerModalCloseBtn = partnerDetailsModal ? partnerDetailsModal.querySelector('.close-btn') : null;

    // Scroll анимациясы үшін элементтерді анықтау
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');


    /* =========================================
     * 0. Қолданушыны Жүктеу (Dynamic User Load)
     * ========================================= */
    const loggedInUser = localStorage.getItem('username');
    const loggedInRole = localStorage.getItem('userRole'); 
    
    if (loggedInUser) {
        // Егер қолданушы жүйеге кірсе:
        userLoginTrigger.style.display = 'none'; // Кіру/Тіркелуді жасыру
        profileLink.style.display = 'inline'; // Профиль сілтемесін көрсету
        
        let roleText = '';
        if (loggedInRole === 'volunteer') {
            roleText = 'Ерікті';
        } else if (loggedInRole === 'help') {
            roleText = 'Мұқтаж';
        }

        profileLink.innerHTML = `<i class="fas fa-user-circle"></i> ${loggedInUser} (${roleText})`;
        profileLink.href = 'profile.html';
        
        if (registerBtnHero) {
            registerBtnHero.textContent = "Жеке Кабинетке Өту";
            registerBtnHero.href = "profile.html";
        }

    } else {
        // Егер қолданушы жүйеге кірмесе:
        userLoginTrigger.style.display = 'inline'; // Кіру/Тіркелуді көрсету
        profileLink.style.display = 'none'; // Профиль сілтемесін жасыру
        
        if (registerBtnHero) {
            registerBtnHero.textContent = "Ерікті болып тіркелу";
            registerBtnHero.href = "register.html";
        }
    }


    /* =========================================
     * 1. Dark Mode Логикасы
     * ========================================= */
    
    // Жүктеу кезінде режимді тексеру
    const currentMode = localStorage.getItem('mode') || 'light';
    if (currentMode === 'dark') {
        body.classList.add('dark-mode');
        modeToggle.innerHTML = '<i class="fas fa-sun"></i> Жарық Режим';
    } else {
        modeToggle.innerHTML = '<i class="fas fa-moon"></i> Қараңғы Режим';
    }

    // Режимді ауыстыру
    if (modeToggle) {
        modeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            
            let mode = 'light';
            if (body.classList.contains('dark-mode')) {
                mode = 'dark';
                modeToggle.innerHTML = '<i class="fas fa-sun"></i> Жарық Режим';
            } else {
                modeToggle.innerHTML = '<i class="fas fa-moon"></i> Қараңғы Режим';
            }
            localStorage.setItem('mode', mode);
        });
    }

    /* =========================================
     * 2. Scroll Animation Логикасы
     * ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    if ('IntersectionObserver' in window) {
        animateOnScrollElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Ескі браузерлер үшін: анимациясыз бірден көрсету
        animateOnScrollElements.forEach(element => {
            element.classList.add('in-view');
        });
    }

    /* =========================================
     * 3. Қосымша мәліметтерді көрсету/жасыру (Тек index.html үшін)
     * ========================================= */
    if (showDetailsBtn) {
        showDetailsBtn.addEventListener('click', function() {
            if (fullDetails.style.display === 'block') {
                fullDetails.style.display = 'none';
                showDetailsBtn.textContent = 'Толығырақ...';
            } else {
                fullDetails.style.display = 'block';
                showDetailsBtn.textContent = 'Жасыру';
            }
        });
    }

    /* =========================================
     * 4. Scroll To Top батырмасы
     * ========================================= */
    window.onscroll = function() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            if(scrollToTopBtn) scrollToTopBtn.style.display = "block";
        } else {
            if(scrollToTopBtn) scrollToTopBtn.style.display = "none";
        }
    };

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            document.body.scrollTop = 0; // Safari
            document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
        });
    }

    /* =========================================
     * 5. Статистика және Счетчиктер Логикасы
     * ========================================= */
    function animateCounter(element, target) {
        let count = 0;
        const speed = 200; // Жылдамдық

        const updateCount = () => {
            const increment = Math.ceil(target / speed);
            count = Math.min(count + increment, target);
            element.textContent = count.toLocaleString();
            
            if (count < target) {
                requestAnimationFrame(updateCount);
            }
        };

        updateCount();
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target.querySelector('.counter-value');
                const target = +counterElement.getAttribute('data-target');
                animateCounter(counterElement, target);
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => {
        counterObserver.observe(item);
    });

    /* =========================================
     * 6. Жаңалықтар Каруселінің Логикасы (Тек index.html үшін)
     * ========================================= */
    const track = document.querySelector('.news-carousel-track');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    
    if (track && prevBtn && nextBtn && indicatorsContainer) {
        const slides = Array.from(track.children);
        const slideCount = slides.length;
        let currentSlideIndex = 0;
        let autoSlideInterval;

        // Индикаторларды жасау
        function createIndicators() {
            slides.forEach((slide, index) => {
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                if (index % 3 === 0) { // Әрбір 3-ші слайдқа ғана индикатор
                    indicator.setAttribute('data-slide-index', index);
                    indicatorsContainer.appendChild(indicator);
                }
            });
        }
        
        // Карусельді жаңарту
        function updateCarousel() {
            const slideWidth = slides[0].getBoundingClientRect().width;
            const offset = -(currentSlideIndex * slideWidth);
            track.style.transform = `translateX(${offset}px)`;
            updateIndicators();
        }

        // Индикаторларды жаңарту
        function updateIndicators() {
            const indicators = indicatorsContainer.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.remove('active');
                if (parseInt(indicator.getAttribute('data-slide-index')) === currentSlideIndex) {
                    indicator.classList.add('active');
                }
            });
        }
        
        // Автоматты жылжуды бастау
        function startAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, 5000); // 5 секунд сайын
        }

        // Келесі слайдқа ауысу
        function nextSlide() {
            if (currentSlideIndex >= slideCount - 3) {
                currentSlideIndex = 0;
            } else {
                currentSlideIndex++;
            }
            updateCarousel();
        }

        // Алдыңғы слайдқа ауысу
        function prevSlide() {
            if (currentSlideIndex === 0) {
                currentSlideIndex = slideCount - 3;
            } else {
                currentSlideIndex--;
            }
            updateCarousel();
        }

        // Батырмаларға тыңдаушыларды қосу
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Индикаторларды басқанда жылжу
        indicatorsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('indicator')) {
                currentSlideIndex = parseInt(e.target.getAttribute('data-slide-index'));
                updateCarousel();
                startAutoSlide(); // Қолмен ауыстырғаннан кейін автоматты жылжуды қайта бастау
            }
        });

        // Резеңке өлшемі өзгергенде карусельді жаңарту
        window.addEventListener('resize', updateCarousel);

        // Карусельді іске қосу
        createIndicators(); 
        updateCarousel();   
        startAutoSlide();   
        
        // Қолданушы тышқанды карусель үстінде ұстаса, жылжуды тоқтату
        const carouselContainer = track.closest('.carousel-container');
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    /* =========================================
     * 7. Байланыс Формасы (Тек index.html үшін)
     * ========================================= */
    if (aiDemoForm) {
        aiDemoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Демо-режимдегі деректерді жинау (Нақты жіберу логикасы жоқ)
            const name = document.getElementById('name').value;
            const requestType = document.getElementById('requestType').value;

            if (name && requestType) {
                formMessage.style.color = '#ffc107'; 
                formMessage.textContent = `Рахмет, ${name}! Сіздің '${requestType}' сұранысыңыз қабылданды. Біз сізбен жақын арада байланысамыз. (Бұл демо-режим)`;
                aiDemoForm.reset();
            } else {
                formMessage.style.color = 'red';
                formMessage.textContent = 'Барлық өрістерді толтырыңыз.';
            }
        });
    }

    /* =========================================
     * 11. Серіктестер Секциясының Логикасы (Partners Section) - ЖАҢА
     * ========================================= */
    // Демо-серіктестер туралы мәліметтер
    const partnersData = {
        'partnerA': {
            name: 'A-Серіктес Қоры',
            description: 'Біздің білім беру бағдарламалары мен жастар бастамаларын қолдайтын басты серіктесіміз.',
            link: 'https://partnerA.kz'
        },
        'partnerB': {
            name: 'B-Технологиялары',
            description: 'Цифрландыру және волонтерлік процестерді автоматтандыру бойынша технологиялық серіктес.',
            link: 'https://partnerB.kz'
        },
        'partnerC': {
            name: 'C-Жасыл Қозғалысы',
            description: 'Қоршаған ортаны қорғау және экологиялық жобалар саласындағы стратегиялық серіктес.',
            link: 'https://partnerC.kz'
        }
    };

    if (partnerButtons.length > 0 && partnerDetailsModal) {
        partnerButtons.forEach(button => {
            button.addEventListener('click', function() {
                const partnerId = this.getAttribute('data-partner-id');
                const data = partnersData[partnerId];
                
                if (data) {
                    partnerNameEl.textContent = data.name;
                    partnerDescriptionEl.textContent = data.description;
                    partnerLinkEl.href = data.link;
                    partnerLinkEl.textContent = `Сайтқа өту: ${data.link}`;
                    
                    // Модальды терезені ашу
                    partnerDetailsModal.style.display = 'block';
                }
            });
        });

        // Модальды терезені жабу
        if (partnerModalCloseBtn) {
            partnerModalCloseBtn.addEventListener('click', function() {
                partnerDetailsModal.style.display = 'none';
            });
        }

        // Модальды тереден тыс жерді басқанда жабу
        window.addEventListener('click', function(event) {
            if (event.target === partnerDetailsModal) {
                partnerDetailsModal.style.display = 'none';
            }
        });
    }

}); // DOMContentLoaded-тің жабылатын жері