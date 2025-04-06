document.addEventListener('DOMContentLoaded', () => {
    // Typing Animation
    const typingText = document.querySelector('.typing-text');
    const textEn = "Welcome to My Portfolio";
    const textRu = "Добро пожаловать в моё портфолио";
    let currentText = textEn;
    let i = 0;

    function typeWriter() {
        if (i < currentText.length) {
            typingText.textContent = currentText.substring(0, i + 1);
            i++;
            setTimeout(typeWriter, 100); // Speed of typing (100ms per letter)
        }
    }

    // Start typing animation
    typingText.textContent = "";
    typeWriter();

    // Particle Background with Interaction
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particlesArray = [];
    const trailsArray = [];
    const numberOfParticles = 100;
    let mouse = { x: null, y: null, radius: 100 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.density = Math.random() * 30 + 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = mouse.radius;
                    let force = (maxDistance - distance) / maxDistance;
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;

                    this.x -= directionX;
                    this.y -= directionY;

                    trailsArray.push({
                        x: this.x,
                        y: this.y,
                        size: this.size,
                        opacity: 0.8
                    });
                }
            }
        }

        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particlesArray.length = 0;
        trailsArray.length = 0;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    opacityValue = 1 - (distance / 120);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function drawTrails() {
        for (let i = 0; i < trailsArray.length; i++) {
            let trail = trailsArray[i];
            ctx.fillStyle = `rgba(255, 255, 255, ${trail.opacity})`;
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
            ctx.fill();

            trail.opacity -= 0.05;
            if (trail.opacity <= 0) {
                trailsArray.splice(i, 1);
                i--;
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        drawTrails();
        connect();
        requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    // Custom Cursor
    const cursor = document.querySelector('.cursor-follow');
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    const easing = 0.05;

    cursor.style.left = currentX + 'px';
    cursor.style.top = currentY + 'px';

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function followCursor() {
        currentX += (targetX - currentX) * easing;
        currentY += (targetY - currentY) * easing;

        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';

        requestAnimationFrame(followCursor);
    }

    followCursor();

    document.querySelectorAll('a, button').forEach(elem => {
        elem.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        elem.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    // Section Visibility
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    // Language Toggle with Typing Reset
    const langToggleBtn = document.getElementById('lang-toggle');
    const html = document.documentElement;

    langToggleBtn.addEventListener('click', () => {
        const currentLang = html.getAttribute('data-lang');
        const newLang = currentLang === 'en' ? 'ru' : 'en';

        html.setAttribute('data-lang', newLang);
        langToggleBtn.textContent = newLang === 'en' ? 'RU' : 'EN';

        document.querySelectorAll('.lang-text').forEach(element => {
            element.textContent = element.getAttribute(`data-${newLang}`);
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.textContent = link.getAttribute(`data-${newLang}`);
        });

        // Reset and restart typing animation for new language
        currentText = newLang === 'en' ? textEn : textRu;
        i = 0;
        typingText.textContent = "";
        typeWriter();
    });
});