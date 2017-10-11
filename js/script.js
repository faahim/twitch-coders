$(document).ready( function() {

	//The list of channels username that'll be fetched
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

	var endPoint = "https://wind-bow.glitch.me/twitch-api/";
	var channelDataAPICall = endPoint+"channels/";
	var channelStreamAPICall = endPoint+"streams/";
	var currentChannel;
	var channelLogo;
	var isLive;
	var isSearch = "";
	var Timer;

	//Main function that calls the API to load all the channels from the list on the homepage
	function magic() {
		for (i=0; i < sources.length; i++) {
			channelDataAPICall = endPoint+"channels/"+sources[i];
			grabTwitcher();
		}
	}

	//Function to make the API calls
	function grabTwitcher() {
		$.ajax({
			//This URL varies depending on the functions that making the call
			url: channelDataAPICall,
			type: "GET",
			dataType: "jsonp",
			success: function(channelData) {
				currentChannel = channelData.name;

				//Checking if the channel exists
				if (currentChannel) {
					$.ajax({
						url: endPoint+"streams/"+currentChannel,
						type: "GET",
						dataType: "jsonp",
						success: function(streamData) {

							//Removing the loading message from DOM
							$(".loader").remove();

							//Checking if the channel have a logo
							if (channelData.logo !== null) {
								channelLogo = channelData.logo;
							} else {
								//Adding fallback thumbnail if the channel doesn't have a logo
								channelLogo = "img/thumb.png";
							}

							//Chechking weather the channel is Live or not
							if (streamData.stream == null) {
								isLive = false;
							} else {
								isLive = true;
							}

							//Removing error texts from previous actions
							$(".notice").fadeOut();
							$("footer").fadeIn().delay(2000);

							//Adding html to the DOM with different class depending on Online and Offline
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
					//Showing error messages if any channel is not found
					$(".notice").fadeOut();
					$(".channels").append(
					"<div class='card-container "+isSearch+" no-result'><div class='card'><p>Channel doesn't exits on Twitch, You've found a black hole! ⚫⚫⚫</p></div></div>"
					);
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				//Showing error messages if the API call fails
	      $(".loader").text("Failed to fetch data! 😟 Is your internet working?");
	    }
		})
	}

	//Search on Fly within the page
		$("#search-string").keyup(function() {
			//Making the function read values of input after 1 sec
			clearTimeout(Timer);
			Timer = setTimeout(getValue, 1000);
		})

		//Hacks to make the ":contains" method case insensitive.
		$.extend($.expr[":"], {
		"containsIN": function(elem, i, match, array) {
		return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
		}
		});

		//Retriving the value in live time as user types
		function getValue() {
			$(".card-container, .notice, .love").fadeOut();
			var onFlySearch = $("#search-string").val();
			var areYouThere = $(".card-container:containsIN('"+onFlySearch+"')");

			//Checking if a channel exists on the page.
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

	//Functions for Searching on Twitch
	function search() {
		//Retriving Value from the input element
		$("#channel-query").submit(function(e) {
			e.preventDefault();
			$(".card-container, .notice").fadeOut();
			$(".search-result").remove();
			var searchData = document.getElementById('search-string').value;
			channelDataAPICall = endPoint+"channels/"+searchData;
			//Adding a class for search result so that we can differentiate them from reguler cards
			isSearch = "search-result";
			//Calling the API function
			grabTwitcher();
		});
	}

		//Filtering the channels based on active switch
		$(".all").click( function(){
			$(".switches").find("p").removeClass("active");
			$(".all").addClass("active");
			$(".search-result").remove();
			$(".notice").fadeOut();
			$(".card-container, .love").fadeOut().delay(500).fadeIn();
		});

		$(".online").click( function(){
			$(".switches").find("p").removeClass("active");
			$(".online").addClass("active");
			$(".search-result").remove();
			$(".card-container, .notice, .love").fadeOut().delay(500);
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
			$(".card-container, .notice, .love").fadeOut().delay(500);
			var isAnyOffline = $(".card-offline").length;
			if (isAnyOffline) {
				$(".card-offline").parent().fadeIn();
			} else {
				$(".notice").text("The Earth is on fire! 😀 Go to Mars if you're searching for some place quite.").fadeIn();
			}
		});

	//Initiating the functions!
	magic();
	search();
});