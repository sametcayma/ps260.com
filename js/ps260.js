/* 
backend: https://www.interdubs.com/r/ps260/index.php?al=1RAeyt&json=1&iconsizeindex=4
output: 
{
"type": "directory",
"name": "Editors",
"children": [{
	"type": "directory",
	"name": "Adam Epstein",
	"children": 	[{
		"type": "file",
		"name": "SNL \"The Day Beyonc   Turned Black\" - Dir. Rhys Thomas",
		"url": "https://www.interdubs.com/r/ps260/filfo/47/88/64788/SNL_TheDayBeyonce_1.mp4",
		"icon": "https://www.interdubs.com//r/ps260/ic3/47/88/14586786158557.jpg"

large icon: xxl_<filename>
*/

//download json
//parse json
//show editor images

//click editor image
//clear video and thumbs
//parse json
//load video
//load icons

//click icon
//load video

$(document).ready(function() {
	var interdubs = "https://www.interdubs.com/r/ps260/index.php?al=1RAeyt&json=1&iconsizeindex=7";
	var local = "js/editors.json";

	var editors = new Object();//editors["name", [index, video-json]]
	var editorImages = new Object();

	var isMobile = false;
	var mobileMenuIsOpen = false;

	//VIDEO JS
	var vjs = videojs("video-player", { fluid: true});

	//MOBILE MENU
	$("#menu-button").click(function(){
		if(mobileMenuIsOpen){
			$(this).stop().transition({ rotate: '270deg'}, 500, 'cubic-bezier(0,0.9,0.3,1)');
		} else {
			$(this).stop().transition({ rotate: '-45deg'}, 500, 'cubic-bezier(0,0.9,0.3,1)');
		}

		$("#mobile-nav-wrapper").stop().fadeToggle();
		mobileMenuIsOpen = !mobileMenuIsOpen;
	});

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
					editorImages[child.name] = child.url;
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
				image = "assets/smalllogo.jpg"
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
		handleVideoClick(editors[name][0]); //play the first video
	}


	function handleVideoClick(json){
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