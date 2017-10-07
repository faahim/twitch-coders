$(document).ready( function() {
	var sources = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas", "noopkat"];
	var endPoint = "https://wind-bow.glitch.me/twitch-api/";
	var htmlCard = ""
								+"Channel Name"
								+"";

	function magic() {
		for (i=0; i < sources.length; i++) {
			var channelDataAPICall = endPoint+"channels/"+sources[i];
			console.log(channelDataAPICall);

			$.ajax({
				url: channelDataAPICall,
				type: "GET",
				dataType: "jsonp",
				success: function(channelData) {
					console.log(channelData);
					$(".channels").append(
						"<div class='card-container'><div class='card'><div class='channel-logo'><img src='"
						+channelData.logo+"'></div><div class='channel-info'><a href='"+channelData.url+
						"' class='channel-name' target='_blank'>"+channelData.display_name+"</a><p class='stream-status'>"+
						"Offline</p><p class='channel-status'>"+channelData.status+"</p></div></div></div>"
						);
				}
			})
		}
	}

	magic();
});