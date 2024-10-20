<?php
    $id = $_POST['id_player']; // Replace with actual value
    // Connexion à la base de données
    $conn = mysqli_connect("localhost", "root", "", "cosmail");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Fonction pour récupérer les informations d'une partie donnée
    $sql = "SELECT joueurs_actifs.point, pawns.id_pawn, pawns.id_emplacement_link, pawns.etat, type_pawn.type_pawn_name
            FROM joueurs_actifs 
            LEFT JOIN pawns ON joueurs_actifs.id_joueur = pawns.id_joueur_link
            LEFT JOIN type_pawn ON pawns.link_type_pawn = type_pawn.id_type_pawn
            WHERE id_joueur = '$id'";

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
