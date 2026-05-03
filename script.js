/* ================= START CONTROL ================= */
let started = false;

/* ================= MUSIC CONTINUITY ================= */
const music = document.getElementById("bg-music");
const overlay = document.getElementById("playOverlay");

if (music) {
    window.addEventListener("load", () => {

        let allowed = localStorage.getItem("musicAllowed");

        // ✅ If user already interacted → auto start
        if (allowed === "true") {
            started = true;

            let savedTime = localStorage.getItem("musicTime");
            if (savedTime) {
                music.currentTime = savedTime;
            }

            music.play().catch(() => {
                if (overlay) overlay.style.display = "flex";
            });

        } else {
            // ❌ First page → wait for click
            if (overlay) overlay.style.display = "flex";
        }

        setInterval(() => {
            if (music) {
                localStorage.setItem("musicTime", music.currentTime);
            }
        }, 1000);
    });
}


function playMusic() {
    if (music) {
        let savedTime = localStorage.getItem("musicTime");
        if (savedTime) music.currentTime = savedTime;

        music.play();
    }

    // ✅ SAVE USER INTERACTION
    localStorage.setItem("musicAllowed", "true");

    if (overlay) overlay.style.display = "none";

    started = true;

    if (document.getElementById("title")) {
        setTimeout(showNext, 1000);
    }

    if (canvas) {
        animateHearts();
    }
}
/* ================= PAGE 1 TEXT ================= */
const seq = ["title", "msg1", "msg2", "msg3", "startBtn"];
let s = 0;

function showNext() {
    if (!started) return;

    if (s < seq.length) {
        let el = document.getElementById(seq[s]);
        if (el) el.classList.add("show");
        s++;
        setTimeout(showNext, 2000);
    }
}

/* ❌ REMOVED AUTO START */
/*
if (document.getElementById("title")) {
    setTimeout(showNext, 1000);
}
*/

/* ================= NAVIGATION ================= */
function startSurprise() {
    if (music) {
        localStorage.setItem("musicTime", music.currentTime);
    }
    window.location.href = "page2.html";
}

/* ================= HEART PARTICLES ================= */
const canvas = document.getElementById("hearts");

if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let hearts = [];

    for (let i = 0; i < 40; i++) {
        hearts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 5 + 2,
            speed: Math.random() * 1 + 0.5
        });
    }

    function drawHeart(x, y, s) {
        ctx.fillStyle = "rgba(255,105,180,0.7)";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x, y - s, x - s, y - s, x - s, y);
        ctx.bezierCurveTo(x - s, y + s, x, y + s * 1.5, x, y + s * 2);
        ctx.bezierCurveTo(x, y + s * 1.5, x + s, y + s, x + s, y);
        ctx.bezierCurveTo(x + s, y - s, x, y - s, x, y);
        ctx.fill();
    }

    function animateHearts() {
        if (!started) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        hearts.forEach(h => {
            drawHeart(h.x, h.y, h.size);
            h.y -= h.speed;

            if (h.y < 0) {
                h.y = canvas.height;
                h.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(animateHearts);
    }
}

/* ================= SLIDESHOW ================= */
const images = [
    "images/5.jpeg",
    "images/7.jpg",
    "images/10.jpg",
    "images/9.jpg",
    "images/6.jpg",
    "images/3.jpg"
];

const texts = [
    "We have not spent too much time with You!! 🥹",
    "But the 2 Times we spent was worth it!! 💖",
    "Your smile makes everything better 😊",
    "You became my Happiness 💫",
    "You became my Everyday Habit ❤️‍🩹",
    "And today is all about YOU 🎉"
];

let i = 0;

if (document.getElementById("slide")) {
    const slide = document.getElementById("slide");
    const text = document.getElementById("slideText");
    const finalImg = document.getElementById("finalImage");

    function typeWriter(txt, index = 0, callback) {
        if (index < txt.length) {
            text.innerHTML += txt.charAt(index).replace("\n", "<br>");
            setTimeout(() => typeWriter(txt, index + 1, callback), 40);
        } else {
            if (callback) callback(); // ✅ runs after typing ends
        }
    }

    function nextSlide() {
        if (i < images.length) {
            slide.src = images[i];
            text.innerHTML = "";
            typeWriter(texts[i]);
            i++;

            setTimeout(nextSlide, 3000);
        } else {
            slide.style.display = "none";

            text.innerHTML = "";
            text.classList.add("final-slide");

            typeWriter(
                    "🎉 HAPPY BIRTHDAY MY LOVE ❤️ 🎉\nYou mean everything to me 💖 \n And Pagli Love you a lot ❤️ \n Enjoy your Day SweetHeart 🫶",
                    0,
                    () => {
                        // 💖 AFTER full text finishes
                        finalImg.style.display = "block";
                        finalImg.style.opacity = "1";
                        finalImg.classList.add("show-final");

                        setTimeout(() => {
                            finalImg.classList.add("heartbeat");
                        }, 2200);
                    }
                );
        }
    }

    nextSlide();
}

/* ================= CURSOR HEART TRAIL ================= */
let lastTime = 0;

document.addEventListener("mousemove", function(e) {
    if (!started) return;

    const now = Date.now();
    if (now - lastTime < 50) return;
    lastTime = now;

    const heart = document.createElement("div");
    heart.className = "cursor-heart";
    heart.style.left = e.clientX + "px";
    heart.style.top = e.clientY + "px";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 800);
});