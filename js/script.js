$(document).ready( function() {
	 var sources = ["esl_sc2", "ogamingsc2", "cretetion",
	 "freecodecamp", "habathcx", "robotcaleb",
	 "noobs2ninjas", "noopkat", "dreamleague",
	 "throwdowntv", "omgitsfirefoxx", "kindafunnygames",
	 "manvsgame", "trihex", "nightblue3", "kittyplays",
	 "open_mailbox", "danrovito", "handmade_hero",
	 "tsoding", "rw_grim", "daroou2", "nmarulo",
	 "mikeconley_dot_ca", "vinlam", "gaprogman",
	 "codedependant", "blocksandgold", "syntag",
	 "devwars", "krzjn", "drathy", 
	 "pajlada", "abnercoimbre", "automateallthethings", 
	 "loonygeekfun", "monstercat"];
	 console.log(sources.length);
	var endPoint = "https://wind-bow.glitch.me/twitch-api/";
	var channelDataAPICall = endPoint+"channels/";
	var channelStreamAPICall = endPoint+"streams/";
	var currentChannel;
	var channelLogo;
	var isLive;
	var isSearch = "";
	var Timer;

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
							$(".loader").remove();

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
							$(".notice").fadeOut();

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
					$(".notice").fadeOut();
					$(".channels").append(
					"<div class='card-container "+isSearch+" no-result'><div class='card'><p>Channel doesn't exits on Twitch, You've found a black hole! ⚫⚫⚫</p></div></div>"
					);
				}
			}
		})
	}

	function search() {
		$("#channel-query").submit(function() {
			event.preventDefault();
			$(".card-container, .notice").fadeOut();
			$(".search-result").remove();
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

		//Search on Fly

		$("#search-string").keyup(function() {
			clearTimeout(Timer);
			Timer = setTimeout(getValue, 1000);
		})

		$.extend($.expr[":"], {
		"containsIN": function(elem, i, match, array) {
		return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
		}
		});

		function getValue() {
			$(".card-container, .notice").fadeOut();
			// $(".search-result").remove();
			var onFlySearch = $("#search-string").val();
			var areYouThere = $(".card-container:containsIN('"+onFlySearch+"')");
			console.log(areYouThere.length);

			if (areYouThere.length >= sources.length) {
				$(".card-container, .notice").fadeOut().delay(400);
				$(".search-result").remove();
				$(".card-container:containsIN('"+onFlySearch+"')").fadeIn();
			} else if (areYouThere.length > 0) {
				$(".card-container, .notice").fadeOut().delay(400);
				$(".card-container:containsIN('"+onFlySearch+"')").fadeIn();
			} else {
				$(".card-container, .notice").fadeOut().delay(400);
				$(".no-result").fadeIn().delay(600);
				$(".notice").text("S/he isn't here 😿 Press Enter to search on Twitch!").fadeIn();
			}
		}

	magic();
	search();
});