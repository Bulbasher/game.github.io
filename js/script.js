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

const hills = [{
        baseHeight: 120,
        amplitude: 30,
        stretch: 0.5,
        colour: colours.lightHill
    },
    {
        baseHeight: 50,
        amplitude: 20,
        stretch: 0.5,
        colour: colours.darkHill
    }
];

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
    "Press and hold anywhere to stretch out a bridge, it has to be the exact length or robber will fall down"
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
// добавление анимации падающего снега
for (let i = 0; i <= 50; i++) {
    createElementStyle("i", `font-size: ${3 * Math.random()}em;left: ${    100 * Math.random()   }%; animation-delay: ${10 * Math.random()}s, ${2 * Math.random()}s`,
        "."
    );
}
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

resetGame();

function resetGame() {
    state = "waiting";
    lastTimestamp = undefined;
    sceneOffset = 0;
    score = 0;
    introductionElement.style.opacity = 1;
    perfectElement.style.opacity = 0;
    restartButton.style.display = "none";
    scoreElement.innerText = score;
    platforms = [{ x: 50, w: 50 }];
    santaX = platforms[0].x + platforms[0].w - config.santaDistanceFromEdge;
    santaY = 0;
    sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];
    trees = [];
    clouds = [];

    for (let i = 0; i <= 20; i++) {
        if (i <= 3) generatePlatform();
        generateTree();
        generateCloud();
    }

    draw();
}


function generateCloud() {
    const minimumGap = 60;
    const maximumGap = 300;

    const lastCloud = clouds[clouds.length - 1];
    let furthestX = lastCloud ? lastCloud.x : 0;

    const x =
        furthestX +
        minimumGap +
        Math.floor(Math.random() * (maximumGap - minimumGap));

    const y =
        minimumGap +
        Math.floor(Math.random() * (maximumGap - minimumGap)) -
        window.innerHeight / 1.2;

    const w = Math.floor(Math.random() * 15 + 15);
    clouds.push({ x, y, w });
}

function generateTree() {
    const minimumGap = 30;
    const maximumGap = 150;

    const lastTree = trees[trees.length - 1];
    let furthestX = lastTree ? lastTree.x : 0;

    const x =
        furthestX +
        minimumGap +
        Math.floor(Math.random() * (maximumGap - minimumGap));

    const treeColors = [colours.lightHill, colours.medBg, colours.medHill];
    const color = treeColors[Math.floor(Math.random() * 3)];

    trees.push({ x, color });
}

function generatePlatform() {
    const minimumGap = 40;
    const maximumGap = 200;
    const minimumWidth = 20;
    const maximumWidth = 100;

    const lastPlatform = platforms[platforms.length - 1];
    let furthestX = lastPlatform.x + lastPlatform.w;

    const x =
        furthestX +
        minimumGap +
        Math.floor(Math.random() * (maximumGap - minimumGap));
    const w =
        minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

    platforms.push({ x, w });
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
}