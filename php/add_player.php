<?php

    // Connexion à la base de données
    include 'connexion.php';
    
    $id_partie_link = $_POST['id_partie'];; // Replace with actual value
    $nom = $_POST['nom'];; // Replace with actual value

    $sql ="SELECT * FROM parties WHERE id_partie = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $id_partie_link);
    mysqli_stmt_execute($stmt);
    $result1 = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result1)) {
        $nb_joueur_conn = (int)$row['nb_joueur_conn'];
        $nb_joueur = (int)$row['nb_joueur'];
        $etat = (int)$row['etat'];
    } else {
        echo json_encode(["error" => "Partie non trouvée"]);
        exit();
    }

    if ($nb_joueur_conn+1 > $nb_joueur || $etat != 0) {
        echo json_encode(["error" => "Partie pleine"]);
        exit();
    }



    // Fonction pour récupérer les informations d'une partie donnée
    $sql = "INSERT INTO joueurs_actifs (id_partie_link, point, type, nom) VALUES (?, 0, 0, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $id_partie_link, $nom);
    mysqli_stmt_execute($stmt);
    

    $sql = "SELECT id_joueur FROM joueurs_actifs WHERE id_partie_link = ? AND nom = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $id_partie_link, $nom);

    mysqli_stmt_execute($stmt);

    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $id_joueur = (int)$row['id_joueur'];
    } else {
        echo json_encode(["error" => "Joueur non trouvé"]);
        exit();
    }


    // comment ajouter 1 a un champ de la table
    $sql = "UPDATE parties SET nb_joueur_conn = nb_joueur_conn + 1 WHERE id_partie = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $id_partie_link);

    $result2 = mysqli_stmt_execute($stmt);

    $tmp = $nb_joueur_conn + 1;
    $sql = "UPDATE joueurs_actifs set numero_joueur = ? WHERE id_joueur = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $tmp, $id_joueur);

    $result3 = mysqli_stmt_execute($stmt);

    // 76 -> id_emplacement de la première base de départ
    $emplacement_id = $tmp + 76;

        // Préparer la requête
    $sql = "INSERT INTO pawns (id_joueur_link, id_emplacement_link, link_type_pawn) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);

    // Exécuter la première requête avec link_type_pawn = 0
    $link_type_pawn = 0;
    mysqli_stmt_bind_param($stmt, "ssi", $id_joueur, $emplacement_id, $link_type_pawn);
    mysqli_stmt_execute($stmt);

    // Exécuter la deuxième requête avec link_type_pawn = 0
    mysqli_stmt_bind_param($stmt, "ssi", $id_joueur, $emplacement_id, $link_type_pawn);
    mysqli_stmt_execute($stmt);

    // Exécuter la troisième requête avec link_type_pawn = 1
    $link_type_pawn = 1;
    mysqli_stmt_bind_param($stmt, "ssi", $id_joueur, $emplacement_id, $link_type_pawn);
    mysqli_stmt_execute($stmt);

    // recuperer les id des pions
    $sql = "SELECT id_pawn FROM pawns WHERE id_joueur_link = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $id_joueur);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $id_pawn = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $id_pawn[] = $row['id_pawn'];
    }


    $sql ="SELECT numero_joueur FROM joueurs_actifs WHERE id_joueur = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $id_joueur);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $numero_joueur = (int)$row['numero_joueur'];
    } else {
        echo json_encode(["error" => "Joueur non trouvé"]);
        exit();
    }



    if ($result2) {
        echo json_encode([
            "success" => "Player added and player count updated",
            "nb_joueur_conn" => $nb_joueur_conn + 1,
            "nb_joueur" => $nb_joueur,
            "id_joueur" => $id_joueur,
            "id_pawn" => $id_pawn,
            "numero_joueur" => $numero_joueur
        ]);
    } else {
        echo json_encode(["error" => "Failed to update player count"]);
    }

    mysqli_close($conn);
?>
