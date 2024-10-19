function createCarte(type, val, nom, id, color) {
    const divCarteMain = document.createElement('div');
    divCarteMain.className = 'div_carte_main';
    divCarteMain.setAttribute('id', id);
    divCarteMain.style.backgroundColor = "#"+color;
    divCarteMain.setAttribute('open', 'false');
    divCarteMain.style.zIndex = 1;

    divCarteMain.addEventListener('click', () => {
        const isOpen = divCarteMain.getAttribute('open') === 'true';
        const cartes = document.querySelectorAll('.div_carte_main');
        
        if (!isOpen) {
            cartes.forEach((carte, index) => {
                const reverseIndex = cartes.length - 1 - index;
                carte.style.transform = `translateX(${-reverseIndex * 100}px)`;
                carte.setAttribute('open', 'true');
            });
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
    document.querySelector('.div_all_cards').style.width = `${document.querySelectorAll('.div_carte_main').length * 150}px`;
}
let id_partie = localStorage.getItem('id_partie');
let id_player = localStorage.getItem('id_player');
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
            let nom = info.joueur_nom;
            document.getElementById('nom_joueur').textContent = nom;

            data.forEach(cards => {
                let type = cards.cargaison_type_nom;
                let val = cards.val;
                let nom = cards.ville_nom;
                let id = cards.id_card;
                let color = cards.color;
                let cartes = document.querySelectorAll('.div_carte_main');
                let cardExists = false;
                cartes.forEach((carte, index) => {
                    if (carte.id == id) {
                        cardExists = true;
                    }
                });
                if (!cardExists) {
                    createCarte(type, val, nom, id, color);
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


