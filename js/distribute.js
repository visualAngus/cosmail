
let id_partie = localStorage.getItem('id_partie');

function distributeCards() {
    return fetch('../php/distribute_cards.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ id:id_partie })
    })
        .then(response => response.json())
        .then(data => {
            let list_joueurs = [];
            let nb_cards = data[0].nb_cards;
            let etat = data[0].etat;
            console.log("etat",etat);
            if (etat == 1) {
                return;
            }
            data.forEach(joueurs =>{
                list_joueurs.push(joueurs.id_joueur);
            });
            let liste_emplacement = [];
            fetch('../php/get_all_emplacement.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams()
            })
                .then(response => response.json())
                .then(data => {
                    data.forEach(emplacement => {
                        let nb_ville = emplacement.nombre;
                        let id_emplacement = emplacement.id_emplacement;

                        for (let i = 0; i < nb_ville; i++) {
                            liste_emplacement.push(id_emplacement);
                        }
                    });

                    list_joueurs.forEach(joueur => {
                        let liste_emplacement_selected = [];
                        for (let i = 0; i < nb_cards; i++) {
                            let random = Math.floor(Math.random() * liste_emplacement.length);
                            let id_emplacement = liste_emplacement[random];
                            liste_emplacement.splice(random, 1);
                            liste_emplacement_selected.push(id_emplacement);
                        }
                        console.log(liste_emplacement_selected,joueur);
                        liste_emplacement_selected = JSON.stringify(liste_emplacement_selected);
                        fetch('../php/distribute_cards_to_player.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: new URLSearchParams({ id_joueur: joueur, liste_emplacement: liste_emplacement_selected })
                        })
                            .then(response => response.text())
                            .then(data => {
                            })
                            .catch(error => console.error(error));
                    });
                    liste_emplacement = JSON.stringify(liste_emplacement);
                    fetch('../php/set_partie_not_distri_cards.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: new URLSearchParams({ id_partie: id_partie, liste_emplacement: liste_emplacement })
                        })
                            .then(response => response.text())
                            .then(data => {
                            })
                            .catch(error => console.error(error));

                })
                .catch(error => console.error(error));
                })
        .catch(error => console.error(error));
}

