$(function(){

    $.get("http://localhost:8080/bike", function(data, status){
        console.log(data);
        console.log(status);
    });

console.log("aaa");
});