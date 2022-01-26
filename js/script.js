let state;
let lastTimestamp;
let manX;
let manY;
let sceneOffset;
let score = 0;
let platforms = [];
let sticks = [];
let trees = [];
let clouds = [];

const config = {
    canvasWidth: 375,
    canvasHeight: 375,
    platformHeight: 100,
    manDistanceFromEdge: 10,
    paddingX: 100,
    perfectAreaSize: 10,
    backgroundSpeedMultiplier: 0.2,
    speed: 4,
    manWidth: 17,
    manHeight: 30
};
const colours = {
    lightBg: "#020321",
    medBg: "#144A0B",
    darkBg: "#020321",
    lightHill: "#E9E9E9",
    darkHill: "#C0C0C0",
    platform: "#9B4546",
    platformTop: "#620E0E",
    em: "#CF6D60",
    skin: "#CF6D60"
};

const scoreElement = createElementStyle(
    "div",
    `position:absolute;top:1.5em;font-size:5em;font-weight:900;text-shadow:${addShadow(
    colours.darkHill,
    7
  )}`
);
const canvas = createElementStyle("canvas");
const introductionElement = createElementStyle(
    "div",
    `font-size:1.2em;position:absolute;text-align:center;transition:opacity 2s;width:250px`,
    "Press and hold anywhere to stretch out a bridge, it has to be the exact length or you will fall down"
);
const perfectElement = createElementStyle(
    "div",
    "position:absolute;opacity:0;transition:opacity 2s",
    "Double Score"
);
const restartButton = createElementStyle(
    "button",
    `width:120px;height:120px;position:absolute;border-radius:50%;color:white;background-color:${colours.em};border:none;font-weight:700;font-size:1.2em;display:none;cursor:pointer`,
    "NEW GAME"
);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
Array.prototype.last = function() {
    return this[this.length - 1];
};
Math.sinus = function(degree) {
    return Math.sin((degree / 180) * Math.PI);
};
//сброс игры через кнопку пробел(пока так)
window.addEventListener("keydown", function(event) {
    if (event.key == " ") {
        event.preventDefault();
        resetGame();
        return;
    }
});

["mousedown", "touchstart"].forEach(function(evt) {
    window.addEventListener(evt, function(event) {
        if (state == "waiting") {
            lastTimestamp = undefined;
            introductionElement.style.opacity = 0;
            state = "stretching";
            window.requestAnimationFrame(animate);
        }
    });
});

["mouseup", "touchend"].forEach(function(evt) {
    window.addEventListener(evt, function(event) {
        if (state == "stretching") {
            state = "turning";
        }
    });
});

window.addEventListener("resize", function(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
});

restartButton.addEventListener("click", function(event) {
    event.preventDefault();
    resetGame();
    restartButton.style.display = "none";
});

window.requestAnimationFrame(animate);

//3д эффект для счета
function addShadow(colour, depth) {
    let shadow = "";
    for (let i = 0; i <= depth; i++) {
        shadow += `${i}px ${i}px 0 ${colour}`;
        shadow += i < depth ? ", " : "";
    }
    return shadow;
}

function createElementStyle(element, cssStyles = null, inner = null) {
    const g = document.createElement(element);
    if (cssStyles) g.style.cssText = cssStyles;
    if (inner) g.innerHTML = inner;
    document.body.appendChild(g);
    return g;
}