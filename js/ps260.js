$(document).ready(function() {
	var interdubs = "https://www.interdubs.com/r/ps260/index.php?al=1RAeyt&json=1&";

	var vfx;

	var editors = new Array(); //[index, "name"]
	var editorVideos = new Object();//{"name", [index, video-json]]}
	var editorImages = new Object(); //{"name", "url"}

	var isMobile = false;
	var mobileWidth = 680; //Note: This number must match SCSS $phone-break-point
	var mobileMenuIsOpen = false;

	var scrollDuration = 800;

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

	//SETUP FOR CHECKING MOBILE
	$(window).resize(function(){
		if(mobileMenuIsOpen){
			$("#menu-button").click();
		}
		if($(window).width() <= mobileWidth){
			isMobile = true;
			interdubs = interdubs + "iconsizeindex=5" //Note: Smaller thumbnails for mobile
		} else {
			interdubs = interdubs + "iconsizeindex=108"
		}
	});

	$(window).resize();

	//VIDEO JS
	var vjs = videojs("video-player", 
		{ 
			fluid: true,
			autoplay: false
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

	//DESTOP NAVIGATION
	$("#mobile-nav-wrapper li a").each(function(index, element){
		$(element).click(function(e){
			e.preventDefault();
			var anchor = $(this).attr("href");
			$(window).scrollTo($("body").find(anchor), scrollDuration, 
				{ 
					offset: { top: -20, left: 0 },
					easing:'easeInOutQuart'
				}
			);
		});
	});

	$(".nav-wrapper a").each(function(index, element){
		$(element).click(function(e){
			e.preventDefault();
			var anchor = $(this).attr("href");
			$(window).scrollTo($("body").find(anchor), scrollDuration, 
				{ 
					offset: { top: -20, left: 0 },
					easing:'easeInOutQuart'
				}
			);		
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

	$.getJSON(interdubs, function(json){
		$.each(json.children, function(index, element){
			if(element.name != "Key Images"){
				var videos = new Array();
				$.each(element.children, function(index, child){
					videos.push(child);
				});

				editorVideos[element.name] = videos;

				editors.push(element.name)
			} else {
				$.each(element.children, function(index, child){
					editorImages[child.name] = child.icon;
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
				$(this).parent().animate({"opacity": 1});
			});
			$editorElement
				.click(function(e){
					e.preventDefault();

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
			var jsonName = json.name.split("\"");

			var brand = jsonName[0];
			var title = "\"" + jsonName[1] + "\"";
			var director = jsonName[2];

			if(director.toUpperCase().indexOf("DIRECTOR") < 0){
				director = "DIRECTOR: " + director.split(".")[1];
			}

			directorEle = "";
			if(director != undefined && director.toLowerCase().indexOf("undefined") < 0){
				directorEle = '<p class="director">' + director + '</p>';
			}

			var $videoElement = $('<div class="thumbnail grayscale"><img src="' + json.icon + '"/><div class="thumbnail-description"><p class="brand">' + brand + '</p><p class="title">' + title + '</p>' + directorEle +'</div></div>');
			$videoElement.css({"opacity": 0});
			$videoElement.find("img").load(function(){
				$(this).parent().animate({"opacity": 1});
			});
			$videoElement
				.click(function(e){
					e.preventDefault();

					$(this).removeClass("grayscale");
					$(this).find(".thumbnail-description").css({top: '50%', opacity: '1'});

					updateThumbnails($videoContainer);

					$(this).addClass("selected");
					handleVideoClick(json);
				})
				.mouseenter(function(){ 
					if(!$(this).hasClass("selected")) { 
						$(this).removeClass("grayscale");
						$(this).find(".thumbnail-description").stop().transition({top: '-=5%', opacity: '1'});
					}
				})
				.mouseleave(function(){ 
					if(!$(this).hasClass("selected")) { 
						$(this).addClass("grayscale");
						$(this).find(".thumbnail-description").stop().transition({top: '+=5%', opacity: '0'});
					} 
				});

			$videoContainer.append($videoElement);
		});

		$("#videos").fadeIn();
	}


	function handleVideoClick(json){
		$(window).scrollTo(0, 500, {"interrupt": !isMobile});

		$("#videos .video-title").html(json.name);
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