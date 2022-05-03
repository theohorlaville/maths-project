
window.addEventListener("load", function () {

    // VARIABLES DU DOM
    const play = document.querySelectorAll(".play")
    const retour = document.querySelector("#retour")
    const return_endgame = document.querySelector(".return")
    var timer = document.querySelector("#timer")
    var jeu = document.querySelector("#jeu")
    var menu = document.querySelector("#menu")
    var gameover = this.document.querySelector("#gameover")
    var scoreBoard = document.querySelectorAll(".score")
    var footer = document.querySelector("footer")
    var wanted = document.querySelector("#wanted")
    var canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');

    // VARIABLES GLOBALES JEU
    var temps;
    var score;
    var bool = false
    var wanted_number;


    // VARIABLES EN LIEN AVEC LE CHARGEMENT D'IMAGES

    const images = []; /// array to hold images.
    var imageURL = ["./assets/1.png", "./assets/2.png", "./assets/3.png", "./assets/4.png", "./assets/5.png", "./assets/6.png"]
    var imageCount = 0;
    var img_size = 30;
    var imageload = false;

    // VARIABLES POSITION/DIRECTION DES BYSTANDERS ET DU WANTED


    let image_direction_x = 0;
    let image_direction_y = 0;
    let image_position_x = 0;
    let image_position_y = 0;


    let wanted_direction_x = 0;
    let wanted_direction_y = 0;
    let wanted_position_x = 0;
    let wanted_position_y = 0;

    let image_informations = []



    // CLICK SUR LE BOUTON PLAY DU MENU : LANCEMENT DU JEU ET CHANGEMENT DE FENETRE

    play[0].addEventListener("click", function () {
        menu.style.width = 0 + "%"
        jeu.style.width = 100 + "%"
        bool = true
        start()
        setTimeout(function () {
            footer.style.display = "none";
        }, 150)
    })

    play[1].addEventListener("click", function () {
        bool = true
        gameover.style.display = "none"
        start()
    })

    // CLICK SUR LE BOUTON RETOUR : RENITIALISATION DU JEU ET CHANGEMENT DE FENETRE

    retour.addEventListener("click", function () {

        menu.style.width = 100 + "%"
        jeu.style.width = 0 + "%"
        bool = false
        gameover.style.display = "none"

        setTimeout(function () {
            footer.style.display = "flex";
        }, 150)

    })

    return_endgame.addEventListener("click", function () {

        menu.style.width = 100 + "%"
        jeu.style.width = 0 + "%"
        bool = false
        gameover.style.display = "none"

        setTimeout(function () {
            footer.style.display = "flex";
        }, 150)

    })


    // FONCTION RANDOM : RETOURNE UNE VALEUR EQUIPROBABLE ENTRE UN MIN ET MAX

    function getRandomArbitrary(min, max) {
        return Number(Math.random() * (max - min) + min);
    }

    // LANCEMENT DU JEU : AFFICHAGE D'UN NOUVEAU WANTED, DU SCORE, CHARGEMENT DES IMG, INITIALISATION DU WANTED SUR LE CANVAS

    function start() {
        initializing_game_infos()
        initializing_wanted()
        initializing_bystanders()
        change_wanted()
        display_score()
        if (!imageload) {
            load_images()
        }
        else requestAnimationFrame(animate);
    }

    // FIN DU JEU : BOOL SI TEMPS FINI

    function finish() {
        if (temps == 0) {
            gameover.style.display = "flex"
            return true;
        }
    }

    function initializing_game_infos() {
        temps = 200;
        score = 0;
    }


    // AFFICHAGE DU TEMPS : DEPEND DU BOOLEEN

    function display_time() {
        if (bool) {
            temps--
            if (temps >= 0) {
                timer.innerHTML = "temps restant : " + temps

            }
            else bool = false;
        }
    }
    setInterval(display_time, 1000)

    // AFFICHAGE DU SCORE

    function display_score() {
        scoreBoard[0].innerHTML = "score : " + score
        scoreBoard[1].innerHTML = "score : " + score

    }

    // AFFICHAGE DU WANTED (pas sur le canvas mais en haut)

    function display_wanted(i) {
        i++
        wanted.src = "./assets/" + i + ".png"
    }

    // FONCTION RAJOUTE DU TEMPS ET ACTUALISE LE TIMER

    function add_time() {
        temps += 2;
    }

    // FONCTION RAJOUTE DU SCORE ET ACTUALISE LE SCOREBOARD

    function add_score() {
        score++
        display_score()
    }

    // CHANGE LE WANTED SUR LE CANVAS ET SUR L'AFFICHE (RANDOM ENTRE LES DIFFERENTES IMG EQUIPROBABLE)

    function change_wanted() {
        wanted_number = Math.round(getRandomArbitrary(0, 4))
        display_wanted(wanted_number)
    }

    // CHARGEMENT DES IMAG EN ASYNCHRONE (onload), QUAND CHARGÉES LANCEMENT DU JEU

    function load_images() {
        imageURL.forEach(src => {  // for each image url
            const image = new Image();
            image.src = src;
            image.onload = () => {
                imageCount += 1;
                if (imageCount === imageURL.length) { // have all loaded????
                    imageload = true
                    requestAnimationFrame(animate);
                }
            }
            images.push(image); // add loading image to images array

        });
    }

    // INITIALISATION DU WANTED : POSITION RANDOM, VITESSE RANDOM, DIRECTION RANDOM
    function random_position_x(){
        let random_position_x = getRandomArbitrary(1, canvas.width - 30);
        return random_position_x;
    }

    function random_position_y(){
        let random_position_y = getRandomArbitrary(1, canvas.height - 30);
        return random_position_y;
    }

    function initializing_wanted() {
        let directionX = -1;
        let directionY = -1;

        /*wanted_position_x = getRandomArbitrary(1, canvas.width - 15)
        wanted_position_y = getRandomArbitrary(1, canvas.height - 15)*/
        wanted_position_x = random_position_x();
        wanted_position_y = random_position_y();

        if (Math.round(Math.random()) == 1) { directionX = 1; }
        else directionX = -1;

        wanted_direction_x = directionX * Math.cos(Math.PI / 180 * 50) * (getRandomArbitrary(1, 100) / 100);

        if (Math.round(Math.random()) == 1) { directionY = 1; }
        else directionY = -1;

        wanted_direction_y = directionY * Math.sin(Math.PI / 180 * 50) * (getRandomArbitrary(1, 100) / 100);
    }

    // ANIMATION DU WANTED : AVANCE ET REBONDI SUR LES MURS

    function animation_wanted() {

        if (wanted_position_x > canvas.width - 20 || wanted_position_x < 0) wanted_direction_x = -wanted_direction_x;
        if (wanted_position_y > canvas.height - 20 || wanted_position_y < 0) wanted_direction_y = -wanted_direction_y;

        wanted_position_x += wanted_direction_x;
        wanted_position_y += wanted_direction_y;

    }

    //Fonction qui sert de struct pour les donnee d'une image    

   

    // ANIMATION DES BYSTANDERS : A FAIRE

    
    function initializing_bystanders() {
        let directionX = -1;
        let directionY = -1;
        let image_positionX = 0;
        let image_positionY = 0;

        for (let i=0; i<20; i++){
            image_positionX = random_position_x();
            image_positionY = random_position_y();

            if (Math.round(Math.random()) == 1) { directionX = 1; }
            else directionX = -1;

            let image_directionX = directionX * Math.cos(Math.PI / 180 * 50) * (getRandomArbitrary(1, 100) / 100);

            if (Math.round(Math.random()) == 1) { directionY = 1; }
            else directionY = -1;

            let image_directionY = directionY * Math.sin(Math.PI / 180 * 50) * (getRandomArbitrary(1, 100) / 100);

            // Create each time a new image data object with new positions
            const image_data = {
                position_x : image_positionX,
                position_y : image_positionY,
                direction_x : image_directionX,
                direction_y : image_directionY
            }

            // We put each Image data object in the image information array at the index i 
            image_informations[i]= image_data

        }
    }

    function animation_bystander() {
  
        for(let i = 0; i<20; i++ ){

            if (image_informations[i].position_x > canvas.width -30|| image_informations[i].position_x < 0) image_informations[i].direction_x = -image_informations[i].direction_x;
            if (image_informations[i].position_y > canvas.height-30 || image_informations[i].position_y < 0) image_informations[i].direction_y = -image_informations[i].direction_y;

            image_informations[i].position_x += image_informations[i].direction_x;
            image_informations[i].position_y += image_informations[i].direction_y;
           
        }
        
    }

    


    // FONCTION D'AFFICHAGE

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        animation_wanted()

        context.drawImage(images[wanted_number], wanted_position_x, wanted_position_y, img_size, img_size);

        animation_bystander()   

        // draw 20 by standers with different positons
        for(let i=0; i<20; i++){
            
            context.drawImage(images[1], image_informations[i].position_x ,  image_informations[i].position_y, img_size, img_size);
        }



        if (!finish()) {
            requestAnimationFrame(animate);
        }

    }

    // FONCTION DETECTION DU CLICK JOUEUR

    function player_guess(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top


        if (x >= wanted_position_x && x <= wanted_position_x + 30) {
            if (y >= wanted_position_y && y <= wanted_position_y + 30) {

                add_score()
                add_time()
                change_wanted()
                initializing_wanted()
                initializing_bystanders()
            }
        }
    }

    canvas.addEventListener('mousedown', function (e) {
        player_guess(canvas, e)
    })

})