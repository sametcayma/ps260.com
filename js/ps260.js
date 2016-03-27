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

	var vjs = videojs("video-player", { fluid: true});

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
			$editorElement.hide();
			$editorElement.find("img").load(function(){
				$editorElement.fadeIn();
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

		var $videoContainer = $("#videos .thumbnail-wrapper");
		$videoContainer.empty();

		$.each(editors[name], function(index, json){
			var image = json.icon;
			if(isMobile){

			}

			var $videoElement = $('<div class="thumbnail grayscale"><img src="' + image + '"/><div class="thumbnail-description"><p class="name">' + json.name + '</p></div></div>');
			$videoElement.hide();
			$videoElement.find("img").load(function(){
				$videoElement.fadeIn();
			});
			$videoElement
				.click(function(){
					$(this).removeClass("grayscale");
					updateThumbnails($videoElement);

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
		thumbnails.each(function(){
			$thumbnail = $(this);
			if($thumbnail.hasClass("selected")){
				$thumnail.removeClass("selected");
				$thumbnail.addClass("grayscale");
			}
		});
	}
});