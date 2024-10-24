
let code_input = document.getElementById("code");
let btn = document.getElementById("connexion");
let chargement_div = document.querySelector(".chargement_div");

code_input.addEventListener("input", function (event) {
    // if more than 5 characters, stop typing
    if (code_input.value.length > 5) {
        // rendre impossible de taper plus de 5 caractères
        code_input.value = code_input.value.slice(0, 5);
    }

});

code_input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("connexion").click();
    }
});

function create_partie() {
    let nom = document.getElementById("nom_create").value;
    let error_txt = document.getElementById("error_txt_2");
    nom = nom.trim();
    let nb_joueurs = document.getElementById("nb_joueurs").value;

    if (nb_joueurs < 2 || nb_joueurs > 6) {
        error_txt.textContent = "Veuillez entrer un nombre entre 2 et 6";
        error_txt.style.color = "red";

        setTimeout(function () {
            error_txt.textContent = "";
        }, 2000);

        return;
    }
    else if (nom.length < 2) {
        error_txt.textContent = "Veuillez entrer un pseudo de plus 2 caractères";
        error_txt.style.color = "red";

        setTimeout(function () {
            error_txt.textContent = "";
        }, 2000);

        return;
    }

    // générer un code aléatoire 2 lettres et 2 chiffres et 1 lettre
    let code = "";

    for (let i = 0; i < 2; i++) {
        code += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    for (let i = 0; i < 2; i++) {
        code += Math.floor(Math.random() * 10);
    }
    code += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    code = code.trim();


    fetch('../php/create_partie.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ code: code, nb_joueurs: nb_joueurs })
    })
        .then(response => response.json())
        .then(data => {
            let id = data["id_partie"];

            fetch('../php/add_player.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ id_partie: id, nom: nom })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data["error"]) {
                        error_txt.textContent = "Partie complète";
                        error_txt.style.color = "red";
                        return;
                    }
                    let nb_joueurs = data["nb_joueur"];
                    let nb_joueur_conn = data["nb_joueur_conn"];
                    let id_player = data["id_joueur"];
                    console.log(id_player);

                    localStorage.setItem('id_partie', id);
                    localStorage.setItem('id_player', id_player);

                    document.querySelector(".div_code").innerHTML = "<h3>Code de la partie : " + code + "</h3>";


                    let txt = "En attente des autres joueurs " + nb_joueur_conn + "/" + nb_joueurs;
                    document.querySelector(".div_txt").innerHTML = "<h3>" + txt + "</h3>";

                    chargement_div.style.display = "flex";

                    setInterval(function () {
                        fetch('../php/get_player_status.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: new URLSearchParams({ id_partie: id })
                        })
                            .then(response => response.json())
                            .then(data => {
                                // console.log(data);
                                let nb_joueur_conn = data["nb_joueur_conn"];
                                let etat = data["etat"];
                                let txt = "En attente des autres joueurs " + nb_joueur_conn + "/" + nb_joueurs;
                                document.querySelector(".div_txt").innerHTML = "<h3>" + txt + "</h3>";

                                let nom = data["noms"];
                                let div_noms = document.querySelector(".div_noms");

                                div_noms.innerHTML = "<h3>Noms des joueurs :</h3>";

                                nom.forEach(nom => {
                                    let p = document.createElement("p");
                                    p.textContent = nom;
                                    div_noms.appendChild(p);
                                });

                                if (nb_joueur_conn == nb_joueurs) {
                                    distributeCards()
                                    if (etat == 1) {
                                        chargement_div.style.display = "none";
                                        nb_joueurs++;
                                        window.location.href = "../map.html";
                                        return
                                    }
                                }
                            })
                            .catch(error => console.error(error));
                    }, 1000);
                })
                .catch(error => console.error(error));


        })
        .catch(error => console.error(error));

}

function get_info_partie() {
    let error_txt = document.getElementById("error_txt");


    let code = document.getElementById("code").value;
    code = code.toUpperCase();
    code = code.trim();

    let nom = document.getElementById("nom").value;
    nom = nom.trim();


    if (code.length != 5) {
        error_txt.textContent = "Le code doit contenir 5 caractères";
        error_txt.style.color = "red";

        setTimeout(function () {
            error_txt.textContent = "";
        }, 2000);

        return;
    } else if (nom.length < 2) {
        error_txt.textContent = "Veuillez entrer un pseudo de plus 2 caractères";
        error_txt.style.color = "red";

        setTimeout(function () {
            error_txt.textContent = "";
        }, 2000);

        return;
    }


    return fetch('../php/get_partie_with_code.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ code: code })
    })
        .then(response => response.json())
        .then(data => {
            if (data["error"]) {
                error_txt.textContent = "Code invalide";
                error_txt.style.color = "red";
            }
            else {
                let id = data[0]["id_partie"];
                error_txt.textContent = "Code valide";
                error_txt.style.color = "green";
                code_input.disabled = true;
                btn.disabled = true;


                fetch('../php/add_player.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({ id_partie: id, nom: nom })
                })
                    .then(response => response.json())
                    .then(data => {
                        // console.log(data);

                        if (data["error"]) {
                            error_txt.textContent = "Partie complète";
                            error_txt.style.color = "red";
                            return;
                        }
                        let nb_joueurs = data["nb_joueur"];
                        let nb_joueur_conn = data["nb_joueur_conn"];
                        let id_player = data["id_joueur"];
                        let numero_joueur = data["numero_joueur"];
                        // console.log(id_player);

                        localStorage.setItem('id_partie', id);
                        localStorage.setItem('id_player', id_player);
                        localStorage.setItem('id_start', nb_joueur_conn + 76);
                        localStorage.setItem('numero_joueur', numero_joueur);

                        document.querySelector(".div_code").innerHTML = "<h3>Code de la partie : " + code + "</h3>";
                        let txt = "En attente des autres joueurs " + nb_joueur_conn + "/" + nb_joueurs;
                        document.querySelector(".div_txt").innerHTML = "<h3>" + txt + "</h3>";

                        chargement_div.style.display = "flex";

                        setInterval(function () {
                            fetch('../php/get_player_status.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                body: new URLSearchParams({ id_partie: id })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    let nb_joueurs = data["nb_joueur"];
                                    let nb_joueur_conn = data["nb_joueur_conn"];
                                    let etat = data["etat"];
                                    let nom = data["noms"];
                                    let txt = "En attente des autres joueurs " + nb_joueur_conn + "/" + nb_joueurs;
                                    document.querySelector(".div_txt").innerHTML = "<h3>" + txt + "</h3>";


                                    let div_noms = document.querySelector(".div_noms");

                                    div_noms.innerHTML = "<h3>Noms des joueurs :</h3>";

                                    nom.forEach(nom => {
                                        let p = document.createElement("p");
                                        p.textContent = nom;
                                        div_noms.appendChild(p);
                                    });

                                    if (nb_joueur_conn == nb_joueurs) {

                                        if (etat == 1) {
                                            chargement_div.style.display = "none";
                                            window.location.href = "../map.html";
                                            return
                                        }
                                    }
                                })
                                .catch(error => console.error(error));
                        }, 1000);
                    })
                    .catch(error => console.error(error));

            }

        })
        .catch(error => console.error(error));
}