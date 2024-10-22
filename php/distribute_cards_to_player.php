<?php

    $id_joueur = $_POST['id_joueur'];
    $liste_emplacement = $_POST['liste_emplacement'];

    // Connexion à la base de données
    include 'connexion.php';

    // Fonction pour distribuer les cartes à un joueur
    function distribuer_cartes($conn, $id_joueur, $id_emplacement) {
        $sql = "INSERT INTO cards (id_joueur_link, id_emplacement_link) VALUES ('$id_joueur', '$id_emplacement')";
        $result = mysqli_query($conn, $sql);
    }

    $liste_emplacement = json_decode($liste_emplacement);

    if (is_array($liste_emplacement) || is_object($liste_emplacement)) {
        foreach ($liste_emplacement as $id_emplacement) {
            distribuer_cartes($conn, $id_joueur, $id_emplacement);
        }
    } else {
        echo "Invalid input: liste_emplacement is not a valid JSON array or object.";
    }

?>
