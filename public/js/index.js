var colours = ["red","green","blue","pink","purple"];
var randPos = Math.floor(Math.random() * 5);
document.querySelector("a").style.color = colours[randPos];

if (document.body.clientWidth <= 768) {
 document.querySelector(".navbar-brand").style.marginRight = "0";
 document.querySelector(".navbar-brand").style.fontSize = "13px";
};