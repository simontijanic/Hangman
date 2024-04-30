const input = document.querySelector("#input");
const output = document.querySelector("#output");
const hint = document.querySelector("#hint");
const points = document.querySelector("#points");
const nameInput = document.querySelector("#nameInput")
const container = document.querySelector(".container")

const images = [
    "gfx/Torso.png",
    "gfx/Arm1.png",
    "gfx/Arm2.png",
    "gfx/Leg1.png",
    "gfx/Leg2.png"
]

const ordListe = [
   {
       ord: "Sackboy",
       hint: "The main character in the game.",
       poeng: 2
    },
    {
        ord: "Sony",
        hint: "Video game publisheren.",
        poeng: 2
    },
    {
        ord: "OddSock",
        hint: "One of the legendary heroes of Bunkum.",
        poeng: 6
    },
    {
        ord: "Toggle",
        hint: "One of the legendary heroes of Bunkum.",
        poeng: 6
    },
    {
        ord: "Swoop",
        hint: "One of the legendary heroes of Bunkum.",
        poeng: 6
    },
    {
        ord: "Craftworld",
        hint: "The map in the game.",
        poeng: 3
    },
    {
        ord: "The Collector",
        hint: "The evil in the game.",
        poeng: 3
    },
    {
        ord: "LittleBigPlanet 4",
        hint: "The newest release of the game.",
        poeng: 3
    },
];


const maksFeil = 5
let feil  = 0
let riktigSvar = [];
let gjetta = [];
let svarPoeng = 0
let maksSekunder = 120
let sekunderBrukt = 0
let timerSekunder

function startTimer() {
    timerSekunder = setInterval(() => {
        if (sekunderBrukt >= maksSekunder) {
            stopTimer()
            gameOver(false, "timerMax")
            return
        }
        sekunderBrukt += 1
        console.log(sekunderBrukt)
    }, 1000)
}

function stopTimer() {
    clearInterval(timerSekunder)
}

function startGame() {
    gjetta = [];
    feil = 0;
    riktigSvar = [];
    svarPoeng = 0
    sekunderBrukt = 0
    
    startTimer()

    points.innerHTML = localStorage.getItem("Points");


    images.forEach(img => {
        const image = document.querySelector(`img[src="${img}"]`);
        if (image) {
            image.classList.add("hidden");
        }
    });

    const ordIndex = Math.floor(Math.random() * ordListe.length);
    const ordObj = ordListe[ordIndex];
    riktigSvar = ordObj.ord;
    svarPoeng = ordObj.poeng;

    console.log(riktigSvar);

    hint.innerHTML = ordObj.hint;

    const hiddenSvar = riktigSvar.split("").map(letter => "_").join("");
    output.innerHTML = hiddenSvar;
}
  
function gameOver(vant, param) {
    if (!vant) {
        if (param == "timerMax") {
            hint.innerHTML = `${localStorage.getItem("name")}, you used too long!`;
        } else {
            hint.innerHTML = `${localStorage.getItem("name")}, you killed Sackboy!`;
        }
    } else {
        proportion = 1 - (sekunderBrukt / maksSekunder)
        pointsLocalStorage = Math.ceil(proportion * parseInt(localStorage.getItem("Points")) || 0);    

        localStorage.setItem("Points", pointsLocalStorage + svarPoeng);
        points.innerHTML = localStorage.getItem("Points");

        hint.innerHTML = `${localStorage.getItem("name")}, you guessed the right word!`;

    }
    stopTimer()
    setTimeout(() => {
        startGame();
    }, 2000)
}

function sjekkBokstav(bokstavValgt) {
    const erBokstav = /^[\w\s]+$/.test(bokstavValgt);

    if (erBokstav && riktigSvar.includes(bokstavValgt)) {
        gjetta = [...riktigSvar].map((bokstav, index) => { // lager ny array med bokstavene. Hvis bokstaven er lik bokstaven i riktigSvar, returner bokstaven. Ellers returner bokstaven i gjetta-arrayet med _ for alle andre bokstaver.
            if (bokstav === bokstavValgt) {
                return bokstavValgt;
            } else {
                return gjetta[index] || "_";
            }
        }).join("");

        output.innerHTML = gjetta;
        const lettersInGjetta = gjetta.replace(/_/g, "").split("");
        if (lettersInGjetta.length === riktigSvar.length) return gameOver(true);
    } else {
        feil++;

        const hiddenImage = images.find(img => document.querySelector(`img[src="${img}"]`) && document.querySelector(`img[src="${img}"]`).classList.contains("hidden"));
        if (hiddenImage) {
            const image = document.querySelector(`img[src="${hiddenImage}"]`);
            image.classList.remove("hidden");
        }


        if (feil === maksFeil) return gameOver(false);  
    }

};
  
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && input.value !== "" && input.value.length === 1) {
        sjekkBokstav(input.value);
        input.value = "";
    }
})

nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && nameInput.value !== "") {
        localStorage.setItem("name", nameInput.value);
        points.parentNode.classList.remove("hidden");
        container.classList.remove("hidden");

        nameInput.parentNode.classList.add("hidden");

        startGame();
    }
})
