<?php
    $id = $_POST['id'];

    // Connexion à la base de données
    include 'connexion.php';

    // Fonction pour récupérer les informations d'une partie donnée
    $stmt = $conn->prepare("SELECT parties.nb_joueur, joueurs_actifs.id_joueur, nb_cards_rules.nb_cards, parties.etat
                            FROM parties 
                            LEFT JOIN joueurs_actifs ON parties.id_partie = joueurs_actifs.id_partie_link
                            LEFT JOIN nb_cards_rules ON parties.nb_joueur = nb_cards_rules.nb_joueur
                            WHERE id_partie = ? AND joueurs_actifs.type = '0'");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

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
