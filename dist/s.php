<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <meta http-equiv="X-UA-Compatible" content="ie=edge">
 <title>Document</title>
</head>
<body>
<?php
	$shortURLkey;
	error_reporting(E_ALL);
	ini_set('display_errors', 1);

 include( $_SERVER['DOCUMENT_ROOT'] . '/connection.php' );

try {
	$shortURLkey = explode('/', $_SERVER['REQUEST_URI'])[2];
} catch(Exception $e) {
	echo $e->getMessage();	
		header('Location: /');

}


	$check = "SELECT * FROM URLs WHERE shortURL = (?)";
	$prepared_check = $conn->prepare($check);
	$prepared_check->bind_param('s', $shortURLkey);
	
if (strlen($shortURLkey) === 5) {
 $prepared_check->execute();
 $prepared_check->bind_result($shortURL, $longURL);
 
 if ($prepared_check->fetch())  {
   $prepared_check->close();
   header('Location: /' . $longURL);
  
  }  else {
			header('Location: /');
		}

} else {
 header('Location: /');
}





?> 
</body>
</html>




