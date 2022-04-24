
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
    var gamemode;

    var canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');



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

      /* ------------- random positon image ------------------ */
      function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
      }
    
    // random departure position
    let image_position_x = getRandomArbitrary(1,canvas.width-1)
    let image_position_y = getRandomArbitrary(1,canvas.height-1)
    let image_direction_x = getRandomArbitrary(5,15)
    let image_direction_y = getRandomArbitrary(0,10)
    setInterval(draw_image, 500) 

    // move speed : the more the second number is low the more the images are fast
    //draw_image()


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

  

    /* ------------- Draw function  ------------------ */


    function draw_image() {
        base_image = new Image();
        base_image.src = './assets/1.png';

        // random number for X direction changing each call
        // bouncing on canvas edges 

        if(image_position_x >= 0  && image_position_x <= canvas.width && image_position_y >= 0 && image_position_y <= canvas.height) {
            
            image_position_x += image_direction_x*Math.random()
            image_position_y += image_direction_y* Math.random()
            console.log(image_position_y)
        }
        else {
            image_direction_x *= -1
            image_direction_y *= -1
            image_position_x += image_direction_x*Math.random()
            image_position_y += image_direction_y*Math.random()
            console.log('cc')
            console.log(image_position_y)

        }

        base_image.onload = function () {
            context.drawImage(base_image, image_position_x, image_position_y, 20, 20);
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
       // requestAnimationFrame(draw_image);

    }
})