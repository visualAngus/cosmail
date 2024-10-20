<?php

    $liste_emplacement = $_POST['liste_emplacement'];
    $id_partie = $_POST['id_partie'];
    // Connexion à la base de données
    $conn = mysqli_connect("localhost", "root", "", "cosmail");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $stmt = $conn->prepare("INSERT INTO joueurs_actifs (id_partie_link, point,type,nom) VALUES (?, ?, 1, 'Dealer')");
    $point = 0;
    $stmt->bind_param("ii", $id_partie, $point);
    $result = $stmt->execute();

    if (!$result) {
        die("Error: " . $stmt->error);
    }
    $stmt->close();


    $stmt = $conn->prepare("SELECT id_joueur FROM joueurs_actifs WHERE id_partie_link = ? AND type = 1");
    $stmt->bind_param("i", $id_partie);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $id_joueur = $row['id_joueur'];
    $stmt->close();

    // Fonction pour distribuer les cartes à un joueur
    function distribuer_cartes($conn, $id_joueur, $id_emplacement) {
        $stmt = $conn->prepare("INSERT INTO cards (id_joueur_link, id_emplacement_link) VALUES (?, ?)");
        $stmt->bind_param("ii", $id_joueur, $id_emplacement);
        $result = $stmt->execute();
        if (!$result) {
            die("Error: " . $stmt->error);
        }
        $stmt->close();
    }

    $liste_emplacement = json_decode($liste_emplacement);

    if (is_array($liste_emplacement) || is_object($liste_emplacement)) {
        foreach ($liste_emplacement as $id_emplacement) {
            distribuer_cartes($conn, $id_joueur, $id_emplacement);
        }
        $stmt = $conn->prepare("UPDATE parties SET etat = ? WHERE id_partie = ?");
        $etat = 1;
        $stmt->bind_param("is", $etat, $id_partie);
        $result = $stmt->execute();
        if (!$result) {
            die("Error: " . $stmt->error);
        }
        $stmt->close();
    } else {
        echo "Invalid input: liste_emplacement is not a valid JSON array or object.";
    }

    $conn->close();

?>
