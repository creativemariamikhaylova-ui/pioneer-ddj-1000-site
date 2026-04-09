(function() {
    var navItems = document.querySelectorAll('.nav-menu li a');
    var pages = {
        home: document.getElementById('home-page'),
        specs: document.getElementById('specs-page'),
        experience: document.getElementById('experience-page'),
        resources: document.getElementById('resources-page')
    };
    
    function showPage(pageId) {
        for(var key in pages) {
            if(pages[key]) pages[key].classList.remove('active-page');
        }
        if(pages[pageId]) pages[pageId].classList.add('active-page');
        for(var i = 0; i < navItems.length; i++) {
            navItems[i].classList.remove('active');
            if(navItems[i].getAttribute('data-page') === pageId) {
                navItems[i].classList.add('active');
            }
        }
        history.pushState(null, null, '#' + pageId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    for(var i = 0; i < navItems.length; i++) {
        navItems[i].addEventListener('click', function(e) {
            e.preventDefault();
            var pageId = this.getAttribute('data-page');
            if(pageId && pages[pageId]) showPage(pageId);
            var navMenu = document.querySelector('.nav-menu');
            if(window.innerWidth <= 768 && navMenu) {
                navMenu.classList.remove('active');
            }
        });
    }
    
    function hashChange() {
        var hash = window.location.hash.substring(1);
        if(hash && pages[hash]) showPage(hash);
        else showPage('home');
    }
    window.addEventListener('popstate', hashChange);
    hashChange();
    
    var statValues = document.querySelectorAll('.stat-value');
    for(var i = 0; i < statValues.length; i++) {
        var target = statValues[i].getAttribute('data-count');
        if(target) {
            statValues[i].textContent = target;
        }
    }
    
    var track = document.getElementById('sliderTrack');
    var slides = track ? track.children : [];
    var prevBtn = document.getElementById('prevSlide');
    var nextBtn = document.getElementById('nextSlide');
    var dotsContainer = document.getElementById('sliderDots');
    var currentIndex = 0;
    
    if(slides.length > 0) {
        function updateSlider() {
            track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
            updateDots();
        }
        function updateDots() {
            var dots = document.querySelectorAll('.dot');
            for(var i = 0; i < dots.length; i++) {
                if(i === currentIndex) {
                    dots[i].classList.add('active');
                } else {
                    dots[i].classList.remove('active');
                }
            }
        }
        function createDots() {
            for(var idx = 0; idx < slides.length; idx++) {
                var dot = document.createElement('span');
                dot.classList.add('dot');
                if(idx === 0) dot.classList.add('active');
                dot.addEventListener('click', (function(i) {
                    return function() {
                        currentIndex = i;
                        updateSlider();
                    };
                })(idx));
                dotsContainer.appendChild(dot);
            }
        }
        if(dotsContainer) createDots();
        if(prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateSlider();
            });
        }
        if(nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlider();
            });
        }
        updateSlider();
    }
    
    function updateCountdown() {
        var releaseDate = new Date(2026, 11, 25, 0, 0, 0);
        var now = new Date();
        var diff = releaseDate - now;
        if(diff <= 0) {
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            return;
        }
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        var mins = Math.floor((diff / (1000 * 60)) % 60);
        var secs = Math.floor((diff / 1000) % 60);
        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = mins < 10 ? '0' + mins : mins;
        document.getElementById('seconds').innerText = secs < 10 ? '0' + secs : secs;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    var scrollBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', function() {
        if(window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    var votes = { excellent: 0, good: 0, average: 0, bad: 0 };
    
    function updateChart() {
        var total = votes.excellent + votes.good + votes.average + votes.bad;
        var voteStats = document.getElementById('voteStats');
        if(voteStats) voteStats.innerText = 'Всего голосов: ' + total;
        var bars = {
            excellent: document.getElementById('bar-excellent'),
            good: document.getElementById('bar-good'),
            average: document.getElementById('bar-average'),
            bad: document.getElementById('bar-bad')
        };
        if(total === 0) {
            for(var key in bars) {
                if(bars[key]) {
                    bars[key].style.width = '0%';
                    bars[key].innerText = '0%';
                }
            }
            return;
        }
        var percentages = {
            excellent: (votes.excellent / total * 100).toFixed(1),
            good: (votes.good / total * 100).toFixed(1),
            average: (votes.average / total * 100).toFixed(1),
            bad: (votes.bad / total * 100).toFixed(1)
        };
        for(var k in bars) {
            if(bars[k]) {
                bars[k].style.width = percentages[k] + '%';
                bars[k].innerText = percentages[k] + '%';
            }
        }
    }
    
    var pollOptions = document.querySelectorAll('.poll-option');
    for(var i = 0; i < pollOptions.length; i++) {
        pollOptions[i].addEventListener('click', function(e) {
            var type = this.getAttribute('data-vote');
            if(type === 'excellent') votes.excellent++;
            else if(type === 'good') votes.good++;
            else if(type === 'average') votes.average++;
            else if(type === 'bad') votes.bad++;
            updateChart();
        });
    }
    updateChart();
    
    var themeBtn = document.getElementById('themeToggleBtn');
    if(themeBtn) {
        themeBtn.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
        });
    }
    
    var bgInterval = null;
    var randomBgBtn = document.getElementById('randomBgBtn');
    var stopRandomBg = document.getElementById('stopRandomBgBtn');
    
    var darkColors = ['#0a0f1a', '#1a1a2e', '#16213e', '#0f3460', '#2c3e50', '#1e2a3a', '#3a2c2f', '#2b2b2b', '#1b262c'];
    var lightColors = ['#ffebee', '#e3f2fd', '#e8f5e9', '#fff3e0', '#fce4ec', '#e0f7fa', '#f1f8e9', '#fff8e1', '#fbe9e7', '#e8eaf6', '#f3e5f5', '#e0f2f1', '#ffecb3', '#ffccbc', '#d1c4e9', '#b2dfdb'];
    
    function setRandomBodyBg() {
        var isLightTheme = document.body.classList.contains('light-theme');
        var colors = isLightTheme ? lightColors : darkColors;
        var randomIndex = Math.floor(Math.random() * colors.length);
        document.body.style.backgroundColor = colors[randomIndex];
    }
    
    if(randomBgBtn) {
        randomBgBtn.addEventListener('click', function() {
            if(bgInterval) clearInterval(bgInterval);
            bgInterval = setInterval(setRandomBodyBg, 5000);
            setRandomBodyBg();
        });
    }
    
    if(stopRandomBg) {
        stopRandomBg.addEventListener('click', function() {
            if(bgInterval) {
                clearInterval(bgInterval);
                bgInterval = null;
            }
            var isLightTheme = document.body.classList.contains('light-theme');
            document.body.style.backgroundColor = isLightTheme ? '#f0f2f5' : '#050505';
        });
    }
    
    var menuToggle = document.querySelector('.menu-toggle');
    var navMenu = document.querySelector('.nav-menu');
    if(menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            if(navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            } else {
                navMenu.classList.add('active');
            }
        });
    }
    
    var lightBeams = document.querySelectorAll('.light-beam');
    setInterval(function() {
        for(var i = 0; i < lightBeams.length; i++) {
            lightBeams[i].style.animationDelay = Math.random() * 8 + 's';
        }
    }, 10000);
})();
