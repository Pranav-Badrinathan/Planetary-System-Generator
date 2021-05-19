var two;

$(function(){
	initTwo();

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
	var height = $(document).height();
    var width = $(document).width();

    var elem = $("#mainDraw").get()[0];
    var params = {width, height};
    two = new Two(params).appendTo(elem);

	generate(two);
}