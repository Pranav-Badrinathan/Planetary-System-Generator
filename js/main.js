var two;

$(function(){
	initTwo();
	$("#gen").on("click", function(){
		generate(two);
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