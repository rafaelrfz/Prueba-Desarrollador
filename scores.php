<?php
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

    $sql = "SELECT * FROM $usertable order by id desc limit 5";

    $resultset = mysqli_query($conn, $sql) or die("database error:". mysqli_error($conn));
    
    /*if ($resultado = mysqli_query($conn, $sql)) {

        /* obtener array asociativo 
        while ($row = mysqli_fetch_assoc($resultado)) {
            printf ("%s (%s)\n", $row["name"], $row["score"]);
        }
    
        /* liberar el conjunto de resultados 
        mysqli_free_result($resultado);
    }*/


    $data = array();
	while( $rows = mysqli_fetch_assoc($resultset) ) {
		$data[] = $rows;
	}
	echo json_encode($data);
    
    mysqli_close($conn);