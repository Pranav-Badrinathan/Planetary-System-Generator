import { generate } from "./generator.js";
import Two from "../libs/two.module.js";

var two;

$(function(){
	initTwo();

	update();

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
    two = new Two({ fullscreen: true, autostart: true }).appendTo(elem);

	generate(two);
}

function update(){
	window.requestAnimationFrame(update);

	$("path").css("stroke-width", "0");
}