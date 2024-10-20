<?php

    // Connexion à la base de données
    $conn = mysqli_connect("localhost", "root", "", "cosmail");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
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



    if ($result2) {
        echo json_encode([
            "success" => "Player added and player count updated",
            "nb_joueur_conn" => $nb_joueur_conn + 1,
            "nb_joueur" => $nb_joueur,
            "id_joueur" => $id_joueur
        ]);
    } else {
        echo json_encode(["error" => "Failed to update player count"]);
    }

    mysqli_close($conn);
?>
