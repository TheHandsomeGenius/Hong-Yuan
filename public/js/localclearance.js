var colours = ["red","green","blue","pink","purple"];
var randPos = Math.floor(Math.random() * 5);
document.querySelector("a").style.color = colours[randPos];

if (document.body.clientWidth <= 768) {
 document.querySelector(".navbar-brand").style.marginRight = "0";
 document.querySelector(".navbar-brand").style.fontSize = "13px";
 document.querySelectorAll(".p-5")[1].classList.remove("p-5");
};

/* functions */

function setAttr(selector,toChange,changeTo) {
 document.querySelector(selector).setAttribute(toChange,changeTo);
};

function checkEmptyWeight() {
 var empty=false;
 for (let i=0; i<document.querySelectorAll("input[name='pkgWeight']").length; i++) {
  if (document.querySelectorAll("input[name='pkgWeight']")[i].value == '') {
   empty=true;
  };
 };
 if (empty === false) {
  document.querySelector("input[name='tWeight']").removeAttribute("required");
 } else if (empty===true) {
  setAttr("input[name='tWeight']","required",true);
 };
}

function checkEmptyDim() {
 var empty=false;
 var pkgLBHAll=document.querySelectorAll("input[name='pkgLBH']");
 var count=0
 for (let i=0; i<pkgLBHAll.length; i=i+3) {
  if (document.querySelectorAll("input[name='pkgVol']")[count].value == '' &&
      (pkgLBHAll[i].value == '' ||pkgLBHAll[i+1].value == '' ||pkgLBHAll[i+2].value == '')) {
   empty=true;
  };
  count++;
 };
 console.log(empty);
 if (empty === false) {
  for (let i=0; i<document.querySelectorAll("input[name='totalLBH']").length ; i++) {
   document.querySelectorAll("input[name='totalLBH']")[i].removeAttribute("required");
  };
  document.querySelector("input[name='totalVol']").removeAttribute("required");
 } else if (empty === true) {
  document.querySelector("input[name='totalVol']").setAttribute("required",true);
 };
}


var fileInputClone = document.querySelector("input[name='docs']").cloneNode(true);
function addFileInput() {
 var fileInputs = document.querySelectorAll("input[name='docs']");
 if (fileInputs.length < 3) {
  fileInputs[fileInputs.length-1].addEventListener("input",function(e) {
   document.querySelector("div.docs").appendChild(fileInputClone);
   addFileInput();
  });
  fileInputClone = fileInputs[fileInputs.length-1].cloneNode(true);
 };
};











/* change visibility of address when no delivery */

document.querySelector("select[name='delivery']").addEventListener("change",function(e) {
 if (e.target.value === "Delivery") {
  document.querySelector("input[name='deliverTo']").classList.remove("hidden");
 } else if (e.target.value === "No Delivery") {
  document.querySelector("input[name='deliverTo']").classList.add("hidden");
 };
});







/* add & remove individual package details inputs */

document.querySelector("input[name='NoP']").addEventListener("change",function(e) {

 var gWeightInputs = document.querySelectorAll("div.gWeight");
 let i = gWeightInputs.length
 while (e.target.value > i) { 
  var gWeightInputClone = gWeightInputs[0].cloneNode(true);
  document.querySelector("td.gWeight").appendChild(gWeightInputClone);
  var pkgWeightInput = document.querySelectorAll("input[name='pkgWeight']");
  pkgWeightInput[pkgWeightInput.length - 1].setAttribute("placeholder","Package " + (i+1) + " Weight");
  pkgWeightInput[pkgWeightInput.length - 1].addEventListener("change", checkEmptyWeight);

  i++;
 };
 while (e.target.value < i) { 
  document.querySelectorAll("div.gWeight")[document.querySelectorAll("div.gWeight").length - 1].remove();
  i--;
 };

 var dimInputs = document.querySelectorAll("div.dimInput");
 let ii = dimInputs.length;
 while (e.target.value > ii) { 
  var dimInputClone = dimInputs[0].cloneNode(true);
  document.querySelector("td.dimInput").appendChild(dimInputClone);
  var pkgLBHInput = document.querySelectorAll("input[name='pkgLBH']");
  pkgLBHInput[pkgLBHInput.length - 3].setAttribute("placeholder","Package " + (ii+1) + " Length");
  pkgLBHInput[pkgLBHInput.length - 3].addEventListener("change",checkEmptyDim);
  pkgLBHInput[pkgLBHInput.length - 2].setAttribute("placeholder","Package " + (ii+1) + " Breadth");
  pkgLBHInput[pkgLBHInput.length - 2].addEventListener("change",checkEmptyDim);
  pkgLBHInput[pkgLBHInput.length - 1].setAttribute("placeholder","Package " + (ii+1) + " Height");
  pkgLBHInput[pkgLBHInput.length - 1].addEventListener("change",checkEmptyDim);
  var pkgVolInput = document.querySelectorAll("input[name='pkgVol']");
  pkgVolInput[pkgVolInput.length - 1].setAttribute("placeholder","Package " + (ii+1) + " Volume");
  pkgVolInput[pkgVolInput.length - 1].addEventListener("change",checkEmptyDim);
  ii++;
 };
 while (e.target.value < ii) { 
  document.querySelectorAll("div.dimInput")[document.querySelectorAll("div.dimInput").length - 1].remove();
  ii--;
 };
});








/* add & remove required attribute */

document.querySelector("input[name='pkgWeight']").addEventListener("change", checkEmptyWeight);

for (let i=0; i<3; i++) {
 document.querySelectorAll("input[name='pkgLBH']")[i].addEventListener("change",checkEmptyDim);
};
document.querySelector("input[name='pkgVol']").addEventListener("change",checkEmptyDim);









/* add & remove file uploads */

addFileInput();
