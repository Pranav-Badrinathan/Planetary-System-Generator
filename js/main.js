import { generate } from "./generator.js";
import Two from "../libs/two.module.js";

window.two;

$(function(){
	initTwo();

	//update();

	$("#gen").on("click", function(){
		//Todo: Read from a gen profile for the selected settings
		generate(two);
	});

	$("#genplus").on("click", function(){
		var paneVis = $("#optionPane").css("display");
		if (paneVis == "block") {paneVis = "none"; $("#genplus").text("+");}
		else {paneVis = "block"; $("#genplus").text("-");}

		$("#optionPane").css("display", paneVis);
	});
});

function initTwo(){
    var elem = $("#mainDraw").get()[0];
    window.two = new Two({ fullscreen: true, autostart: true }).appendTo(elem);

	generate();
}

// function update(){
// 	window.requestAnimationFrame(update);

// 	$("path").css("stroke-width", "0");
// }