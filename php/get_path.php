<?php
    $position_id = $_POST['position'];

    // Connexion à la base de données
    $conn = mysqli_connect("localhost", "root", "", "cosmail");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Fonction pour récupérer les liaisons à partir d'une position donnée
    function requet($conn, $position_id) {
        $id_liaison = [];
        $sql = "SELECT * FROM liaison WHERE from_emp = '$position_id' OR to_emp = '$position_id'";
        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $id_liaison[] = [$row['id_liaison'], $row['from_emp'], $row['to_emp'], $row['length']];
            }
        }
        return $id_liaison;
    }

    $id_liaisons = requet($conn, $position_id);

    // Retourner les liaisons en JSON
    echo json_encode($id_liaisons);

    mysqli_close($conn);
?>