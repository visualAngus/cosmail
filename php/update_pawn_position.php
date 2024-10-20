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

    // Vérification si la requête a réussi
    if ($result) {
        // Si la mise à jour a réussi, retourner une confirmation
        echo json_encode(["success" => "Position updated"]);
    } else {
        // En cas d'échec de la requête, afficher une erreur
        echo json_encode(["error" => "Update failed: " . mysqli_error($conn)]);
    }

    mysqli_close($conn);
?>
