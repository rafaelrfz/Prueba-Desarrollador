<?php

    $name = $_POST['name'];
    $score = $_POST['score'];
    $level = $_POST['level'];

    $hostname="localhost";
	$username="root";
	$password="";
	$dbname="simon_books";
	$usertable="scores";

    // Create connection
    $conn = mysqli_connect($hostname, $username, $password, $dbname);
    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "INSERT INTO $usertable (name, score, level) VALUES ('$name', '$score', '$level')";

    if (mysqli_query($conn, $sql)) {
        echo json_encode('Registro insertado');
    } else {
        echo json_encode('Respondo negativo desde peticiones');
    }

    mysqli_close($conn);