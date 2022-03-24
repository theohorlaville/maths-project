
function densite() {

}

let p = 0.5
function getPileorFace(p) {
    let nombreRandom = Math.random();
    if (nombreRandom > p) {
        console.log("pile")
    } else {
        console.log("face")
    }
}

getPileorFace(p);

let n = 1 / 6;

function getValueDe(n) {
    let nombreRandom = Math.random();
    let valueDe = 1;
    let chanceValue = 0;
    let isFalse = false;

    while (!isFalse) {

        if (chanceValue < nombreRandom && nombreRandom < (chanceValue + n)) {
            console.log(valueDe)
            console.log(chanceValue, nombreRandom, chanceValue + n)
            isFalse = true;
        }

        chanceValue += n;
        valueDe++

    }
}

getValueDe(n);

window.addEventListener("load", function () {

    const difficulty = document.querySelector(".gamemode")
    const retour = document.querySelector("#retour")

    var jeu = document.querySelector("#jeu")
    var menu = document.querySelector("#menu")
    var footer = document.querySelector("footer")
    var wanted = document.querySelector("#wanted")

    var temps = 120
    var score = 0;
    var bool = false
    var tab_wanted = new Array(1, 2, 3, 4, 5)



    difficulty.addEventListener("click", function () {
        menu.style.width = 0 + "%"
        jeu.style.width = 100 + "%"
        bool = true
        setTimeout(function () {
            footer.style.display = "none";
        }, 150)
    })

    retour.addEventListener("click", function () {

        menu.style.width = 100 + "%"
        jeu.style.width = 0 + "%"
        bool = false
        temps = 120
        score = 0
        setTimeout(function () {
            footer.style.display = "flex";
        }, 150)

    })

    display_score()
    display_wanted()
    setInterval(display_time, 1000)



    function display_time() {
        if (bool) {
            var timer = document.querySelector("#timer")
            temps--
            if (temps >= 0) {
                console.log("test")
                timer.innerHTML = "temps restant : " + temps
            }
        }
    }

    function display_score() {
        var scoreBoard = document.querySelector("#score")
        scoreBoard.innerHTML = "score : " + score
    }

    function display_wanted() {
        wanted.src = "./assets/" + tab_wanted[0] + ".png"
    }

})