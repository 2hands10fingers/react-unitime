<?php
	
	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	include( $_SERVER['DOCUMENT_ROOT'] . '/connection.php' );
	$post_contents = file_get_contents("php://input");
	$post_vars = json_decode($post_contents, true);
	
	$longURL = $post_vars["shareArgs"];
	$shortURL = $post_vars["hash"];

	$check = "SELECT * FROM URLs WHERE shortURL = (?)";
	
	$prepared_check = $conn->prepare($check);
	$prepared_check->bind_param('s', $shortURL);
	$prepared_check->execute();
	$result = $prepared_check->fetch();
	
	
	if ($prepared_check->execute()) {
		
				$prepared_check->close();
		
		if ( $result == 1 ) {
	
				echo "DB VALUE " . $shortURL . " IS PRESENT";
	
			} else {

			$stmt_string = "INSERT INTO URLs (shortURL, longURL) VALUES (?, ?)";
			$stmt = $conn->prepare($stmt_string);
			
			if ($stmt === false): 
				echo $conn->error; 
			endif;
			
			$stmt->bind_param('ss', $shortURL, $longURL);

			
			$stmt->execute();
			
			if ( $stmt->execute() ) {
					echo "CONNECTION MADE";
					echo "\nSUBMITTED " . $shortURL . "  & " . $longURL;
					$stmt->close();
			} 

		}
	
	} else {
	
		echo $conn->error;
	}

  ?>