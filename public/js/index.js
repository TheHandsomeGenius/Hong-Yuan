var colours = ["red","green","blue","pink","purple"];
var randPos = Math.floor(Math.random() * 5);
document.querySelector("a").style.color = colours[randPos];

if (document.body.clientWidth <= 768) {
 document.querySelector(".navbar-brand").style.marginRight = "0";
 document.querySelector(".navbar-brand").style.fontSize = "13px";

 if (window.location.pathname == "/") {
  document.querySelector(".carousel").style.marginTop = "16%";
  document.querySelector(".carouselPage3 h1").style.margin = "0 0 20px 10px";
  for (let i=0;i<document.querySelectorAll("td").length;i++) {
   document.querySelectorAll("td")[i].style.fontSize = "13px";
  };
  document.querySelector(".indexSecondDiv h1").style.fontSize = "2rem";
 };
};