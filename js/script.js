$(document).ready( function() {
	var sources = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas", "noopkat", "dreamleague", "throwdowntv", "Omgitsfirefoxx", "kindafunnygames", "manvsgame", "trihex", "nightblue3", "kittyplays", "open_mailbox", "danrovito", "handmade_hero", "tsoding", "rw_grim", "daroou2", "nmarulo", "mikeconley_dot_ca", "vinlam", "gaprogman", "codedependant", "blocksandgold", "syntag", "devwars", "krzjn", "drathy", "pajlada", "abnercoimbre", "automateallthethings", "loonygeekfun"];
	var endPoint = "https://wind-bow.glitch.me/twitch-api/";
	var channelDataAPICall = endPoint+"channels/";
	var channelStreamAPICall = endPoint+"streams/";
	var currentChannel;
	var isLive;

	function magic() {
		for (i=0; i < sources.length; i++) {
			channelDataAPICall = endPoint+"channels/"+sources[i];

			$.ajax({
				url: channelDataAPICall,
				type: "GET",
				dataType: "jsonp",
				success: function(channelData) {
					currentChannel = channelData.name;
					console.log(channelData);
					$.ajax({
						url: endPoint+"streams/"+currentChannel,
						type: "GET",
						dataType: "jsonp",
						success: function(streamData) {
							console.log(streamData);
							if (streamData.stream == null) {
								isLive = false;
							} else {
								isLive = true;
							}
							console.log(isLive);

							if (isLive) {
								$(".channels").append(
								"<div class='card-container'><div class='card-online'><div class='channel-logo'><img src='"
								+channelData.logo+"'></div><div class='channel-info'><a href='"+channelData.url+
								"' class='channel-name' target='_blank'>"+channelData.display_name+"</a><p class='stream-active'>"+
								"Online</p><p class='channel-status'><span>Now Playing: </span>"+streamData.stream.channel.status+"</p></div></div></div>"
								);
							} else {
								$(".channels").append(
								"<div class='card-container'><div class='card-offline'><div class='channel-logo'><img src='"
								+channelData.logo+"'></div><div class='channel-info'><a href='"+channelData.url+
								"' class='channel-name' target='_blank'>"+channelData.display_name+"</a><p class='stream-inactive'>"+
								"Offline</p><p class='channel-status'>Last Status: "+channelData.status+"</p></div></div></div>"
								);
							}
						}
					})
				}
			})
		}
	}

		$(".all").click( function(){
			$(".switches").find("p").removeClass("active");
			$(".all").addClass("active");
			$(".card-container").fadeOut().delay(500).fadeIn();
		});

		$(".online").click( function(){
			$(".switches").find("p").removeClass("active");
			$(".online").addClass("active");
			$(".card-container").fadeOut().delay(500);
			$(".card-online").parent().fadeIn();
		});

		$(".offline").click( function(){
			$(".switches").find("p").removeClass("active");
			$(".offline").addClass("active");
			$(".card-container").fadeOut().delay(500);
			$(".card-offline").parent().fadeIn();
		});

	magic();
});