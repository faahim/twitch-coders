$(document).ready( function() {
	var sources = ["monstercat"];
	 var sourcesBak = ["ESL_SC2", "OgamingSC2", "cretetion",
	 "freecodecamp", "habathcx", "RobotCaleb",
	 "noobs2ninjas", "noopkat", "dreamleague",
	 "throwdowntv", "Omgitsfirefoxx", "kindafunnygames",
	 "manvsgame", "trihex", "nightblue3", "kittyplays",
	 "open_mailbox", "danrovito", "handmade_hero",
	 "tsoding", "rw_grim", "daroou2", "nmarulo",
	 "mikeconley_dot_ca", "vinlam", "gaprogman",
	 "codedependant", "blocksandgold", "syntag",
	 "devwars", "krzjn", "drathy", 
	 "pajlada", "abnercoimbre", "automateallthethings", 
	 "loonygeekfun", "monstercat", "LOL"];
	var endPoint = "https://wind-bow.glitch.me/twitch-api/";
	var channelDataAPICall = endPoint+"channels/";
	var channelStreamAPICall = endPoint+"streams/";
	var currentChannel;
	var channelLogo;
	var isLive;
	var isSearch = "";

	function magic() {
		for (i=0; i < sources.length; i++) {
			channelDataAPICall = endPoint+"channels/"+sources[i];
			grabTwitcher();
		}
	}

	console.log(channelDataAPICall);

	function grabTwitcher() {
		$.ajax({
			url: channelDataAPICall,
			type: "GET",
			dataType: "jsonp",
			success: function(channelData) {
				currentChannel = channelData.name;
				if (currentChannel) {
					$.ajax({
						url: endPoint+"streams/"+currentChannel,
						type: "GET",
						dataType: "jsonp",
						success: function(streamData) {
							// console.log(streamData);
							if (channelData.logo !== null) {
								channelLogo = channelData.logo;
							} else {
								channelLogo = "img/thumb.png";
							}

							if (streamData.stream == null) {
								isLive = false;
							} else {
								isLive = true;
							}
							// console.log(isLive);

							if (isLive) {
								$(".channels").append(
								"<div class='card-container "+isSearch+"'><div class='card-online'><div class='channel-logo'><img src='"
								+channelLogo+"'></div><div class='channel-info'><a href='"+channelData.url+
								"' class='channel-name' target='_blank'>"+channelData.display_name+"</a><p class='stream-active'>"+
								"Online</p><p class='channel-status'><span>Now Playing: </span>"+streamData.stream.channel.status+"</p></div></div></div>"
								);
							} else {
								$(".channels").append(
								"<div class='card-container "+isSearch+"'><div class='card-offline'><div class='channel-logo'><img src='"
								+channelLogo+"'></div><div class='channel-info'><a href='"+channelData.url+
								"' class='channel-name' target='_blank'>"+channelData.display_name+"</a><p class='stream-inactive'>"+
								"Offline</p><p class='channel-status'>Last Status: "+channelData.status+"</p></div></div></div>"
								);
							}
						}
					})
				} else {
					$(".channels").append(
					"<div class='card-container "+isSearch+"'><div class='card'><p>This doesn't exits, You've found a black hole! ⚫⚫⚫</p></div></div>"
					);
				}
			}
		})
	}

	function search() {
		$("#channel-query").submit(function() {
			event.preventDefault();
			$(".card-container").fadeOut();
			var searchData = document.getElementById('search-string').value;
			channelDataAPICall = endPoint+"channels/"+searchData;
			console.log(channelDataAPICall);
			isSearch = "search-result";
			grabTwitcher();
		});
	}

		$(".all").click( function(){
			$(".switches").find("p").removeClass("active");
			$(".all").addClass("active");
			$(".search-result").remove();
			$(".notice").fadeOut();
			$(".card-container").fadeOut().delay(500).fadeIn();
		});

		$(".online").click( function(){
			$(".switches").find("p").removeClass("active");
			$(".online").addClass("active");
			$(".search-result").remove();
			$(".card-container, .notice").fadeOut().delay(500);
			var isAnyOnline = $(".card-online").length;
			if (isAnyOnline) {
				$(".card-online").parent().fadeIn();
			} else {
				$(".notice").text("Looks like the Earth is sleeping.😕 Alternatively, Please Make sure you're not on Mars!").fadeIn();
			}
		});

		$(".offline").click( function(){
			$(".switches").find("p").removeClass("active");
			$(".offline").addClass("active");
			$(".search-result").remove();
			$(".card-container, .notice").fadeOut().delay(500);
			var isAnyOffline = $(".card-offline").length;
			if (isAnyOffline) {
				$(".card-offline").parent().fadeIn();
			} else {
				$(".notice").text("The Earth is on fire! 😀 Go to Mars if you're searching for some place quite.").fadeIn();
			}
		});

	magic();
	search();
});