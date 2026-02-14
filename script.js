document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const title = document.getElementById('title');
    const subtitle = document.getElementById('subtitle');
    const question = document.getElementById('question');
    const nextBtn = document.getElementById('next-btn');
    const choiceBtns = document.getElementById('choice-btns');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const heartContainer = document.querySelector('.background-hearts');

    // Config
    const config = window.VALENTINE_CONFIG || {};
    const messages = config.messages || ["Hola..."];
    let currentMessageIndex = 0;

    // Initialize UI from Config
    title.textContent = config.initTitle || "Hola ❤️";
    nextBtn.textContent = config.btnNext || "Continuar";
    yesBtn.textContent = config.btnYes || "Sí";
    noBtn.textContent = config.btnNo || "No";
    subtitle.textContent = messages[0];
    subtitle.style.opacity = 1;

    // Flow Logic
    nextBtn.addEventListener('click', () => {
        currentMessageIndex++;

        // Hide title after first message
        if (currentMessageIndex > 0) {
            title.style.opacity = 0;
            // Optional: set display none after transition if layout shift is desired, 
            // but opacity 0 keeps layout stable which is usually better. 
            // If user wants it 'gone' gone, we might need display none.
            // Let's stick to opacity for now to avoid jumping text.
            setTimeout(() => { title.style.display = 'none'; }, 500);
        }

        if (currentMessageIndex < messages.length) {
            updateContent(messages[currentMessageIndex]);
        } else {
            showProposal();
        }
    });

    function updateContent(text) {
        subtitle.style.transition = "opacity 0.5s ease";
        subtitle.style.opacity = 0;

        setTimeout(() => {
            subtitle.textContent = text;
            subtitle.style.opacity = 1;
        }, 500);
    }

    function showProposal() {
        // Change layout for proposal
        subtitle.style.transition = "opacity 0.5s ease";
        subtitle.style.opacity = 0;

        setTimeout(() => {
            subtitle.style.display = 'none'; // Completely hide subtitle
            title.textContent = "Una pregunta...";

            question.classList.remove('hidden'); // Show the big question
            question.style.opacity = 0;
            question.style.display = 'block';

            // Fade in question
            setTimeout(() => {
                question.style.transition = "opacity 1s ease";
                question.style.opacity = 1;
            }, 50);

            nextBtn.style.display = 'none';
            choiceBtns.classList.remove('hidden');
            choiceBtns.style.display = 'flex';
        }, 500);
    }

    // Interaction Logic (Yes/No)

    // Function to handle moving the button
    function moveNoButton(e) {
        // Prevent default touch behavior to stop scrolling/zooming while trying to touch
        if (e.type === 'touchstart') e.preventDefault();

        // Ensure it doesn't go off screen
        const buttonWidth = noBtn.offsetWidth;
        const buttonHeight = noBtn.offsetHeight;

        // Add a buffer so it doesn't just stick to the edge
        const buffer = 20;

        const maxX = window.innerWidth - buttonWidth - buffer;
        const maxY = window.innerHeight - buttonHeight - buffer;

        const x = Math.max(buffer, Math.random() * maxX);
        const y = Math.max(buffer, Math.random() * maxY);

        // Apply fixed positioning with high z-index
        noBtn.style.position = 'fixed';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
        noBtn.style.zIndex = '100';

        // Grow Yes button logic (Scale up)
        const currentScale = yesBtn.style.transform ? parseFloat(yesBtn.style.transform.replace('scale(', '').replace(')', '')) : 1;
        // Cap the scale so it doesn't get absurdly huge
        if (currentScale < 2.0) {
            const newScale = currentScale + 0.1;
            yesBtn.style.transform = `scale(${newScale})`;
        }
    }

    // Add listeners for both mouse and touch
    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('touchstart', moveNoButton);
    // Click listener as a fallback or final catch (though usually it moves before click)
    noBtn.addEventListener('click', moveNoButton);


    yesBtn.addEventListener('click', () => {
        // Success State
        title.style.opacity = 0;
        question.style.opacity = 0;

        setTimeout(() => {
            title.textContent = "¡Siiiii! 🎉❤️";
            question.textContent = "¡Sabía que dirías que sí! Te amo.";
            question.style.color = "#ff4d6d";
            title.style.opacity = 1;
            question.style.opacity = 1;
        }, 300);

        choiceBtns.style.display = 'none';

        // Note: No success GIF change requested

        startConfetti();
    });

    // Background Hearts
    function createHearts() {
        // Reduced count for better mobile performance
        const heartCount = 15;
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 3 + 3 + 's';
            heart.style.animationDelay = Math.random() * 5 + 's';
            heartContainer.appendChild(heart);
        }
    }
    createHearts();

    // Confetti
    function startConfetti() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#ff4d6d', '#ff8fa3', '#fff0f3', '#ffccd5', '#d90429'];

        // Reduced particles for mobile performance
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: Math.random() * 10 + 5,
                h: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 5 + 2,
                angle: Math.random() * 2 * Math.PI,
                spin: Math.random() * 0.2 - 0.1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.save();
                ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
                ctx.rotate(p.angle);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();

                p.y += p.speed;
                p.angle += p.spin;

                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }
            });
            requestAnimationFrame(draw);
        }
        draw();
        setTimeout(() => canvas.remove(), 8000);
    }
});
