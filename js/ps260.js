$(document).ready(function() {
	var interdubs = "https://www.interdubs.com/r/ps260/index.php?al=1RAeyt&json=1&";

	var editors = new Object();//editors["name", [index, video-json]]
	var editorImages = new Object();

	var isMobile = false;
	var mobileWidth = 680; //Note: This number must match SCSS $phone-break-point
	var mobileMenuIsOpen = false;

	if($(window).width() <= mobileWidth){
		isMobile = true;
		interdubs = interdubs + "iconsizeindex=5" //Note: Smaller thumbnails for mobile
	} else {
		interdubs = interdubs + "iconsizeindex=7"
	}

	//VIDEO JS
	var vjs = videojs("video-player", 
		{ 
			fluid: true,
			autoplay: isMobile
		}
	);

	//MOBILE
	if(isMobile){
		$("#menu-button").click(function(){
			if(mobileMenuIsOpen){
				$(this).stop().transition({ rotate: '270deg'}, 500, 'cubic-bezier(0,0.9,0.3,1)');
			} else {
				$(this).stop().transition({ rotate: '-45deg'}, 500, 'cubic-bezier(0,0.9,0.3,1)');
			}

			$("#mobile-nav-wrapper").stop().fadeToggle();
			mobileMenuIsOpen = !mobileMenuIsOpen;
		});

		$("#scroll-to-top").click(function(){
			$(window).scrollTo(0, 500, {"interrupt": !isMobile});
		});

		$(window).scroll(function(){
			if($(window).scrollTop() == 0){
				$("#scroll-to-top").stop().fadeOut();
			} else {
				$("#scroll-to-top").stop().fadeIn();
			}
		});
	}

	$.getJSON(interdubs, function(json){
		$.each(json.children, function(index, element){
			if(element.name != "Key Images"){
				var videos = new Array();
				$.each(element.children, function(index, child){
					videos.push(child);
				});

				editors[element.name] = videos;
			} else {
				$.each(element.children, function(index, child){
					editorImages[child.name] = child.icon;
				});
			}
		});

		parseEditors();
	});

	function parseEditors(){

		var $editorsContainer = $("#editors .thumbnail-wrapper");

		$.each(editors, function(editor, videos){
			var image = editorImages[editor];
			if(image == undefined){
				image = "assets/blank.jpg"
			} 
			var $editorElement = $('<div class="thumbnail grayscale"><img src="' + image +'"/><div class="thumbnail-description"><p class="name">'+ editor +'</p></div></div>');
			$editorElement.css({"opacity":0});
			$editorElement.find("img").load(function(){
				$(this).parent().animate({"opacity": 1});
			});
			$editorElement
				.click(function(){
					$(this).removeClass("grayscale");
					updateThumbnails($editorsContainer);

					$(this).addClass("selected");
					handleEditorClick(editor);
				})
				.mouseenter(function(){ $(this).removeClass("grayscale"); })
				.mouseleave(function(){ 
					if(!$(this).hasClass("selected")) { 
						$(this).addClass("grayscale");
					} 
				});

			$($editorsContainer).append($editorElement);
		});
	};

	function handleEditorClick(name){

		$("#videos").fadeIn();

		var $videoContainer = $("#videos .thumbnail-wrapper");
		$videoContainer.empty();

		$.each(editors[name], function(index, json){
			var image = json.icon;
			if(isMobile){

			}

			var $videoElement = $('<div class="thumbnail grayscale"><img src="' + image + '"/><div class="thumbnail-description"><p class="name">' + json.name + '</p></div></div>');
			$videoElement.css({"opacity": 0});
			$videoElement.find("img").load(function(){
				$(this).parent().animate({"opacity": 1});
			});
			$videoElement
				.click(function(){
					$(this).removeClass("grayscale");
					updateThumbnails($videoContainer);

					$(this).addClass("selected");
					handleVideoClick(json);
				})
				.mouseenter(function(){ $(this).removeClass("grayscale");})
				.mouseleave(function(){ 
					if(!$(this).hasClass("selected")) { 
						$(this).addClass("grayscale");
					} 
				});

			$videoContainer.append($videoElement);
		});

		$("#videos .editor-name").html(name);

		$("#videos .thumbnail:first-child").click();
	}


	function handleVideoClick(json){
		$(window).scrollTo(0, 500, {"interrupt": !isMobile});

		$("#videos .video-title").html(json.name);
		vjs.src({ type: "video/mp4", src: json.url});
		vjs.play();
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