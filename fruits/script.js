var playing = false;
var score;
var trialsleft;
var step;
var action;
var fruits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]; // 10 est la bombe

$(function () {
    $("#front").show();

    $("#startReset").click(function () {
        if (playing == true) {
            location.reload();
        } else {
            playing = true;
            score = 0;
            $("#scoreValue").html(score);
            $("#front").hide();
            $("#trialsleft").show();
            $("#score").show();
            trialsleft = 3;
            addhearts();
            $("#gameOver").hide();
            $("#startReset").html("Réinitialiser");
            startAction();
        }
    });

    $("#fruit1").mouseover(function () {
        // Vérifier si c'est une bombe (image 10)
        if ($("#fruit1").attr("src").includes("10.png")) {
            // C'est une bombe !
            score = Math.max(0, score - 5); // Pénalité de points
            trialsleft--; // Perte d'une vie
            addhearts();
            $("#slicesound")[0].play(); // Son d'explosion ou slice

            if (trialsleft < 1) {
                gameOver();
            } else {
                $("#scoreValue").html(score);
                stopAction();
                setTimeout(startAction, 500);
            }
        } else {
            // C'est un fruit normal
            score++;
            $("#scoreValue").html(score);
            $("#slicesound")[0].play();

            clearInterval(action);
            $("#fruit1").hide("explode", 400);
            setTimeout(startAction, 500);
        }
    });

    function addhearts() {
        $("#trialsleft").empty();
        for (i = 0; i < trialsleft; i++) {
            $("#trialsleft").append('<img src="https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/wrong.png" class="life">');
        }
    }

    function startAction() {
        $("#fruit1").show();
        chooseRandom();

        // Position aléatoire horizontale
        $("#fruit1").css({
            left: Math.round(550 * Math.random()),
            top: -50
        });

        // COMPLEXITÉ : La vitesse de base augmente avec le score
        // On augmente le step minimum tous les 5 points
        var difficultyBonus = Math.floor(score / 5);
        step = 2 + difficultyBonus + Math.round(4 * Math.random());

        action = setInterval(function () {
            // Déplacement vertical
            var currentTop = $("#fruit1").position().top + step;

            // COMPLEXITÉ : Mouvement sinusoïdal (oscillation gauche/droite)
            var currentLeft = $("#fruit1").position().left + Math.sin(currentTop / 20) * 2;

            $("#fruit1").css({
                "top": currentTop,
                "left": currentLeft
            });

            // Vérifier si le fruit est sorti de l'écran (raté)
            if ($("#fruit1").position().top > $("#fruitcontainer").height()) {
                if (trialsleft > 1) {
                    trialsleft--;
                    addhearts();
                    // On ne perd pas de vie si c'était une bombe qu'on a laissé passer
                    if ($("#fruit1").attr("src").includes("10.png")) {
                        trialsleft++; // On rend la vie car c'est bien d'éviter une bombe
                        addhearts();
                    }

                    chooseRandom();
                    $("#fruit1").css({
                        left: Math.round(550 * Math.random()),
                        top: -50
                    });
                    step = 2 + Math.floor(score / 5) + Math.round(4 * Math.random());
                } else {
                    gameOver();
                }
            }
        }, 15);
    }

    function chooseRandom() {
        var randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
        $("#fruit1").attr("src", "https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/" + randomFruit + ".png");

        // Effet visuel : si c'est la bombe (10), on peut ajouter un filtre CSS
        if(randomFruit === "10") {
            $("#fruit1").css("filter", "drop-shadow(0px 0px 10px red)");
        } else {
            $("#fruit1").css("filter", "none");
        }
    }

    function stopAction() {
        clearInterval(action);
        $("#fruit1").hide();
    }

    function gameOver() {
        playing = false;
        $("#startReset").html("Rejouer");
        $("#gameOver").show().html("<p>Game Over!</p><p>Score final : " + score + "</p>");
        $("#score, #trialsleft").hide();
        stopAction();
    }
});