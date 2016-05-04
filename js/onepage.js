/*
	App-like One Page Layout by jayjnu

	To apply one page layout to your web page,
	it is crucial to set key values of frame, container and sections.

	App-like One Page Layout provides active radio nav animation.
	To activate this feature, Create html elements in accordance with markup and style guides on README.md.
	After that, set radio and radioOn key values.
	
	{
		frame: "#id",
		container: "#id",
		sections: ".class",
		radio: "#id",
		radioOn: "#id",
		speed: 500,
		easing: "swing"
	}

*/

function startOnePage(myInput){
	'use strict';

	var settings = myInput;

	// input values
	var frame = $(settings.frame),
		container = $(settings.container),
		sections = $(settings.sections),
		speed = settings.speed || 500,
		radio = $(settings.radio),
		radioOn = $(settings.radioOn),
		easing = settings.easing || "swing";

	/* 
		Boolean values to enable/disable default scroll action
		linked to
			1) init()
			2) animateScr()
			3) scroll, keydown bound event handler
		default: true;
	*/
	var didScroll = true,
		isFocused = true;

	// common variables
	var height = $(window).height();

	// Index values for sections elements
	var totalSections = sections.length - 1;

	// currently displayed section number
	// modifying this variable will cause buggy behaviors.
	var num = 0; 

	// keyboard input values
	// add more if necessary
	var pressedKey = {};
		pressedKey[36] = "top"; // home
		pressedKey[38] = "up"; // upward arrow
		pressedKey[40] = "down"; // downward arrow
		pressedKey[33] = "up"; // page up
		pressedKey[34] = "down"; // page down
		pressedKey[35] = "bottom"; // end


	// init function to initialize/reassign values of the variables
	// to prevent section misplacement caused by a window resize.
	function init(){
		height = $(window).height();
		frame.css({"overflow":"hidden", "height": height + "px"});
		sections.css({"height": height + "px"});
		didScroll = true;
		isFocused = true;
		end = - height * ( totalSections );

		
		container.stop().animate({marginTop : 0}, 0, easing, function(){
			num = 0;
			didScroll = true;
			turnOnRadio(0, 0);
		});
	}
	// event binding to init function
	$(window).bind("load resize", init);
	

	// animate scrolling effect
	var now, end;
	function animateScr(moveTo, duration, distance){
		var top;
		duration = duration || speed;
		switch(moveTo){
			case "down":
				top = "-=" + ( height * distance ) + "px";
				num += distance;
				break;
			case "up":
				top = "+=" + ( height * distance ) + "px";
				num -= distance;
				break;
			case "bottom":
				top = end;
				num = totalSections;
				break;
			case "top":
				top = 0;
				num = 0;
				break;
			default: console.log("(error) wrong argument passed"); return false;
		}

		container.not(":animated").animate({marginTop : top}, duration, easing, function(){
			didScroll = true;
		});

		if(radio){turnOnRadio(num, speed);}
	}

	// show active radio button
	function turnOnRadio(index, duration){
		duration = duration || speed;
		radioOn.stop().animate({"top": index * radioOn.outerHeight( true )+ "px"}, speed, easing);
	}

	radio.children("li:not(" + settings.radioOn + ")").click(function(){
		var to = $(this).index();
		var dif = Math.abs( num - to );

		if(num < to){
			animateScr("down", speed, dif);
		}else if(num > to){
			animateScr("up", speed, dif);
		}
	});

	/*	
		1. get a type of event and handle accordingly
		2. enable/disable default keyboard behavior
	*/
	$(document).bind("DOMMouseScroll mousewheel keydown", function(e){
		var eType = e.type;

		now = parseInt( container.css("marginTop") );
		end = - height * ( totalSections );

		// handles the event
		if( didScroll && isFocused ){
			// prevent multiple event handling
			didScroll = false;

			// on wheel
			if( eType == "DOMMouseScroll" || eType == "mousewheel" ){

				var mvmt = e.originalEvent.wheelDelta;
				if(!mvmt){ mvmt = -e.originalEvent.detail; }

				// 휠로 스크롤을 올렸을때
				if(mvmt > 0){
					//만약 첫번째 영역이라면
					if( now == 0){
						didScroll = true;
					}else{
						animateScr("up", 500, 1);
					}
				}else if(mvmt < 0){
					//만약 마지막 영역이라면
					if( now == end ){
						didScroll = true;
					}else{
						animateScr("down", 500, 1);
					}
				}else{
					didScroll = true; 
				}
			}
			// on keydown
			else if( eType == "keydown" ){
				// 위아래로 움직이는 키를 눌렀을 때 발동
				if( pressedKey[e.which] ){
					e.preventDefault();
					if( pressedKey[e.which] == "up" ){
						// 만약 첫번째 영역이라면
						if( now == 0 ){
							animateScr("bottom");
						}else{
							animateScr("up", speed, 1);
						}
					}else if( pressedKey[e.which]  == "down" ){
						//만약 마지막 영역이라면 첫번째 화면으로 가기
						if( now == end ){
							animateScr("top");
						}else{
							animateScr("down", speed, 1);
						}
					}else{
						// page down 또는 page up일 때
						animateScr( pressedKey[e.which] );
					}
				}else{
					didScroll = true;
				}
			}
		}

		// enable default keyboard behavior when an input or textarea is being focused
		$("input, textarea").focus(function(){isFocused = false;})
							.blur(function(){isFocused = true;});
	});

}