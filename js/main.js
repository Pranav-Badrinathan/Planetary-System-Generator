/// <reference path="../libs/two.js" />

$(function(){
    console.log("HI!");
    console.log($("#gen").text());

    var height = $(window).height();
    var width = $(window).width();

    var elem = $("#body").get();
    var params = {width, height};
    var two = Two(params).appendTo(elem);

    $("#gen").on("click", function(){
        var circle = two.makeCircle(innerWidth/2, innerHeight/2, 50);
        circle.fill = '#FF8000';
        two.update();
        console.log("MAKE CIRCLE");
    });
});