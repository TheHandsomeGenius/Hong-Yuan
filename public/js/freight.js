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









/* clone file inputs */

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









/* change placeholder based on shipping terms */

document.querySelector("select[name='pickupTerm']").addEventListener("change",function(e) {
 if (e.target.value === "Drop-off") {
  setAttr("input[name='pickupAddr']","placeholder","State");
 } else if (e.target.value === "FOB") {
  setAttr("input[name='pickupAddr']","placeholder","Port");
 } else if (e.target.value === "Pickup") {
  setAttr("input[name='pickupAddr']","placeholder","Address");
 };
});

document.querySelector("select[name='deliveryTerm']").addEventListener("change",function(e) {
 if (e.target.value === "Delivery") {
  setAttr("input[name='deliveryAddr']","placeholder","Address");
 } else if (e.target.value === "Self-Collection") {
  setAttr("input[name='deliveryAddr']","placeholder","State");
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



/* validate checkboxes */

var checkboxes = document.querySelectorAll("input[name='mode']");
for (let i=0; i<checkboxes.length; i++) {
 checkboxes[i].addEventListener("change",function(e) {
  var unchecked = true;
  console.log(checkboxes[0],checkboxes[1]);
  for (let ii=0; ii<checkboxes.length; ii++) {
   if (checkboxes[ii].checked) {
    console.log(checkboxes[ii].checked);
    unchecked = false;
   };
  };
  if (unchecked === true) {
   checkboxes[4].checked = true;
  } else if (unchecked === false) {
   checkboxes[4].checked = false;
  }; 
 });
};




/* add & remove file uploads */

addFileInput();







/* check mode based on click */

if (location.hash != '') {
 document.querySelector("#" + location.hash[1].toUpperCase() + location.hash.slice(2,location.hash.length)).checked = true;
 document.querySelector("#None").checked = false;
};



