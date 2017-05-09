<?php
	if(isset($_POST["submit"])){		
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
		$headers .= "From: survey <survey@ps260.com>" . "\r\n";

		$to_email = "erin@ps260, natalie@ps260.com, jonathan@ps260.com";
		$subject = "[ps260.com] New Survey Submitted!";

		$message = "<html><head></head><body>";

		foreach ($_POST as $param_name => $param_val) {
			if($param_name != "submit"){
				$param_name = str_replace("_", ".", $param_name);
    			$message .= "<p><b>" . rawurldecode($param_name) . "</b><br /><i>$param_val<i></p>";
    		}
		}

		$message .= "</body></html>";

		mail($to_email, $subject, $message, $headers);

		header("Location: http://www.ps260.com/index.html");
	}
?>