<?php
    $id = $_POST['id'];
    $id_partie = $_POST['id_partie'];
    // Connexion à la base de données
    include 'connexion.php';

    // Fonction pour récupérer les informations d'une partie donnée
    $sql = "SELECT parties.nb_joueur , joueurs_actifs.id_joueur , joueurs_actifs.score , cards.id_card , cards.etat , emplacement.nom as ville_nom, 
                    emplacement.val, emplacement.id_emplacement, cargaison_type.nom as cargaison_type_nom, cargaison_type.id as cargaison_type_id ,
                    color.color, joueurs_actifs.nom as joueur_nom
            FROM joueurs_actifs 
            LEFT JOIN parties ON joueurs_actifs.id_partie_link = parties.id_partie and parties.id_partie = '$id_partie'
            LEFT JOIN cards ON joueurs_actifs.id_joueur = cards.id_joueur_link 
            LEFT JOIN emplacement ON cards.id_emplacement_link = emplacement.id_emplacement
            LEFT JOIN cargaison_type ON emplacement.id_cargaison_type_link = cargaison_type.id
            LEFT JOIN color ON cargaison_type.id = color.id_cargaison_type_link
            WHERE joueurs_actifs.id_joueur = '$id' AND joueurs_actifs.type = '0' AND joueurs_actifs.id_partie_link='$id_partie' ORDER BY RAND()";
    $result = mysqli_query($conn, $sql);

    $data = [];
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo json_encode(["error" => "No results found"]);
    }

    mysqli_close($conn);
?>