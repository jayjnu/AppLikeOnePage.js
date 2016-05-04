'use strict';
// default
var didScroll = true;
var isFocused = true;
var height = $(window).height();

function init(){
	height = $(window).height();
	$("#view").css({"overflow":"hidden", "height": height + "px"});
	$(".op-section").css({"height": height + "px"});
	didScroll = true;
	isFocused = true;
	animateScr("top");
}

$(window).bind("load resize", init);

function animateScr(moveTo){
	
	if(moveTo == "down"){
		$("#film").not(":animated").animate({marginTop : "-=" + height + "px"}, 500, "swing", function(){ didScroll = true; });
	}else if( moveTo == "up" ){
		$("#film").not(":animated").animate({marginTop : "+=" + height + "px"}, 500, "swing", function(){ didScroll = true; });
	}else if( moveTo == "bottom" ){
		$("#film").not(":animated").animate({marginTop : -height * ($(".op-section").length -1) + "px"}, 500, "swing", function(){ didScroll = true; });
	}else if(moveTo == "top"){
		$("#film").not(":animated").animate({marginTop: 0}, 500, "swing", function(){ didScroll = true; });
	}
}

$(document).bind("DOMMouseScroll mousewheel keydown", function(e){
	var eType = e.type;
	var pressedKey = {};
		pressedKey[38] = "up"; // upward arrow
		pressedKey[40] = "down"; // downward arrow
		pressedKey[33] = "up"; // page up
		pressedKey[34] = "down"; // page down
		pressedKey[35] = "bottom"; // end

	var now = parseInt( $("#film").css("marginTop") );
	var end = -$(window).height() * ($(".op-section").length -1);

	// didScroll이 true일때만 실행
	if( didScroll && isFocused ){
		// 휠 블락
		didScroll = false;

		// 마우스 휠 일때
		if( eType == "DOMMouseScroll" || eType == "mousewheel" ){
			var mvmt = e.originalEvent.wheelDelta;
			
			// 휠로 스크롤을 올렸을때
			if(mvmt > 0){
				//만약 첫번째 영역이라면
				if( now == 0){
					animateScr("bottom");
				}else{
					animateScr("up");
				}
			}else{
				//만약 마지막 영역이라면
				if( now == end ){
					animateScr("top");
				}else{
					animateScr("down");
				}
			}
		}
		// 키를 눌렀을 때
		else if( eType == "keydown" ){
			// 위아래로 움직이는 키를 눌렀을 때 발동
			if( pressedKey[e.which] ){
				if( pressedKey[e.which] == "up" ){
					// 만약 첫번째 영역이라면
					if( now == 0 ){
						animateScr("bottom");
					}else{
						animateScr("up");
					}
				}else if( pressedKey[e.which]  == "down" ){
					if( now == end ){
						animateScr("top");
					}else{
						animateScr("down");
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

	// 입력부분에 글을 쓸때는 키보드 기능 먹히도록 하기
	$("input, textarea").focus(function(){isFocused = false;})
						.blur(function(){isFocused = true;});
});