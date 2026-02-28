document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       1. Custom Cursor Logic
    ========================================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    // Suivi de la souris
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Immediate response for dot
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Slight delay for ring (using GSAP or native requestAnimationFrame, simple approach here)
        cursorRing.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 100, fill: "forwards" });
    });

    // Hover effects for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-panel');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    /* ==========================================================
       2. UI Interactivity (Navbar & Menus)
    ========================================================== */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.add('fa-bars');
                hamburger.querySelector('i').classList.remove('fa-times');
            });
        });
    }

    /* ==========================================================
       3. Typewriter Effect (Hero Title)
    ========================================================== */
    const typedTextSpan = document.querySelector(".type-text");
    const textArray = ["Jdia Somia", "a Developer", "a Data Engineer"];
    const typingDelay = 100;
    const erasingDelay = 100;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (textArray.length) {
        // Start after a short delay
        setTimeout(type, 1000);
        typedTextSpan.textContent = "";
    }

    /* ==========================================================
       4. GSAP & ScrollTrigger Animations
    ========================================================== */
    // Ensure GSAP plugins are registered
    gsap.registerPlugin(ScrollTrigger);

    // Initial load animations (Hero)
    gsap.from(".hero .gs-reveal", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Section Headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8
        });
    });

    // Timeline Animations
    gsap.utils.toArray('.timeline-item.left').forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
            },
            x: -100,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        });
    });

    gsap.utils.toArray('.timeline-item.right').forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
            },
            x: 100,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        });
    });

    // Hexagon Skills stagger
    gsap.from(".hex-wrap", {
        scrollTrigger: {
            trigger: ".hex-grid",
            start: "top 75%",
        },
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)"
    });

    // Projects container animation
    gsap.from(".project-slider", {
        scrollTrigger: {
            trigger: ".projects",
            start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 0.8
    });

    /* ==========================================================
       5. Three.js Background Particles (Global Canvas)
    ========================================================== */
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        const sceneBg = new THREE.Scene();
        const cameraBg = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const rendererBg = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });

        rendererBg.setSize(window.innerWidth, window.innerHeight);
        rendererBg.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            // Spread across a large area
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Particle material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: '#a855f7', // purple tint
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        sceneBg.add(particlesMesh);

        cameraBg.position.z = 3;

        // Mouse Parallax Effect on background
        let mouseX = 0;
        let mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX / window.innerWidth - 0.5;
            mouseY = event.clientY / window.innerHeight - 0.5;
        });

        // Animation loop for Background
        const clock = new THREE.Clock();
        function animateBg() {
            requestAnimationFrame(animateBg);
            const elapsedTime = clock.getElapsedTime();

            // Rotate particles slowly
            particlesMesh.rotation.y = elapsedTime * 0.05;
            particlesMesh.rotation.x = elapsedTime * 0.02;

            // Parallax offset
            cameraBg.position.x += (mouseX * 0.5 - cameraBg.position.x) * 0.05;
            cameraBg.position.y += (-mouseY * 0.5 - cameraBg.position.y) * 0.05;

            rendererBg.render(sceneBg, cameraBg);
        }
        animateBg();

        // Window resize handler
        window.addEventListener('resize', () => {
            cameraBg.aspect = window.innerWidth / window.innerHeight;
            cameraBg.updateProjectionMatrix();
            rendererBg.setSize(window.innerWidth, window.innerHeight);
        });
    }

    /* ==========================================================
       6. Three.js Hero Foreground Object (Cyber Sphere)
    ========================================================== */
    const heroContainer = document.getElementById('hero-3d-container');
    if (heroContainer) {
        const sceneHero = new THREE.Scene();
        // Camera aspect based on container
        const cameraHero = new THREE.PerspectiveCamera(75, heroContainer.clientWidth / heroContainer.clientHeight, 0.1, 100);
        const rendererHero = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        rendererHero.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
        rendererHero.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        heroContainer.appendChild(rendererHero.domElement);

        // Geometrie complexe : Icosahedron
        const geometry = new THREE.IcosahedronGeometry(1.5, 1);

        // Material filaire brillant (neon blue)
        const material = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });

        const sphere = new THREE.Mesh(geometry, material);
        sceneHero.add(sphere);

        // Core central
        const coreGeo = new THREE.IcosahedronGeometry(0.8, 2);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x9d4edd,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        sceneHero.add(core);

        cameraHero.position.z = 4;

        // Interaction souris
        let targetX = 0;
        let targetY = 0;

        heroContainer.addEventListener('mousemove', (e) => {
            const rect = heroContainer.getBoundingClientRect();
            // Normaliser entre -1 et 1
            targetX = ((e.clientX - rect.left) / heroContainer.clientWidth) * 2 - 1;
            targetY = -((e.clientY - rect.top) / heroContainer.clientHeight) * 2 + 1;
        });

        // Loop Hero
        function animateHero() {
            requestAnimationFrame(animateHero);

            // Base rotation
            sphere.rotation.x += 0.002;
            sphere.rotation.y += 0.005;
            core.rotation.y -= 0.01;

            // Interactive rotation
            sphere.rotation.x += 0.01 * (targetY - sphere.rotation.x);
            sphere.rotation.y += 0.01 * (targetX - sphere.rotation.y);

            rendererHero.render(sceneHero, cameraHero);
        }
        animateHero();

        // Resize handler local
        window.addEventListener('resize', () => {
            if (!heroContainer) return;
            cameraHero.aspect = heroContainer.clientWidth / heroContainer.clientHeight;
            cameraHero.updateProjectionMatrix();
            rendererHero.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
        });
    }

    /* ==========================================================
       7. Three.js Contact Globe
    ========================================================== */
    const contactGlobeContainer = document.getElementById('contact-globe');
    if (contactGlobeContainer) {
        const sceneGlobe = new THREE.Scene();
        const cameraGlobe = new THREE.PerspectiveCamera(60, contactGlobeContainer.clientWidth / contactGlobeContainer.clientHeight, 0.1, 100);
        cameraGlobe.position.z = 5;

        const rendererGlobe = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        rendererGlobe.setSize(contactGlobeContainer.clientWidth, contactGlobeContainer.clientHeight);
        rendererGlobe.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        contactGlobeContainer.appendChild(rendererGlobe.domElement);

        // Group container to rotate everything
        const globeGroup = new THREE.Group();
        sceneGlobe.add(globeGroup);

        // Core dark sphere
        const coreGeometry = new THREE.SphereGeometry(1.4, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x050507, // Dark background color
            transparent: true,
            opacity: 0.9
        });
        const innerCore = new THREE.Mesh(coreGeometry, coreMaterial);
        globeGroup.add(innerCore);

        // Neon Blue Lines Sphere
        const wireGeometry1 = new THREE.SphereGeometry(1.5, 20, 20);
        const wireMaterial1 = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const wireGlobe1 = new THREE.Mesh(wireGeometry1, wireMaterial1);
        globeGroup.add(wireGlobe1);

        // Neon Pink/Purple Lines Sphere (slightly larger)
        const wireGeometry2 = new THREE.SphereGeometry(1.6, 16, 16);
        const wireMaterial2 = new THREE.MeshBasicMaterial({
            color: 0xff00d4, // Neon pink/purple
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wireGlobe2 = new THREE.Mesh(wireGeometry2, wireMaterial2);
        // Rotate it differently initially so lines cross each other
        wireGlobe2.rotation.x = Math.PI / 4; 
        globeGroup.add(wireGlobe2);

        // Small floating particles around globe
        const pGeometry = new THREE.BufferGeometry();
        const pCount = 200;
        const posArray = new Float32Array(pCount * 3);
        for(let i = 0; i < pCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 6;
        }
        pGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const pMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x9d4edd,
            transparent: true,
            opacity: 0.8
        });
        const pMesh = new THREE.Points(pGeometry, pMaterial);
        globeGroup.add(pMesh);

        // Mouse interaction for the contact globe
        let targetRotX = 0;
        let targetRotY = 0;

        contactGlobeContainer.addEventListener('mousemove', (e) => {
            const rect = contactGlobeContainer.getBoundingClientRect();
            targetRotX = ((e.clientY - rect.top) / contactGlobeContainer.clientHeight) * 2 - 1;
            targetRotY = ((e.clientX - rect.left) / contactGlobeContainer.clientWidth) * 2 - 1;
        });

        function animateContactGlobe() {
            requestAnimationFrame(animateContactGlobe);

            // Base autonomous rotation
            globeGroup.rotation.y += 0.003;
            wireGlobe1.rotation.x -= 0.001;
            wireGlobe1.rotation.y -= 0.002;
            wireGlobe2.rotation.x += 0.002;
            wireGlobe2.rotation.z -= 0.001;
            pMesh.rotation.y += 0.001;

            // Interactive continuous rotation influence
            globeGroup.rotation.y += targetRotY * 0.02;
            globeGroup.rotation.x += targetRotX * 0.02;

            rendererGlobe.render(sceneGlobe, cameraGlobe);
        }
        animateContactGlobe();

        // Responsive resize
        window.addEventListener('resize', () => {
            if (!contactGlobeContainer) return;
            const width = contactGlobeContainer.clientWidth;
            const height = contactGlobeContainer.clientHeight;
            cameraGlobe.aspect = width / height;
            cameraGlobe.updateProjectionMatrix();
            rendererGlobe.setSize(width, height);
        });
    }

    /* ==========================================================
       7. Swiper 3D Coverflow (Projects)
    ========================================================== */
    if (document.querySelector('.project-slider')) {
        const swiper = new Swiper('.project-slider', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: false, // Turned off to fix clone rendering issues with only 4 items
            initialSlide: 1, // Start on the second slide (Roadmap)
            coverflowEffect: {
                rotate: 15,
                stretch: 0,
                depth: 200,
                modifier: 1,
                slideShadows: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

});
