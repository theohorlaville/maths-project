
window.addEventListener("load", function () {

    const difficulty = document.querySelectorAll(".gamemode")
    const retour = document.querySelector("#retour")

    var jeu = document.querySelector("#jeu")
    var menu = document.querySelector("#menu")
    var footer = document.querySelector("footer")
    var wanted = document.querySelector("#wanted")

    var temps = 120
    var score = 0;
    var bool = false
    var tab_wanted = new Array(1, 2, 3, 4, 5)

    var canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');



    difficulty.forEach(i => {
        i.addEventListener("click", function () {
            menu.style.width = 0 + "%"
            jeu.style.width = 100 + "%"
            bool = true
            setTimeout(function () {
                footer.style.display = "none";
            }, 150)
        })
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


    let image_direction = 5
    base_image = new Image();
    base_image.src = './assets/' + 1 + '.png';



    setInterval(display_time, 1000)

    /* ------------- random positon image ------------------ */
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    // random departure position
    let image_position_x = getRandomArbitrary(1, canvas.width - 1)
    let image_position_y = getRandomArbitrary(1, canvas.height - 1)
    let image_direction_x = getRandomArbitrary(5, 15)
    let image_direction_y = getRandomArbitrary(0, 10)

    // move speed : the more the second number is low the more the images are fast
    //draw_image()
    requestAnimationFrame(animate);




    function display_time() {
        if (bool) {
            var timer = document.querySelector("#timer")
            temps--
            if (temps >= 0) {
                timer.innerHTML = "temps restant : " + temps

            }
            else bool = false;
        }
    }

    function display_score() {
        var scoreBoard = document.querySelector("#score")
        scoreBoard.innerHTML = "score : " + score
    }

    function display_wanted() {
        wanted.src = "./assets/" + tab_wanted[0] + ".png"
    }





    function animate() {

        let pas = 5;
        context.clearRect(0, 0, canvas.width, canvas.height);

        console.log("test")
        if (image_position_x > 0 && image_position_x + pas * 9 < canvas.width) {

            image_position_x += image_direction
        }
        else {
            image_direction *= -1
            image_position_x += image_direction
        }

        for (let i = 1; i < 10; i++) {
            pas += 10
            context.drawImage(base_image, image_position_x + pas, 0, 20, 20);

        }


        requestAnimationFrame(animate);

    }

    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        console.log("x: " + x + " y: " + y)
    }

    canvas.addEventListener('mousedown', function (e) {
        getCursorPosition(canvas, e)
    })

})