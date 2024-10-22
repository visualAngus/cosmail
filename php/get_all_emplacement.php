<?php

    // Connexion à la base de données
    include 'connexion.php';

    // Fonction pour récupérer les informations d'une partie donnée
    $sql = "SELECT * FROM emplacement";
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
