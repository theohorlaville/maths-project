
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
    var parametres = document.querySelector("#parametres")
    var displayParametres = document.querySelector("#displayParametres")
    var options = document.querySelectorAll(".options")

    context = canvas.getContext('2d');

    // VARIABLES GLOBALES JEU
    var temps;
    var temps_manche = 0
    var score;
    var animation;
    var k;
    var lambda;
    var esperance1;
    var esperance2;
    var nbBystanders;
    var wanted_plage;
    var bool = false
    var wanted_number;
    var bystander_number = [];
    let moyVitesse= []





    // VARIABLES EN LIEN AVEC LE CHARGEMENT D'IMAGES

    const images = []; /// array to hold images.
    var imageURL = ["./assets/1.png", "./assets/2.png", "./assets/3.png", "./assets/4.png", "./assets/5.png", "./assets/6.png"]
    var imageCount = 0;
    var img_size = 30;
    var imageload = false;

    // VARIABLES POSITION/DIRECTION DES BYSTANDERS ET DU WANTED


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

    displayParametres.addEventListener("click", function () {
        parametres.style.display == "flex" ? parametres.style.display = "none" : parametres.style.display = "flex"
    })

    // CLICK SUR LE BOUTON RETOUR : RENITIALISATION DU JEU ET CHANGEMENT DE FENETRE

    retour.addEventListener("click", function () {

        menu.style.width = 100 + "%"
        jeu.style.width = 0 + "%"
        bool = false
        temps = 0;
        temps_manche = 0;
        gameover.style.display = "none"
        cancelAnimationFrame(animation)
        setTimeout(function () {
            footer.style.display = "flex";
        }, 150)

    })

    return_endgame.addEventListener("click", function () {


        menu.style.width = 100 + "%"
        jeu.style.width = 0 + "%"
        bool = false
        temps = 0;
        temps_manche = 0;
        gameover.style.display = "none"
        cancelAnimationFrame(animation)
        setTimeout(function () {
            footer.style.display = "flex";
        }, 150)

    })

    /******************************************** RANDOM FUNCTIONS  ************************************************************/
    // LOI UNIFORME : RETOURNE UNE VALEUR EQUIPROBABLE ENTRE UN MIN ET MAX

    function uniforme(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    function rademacher() {
        if (Math.random() < 1 / 2) { return -1 }
        else return 1
    }

    function bernoulli(p) {
        if (Math.random() < p) { return 1 }
        else return 0
    }

    function exponentielle() {
        return -Math.log(Math.random()) / lambda
    }

    // LOI NORMALE / GAUSSIENNE : RETOURNE UNE VALEUR EQUIPROBABLE ENTRE UN MIN ET MAX
    function normal(esperance, ecartType) {
        let a = 0
        let b = 0;
        while (a === 0) a = Math.random(); //Converting [0,1) to (0,1)
        while (b === 0) b = Math.random();
        let x = Math.sqrt(-2.0 * Math.log(a)) * Math.cos(2.0 * Math.PI * b);
        
        return esperance + ecartType * x;
    }

    // LOI MARKOV : 

    // Object with the charcters value
    //let bystander_values = ["./assets/1.png", "./assets/2.png", "./assets/3.png", "./assets/4.png", "./assets/5.png", "./assets/6.png"]
    let bystander_values = [1, 2, 3, 4, 5, 6]
    // Array Mario : 
    let mario = [0., 0.2, 0.2, 0.2, 0.2, 0.2]

    // Array Luigi : 
    let luigi = [0.1, 0., 0.2, 0.1, 0.2, 0.4]

    // Array Wario : 
    let wario = [0.2, 0.1, 0., 0.3, 0.3, 0.1]

    // Array Peach : 
    let peach = [0.2, 0.1, 0.3, 0., 0.3, 0.1]

    // Array Bowser : 
    let bowser = [0.2, 0.1, 0.3, 0.3, 0., 0.1]

    // Array Yoshi : 
    let yoshi = [0.1, 0.4, 0.1, 0.1, 0.3, 0.]

    function chaine_markov(bystander_probas, bystander_value) {
        let random = Math.random();
        let i = 0;
        let new_proba = bystander_probas[0];

        while (random > new_proba && i < 5) {
            new_proba += bystander_probas[i + 1];
            i++;
        }
        return bystander_value[i];
    }



    // LANCEMENT DU JEU : AFFICHAGE D'UN NOUVEAU WANTED, DU SCORE, CHARGEMENT DES IMG, INITIALISATION DU WANTED SUR LE CANVAS

    function start() {
        initializing_game_infos()
        initializing_wanted()
        initializing_bystanders()
        display_score()
        if (!imageload) {
            load_images()
        }
        else animation = requestAnimationFrame(animate);
    }

    // FIN DU JEU : BOOL SI TEMPS FINI

    function finish() {
        if (temps <= 0 && bool == true) {
            gameover.style.display = "flex"
            display_info()

            return true;
        }
    }

    function initializing_game_infos() {
        lambda = 1 / options[0].value;
        esperance1 = options[1].value;
        esperance2 = options[2].value;
        wanted_plage = options[3].value;
        temps = 10;
        score = 0;
        change_wanted()
    }

    function display_info(){
        let sum =0
        let moyenne = 0
        let ecart = 0
        let variance = 0
        moyVitesse.forEach(element => sum+=element)
        //console.log(sum)
        console.log("sur un ??chantillon de ", moyVitesse.length, " niveaux :")
        console.log("Vitesse moyenne th??orique de notre personnage est de : ", options[0].value)
        moyenne = sum/moyVitesse.length
        console.log("Vitesse moyenne en pratique de notre personnage : ", moyenne)

        moyVitesse.forEach(element => ecart += (element-moyenne)*(element-moyenne))
       // console.log(ecart)
        variance  = ecart/moyVitesse.length
        console.log("Ecart-type de la vitesse de notre personnage en pratique : ", Math.sqrt(variance))
        moyVitesse.length=0
    }

    // AFFICHAGE DU TEMPS : DEPEND DU BOOLEEN

    function display_time() {
        if (bool) {
            temps--
            temps_manche++
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
        // i++
        wanted.src = "./assets/" + i + ".png"
    }

    // FONCTION RAJOUTE DU TEMPS ET ACTUALISE LE TIMER
    //  utilise une gaussienne pour le temps

    function add_time() {
        temps += Math.round(normal(parseInt(esperance2), parseInt(esperance2) * 0.25))
    }

    // FONCTION RAJOUTE DU SCORE ET ACTUALISE LE SCOREBOARD

    function add_score() {
        if (temps_manche >= 0 && temps_manche < 3) {
            if (bernoulli(0.6)) { score += 10 }
            else { score += 8 }
        }
        if (temps_manche >= 3 && temps_manche < 10) {
            if (bernoulli(0.3)) { score += 4 }
            else { score += 5 }
        }
        if (temps_manche >= 10) {
            if (bernoulli(0.9)) { score += 2 }
            else { score += 3 }
        }
        display_score()
    }

    // CHANGE LE WANTED SUR LE CANVAS ET SUR L'AFFICHE (RANDOM ENTRE LES DIFFERENTES IMG EQUIPROBABLE)

    function change_wanted() {
        wanted_number = Math.round(uniforme(1, wanted_plage))
        display_wanted(wanted_number)
    }

    // CHARGEMENT DES IMAG EN ASYNCHRONE (onload), QUAND CHARG??ES LANCEMENT DU JEU

    function load_images() {
        imageURL.forEach(src => {  // for each image url
            const image = new Image();
            image.src = src;
            image.onload = () => {
                imageCount += 1;
                if (imageCount === imageURL.length) { // have all loaded????
                    imageload = true
                    animation = requestAnimationFrame(animate);
                }
            }
            images.push(image); // add loading image to images array

        });
    }

    // INITIALISATION DU WANTED : POSITION RANDOM, VITESSE RANDOM, DIRECTION RANDOM
    function random_position_x() {
        let random_position_x = uniforme(1, canvas.width - 30); 
        return random_position_x;
    }

    function random_position_y() {
        let random_position_y = uniforme(1, canvas.height - 30);
        return random_position_y;
    }

    function initializing_wanted() {
        let directionX = -1;
        let directionY = -1;

        wanted_position_x = random_position_x();
        wanted_position_y = random_position_y();

        k = rademacher()

        if (Math.round(Math.random()) == 1) { directionX = 1; }
        else directionX = -1;

        let expo1 = exponentielle()
        wanted_direction_x = directionX * Math.cos(Math.PI / 180 * 50) * expo1;

        if (Math.round(Math.random()) == 1) { directionY = 1; }
        else directionY = -1;

        wanted_direction_y = directionY * Math.sin(Math.PI / 180 * 50) * expo1;
        moyVitesse.push(Math.abs(expo1))
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

        nbBystanders = Math.round(normal(parseInt(esperance1), parseInt(esperance1) * 0.1))


        for (let i = 0; i < nbBystanders; i++) {
            image_positionX = random_position_x();
            image_positionY = random_position_y();

            if (Math.round(Math.random()) == 1) { directionX = 1; }
            else directionX = -1;

            let image_directionX = directionX * Math.cos(Math.PI / 180 * 50) * exponentielle();

            if (Math.round(Math.random()) == 1) { directionY = 1; }
            else directionY = -1;

            let image_directionY = directionY * Math.sin(Math.PI / 180 * 50) * exponentielle(); 
            //avec u une uniforme de 0 ?? 1


            // Create each time a new image data object with new positions
            const image_data = {
                position_x: image_positionX,
                position_y: image_positionY,
                direction_x: image_directionX,
                direction_y: image_directionY
            }

            // We put each Image data object in the image information array at the index i 
            image_informations[i] = image_data
            switch (wanted_number) {
                case 1:
                    bystander_number[i]= chaine_markov(mario, bystander_values)
                  break;
                  
                case 2:
                  bystander_number[i] = chaine_markov(luigi, bystander_values)
                  break;

                case 3:
                    bystander_number[i] = chaine_markov(wario, bystander_values)
                break;

                case 4:
                    bystander_number[i] = chaine_markov(peach, bystander_values)
                break;
                
                case 5:
                    bystander_number[i] = chaine_markov(bowser, bystander_values)
                break;
    
                case 6:
                    bystander_number[i] = chaine_markov(yoshi, bystander_values)
                break;
              }
              

            // tombe sur 1 = premiere image on donne num et on check si c le mm num donn??
            /*  bystander_number[i] = Math.round(uniforme(0, 4)) // we would like to have different probability regarding the wanted element e.g if wanted == yoshi proba bowser sup ?? mario
              while (bystander_number[i] == wanted_number) { bystander_number[i] = Math.round(uniforme(0, 4)) } // MARKOV*/


        }
    }
    // loi gaussienne centr??e sur 10 ac esperance =  10 + variance = a quel point on est ress??r?? sur le 10 
    // quand on se trompe on diminue du temps 

    function animation_bystander() {

        for (let i = 0; i < nbBystanders; i++) {

            if (image_informations[i].position_x > canvas.width - 30 || image_informations[i].position_x < 0) image_informations[i].direction_x = -image_informations[i].direction_x;
            if (image_informations[i].position_y > canvas.height - 30 || image_informations[i].position_y < 0) image_informations[i].direction_y = -image_informations[i].direction_y;

            image_informations[i].position_x += image_informations[i].direction_x;
            image_informations[i].position_y += image_informations[i].direction_y;

        }

    }




    // FONCTION D'AFFICHAGE

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (k == -1) {

            animation_bystander()
            for (let i = 0; i < nbBystanders; i++) {

                context.drawImage(images[bystander_number[i] - 1], image_informations[i].position_x, image_informations[i].position_y, img_size, img_size);
            }

            animation_wanted()
            context.drawImage(images[wanted_number - 1], wanted_position_x, wanted_position_y, img_size, img_size);
        }
        else {
            animation_wanted()
            context.drawImage(images[wanted_number - 1], wanted_position_x, wanted_position_y, img_size, img_size);
            animation_bystander()
            for (let i = 0; i < nbBystanders; i++) {

                context.drawImage(images[bystander_number[i] - 1], image_informations[i].position_x, image_informations[i].position_y, img_size, img_size);
            }

        }



        if (!finish()) {
            animation = requestAnimationFrame(animate);
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
                temps_manche = 0;
                esperance1++
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