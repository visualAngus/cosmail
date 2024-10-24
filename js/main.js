    // ouverture de la carte en svg
    fetch('./img/V1.svg')
        .then(response => response.text()) // Récupère le contenu du fichier SVG sous forme de texte
        .then(data => {
            document.getElementById('svg-container').innerHTML += data; // Injecte le SVG dans le DOM
            let layer8 = document.getElementById('Layer_8');
            // mise en place des evenements sur les villes
            for (let i = 0; i < layer8.children.length; i++) {
                let ville = layer8.children[i];
                ville.addEventListener('mouseover', function () {
                    city_hover(ville, 1);
                });
                ville.addEventListener('mouseout', function () {
                    city_hover(ville, 0);
                });
                ville.addEventListener('click', function () {
                    deplace_plane(ville);
                });
            }

            let layer7 = document.getElementById('Layer_7');
            for (let i = 0; i < layer7.children.length; i++) {
                let ville = layer7.children[i];
                ville.addEventListener('click', function () {
                    deplace_plane(ville);
                });
            }


            for (let i = 0; i < layer7.children.length; i++) {
                let ville = layer7.children[i];
                let position_tmp = ville.querySelector('rect');
                if (position_tmp) {
                    let x = position_tmp.getAttribute('cx');
                    let y = position_tmp.getAttribute('cy');

                    ville.style.transformOrigin = `${x}px ${y}px`;
                    ville.style.transform = `rotate(${-angle}deg)`;
                    ville.style.transition = 'all 0.2s ease';
                }
            }


            let villes_layer = document.getElementById('Layer_8');

            // rotation des villes en fonction de la carte
            for (let i = 0; i < villes_layer.children.length; i++) {
                let ville = villes_layer.children[i];
                let position_tmp = ville.querySelector('circle');
                if (position_tmp) {
                    let x = position_tmp.getAttribute('cx');
                    let y = position_tmp.getAttribute('cy');

                    ville.style.transformOrigin = `${x}px ${y}px`;
                    ville.style.transform = `rotate(${-angle}deg)`;
                    ville.style.transition = 'all 0.2s ease';
                }
            }

            let layer12 = document.getElementById('Layer_12');
            for (let i = 0; i < layer12.children.length; i++) {
                let ville = layer12.children[i];
                let position_tmp = ville.querySelector('circle');
                if (position_tmp) {
                    let x = position_tmp.getAttribute('cx');
                    let y = position_tmp.getAttribute('cy');

                    ville.style.transformOrigin = `${x}px ${y}px`;
                    ville.style.transform = `rotate(${-angle}deg)`;
                    ville.style.transition = 'all 0.2s ease';
                }
            }
            for (let i = 0; i < layer12.children.length; i++) {
                let ville = layer12.children[i];
                ville.addEventListener('mouseover', function () {
                    city_hover(ville, 1);
                });
                ville.addEventListener('mouseout', function () {
                    city_hover(ville, 0);
                });
                ville.addEventListener('click', function () {
                    deplace_plane(ville);
                });
            }
            // chargement de l'avion
            function add_plane(id, id_pawn, etat, type_pawn_name, id_emplacement_link, opponent, color) {
                color = color;
                fetch('./img/plane.svg')
                    .then(response => response.text()) // Récupère le contenu du fichier SVG sous forme de texte
                    .then(data => {
                        let div_plane = document.createElement('div');
                        div_plane.classList.add('div_plane');
                        div_plane.id = "plane-" + id;
                        div_plane.setAttribute('id_pawn', id_pawn);
                        div_plane.setAttribute('etat', etat);
                        div_plane.setAttribute('type_pawn_name', type_pawn_name);

                        let svg_plane = document.createElement('div');
                        svg_plane.classList.add('svg-plane');
                        svg_plane.innerHTML = data;
                        div_plane.appendChild(svg_plane);
                        document.getElementsByClassName('div_piont')[0].appendChild(div_plane);

                        change_pawn_color(div_plane, color);

                        if (opponent == 1) {
                            div_plane.classList.add('opponent');
                        } else {
                            div_plane.classList.add('player_pawn')
                            div_plane.addEventListener('mousedown', function () {
                                id_pawn_selected = id;
                                plane_dragging = true;
                                click_down_plane = [event.clientX, event.clientY];
                            });

                            div_plane.addEventListener('click', function (event) {
                                id_pawn_selected = id;

                                // tout les autres avions sont enlevés de la classe selected
                                let planes = document.getElementsByClassName('div_plane');
                                for (let i = 0; i < planes.length; i++) {
                                    planes[i].classList.remove('selected');
                                }
                                div_plane.classList.add('selected');

                            });

                            document.addEventListener('mousemove', function (event) {
                                if (plane_dragging && dragging == false) {
                                    move_plane(event);
                                }
                            });
                        }
                        set_starting_position(id_emplacement_link, id);
                    })
                    .catch(error => console.log(error));
            }


            fetch('./php/get_player_info.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ id_player: id_player, id_partie: id_partie })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    let player_data = data.player;
                    for (let i = 0; i < player_data.length; i++) {
                        let player = player_data[i];

                        nom = player['nom'];
                        document.getElementById('nom_joueur').innerText = nom;
                        document.getElementsByClassName('div_point')[0].children[0].innerText = player['score'];
                        document.getElementsByClassName('div_nb_steep')[0].children[1].innerText = player['steep'];
                        localStorage.setItem('nb_steep', player['steep']);
                        localStorage.setItem('numero_joueur', player['numero_joueur']);
                        color = player["color"];
                        add_plane(i, player['id_pawn'], player['etat'], player['type_pawn_name'], player['id_emplacement_link'], 0, player["color"]);
                    }

                    let opponent_data = data.opponent;
                    for (let j = 0; j < opponent_data.length; j++) {
                        let opponent = opponent_data[j];
                        add_plane(j + player_data.length, opponent['id_pawn'], opponent['etat'], opponent['type_pawn_name'], opponent['id_emplacement_link'], 1, opponent["color"]);
                    }
                    let messages = data.messages;
                    for (let i = 0; i < messages.length; i++) {
                        let ext = 'ext';

                        if (messages[i]['id_player_link'] == id_player) {
                            ext = 'int';
                        }
                        add_message(messages[i]['chat'], messages[i]['nom'], ext, messages[i]['color']);
                        id_last_message = messages[i]['id_chat'];
                    }
                    let game = data.game[0];
                    console.log(game);
                    if (game['id_joueur'] == id_player) {
                        which_player_is_playing = game['id_joueur'];
                        add_log_to_base(`C'est à <a>${nom}<a> de jouer`);
                        show_erreur("C'est à toi de jouer", 'Message');
                        document.querySelector('.dice-container').classList.add('active');
                        document.querySelector('.btn_tour').classList.add('active');
                        niveau_message = 1;
                    } else {
                        which_player_is_playing = game['id_joueur'];
                        let nom = game['nom'];
                        show_erreur(`C'est à ${nom} de jouer`, 'Message');
                    }
                    let log = data['log'];
                    for (let i = 0; i < log.length; i++) {
                        add_log(log[i]['txt'], log[i]['color']);
                        id_last_log = log[i]['id_log_message'];
                    }


                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });



            function add_steep_to_wire() {


                let wires = Array.from(document.querySelectorAll('.cls-6, .cls-13'));
                let ids = [];

                for (let i = 0; i < wires.length; i++) {
                    let wire = wires[i];
                    let id = wire.getAttribute('id');
                    if (id == null) continue;

                    // Nettoyage de l'ID
                    id = id.replace(/_x3|_/g, '');
                    ids.push(id);
                    wires[i].setAttribute('id_base', id);

                    if (wires[i].classList.contains('cls-6')) {
                        wires[i].classList.add('plane');
                    } else {
                        wires[i].classList.add('boat');
                    }
                }

                let steeps = [];

                fetch('./php/get_steep_by_id.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({ ids: JSON.stringify(ids) })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        steeps = data; // Récupération des steep
                        for (let i = 0; i < steeps.length; i++) {
                            let wire = document.querySelector('[id_base="' + steeps[i].id_liaison + '"]');
                            let position = wire.getBoundingClientRect();

                            let x = (position.left + position.right) / 2;
                            let y = (position.top + position.bottom) / 2;

                            let div_steep = document.createElement('div');
                            div_steep.classList.add('steep');
                            if (steeps[i].type == 'avion') {
                                div_steep.classList.add('boat');
                            } else {
                                div_steep.classList.add('plane');
                            }
                            div_steep.innerHTML = '<h4>' + steeps[i].length + '</h4>';
                            div_steep.style.left = x + 'px';
                            div_steep.style.top = y + 'px';
                            document.querySelector('.div_carte').appendChild(div_steep);

                            div_steep.addEventListener('mouseover', function () {
                                div_steep.classList.add('visible');
                            });
                            div_steep.addEventListener('mouseout', function () {
                                div_steep.classList.remove('visible');
                            });

                            wire.addEventListener('mouseover', function () {
                                div_steep.classList.add('visible');
                            });
                            wire.addEventListener('mouseout', function () {
                                div_steep.classList.remove('visible');
                            });
                        }
                    })
                    .catch(error => console.log(error));
            }

            add_steep_to_wire();
            chargement = true;

        })
        .catch(error => console.log(error));

    // set des variables
    let click_down = [0, 0]; // Position de la souris lors du clic
    let translates = [0, 0]; // Translation de la carte
    let dragging = false; // Indique si l'utilisateur est en train de faire glisser la carte
    let scale = 1; // Échelle de la carte   
    let angle = 0; // Angle de rotation de la carte

    let id_pawn_selected = 0; // Id du pion sélectionné
    let click_down_plane = [0, 0]; // Position de la souris lors du clic sur l'avion
    let translates_plane = [[0, 0], [0, 0], [0, 0]]; // Translation de l'avion
    let plane_dragging = false; // Indique si l'utilisateur est en train de faire glisser l'avion

    let nom = "";
    let color = "";

    let id_last_message = 0;
    let id_last_log = 0;
    let which_player_is_playing = 0;
    let chargement = false;

    let is_roll = false;
    let niveau_message = 0; //contient le niveau de message c'est a dire a quel message il est dans le sens ou le message c'est a toi de jouer est le message 1 et le message lances le dé est le message 2
    let can_move = false;
    let is_message = false;
    let nb_message_en_attente = 0;

    // gestion des dés pour les déplacements
    document.querySelector('.dice-container').addEventListener('click', startRolling);
    document.querySelector('.btn_tour').addEventListener('click', skip_turn);
    let rollingInterval;
    let time = 0;

    // deplacement de l'avion par le click
    function move_plane(event) {
        // Calculer le déplacement de la souris
        let x_move = (event.clientX - click_down_plane[0]) / scale;
        let y_move = (event.clientY - click_down_plane[1]) / scale;
        // Mettre à jour la variable de translation de l'avion
        translates_plane[id_pawn_selected][0] += x_move;
        translates_plane[id_pawn_selected][1] += y_move;
        // Mettre à jour la position de l'avion

        // selection de l'enfant avec le bon id
        document.querySelector('.div_piont').querySelector(`#plane-${id_pawn_selected}`).style.transform = `translate(${translates_plane[id_pawn_selected][0]}px, ${translates_plane[id_pawn_selected][1]}px)`;

        click_down_plane = [event.clientX, event.clientY];
    }

    // deplacement de l'avion
    function move_to(id_pawn, id_ville, adjustedX, adjustedY, id_emplacement, valeur,who) {
        // let plane_tmp = document.querySelector(`.div_piont [data-ville="${id_ville}"]`);
        // if (plane_tmp) {
        //     //faire en sorte que les avions ne se superposent pas
        //     let x = (Math.random() * 20) - 10;
        //     let y = (Math.random() * 20) - 10;
        //     adjustedX += x;
        //     adjustedY += y;
        // }
        
        // verification si la ville fait partie des villes objectifs

        ville_tmp = parseInt(id_ville);
        if (isNaN(ville_tmp)) {
            ville = id_ville.split('-')[0];
            ville = ville.substring(3);
            ville = ville.replace('_', '');
            ville = parseInt(ville);
        } else {
            ville = id_ville;
        }
        ville = ville.toString();

        console.log('ville', ville);
        console.log('liste', liste_cartes);
        let tmp_cartes = [];
        if (liste_cartes.includes(ville) && who == 0) {
            let carte = document.querySelector(`[carte_ville="${ville}"]`);
            console.log(carte);
            tmp_cartes.push(carte);
        }
        carte_trouvee(tmp_cartes);

        translates_plane[id_pawn] = [adjustedX, adjustedY];
        document.querySelector('.div_piont').querySelector(`#plane-${id_pawn}`).style.transition = 'transform 2s ease';
        document.querySelector('.div_piont').querySelector(`#plane-${id_pawn}`).style.transform = `translate(${adjustedX}px, ${adjustedY}px)`;
        document.querySelector('.div_piont').querySelector(`#plane-${id_pawn}`).setAttribute('data-ville', id_ville);

        let id_pawn_data = document.querySelector('.div_piont').querySelector(`#plane-${id_pawn}`).getAttribute('id_pawn');

        document.getElementsByClassName('div_nb_steep')[0].children[1].innerText = valeur;

        fetch('./php/update_pawn_position.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ id_player: id_player, id_pawn: id_pawn_data, id_emplacement: id_emplacement, valeur: valeur })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('nb_steep', valeur);
                if (who == 1) {
                    console.log(data);
                    add_log_to_base(`<a>${nom}<a> a déplacé son piont a ${data["emplacement"]} il lui reste ${valeur} pas`);
                }

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

    }

    function move_to_update(id_pawn, id_ville, adjustedX, adjustedY, id_emplacement, reel_id_pawn) {


        translates_plane[id_pawn] = [adjustedX, adjustedY];
        let plane = document.querySelector(`.div_piont [id_pawn="${reel_id_pawn}"]`);


        plane.style.transform = `translate(${adjustedX}px, ${adjustedY}px)`;
        plane.setAttribute('data-ville', id_ville);


        fetch('./php/update_pawn_position_back.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ id_player: id_player, id_pawn: reel_id_pawn, id_emplacement: id_emplacement })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

    }

    function get_ville_position(start_id) {

        if (start_id.length == 1) {
            start_id = "_x3" + start_id[0] + "_";
        } else if (start_id.length == 2) {
            start_id = "_x3" + start_id[0] + "_" + start_id[1];
        }

        const layers = ['Layer_12', 'Layer_8', 'Layer_7'];
        let actuel_layer;
        let ville = null;
        for (const layerId of layers) {
            const layer = document.getElementById(layerId);
            ville = layer.querySelector(`#${start_id}`) || layer.querySelector(`#${start_id}-2`);
            actuel_layer = layer;
            if (ville) break;
        }

        let position = ville.getBoundingClientRect();
        const svgContainer = document.getElementById('svg-container');
        const svgRect = svgContainer.getBoundingClientRect();

        let cityLeft;
        let cityTop;

        if (actuel_layer.id == 'Layer_8') {
            cityLeft = position.left - svgRect.left;
            cityTop = position.top - svgRect.top - 15;
        } else if (actuel_layer.id == 'Layer_7') {
            cityLeft = position.left - svgRect.left - 10;
            cityTop = position.top - svgRect.top - 25;
        } else {
            cityLeft = position.left - svgRect.left;
            cityTop = position.top - svgRect.top - 15;
        }

        let rotatedLeft = cityLeft * Math.cos(angle * Math.PI / 180) - cityTop * Math.sin(angle * Math.PI / 180);
        let rotatedTop = cityLeft * Math.sin(angle * Math.PI / 180) + cityTop * Math.cos(angle * Math.PI / 180);
        let adjustedX = (rotatedLeft) / scale;
        let adjustedY = (rotatedTop) / scale;
        return [adjustedX, adjustedY];
    }

    function deplace_plane(ville) {
        id_ville = ville.id;

        // _x33_1-2 => 31
        id_ville = id_ville.replace('_x3', '');
        id_ville = id_ville.replace('_', '');

        id_ville = id_ville.split('-')[0];
        let param = get_ville_position(id_ville);
        let adjustedX = param[0];
        let adjustedY = param[1];

        // Vérifier si le joueur est autorisé à se déplacer vers la ville
        get_next_authorized_step(localStorage.getItem('nb_steep')).then(paths => {
            // Obtenir l'id reelle de la ville
            let paths_ = paths.map(path => path[0]);
            let steeps = paths.map(path => path[1]);

            let id = ville.id;
            ville = id.split('-')[0];
            ville = ville.substring(3);
            ville = ville.replace('_', '');

            // si la ville n'a pas de connection
            if (paths_.length == 0) {
                console.log('not authorized');
                show_erreur('Vous ne pouvez plus vous déplacer vers aucune ville', 'Erreur');
                return;
            }
            // si la ville est autorisé / son id est dans les paths
            if (paths_.includes(ville)) {
                console.log('authorized');

                let path_id = paths_.findIndex(path => path === ville);
                let val = localStorage.getItem('nb_steep') - steeps[path_id];

                move_to(id_pawn_selected, ville, adjustedX, adjustedY, ville, val,1);
                fetch('./php/update_player.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({ id_player: id_player, steep: val })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(Data => {
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
            }
            // si la ville n'est pas autorisé
            else {
                console.log('not authorized');
                show_erreur('Vous ne pouvez pas vous déplacer vers cette ville', 'Erreur');
                return;
            }
        }).catch(error => {
            console.error('Error getting authorized steps:', error);
        });
    }
    // Fonction pour trouver les chemins possibles
    function findPaths(positions, startPosition, maxLength) {
        let paths = new Set();
        let queue = [{ position: startPosition, length: 0 }];

        while (queue.length > 0) {
            let { position, length } = queue.shift();

            positions.forEach(link => {
                let nextPosition = null;
                if (link[1] == position) {
                    nextPosition = [link[2], link[3]];
                } else if (link[2] == position) {
                    nextPosition = [link[1], link[3]];
                }
                if (nextPosition && parseInt(length) + parseInt(link[3]) <= parseInt(maxLength)) {
                    paths.add(nextPosition);
                    queue.push({ position: nextPosition, length: length + link[3] });
                }
            });
        }

        return Array.from(paths);
    }
    // Fonction pour obtenir les étapes autorisées
    function get_next_authorized_step(nb_step) {
        // Obtenir la position actuelle de l'avion
        let plane = document.querySelector('.div_piont').querySelector(`#plane-${id_pawn_selected}`)
        // Obtenir l'id de la ville sur laquelle se trouve l'avion
        let ville = plane.getAttribute('data-ville');
        // Si l'avion n'est pas sur une ville
        if (ville == null) {
            return Promise.resolve([]); // Retourner une promesse résolue avec un tableau vide
        }
        // Obtenir l'id de la ville

        // verifier si l'id est sous forme de string ou de nombre
        ville_tmp = parseInt(ville);
        if (isNaN(ville_tmp)) {
            ville = ville.split('-')[0];
            ville = ville.substring(3);
            ville = ville.replace('_', '');
            ville = parseInt(ville);
        } else {
            ville = ville_tmp;
        }

        // Obtenir les chemins possibles
        return fetch('./php/get_path.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ position: ville })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                return findPaths(data, ville, nb_step); // Retourner le résultat après avoir trouvé les chemins = paths
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                return []; // Retourner un tableau vide en cas d'erreur
            });
    }

    function get_next_all_authorized_step(nb_step) {
        // Obtenir la position actuelle de l'avion
        let planes = document.getElementsByClassName('div_plane player_pawn');

        let promises = [];  // Pour stocker toutes les promesses des fetch
        let array = [];  // Initialisation du tableau

        for (let i = 0; i < planes.length; i++) {
            let plane = planes[i];
            // Obtenir l'id de la ville sur laquelle se trouve l'avion
            let ville = plane.getAttribute('data-ville');

            // Si l'avion n'est pas sur une ville, on passe au suivant
            if (ville == null) {
                continue;
            }

            // Vérifier si l'id est sous forme de string ou de nombre
            let ville_tmp = parseInt(ville);
            if (isNaN(ville_tmp)) {
                ville = ville.split('-')[0];
                ville = ville.substring(3);
                ville = ville.replace('_', '');
                ville = parseInt(ville);
            } else {
                ville = ville_tmp;
            }

            // On crée une promesse fetch pour chaque avion
            let promise = fetch('./php/get_path.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ position: ville })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Ajouter les chemins trouvés dans array
                    let paths = findPaths(data, ville, nb_step);
                    if (paths) {
                        array.push(paths);
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });

            promises.push(promise); // Ajouter chaque promesse à la liste
        }

        // Retourner une promesse qui résout toutes les requêtes fetch
        return Promise.all(promises).then(() => {
            return array;
        });
    }

    // Fonction pour définir la position de départ de l'avion
    function set_starting_position(id_starting_position, pawn_id) {

        let start_id = String(id_starting_position);

        let adjustedX;
        let adjustedY;
        let postions = get_ville_position(start_id);

        adjustedX = postions[0];
        adjustedY = postions[1];

        if (start_id.length == 1) {
            start_id = "_x3" + start_id[0] + "_";
        } else if (start_id.length == 2) {
            start_id = "_x3" + start_id[0] + "_" + start_id[1];
        }
        move_to(pawn_id, start_id, adjustedX, adjustedY, id_starting_position, localStorage.getItem("nb_steep"),0);


    }

    function city_hover(city, etat) {
        if (etat == 0) {
            city.style.transform = 'scale(1)';
            city.style.filter = '';
            return;
        }
        else if (etat == 1) {
            city.style.transform = 'scale(1.1)';
            city.style.filter = 'drop-shadow(0px 5px 10px rgba(0, 0, 0, 0.35))';
        }
    }

    function mouve_svg(event) {
        if (!dragging) {
            return `translate(${translates[0]}px, ${translates[1]}px)`;
        }
        let x = event.clientX - click_down[0];
        let y = event.clientY - click_down[1];
        translates[0] += x;
        translates[1] += y;
        click_down = [event.clientX, event.clientY];
        return `translate(${translates[0]}px, ${translates[1]}px)`;
    }

    function zoom_svg(event) {
        event.preventDefault();  // Empêche le défilement par défaut
        let zoom = event.deltaY * -0.0005;  // Modifie la sensibilité
        scale += zoom * scale;

        if (scale > 6) {
            scale = 6;
        }
        if (scale < 0.5) {
            scale = 0.5;
        }
        return scale;
    }

    function reset_svg() {
        translates = [0, 0];
        scale = 1;
        angle = 0;  // Réinitialiser l'angle
        let svg_parent = document.getElementsByClassName('div_carte')[0];
        svg_parent.style.transform = `translate(${translates[0]}px, ${translates[1]}px) scale(${scale})`;
        let zoom_bar = document.getElementsByClassName('div_zoom_in_bar')[0];
        zoom_bar.style.height = '';
    }

    function change_pawn_color(pawn, color) {

        let svg = pawn.querySelector('svg');
        let path = svg.querySelector('path');
        path.classList.add('svg_color_change');
        path.style.fill = color;
    }

    document.addEventListener('mouseup', function (event) {
        dragging = false;
        plane_dragging = false;
        is_slider_selected= false;
    });

    document.addEventListener('wheel', function (event) {
        event.preventDefault();

        let divChat = document.getElementsByClassName('div_chat_messages')[0];

        //si la souris est sur le chat
        if (event.clientX > divChat.getBoundingClientRect().left && event.clientX < divChat.getBoundingClientRect().right && event.clientY > divChat.getBoundingClientRect().top && event.clientY < divChat.getBoundingClientRect().bottom) {
            divChat.scrollTop += event.deltaY;
            return;
        }
        divChat = document.getElementsByClassName('div_log_messages')[0];
        if (event.clientX > divChat.getBoundingClientRect().left && event.clientX < divChat.getBoundingClientRect().right && event.clientY > divChat.getBoundingClientRect().top && event.clientY < divChat.getBoundingClientRect().bottom) {
            divChat.scrollTop += event.deltaY;
            return;
        }


        let zoom = zoom_svg(event);
        scale = zoom;
        let move = mouve_svg(event);
        let svg_parent = document.getElementsByClassName('div_carte')[0];
        svg_parent.style.transition = 'transform 0.5s ease';
        svg_parent.style.transform = `${move} scale(${scale})`;
        let zoom_bar = document.getElementsByClassName('div_zoom_in_bar')[0];
        zoom_bar.style.height = `${100 / 6 * scale}%`;



    }, { passive: false });

    document.addEventListener('mousemove', function (event) {
        let svg_parent = document.getElementsByClassName('div_carte')[0];
        svg_parent.style.transition = 'transform 0.1s ease';
        svg_parent.style.transform = mouve_svg(event) + ` scale(${scale})`;
    });

    document.addEventListener('mousedown', function (event) {
        if (event.button !== 1) {
            return;
        }
        document.body.style.cursor = 'grabbing';
        dragging = true;
        click_down = [event.clientX, event.clientY];
    });

    document.addEventListener('mouseup', function () {
        document.body.style.cursor = '';
        dragging = false;
        dragging_plane = false;
    });

    // bnt zoom
    document.getElementById('zoom_in').addEventListener('click', function () {
        scale += 0.1 * scale;
        if (scale > 6) {
            scale = 6;
        }
        let svg_parent = document.getElementsByClassName('div_carte')[0];
        svg_parent.style.transform = `translate(${translates[0]}px, ${translates[1]}px) scale(${scale})`;
        let zoom_bar = document.getElementsByClassName('div_zoom_in_bar')[0];
        zoom_bar.style.height = `${100 / 6 * scale}%`;
    });

    document.getElementById('zoom_out').addEventListener('click', function () {
        scale -= 0.1 * scale;
        if (scale < 0.5) {
            scale = 0.5;
        }
        let svg_parent = document.getElementsByClassName('div_carte')[0];
        svg_parent.style.transform = `translate(${translates[0]}px, ${translates[1]}px) scale(${scale})`;
        let zoom_bar = document.getElementsByClassName('div_zoom_in_bar')[0];
        zoom_bar.style.height = `${100 / 3 * scale}%`;
    });

    // boucle d'update des pions toutes les 5 secondes
    setInterval(function () {
        fetch('./php/get_update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ id_partie: id_partie, id_last_message: id_last_message, id_player: id_player, id_last_log:id_last_log })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(Data => {
                if (Data['data'] == null) {
                    return;
                }
                let data = Data['data'];
                for (let i = 0; i < data.length; i++) {
                    let ville = data[i]['id_emplacement_link'];
                    let postions = get_ville_position(ville);
                    let adjustedX = postions[0];
                    let adjustedY = postions[1];
                    move_to_update(i, ville, adjustedX, adjustedY, ville, data[i]['id_pawn'], data[i]['color']);
                }
                let messages = Data['data2'];
                for (let i = 0; i < messages.length; i++) {
                    let ext = 'ext';

                    if (messages[i]['id_player_link'] == id_player) {
                        ext = 'int';
                    }
                    add_message(messages[i]['chat'], messages[i]['nom'], ext, messages[i]['color']);
                    id_last_message = messages[i]['id_chat'];
                }

                let game = Data.game[0];
                if (game['id_joueur'] == id_player && which_player_is_playing != id_player) {
                    which_player_is_playing = game['id_joueur'];
                    add_log_to_base(`C'est à <a>${nom}<a> de jouer`);
                    show_erreur("C'est à toi de jouer", 'Message');
                    document.querySelector('.dice-container').classList.add('active');
                    document.querySelector('.btn_tour').classList.add('active');

                    niveau_message = 1;
                } else if (which_player_is_playing != game['id_joueur']) {
                    which_player_is_playing = game['id_joueur'];
                    let nom = game['nom'];
                    show_erreur(`C'est ${nom} qui joue`, 'Message');
                }

                let log = Data['log'];
                for (let i = 0; i < log.length; i++) {
                    add_log(log[i]['txt'], log[i]['color']);
                    id_last_log = log[i]['id_log_message'];
                }

                let player_data = Data.player[0];
                
                document.getElementsByClassName('div_nb_steep')[0].children[1].innerText = player_data['steep'];
                localStorage.setItem('nb_steep', player_data['steep']);
                
                document.getElementsByClassName('div_point')[0].children[0].innerText = player_data['score'];

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, 1000);

    function rollDice() {
        let die1 = Math.floor(Math.random() * 6) + 1;
        let die2 = Math.floor(Math.random() * 6) + 1;

        document.getElementById('die1').textContent = die1;
        document.getElementById('die2').textContent = die2;
    }

    function startRolling() {
        
        // if active 
        if (!document.querySelector('.dice-container').classList.contains('active')) {
            return;
        }

        document.querySelector('.dice-container').classList.remove('active');

        // Lancer les dés aléatoirement toutes les 100ms
        rollingInterval = setInterval(rollDice, 100);

        // Arrêter le lancer après 2 secondes
        setTimeout(function () {
            clearInterval(rollingInterval);
            rollDice();
            time = 0;

            let sum = parseInt(document.getElementById('die1').textContent) * parseInt(document.getElementById('die2').textContent);
            localStorage.setItem('nb_steep', sum);

            fetch('./php/update_player.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ id_player: id_player, steep: sum })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(Data => {
                    setTimeout(function () {
                        document.getElementsByClassName('div_nb_steep')[0].children[1].innerText = sum;
                        add_log_to_base(`<a>${nom}<a> a lancé les dés et a obtenu ${sum} points`);
                        is_roll = true;
                    }, 500);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });


        }, 1000);
    }

    function show_erreur(message, en_tete) {

        // console.log("message", message);
        // console.log("en_tete", en_tete);
        // console.log("is_message", is_message);
        // console.log("**************************************************");

        if (is_message) {
            setTimeout(function () {
                show_erreur(message, en_tete)
            }, 1000);
        }else{
            is_message = true;
            let box = document.getElementsByClassName('div_message_error')[0]
            box.style.transform = 'translateX(-50%) translateY(0)';
    
            box.querySelector('#erreur_message').innerText = message;
            box.querySelector('#en_tete').innerText = en_tete;
    
            setTimeout(function () {
                hide_erreur();
            }, 5000);
        }

    }

    function hide_erreur() {
        let box = document.getElementsByClassName('div_message_error')[0]
        box.style.transform = 'translateX(-50%) translateY(-300px)';
        is_message = false;
    }

    function passer_au_prochain_tour() {

        //reset des dés
        document.getElementById('die1').textContent = "🎲";
        document.getElementById('die2').textContent = "🎲";
        document.querySelector('.dice-container').classList.remove('active');
        document.querySelector('.btn_tour').classList.remove('active');
        document.getElementsByClassName('div_nb_steep')[0].children[1].innerText = 0;

        
        fetch('./php/next_round.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ num_player: which_player_is_playing, id_partie: id_partie, id_player: id_player})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // fermer la page de chargement
    setInterval(function () {
        if (chargement) {
            setTimeout(function () {
                document.getElementsByClassName('div_chargement')[0].style.display = 'none';
                if (localStorage.getItem('nb_steep') == 0 &&parseInt(which_player_is_playing) == parseInt(id_player) && !is_roll && niveau_message == 1) {
                    show_erreur('Vous devez lancer les dés pour pouvoir vous déplacer', 'Message');
                    document.querySelector('.dice-container').classList.add('active');
                    document.querySelector('.btn_tour').classList.add('active');
                    niveau_message = 2;
                }

                if (parseInt(which_player_is_playing) == parseInt(id_player) && !is_roll){
                            can_move = false;
                }
                else if (parseInt(which_player_is_playing) == parseInt(id_player) && is_roll){
                    can_move = true;
                }
                else if (parseInt(which_player_is_playing) != parseInt(id_player)){
                    can_move = false;
                }
                if (parseInt(which_player_is_playing) == parseInt(id_player) && is_roll){
                    get_next_all_authorized_step(localStorage.getItem('nb_steep'))
                        .then(resultat => {
                            // si toutes les listes sont vides l'utilisateur ne peux plus se déplacer et que c'est bien a l'utilisateur de jouer
                            let toutes_vides = resultat.every(liste => liste.length === 0);

                            if (toutes_vides && parseInt(which_player_is_playing) == parseInt(id_player) && is_roll) {
                                show_erreur("Vous ne pouvez plus vous déplacer vers aucune ville c'est au prochain joueur de jouer", 'Message');
                                passer_au_prochain_tour()
                                is_roll = false;
                                niveau_message = 0;
                            }
                        })
                        .catch(error => {
                            console.error('Erreur lors de la récupération des chemins autorisés:', error);
                        });
                }

            }, 5000);
        }

    }, 1000);


    function add_log_to_base(txt){
        console.log(txt);
        fetch('./php/add_log.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ id_player: id_player, id_partie:id_partie, txt: txt})
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error(error));
    }


    // fonction qui s'execute que l'utyilisateur fait un refresh de la page
    window.addEventListener('beforeunload', function (event) {
        fetch('./php/update_player.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ id_player: id_player, steep: 0 })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(Data => {
                setTimeout(function () {
                    document.getElementsByClassName('div_nb_steep')[0].children[1].innerText = sum;
                    add_log_to_base(`<a>${nom}<a> a lancé les dés et a obtenu ${sum} points`);
                    is_roll = true;
                }, 500);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });


    function skip_turn(){
        if (parseInt(which_player_is_playing) == parseInt(id_player) && is_roll && document.querySelector('.btn_tour').classList.contains('active')) {
            console.log(document.querySelector('.btn_tour').classList);
            show_erreur("Vous avez passé votre tour", 'Message');
            add_log_to_base(`<a>${nom}<a> a passé son tour`);
            passer_au_prochain_tour();
            is_roll = false;
            niveau_message = 0;
        }else if ((parseInt(which_player_is_playing) == parseInt(id_player) && !is_roll && document.querySelector('.btn_tour').classList.contains('active'))){
            show_erreur("Vous devez lancer les dés avant de décider de terminer le tour", 'Message');
        }
    }