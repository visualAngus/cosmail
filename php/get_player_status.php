<?php

// Connexion à la base de données
include './connexion.php';

$id_partie_link = $_POST['id_partie'];

$sql = "SELECT parties.nb_joueur_conn, parties.nb_joueur, parties.etat, joueurs_actifs.id_joueur, joueurs_actifs.nom
        FROM parties 
        LEFT JOIN joueurs_actifs ON parties.id_partie = joueurs_actifs.id_partie_link
        WHERE parties.id_partie = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "s", $id_partie_link);
mysqli_stmt_execute($stmt);
$result1 = mysqli_stmt_get_result($stmt);

$player_names = [];
$nb_joueur_conn = 0;
$nb_joueur = 0;
$etat = 0;

while ($row = mysqli_fetch_assoc($result1)) {
    $nb_joueur_conn = (int)$row['nb_joueur_conn'];
    $nb_joueur = (int)$row['nb_joueur'];
    $etat = (int)$row['etat'];
    if ($row['nom']) {
        $player_names[] = $row['nom'];
    }
}

if (!empty($player_names)) {
    echo json_encode([
        "success" => "Player added and player count updated",
        "nb_joueur_conn" => $nb_joueur_conn,
        "nb_joueur" => $nb_joueur,
        "etat" => $etat,
        "noms" => $player_names
    ]);
} else {
    echo json_encode(["error" => "Partie non trouvée ou aucun joueur actif"]);
}

mysqli_close($conn);
?>
