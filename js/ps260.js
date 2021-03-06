$(document).ready(function() {	
	var interdubs = "https://www.interdubs.com/r/ps260/index.php?al=1RAeyt&json=1&allchars=1&";

	var vfx;

	var editors = new Array(); //[index, "name"]

	var editorVideos = new Object();//{"editor_name", [index, video-json]]}
	var editorAdditionalVideos = new Object();//{"editor_name", {"folder_name", [index, video-json]}]}
	var editorImages = new Object(); //{"editor_name", "url"}

	var splashHidden = false;
	var isMobile = false;
	var mobileWidth = 680; //Note: This number must match SCSS $phone-break-point
	var mobileMenuIsOpen = false;

	var scrollDuration = 800;

	//SURVEY
	//Set the preceeding <p> as the name of the input
	$('#survey form div').each(function(){
		$question = $(this).find('p').text();
		$input = $(this).find('input');
		$input.attr('name', encodeURIComponent($question));
	});

	//FONT
	try {
		Typekit.load({ async: true });
	} catch(e) {}

	//EASING FOR SCROLLING
	$.easing.easeInOutExpo = function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	};

	$.easing.easeInOutQuart = function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	};

	//SPLASH
	$(".splash-logo").click(function(e){
		e.preventDefault();
		splashHidden = true
		$("#splash").transition({ opacity: 0 }, function(){
			$("#splash").css({display: "none" });
		});
	});
	
	//MOBILE TWEAKS
	if(isMobile){
		splashHidden = true;
		$("#splash").hide();
	}

	//SETUP FOR CHECKING MOBILE
	$(window).resize(function(){
		if(mobileMenuIsOpen){
			$("#menu-button").click();
		}
		if($(window).width() <= mobileWidth){
			isMobile = true;
			if(!splashHidden) {
				$("#splash").hide();
			}
			interdubs = interdubs + "iconsizeindex=5" //Note: Smaller thumbnails for mobile
		} else {
			if(!splashHidden){		
				$("#splash").show();
			}
			interdubs = interdubs + "iconsizeindex=108"
		}
	});

	$(window).resize();

	//PHONE LINKS
	if(isMobile){
		$(".number").each(function(){
			var number = $(this).text();

			$(this).html('<a href="tel:+1' + number.replace(/\s/g, "") + '">' + number + '</a>');
		});
	}

	//VIDEO JS
	var vjs = videojs("video-player", 
		{
			autoplay: false,
			preload: false	
		}
	);

	//MOBILE NAVIGATION
	$("#menu-button").click(function(e){
		e.preventDefault();
		if(mobileMenuIsOpen){
			$(this).stop().transition({ rotate: '270deg'}, 500, 'cubic-bezier(0,0.9,0.3,1)');
		} else {
			$(this).stop().transition({ rotate: '-45deg'}, 500, 'cubic-bezier(0,0.9,0.3,1)');
		}

		$("#mobile-nav-wrapper").stop().fadeToggle();
		mobileMenuIsOpen = !mobileMenuIsOpen;
	});

	$("#mobile-nav-wrapper li a").each(function(index, element){
		$(element).click(function(e){
			e.preventDefault();

			setTimeout(function(){
				$("#menu-button").click();
			}, 300);

			var anchor = $(this).attr("href");
			if(anchor == "#survey"){
				var $overlay = $('#overlay');
				var $surveyBackground = $('#survey-background');
				var $surveyWrapper = $('#survey-wrapper');

				$overlay.show();
				$surveyWrapper.show();

				$overlay.stop().transition({"opacity" : 1 });
				$surveyWrapper.stop().transition({"opacity" : 1 }, function(){});

				$surveyBackground.click(function(e){
					e.preventDefault();
					$surveyWrapper.css({"opacity" : 0});
					$surveyWrapper.hide();

					$overlay.stop().transition({"opacity" : 0 }, function(){
						$overlay.hide();
						$overlay.css({"opacity" : 0});
					});
				});
			} else {
				$(window).scrollTo($("body").find(anchor), scrollDuration, 
					{ 
						offset: { top: -20, left: 0 },
					}
				);		
			}
		});
	});

	//DESTOP NAVIGATION
	$(".nav-wrapper a").each(function(index, element){
		$(element).click(function(e){
			e.preventDefault();

			var anchor = $(this).attr("href");
			if(anchor == "#survey"){
				var $overlay = $('#overlay');
				var $surveyBackground = $('#survey-background');
				var $surveyWrapper = $('#survey-wrapper');

				$overlay.show();
				$surveyWrapper.show();

				$overlay.stop().transition({"opacity" : 1 });
				$surveyWrapper.stop().transition({"opacity" : 1 }, function(){});

				$surveyBackground.click(function(e){
					e.preventDefault();
					$surveyWrapper.css({"opacity" : 0});
					$surveyWrapper.hide();

					$overlay.stop().transition({"opacity" : 0 }, function(){
						$overlay.hide();
						$overlay.css({"opacity" : 0});
					});
				});
			} else {
				$(window).scrollTo($("body").find(anchor), scrollDuration, 
					{ 
						offset: { top: -20, left: 0 },
					}
				);		
			}
		});
	});

	//SCROLL TO TOP BUTTON
	$("#scroll-to-top").click(function(e){
		e.preventDefault();
		$(window).scrollTo(0, scrollDuration, {easing:'easeInOutQuart'});
	});

	$(window).scroll(function(){
		if($(window).scrollTop() == 0){
			$("#scroll-to-top").stop().fadeOut();
		} else {
			$("#scroll-to-top").stop().fadeIn();
		}
	});

	//BACK BUTTON RESET
	$(window).on('hashchange', function() {
		$('#videos').hide();
		$(window).scrollTo(0, scrollDuration, {easing:'easeInOutQuart'});
	});

	//DATA LOADING
	$.getJSON(interdubs, function(json){
		$.each(json.children, function(index, element){
			if(element.name != "Key Images"){
				var videos = new Array();
				var folders = new Object();
				$.each(element.children, function(index, child){
					if(child.type == "directory"){
						var folderVideos = new Array();
						$.each(child.children, function(index, subchild){
							folderVideos.push(subchild);
						});

						folders[child.name] = folderVideos;

					} else {
						videos.push(child);
					}
				});

				editorVideos[element.name] = videos;
				editorAdditionalVideos[element.name] = folders;
				editors.push(element.name)
			} else {
				$.each(element.children, function(index, child){
					if(child.type == "file"){
						editorImages[child.name] = child.icon;
					}
				});
			}
		});

		parseEditors();
	});

	function parseEditors(){

		editors.sort(function(a, b){
			var aLast = a.toLowerCase().split(" ")[1];
			var bLast = b.toLowerCase().split(" ")[1];

			if(a.toLowerCase().indexOf("vfx") > -1 || aLast == undefined) return 0;
			if(b.toLowerCase().indexOf("vfx") > -1 || bLast == undefined) return 0;

			return (aLast < bLast) ? -1 : (aLast > bLast) ? 1 : 0;
		});

		var $editorsContainer = $("#editors .thumbnail-wrapper");

		for (var i = 0; i < editors.length; i++) {
			var editor = editors[i];
			var image = editorImages[editor];
			if(image == undefined){
				image = "assets/blank.jpg"
			} 
			var $editorElement = $('<div class="thumbnail grayscale" data-editor-index="' + i + '"><img src="' + image +'"/><div class="thumbnail-description"><p class="name">'+ editor +'</p></div></div>');
			$editorElement.css({"opacity":0});
			$editorElement.find("img").load(function(){
				if(!isMobile){
					$(this).parent().animate({"opacity": 1});
				} else {
					$(this).parent().css({"opacity": 1});
				}
			});
			$editorElement
				.click(function(e){
					e.preventDefault();

					if(window.location.href.indexOf("#") == -1){
						history.pushState(null, null, '#');
					}

					$(this).removeClass("grayscale");
					updateThumbnails($editorsContainer);

					$(this).addClass("selected");
					handleEditorClick($(this).attr("data-editor-index"));
				})
				.mouseenter(function(){ $(this).removeClass("grayscale"); })
				.mouseleave(function(){ 
					if(!$(this).hasClass("selected")) { 
						$(this).addClass("grayscale");
					} 
				});

			$editorsContainer.append($editorElement); 
		}
	};

	function handleEditorClick(editorIndex){
		var editor = editors[editorIndex];

		parseVideos(editor);

		$("#videos .editor-name").html(editor);

		$("#videos .thumbnail:first-child").click();
	}

	function parseVideos(editor){
		var $videoContainer = $("#videos .thumbnail-wrapper");
		$videoContainer.empty();

		$.each(editorVideos[editor], function(index, json){ 
			parseVideoJson(json, $videoContainer);
		});

		var folders = editorAdditionalVideos[editor];
		for (var name in folders) {
			var videoArray = folders[name];
	
			var randomIndex = Math.round((videoArray.length - 1) * Math.random());
			var randomJson = videoArray[randomIndex];

			$videoContainer.append(createVideoElement(randomJson.icon, name, "", "", function(e){
				e.preventDefault();

				var thumbIndex = $(this).index() - 1;
				$(this).remove();

				$.each(editorAdditionalVideos[editor][name], function(index, json){ 
					parseVideoJson(json, $videoContainer, thumbIndex);
				});
			}));
		}

		if(editorVideos[editor].length == 1){
			$videoContainer.hide();
		} else {
			$videoContainer.show();
		}

		$("#videos").fadeIn();
	}

	function parseVideoJson(json, container, atIndex){
		var jsonName = json.name.split("\"");

		var brand = jsonName[0];
		var title = "\"" + jsonName[1] + "\"";
		var director = jsonName[2];

		if(brand.indexOf("*") > -1){
			brand = brand.split("*")[1];
		}

		titleEle = "";
		if(title != null && title != "" && title != undefined && title.toLowerCase().indexOf("undefined") < 0){
			titleEle = '<p class="title">' + title + '</p>';
		}
		
		directorEle = "";
		if(director != null && director != "" && director !== undefined && director.toLowerCase().indexOf("undefined") < 0){
			if(director.toUpperCase().indexOf("DIRECTOR") < 0){
				director = "DIRECTOR: " + director.split(".")[1];
			}
			directorEle = '<p class="director">' + director + '</p>';
		}

		var videoElement = createVideoElement(json.icon, brand, titleEle, directorEle, function(e){
			e.preventDefault();

			$(this).removeClass("grayscale");

			updateThumbnails(container);

			$(this).addClass("selected");
			handleVideoClick(json);
		});

		if(atIndex != null){
			$(container.children()[atIndex]).after(videoElement);
		} else {
			container.append(videoElement);
		}
	}

	function createVideoElement(icon, brand, titleEle, directorEle, onClick){
		var $videoElement = $('<div class="thumbnail grayscale"><img src="' + icon + '"/><div class="thumbnail-description"><p class="brand">' + brand + '</p>' + titleEle + directorEle +'</div></div>');


		$videoElement.css({"opacity": 0});
		$videoElement.find("img").load(function(){
			if(!isMobile){
				$(this).parent().animate({"opacity": 1});
			} else {
				$(this).parent().css({"opacity": 1});
			}
		});
		$videoElement
			.click(onClick)
			.mouseenter(function(){ 
				if(!$(this).hasClass("selected")) { 
					$(this).removeClass("grayscale");
					//$(this).find(".thumbnail-description").stop().animate({opacity: '1'});
				}
			})
			.mouseleave(function(){ 
				if(!$(this).hasClass("selected")) { 
					$(this).addClass("grayscale");
					//$(this).find(".thumbnail-description").stop().animate({opacity: '0'});
				} 
			});

		return $videoElement;
	}


	function handleVideoClick(json){
		$(window).scrollTo(0, 500, {"interrupt": !isMobile});

		var brandAndTitle = json.name.split("-")[0];

		$("#videos .video-title").html(brandAndTitle.toUpperCase());
		vjs.poster(json.icon);
		vjs.src({ type: "video/mp4", src: json.url});
	}

	function updateThumbnails(thumbnails){
		thumbnails.children().each(function(){
			$thumbnail = $(this);
			if($thumbnail.hasClass("selected")){
				$thumbnail.removeClass("selected");
				$thumbnail.addClass("grayscale");
			}
		});
	}
});
