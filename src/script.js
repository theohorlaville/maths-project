
window.addEventListener("load", function () {

    const play = document.querySelector(".play")
    const retour = document.querySelector("#retour")

    var jeu = document.querySelector("#jeu")
    var menu = document.querySelector("#menu")
    var footer = document.querySelector("footer")
    var wanted = document.querySelector("#wanted")

    var temps = 120
    var score = 0;
    var bool = false
    var tab_wanted = new Array(1, 2, 3, 4, 5)
    var imageURL = ["./assets/1.png", "./assets/2.png", "./assets/3.png"]

    var canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');




    play.addEventListener("click", function () {
        menu.style.width = 0 + "%"
        jeu.style.width = 100 + "%"
        bool = true
        change_wanted()
        display_score()

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
        display_score()
        setTimeout(function () {
            footer.style.display = "flex";
        }, 150)

    })



    let image_direction = 1
    const images = []; /// array to hold images.
    var imageCount = 0;
    let wantedPosX = 0
    let wantedPosY = 0

    setInterval(display_time, 1000)

    load_images()

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

    function display_wanted(i) {
        wanted.src = "./assets/" + tab_wanted[i] + ".png"
    }

    function add_time() {
        temps += 2;
        display_time()
    }

    function add_score() {
        score++
        display_score()
    }

    function change_wanted() {
        display_wanted(Math.round(getRandomArbitrary(0, 4)))
    }

    function load_images() {
        imageURL.forEach(src => {  // for each image url
            const image = new Image();
            image.src = src;
            image.onload = () => {
                imageCount += 1;
                if (imageCount === imageURL.length) { // have all loaded????
                    requestAnimationFrame(animate);
                }
            }
            images.push(image); // add loading image to images array

        });
    }

    function animation_wanted() {

    }

    function animation_bystander() {
        if (image_position_x > 0 && image_position_x < canvas.width) {

            image_position_x += image_direction
        }
        else {
            image_direction *= -1
            image_position_x += image_direction
        }
    }


    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        let pasX = 5;
        let pasY = 0


        animation_wanted()
        animation_bystander()

        context.drawImage(images[tab_wanted[1]], 0, 0, 30, 30);

        /*
        pasX = 5
        pasY = 0
        
        for (let i = 1; i < 10; i++) {
            pasX += 15
            context.drawImage(images[2], image_position_x + pasX, 10, 30, 30);
        }

        pasX = 10
        pasY = 0
        for (let i = 1; i < 10; i++) {
            pasX += 15
            context.drawImage(images[1], image_position_x + pasX, 20, 30, 30);
        }
        */


        requestAnimationFrame(animate);

    }

    function player_guess(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        if (x >= wantedPosX && x <= wantedPosX + 30) {

            if (y >= wantedPosY && y <= wantedPosY + 30) {
                add_score()
                add_time()
                change_wanted()
            }
        }
    }

    canvas.addEventListener('mousedown', function (e) {
        player_guess(canvas, e)
    })

})