function createCarte(type, val, nom, id, color,id_emplacement) {
    const divCarteMain = document.createElement('div');
    divCarteMain.classList.add('div_carte_main');
    divCarteMain.setAttribute('id', id);
    divCarteMain.setAttribute('carte_ville', id_emplacement);
    liste_cartes.push(id_emplacement);
    divCarteMain.style.backgroundColor = "#"+color;
    divCarteMain.setAttribute('open', 'false');
    divCarteMain.style.zIndex = 1;

    divCarteMain.addEventListener('click', () => {
        const isOpen = divCarteMain.getAttribute('open') === 'true';
        const cartes = document.querySelectorAll('.div_carte_main');
        
        if (!isOpen) {
            document.querySelector('.div_all_cards').style.width = `${document.querySelectorAll('.div_carte_main').length * 150}px`;
            
            cartes.forEach((carte, index) => {
                const reverseIndex = cartes.length - 1 - index;
                carte.style.transform = `translateX(${-reverseIndex * 100}px)`;
                carte.setAttribute('open', 'true');
            });

            // de combien la div all cards est plus grande que la fenetre
            const diff = document.querySelector('.div_all_cards').offsetWidth - window.innerWidth;
            console.log(diff);

        } else {
            divCarteMain.style.transform += ` translateY(-100px)`;
            divCarteMain.setAttribute('open', 'false');
        }
    });

    divCarteMain.addEventListener('mouseover', () => {
        if (divCarteMain.getAttribute('open') === 'true') {
            divCarteMain.style.transform += ` translateX(-80px) translateY(-60px)`;
        }
    });

    divCarteMain.addEventListener('mouseout', () => {
        if (divCarteMain.getAttribute('open') === 'true' && divCarteMain.style.transform.includes('translateX(-80px) translateY(-60px)')) {
            document.querySelector('.div_all_cards').style.width = `50px`;
            
            divCarteMain.style.transform = divCarteMain.style.transform.replace('translateX(-80px) translateY(-60px)', '');
        }
    });

    const divTitre = document.createElement('div');
    divTitre.className = 'div_titre';

    const h2Carte = document.createElement('h2');
    h2Carte.textContent = type;

    const h3Carte = document.createElement('h3');
    h3Carte.textContent = val;

    divTitre.appendChild(h2Carte);
    divTitre.appendChild(h3Carte);

    const divVilleName = document.createElement('div');
    divVilleName.className = 'div_ville_name';

    const h2Ville = document.createElement('h2');
    h2Ville.textContent = nom;

    divVilleName.appendChild(h2Ville);

    divCarteMain.appendChild(divTitre);
    divCarteMain.appendChild(divVilleName);

    document.querySelector('.div_all_cards').appendChild(divCarteMain);
    // document.querySelector('.div_all_cards').style.width = `${document.querySelectorAll('.div_carte_main').length * 150}px`;
}

let liste_cartes = [];
let id_partie = localStorage.getItem('id_partie');
let id_player = localStorage.getItem('id_player');
let is_card_open = false;
console.log("id_partie",id_partie);
console.log("id_player",id_player);


function get_info_partie() {
    return fetch('./php/get_partie_info.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ id: id_player, id_partie: id_partie})
    })
        .then(response => response.json())
        .then(data => {
            let info = data[0];

            data.forEach(cards => {
                let type = cards.cargaison_type_nom;
                let val = cards.val;
                let nom = cards.ville_nom;
                let id = cards.id_card;
                let color = cards.color;
                let id_emplacement = cards.id_emplacement;
                let cartes = document.querySelectorAll('.div_carte_main');
                let cardExists = false;
                cartes.forEach((carte, index) => {
                    if (carte.id == id) {
                        cardExists = true;
                    }
                });
                if (!cardExists) {
                    createCarte(type, val, nom, id, color,id_emplacement);
                }


            });
        })
        .catch(error => console.error(error));
}

get_info_partie();
document.addEventListener('mousemove', (event) => {

    let elem  = document.querySelector('.div_all_cards');
    const rect = elem.getBoundingClientRect();
    const distance = Math.sqrt(
        Math.pow(event.clientY - (rect.top + rect.height / 2), 2)
    );
    const cartes = document.querySelectorAll('.div_carte_main');
    cartes.forEach((carte) => {
        if (distance > 200) {
            carte.style.transform = ``;
            carte.setAttribute('open', 'false');
        }
    });
});

async function carte_trouvee(cartes) {
    if (is_card_open) {
        // Attendre 1 seconde et relancer la fonction
        setTimeout(() => {
            carte_trouvee(cartes);
        }, 1000);
        return; // Retourner pour ne pas exécuter le reste de la fonction
    }

    is_card_open = true; // Définir l'état comme ouvert
    const promises = []; // Tableau pour stocker les promesses de fetch

    for (let i = 0; i < cartes.length; i++) {
        const carte = cartes[i];
        const id_carte = carte.id;

        // Créer une promesse pour chaque requête fetch
        const promise = fetch('./php/carte_trouvee.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ id_carte: id_carte, id_player: id_player })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            let etat = data["etat"];
            let val = data["val"];
            
            if (etat == 0){
                // Ajoute l'animation à la carte spécifiée
                carte.classList.add('carte_trouvee_animation');
    
                // Retire l'animation après son exécution
                setTimeout(() => {
                    carte.classList.remove('carte_trouvee_animation');
                    carte.classList.add('carte_trouvee');
                }, 5000); // Durée de l'animation
            }else{
                carte.classList.add('carte_trouvee');

            }

        })
        .catch(error => console.error('Erreur :', error));

        promises.push(promise); // Ajouter la promesse au tableau
    }

    // Attendre que toutes les promesses soient résolues
    await Promise.all(promises);

    is_card_open = false; // Définir l'état comme fermé
}
