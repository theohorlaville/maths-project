
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
