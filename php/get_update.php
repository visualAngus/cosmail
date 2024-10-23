<?php
    $id_partie = $_POST['id_partie'];
    $id_last_message = $_POST['id_last_message'];
    $id_player = $_POST['id_player'];
    $id_last_log = $_POST['id_last_log'];

    // Connexion à la base de données
    include 'connexion.php';


    $sql = "SELECT counter_modif FROM parties WHERE id_partie = '$id_partie'";
    $result = mysqli_query($conn, $sql);

    //recuperation du counter_modif unique
    $counter_modif = mysqli_fetch_assoc($result);
    $counter_modif = $counter_modif['counter_modif'];

    //get cookie
    $counter = $_COOKIE['counter'];

    // compare counter
    if($counter_modif == $counter){
        echo json_encode(["message" => "No modification"]);
        return;
    }else{
        $sql = "SELECT parties.etat, joueurs_actifs.id_joueur, joueurs_actifs.point, pawns.id_emplacement_link, pawns.etat,pawns.id_pawn
            FROM parties 
            LEFT JOIN joueurs_actifs ON parties.id_partie = joueurs_actifs.id_partie_link
            LEFT JOIN pawns ON joueurs_actifs.id_joueur = pawns.id_joueur_link
            WHERE parties.id_partie = '$id_partie' AND id_pawn IS NOT NULL";
        $result = mysqli_query($conn, $sql);

        $sql = "SELECT chat.id_player_link, chat.chat, player_color.color, joueurs_actifs.nom, chat.id_chat
            FROM parties
            LEFT JOIN joueurs_actifs ON parties.id_partie = joueurs_actifs.id_partie_link
            LEFT JOIN chat ON joueurs_actifs.id_joueur = chat.id_player_link
            LEFT JOIN player_color ON joueurs_actifs.numero_joueur = player_color.id_color
            WHERE parties.id_partie = '$id_partie' AND chat.id_chat > '$id_last_message' AND chat.id_player_link IS NOT NULL";
        $result2 = mysqli_query($conn, $sql);

        $sql = "SELECT parties.etat, parties.tour_de_jeu as tour, joueurs_actifs.id_joueur, joueurs_actifs.nom, joueurs_actifs.steep
        FROM parties 
        LEFT JOIN joueurs_actifs ON parties.id_partie = joueurs_actifs.id_partie_link
        WHERE id_partie = '$id_partie' AND joueurs_actifs.id_partie_link = '$id_partie' AND joueurs_actifs.numero_joueur = parties.tour_de_jeu";
        $result3 = mysqli_query($conn, $sql);

        $sql = "SELECT log_messages.id_log_message, log_messages.txt, player_color.color
                FROM log_messages
                LEFT JOIN joueurs_actifs ON log_messages.id_player_link = joueurs_actifs.id_joueur
                LEFT JOIN player_color ON joueurs_actifs.numero_joueur = player_color.id_color
                WHERE log_messages.id_partie_link = '$id_partie' AND log_messages.id_log_message > '$id_last_log'";
        $result4 = mysqli_query($conn, $sql);



        $data = [];
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            
        }
        $data2 = [];
        if (mysqli_num_rows($result2) > 0) {
            while ($row = mysqli_fetch_assoc($result2)) {
                $data2[] = $row;
            }
        }

        $data3 = [];
        if (mysqli_num_rows($result3) > 0) {
            while ($row = mysqli_fetch_assoc($result3)) {
                $data3[] = $row;
            }
        }

        $data4 = [];
        if (mysqli_num_rows($result4) > 0) {
            while ($row = mysqli_fetch_assoc($result4)) {
                $data4[] = $row;
            }
        }

        echo json_encode(["data" => $data, "data2" => $data2, "game" => $data3, "log" => $data4]);
        return;
    }

    mysqli_close($conn);
?>