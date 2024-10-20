<?php
    $id_pawn = $_POST['id_pawn'];
    $id_player = $_POST['id_player'];
    $id_emplacement = $_POST['id_emplacement'];

    // Connexion à la base de données
    $conn = mysqli_connect("localhost", "root", "", "cosmail");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Requête pour mettre à jour l'emplacement du pion
    $sql = "UPDATE pawns SET id_emplacement_link = '$id_emplacement' WHERE id_pawn = '$id_pawn' AND id_joueur_link = '$id_player'";
    $result = mysqli_query($conn, $sql);

    $sql = "SELECT counter_modif FROM parties WHERE id_partie = (SELECT id_partie_link FROM joueurs_actifs WHERE id_joueur = '$id_player')";
    $result = mysqli_query($conn, $sql);

    //recuperation du counter_modif unique
    $counter_modif = mysqli_fetch_assoc($result);
    $counter_modif = $counter_modif['counter_modif'];

    //set cookie
    setcookie("counter", $counter_modif, time() + 3600, "/", "", false, true);


    // Vérification si la requête a réussi
    if ($result) {
        // Si la mise à jour a réussi, retourner une confirmation
        echo json_encode(["counter" => $counter_modif]);
    } else {
        // En cas d'échec de la requête, afficher une erreur
        echo json_encode(["error" => "Update failed: " . mysqli_error($conn)]);
    }

    mysqli_close($conn);
?>