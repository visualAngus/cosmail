<?php

    // Connexion à la base de données
    $conn = mysqli_connect("localhost", "root", "", "cosmail");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    $id_partie_link = $_POST['id_partie'];

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

    if ($result1) {
        echo json_encode([
            "success" => "Player added and player count updated",
            "nb_joueur_conn" => $nb_joueur_conn,
            "nb_joueur" => $nb_joueur
        ]);
    } else {
        echo json_encode(["error" => "Failed to update player count"]);
    }

    mysqli_close($conn);
?>
