var inventory;
var cart; //Item are stored in this way: quantity for item that appears in row x . 
 
//Determine whether it is the first time the website has been opened
if (sessionStorage.getItem("inventoryStorage") == null) {
	inventoryStorage = false;
} else {
	inventoryStorage = true;
	inventory = JSON.parse(sessionStorage.getItem("inventory"));
}
 
if (inventoryStorage != true) {
	getInventory("inventory.txt");
}
 
//onload function
function mainPageStartup() {
	inventory = JSON.parse(sessionStorage.getItem("inventory"));
	window.addEventListener('scroll', resizeHeader);
	writeCategories(inventory);
	randomGenerator();
}
 
function getInventory(path) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                processData(xhr.responseText);
            } else {
				console.log("xhr status 200 error");
			}
        }
    };
    xhr.open("GET", path);
    xhr.send();
}
 
//Read the csv and store in an array, saved to sessionStorage
function processData(allText) {
	inventory = new Array();
	var allTextLines = allText.split(/\r\n|\n/);
	
	for (var row = 0; row < allTextLines.length; row++) {
		inventory[row] = allTextLines[row].split(",");
		
		for (var col = 0; col < inventory[row].length; col++) {
			inventory[row][col] = inventory[row][col].replace(/@/g, ",");
			
			if (col > 0) {
				inventory[row][col] = inventory[row][col].substring(1);
			}
		}
	}
	
	//Sort inventory by alphabetical order by name
	var sortedInventory = new Array(inventory.length);
	var alphabeticalList = new Array(inventory.length);
	var dummyList = new Array(inventory.length); //So items can be removed when sorting
	for (var i = 0; i < inventory.length; i++) {
		alphabeticalList[i] = inventory[i][1];
		dummyList[i] = inventory[i];
	}
	
	alphabeticalList.sort();
	
	for (var i = 0; i < alphabeticalList.length; i++) {
		Search:
		for (var k = 0; k < inventory.length; k++) {
			if (alphabeticalList[i] === dummyList[k][1]) {
				sortedInventory[i] = dummyList[k];
				dummyList[k] = -1;
				break Search;
			}
		}
	}
	
	for (var i = 0; i < inventory.length; i++) {
		inventory[i] = sortedInventory[i];
	}
	
	//Store inventory
	sessionStorage.setItem("inventory", JSON.stringify(inventory));
	sessionStorage.setItem("inventoryStorage", true);
	
	
	cart = new Array();
	cart.length = inventory.length; 
	
	for (var i = 0; i < cart.length; i++) {
		cart[i] = 0;
	}
 
	sessionStorage.setItem("cart", JSON.stringify(cart));
}
 
var inventory = JSON.parse(sessionStorage.getItem("inventory"));
 
//Write category names in alphabetical order
function writeCategories(inventory) {
	searchFunction();
	inventory = JSON.parse(sessionStorage.getItem("inventory"));
	var categories = new Array();
	
	var counter = 0;
	ReadLine:
	for (var row = 0; row < inventory.length; row++) {
		var categoryOfItem = inventory[row][2];
		
		for (var i = 0; i < inventory.length; i++) {
			if (categoryOfItem == categories[i]) continue ReadLine; 
		}
		
		categories[counter] = categoryOfItem;
		counter++;	
	}
	categories.sort();
	var names = new Array();
	names.length = categories.length;
	
	
	for (var i = 0; i < categories.length; i++) {
		var aElement = document.createElement("a");
		
		aElement.setAttribute("href", "Browse by Category.html");
		aElement.onclick = function() { //Redirect to category page
			category = this.innerHTML;
			sessionStorage.setItem("category", category);
			sessionStorage.setItem("col", 2);
		}
		
		names[i] = document.createElement("li");
		//names[i].setAttribute("id", "category" + i);
		
		var inventory = document.createTextNode(categories[i]);
		
		aElement.appendChild(inventory);
		document.getElementById("categoryList").appendChild(names[i]);
		names[i].appendChild(aElement);
	}
}
 
//Product page
var item;
 
//onload function
function individualItemStartup() {
	item = sessionStorage.getItem("item");
	window.addEventListener('scroll', resizeHeader);
	writeCategories();
	writeItemInformation(item)
}
 
//Write information
function writeItemInformation() {
	var row = 0; 
	for (var i = 0; i < inventory.length; i++) {
		if (item == inventory[i][0]) {
			row = i;
			break;
		}
	}
	
	document.getElementById("product-img").setAttribute("src", inventory[row][6]);
	document.getElementById("product-name").innerHTML = inventory[row][1];
	document.getElementById("company").innerHTML = inventory[row][3];
	document.getElementById("product-id").innerHTML = "ID: #" + inventory[row][0];
	document.getElementById("price").innerHTML = inventory[row][5];
	document.getElementById("product-des").innerHTML = inventory[row][4];
	calculateTotalPrice();
	
	document.getElementById("add-cart").onclick = function() {
		for (var i = 0; i < inventory.length; i++) {
			if ((document.getElementById("product-id").innerHTML).substring(5) == inventory[i][0]) {
					cart = JSON.parse(sessionStorage.getItem("cart"));
					cart[i] += parseFloat(document.getElementById("quantity").value);
					sessionStorage.setItem("cart", JSON.stringify(cart));
					
					var x = document.getElementById("snackbar");
					x.innerHTML = "Added to cart.";
					x.className = "show";
					setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
 
					break;
			}
		}
		
	}
}
 
function resizeHeader() {
  const distanceY = window.pageYOffset || document.documentElement.scrollTop;
  headerEl = document.getElementById('js-header');
  
  if (distanceY > 200) {
    headerEl.classList.add("smaller");
  } else {
    headerEl.classList.remove("smaller");
  }
}
 
 
function expandCategories() {
	var expandEl = document.getElementById("bottom-bar");
	
	if (expandEl.style.height != "250px") {
		expandEl.style.height = "250px";
	} else {
		expandEl.style.height = "43px";
	}
	
}	
 
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};
 
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}
 
// When the user clicks on the button, scroll to the top of the document
function topFunction(scrollDuration) {
    var scrollStep = -window.scrollY / (scrollDuration / 15),
        scrollInterval = setInterval(function(){
        if ( window.scrollY != 0 ) {
            window.scrollBy( 0, scrollStep );
        }
        else clearInterval(scrollInterval); 
    },15);
}
/**Total price calculator */
function calculateTotalPrice() {
   var price = document.getElementById("price").innerHTML;
   price = price.substring(price.indexOf("$") + 1);
   var totalPrice = document.getElementById("quantity").value * price;
   document.getElementById("total-price").innerHTML = "$" + totalPrice.toFixed(2);
}
 
 
//Individual category webpage
var category;
 
//onload function
function individualCategoryStartup() {
	category = sessionStorage.getItem("category");
	window.addEventListener('scroll', resizeHeader);
	writeCategories();	
	displayItems(sessionStorage.getItem("col"));
}
 
 //Display items in a table
 function displayItems(col) {
	 document.getElementById("category-name").innerHTML = category;
	 
	 var pointer = 0;
	 var tr;
	 for (var i = 0; i < inventory.length; i++) {	
		if (category == inventory[i][col]) {
			if (pointer % 4 == 0) {
				if (pointer != 0) {
					document.getElementById("display-items").appendChild(tr);
				}
				tr = document.createElement("tr");
			}
			
			 var td = document.createElement("td");
			 var img = document.createElement("img");
			 var h1 = document.createElement("h1");
			 var h2 = document.createElement("h2");
			 var company = document.createElement("h3");
			 
			 var buttonElement = document.createElement("button");
			 var aElement = document.createElement("a");
			 
			 
			 img.setAttribute("src", inventory[i][6]);
			 img.setAttribute("alt", "Item 1");
			 h1.setAttribute("id", "product-name");
			 h2.setAttribute("class", "price");
			 company.setAttribute("class", "price");
			
			 aElement.setAttribute("id", inventory[i][0]);
			 aElement.onclick = function() { //Redirect to product information page
				 item = this.id;
				 sessionStorage.setItem("item", item);
			 }
			 aElement.setAttribute("href", "Product Information.html");
			 
			 
			 h1.appendChild(document.createTextNode(inventory[i][1]));
			 h2.appendChild(document.createTextNode(inventory[i][5]));
			 company.appendChild(document.createTextNode(inventory[i][3]));
			 
			 aElement.appendChild(img);
			 aElement.appendChild(h1);
			 
			 buttonElement.innerHTML = "Add to cart";
			 buttonElement.setAttribute("id", inventory[i][0]);
			 buttonElement.onclick = function() { //Add to cart
				 for (var i = 0; i < inventory.length; i++) {
					if (this.id == inventory[i][0]) {
					cart = JSON.parse(sessionStorage.getItem("cart"));
					cart[i] += 1;
					sessionStorage.setItem("cart", JSON.stringify(cart));
					
					var x = document.getElementById("snackbar");
					x.innerHTML = "Added to cart.";
					x.className = "show";
					setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
					
					break;
					}
				}
			}
			 
			 
			 td.appendChild(aElement);
			 td.appendChild(company);
			 td.appendChild(h2);
			 td.appendChild(buttonElement);
			 
			 
			 tr.appendChild(td);
			 pointer++;
		}
	 }
	 
	 document.getElementById("display-items").appendChild(tr);
 }

//onload function
function shoppingCartStartup() {
	window.addEventListener('scroll', resizeHeader);
	writeCategories();
	shoppingCart();
}
 
//Display the shopping cart in a table
function shoppingCart() {
	cart = JSON.parse(sessionStorage.getItem("cart"));
 
	for (var i = 0; i < cart.length; i++) {
		if (cart[i] != 0) {
			var tr = document.createElement("tr");
			tr.id = i;
			var td = new Array(6);
			
			for (var k = 0; k < td.length; k++) {
				td[k] = document.createElement("td");
			}
			
			var img = document.createElement("img");
			img.src = inventory[i][6];
			td[0].appendChild(img);
			
			td[1].appendChild(document.createTextNode(inventory[i][1]));
			td[2].appendChild(document.createTextNode(inventory[i][5]));
			td[2].id = "price" + i;
			
			var input = document.createElement("input");
			input.type = "number";
			input.id = "input" + i;
			input.min = "1";
			input.max = "99"
			input.value = cart[i];
			td[3].appendChild(input);
			td[4].innerHTML = "$" + input.value * td[2].innerHTML.substring(1);
			td[4].id = "total" + i;
			input.oninput = function() { //Change quantity
				var itemRow = document.getElementById(this.id.substring(5)).id;
				cart = JSON.parse(sessionStorage.getItem("cart"));
				cart[itemRow] = this.value;
				sessionStorage.setItem("cart", JSON.stringify(cart));
				document.getElementById("total" + this.id.substring(5)).innerHTML = "$" + (this.value * document.getElementById("price" + this.id.substring(5)).innerHTML.substring(1)).toFixed(2);
				sumPrice();
			}
			
			var buttonElement = document.createElement("button");
			buttonElement.id = "buttonElement" + i;
			buttonElement.setAttribute("class", "remove");
			buttonElement.innerHTML = "&times;";
			buttonElement.onclick = function() { //Remove row
				var itemRow = document.getElementById(this.id.substring(13)).id;
				cart = JSON.parse(sessionStorage.getItem("cart"));
				cart[itemRow] = 0;
				sessionStorage.setItem("cart", JSON.stringify(cart));
				document.getElementById("cart").removeChild(document.getElementById(this.id.substring(13)));
				if (table.rows.length == 1) {
				    // if shopping cart is empty then display this message
				    cell1.colSpan = "6";
				    totalRow.deleteCell(1);
				    totalRow.deleteCell(-1);
				    cell1.innerHTML = "Your shopping cart is empty. ";
				    cell1.style.padding = "10px";
				 }
				sumPrice();
			}
			td[5].appendChild(buttonElement);
			
			for (var k = 0; k < td.length; k++) {
				tr.appendChild(td[k]);
			}
			
			document.getElementById("cart").appendChild(tr);
		}
	}
	
	var table = document.getElementById("cart");
	var totalRow = table.insertRow(table.rows.length);
	var cell1 = totalRow.insertCell(0);
	var cell2 = totalRow.insertCell(1);
	var cell3 = totalRow.insertCell(2)
	cell1.colSpan = "3";
	cell2.colSpan = "1";
	cell3.colSpan = "2";
	cell2.innerHTML = "Total";
	cell2.style.fontWeight = "bold";
	cell1.style.border = "none";
	cell3.id = "totalSum"
	
	if (table.rows.length == 1) { // if shopping cart is empty then display this message
		cell1.colSpan = "6";
		totalRow.deleteCell(1);
		totalRow.deleteCell(-1);
		cell1.innerHTML = "Your shopping cart is empty. ";
		cell1.style.padding = "10px";
	}
				 
	function sumPrice() { //Find the total price
		var tableTotal = 0;
		var tempPrice;
		for (var i = 0; i < table.rows.length; i++) {
			tempPrice = table.rows[i].cells[4].innerHTML;
			tempPrice = tempPrice.substring(1, tempPrice.length);
			tableTotal = parseFloat(tempPrice) + tableTotal;
			cell3.innerHTML = "$" + tableTotal.toFixed(2);
		}
	}
	
	sumPrice();
}
 
var sortedInventory = new Array(); 

//onload function
function viewAllProductsStartup() {
	window.addEventListener('scroll', resizeHeader);
	writeCategories();
	writeCompanyNames();
	displayAllItems(inventory);
}
 
 //Write in the select drop down menu, possible company names. Handles ' s 
function writeCompanyNames() {
	var alphabeticalList = new Array(inventory.length);
	var dummyList = new Array(inventory.length); //So items can be removed when sorting
	for (var i = 0; i < inventory.length; i++) {
		alphabeticalList[i] = new String(inventory[i][3]);
		alphabeticalList[i] = alphabeticalList[i].replace("'", "");
		dummyList[i] = Object.create(inventory[i]);
		dummyList[i][3] = dummyList[i][3].replace("'", "");
	}
	
	alphabeticalList.sort();
	
	for (var i = 0; i < alphabeticalList.length; i++) {
		Search:
		for (var k = 0; k < inventory.length; k++) {
			if (alphabeticalList[i] === dummyList[k][3]) {
				sortedInventory[i] = inventory[k];
				dummyList[k] = -1;
				break Search;
			}
		}
	}
	
	var optionElement = document.createElement("option");
	optionElement.value = "All";
	optionElement.innerHTML = "All";
	document.getElementById("sort-brand").append(optionElement);
	
	var optionElement = document.createElement("option");
	optionElement.value = sortedInventory[0][3];
	optionElement.innerHTML = sortedInventory[0][3];
	document.getElementById("sort-brand").append(optionElement);
	for (var i = 1; i < sortedInventory.length; i++) {
		if (sortedInventory[i][3] != sortedInventory[i - 1][3]) {
			var optionElement = document.createElement("option");
			optionElement.value = sortedInventory[i][3];
			optionElement.innerHTML = sortedInventory[i][3];
			document.getElementById("sort-brand").append(optionElement);
		}
	}	
}
 
//Sort possible brands
function sortBrand() {
	var type = document.getElementById("sort-brand").value;
	for (var i = 0; i < sortedInventory.length; i++) {
		if (sortedInventory[i][3] != type & type != "All") {
			sortedInventory[i] = null;
		}
	}	
}	
 
//Sort according to the user's choice
function sort() {
	var type = document.getElementById("sort-type");
	sortedInventory.length = inventory.length; //Have this sorted by the end
	if (type.value == "default") {
		for (var i = 0; i < inventory.length; i++) {
			sortedInventory[i] = inventory[i];
		}
	} else if (type.value == "sortName") {
		var alphabeticalList = new Array(inventory.length);
		var dummyList = new Array(inventory.length); //So items can be removed when sorting
		for (var i = 0; i < inventory.length; i++) {
			alphabeticalList[i] = inventory[i][1];
			dummyList[i] = inventory[i];
		}
		
		alphabeticalList.sort();
		
		for (var i = 0; i < alphabeticalList.length; i++) {
			Search:
			for (var k = 0; k < inventory.length; k++) {
				if (alphabeticalList[i] === dummyList[k][1]) {
					sortedInventory[i] = dummyList[k];
					dummyList[k] = -1;
					break Search;
				}
			}
		}
	} else if (type.value == "sortCompany") {
		var alphabeticalList = new Array(inventory.length);
		var dummyList = new Array(inventory.length); //So items can be removed when sorting
		for (var i = 0; i < inventory.length; i++) {
			alphabeticalList[i] = new String(inventory[i][3]);
			alphabeticalList[i] = alphabeticalList[i].replace("'", "");
			dummyList[i] = Object.create(inventory[i]);
			dummyList[i][3] = dummyList[i][3].replace("'", "");
		}
		
		alphabeticalList.sort();
		
		for (var i = 0; i < alphabeticalList.length; i++) {
			Search:
			for (var k = 0; k < inventory.length; k++) {
				if (alphabeticalList[i] === dummyList[k][3]) {
					sortedInventory[i] = inventory[k];
					dummyList[k] = -1;
					break Search;
				}
			}
		}
	} else if (type.value == "sortPriceLow") {
		for (var i = 0; i < inventory.length; i++) {
			sortedInventory[i] = inventory[i];
		}
		
		sortedInventory.sort(lowToHigh);
		
		function lowToHigh(a, b) {
			return a[5].substring(1) - b[5].substring(1);
		}
	} else if (type.value == "sortPriceHigh") {
		for (var i = 0; i < inventory.length; i++) {
			sortedInventory[i] = inventory[i];
		}
		
		sortedInventory.sort(highToLow);
		
		function highToLow(a, b) {
			return b[5].substring(1) - a[5].substring(1);
		}
	}
	
	sortBrand();
	displayAllItems(sortedInventory);
}
 
//Display items in a table
function displayAllItems(sortedInventory) {
	document.getElementById("display-items").innerHTML = ''; //Remove all previous items
 
	//Write on page
	 var pointer = 0;
	 var tr;
	 for (var i = 0; i < sortedInventory.length; i++) {	
		if (sortedInventory[i] == null) {
			continue;
		}
		
		if (pointer % 4 == 0) {
			if (pointer != 0) {
				document.getElementById("display-items").appendChild(tr);
			}
			tr = document.createElement("tr");
		}
		
		 var td = document.createElement("td");
		 var img = document.createElement("img");
		 var h1 = document.createElement("h1");
		 var h2 = document.createElement("h2");
		 var company = document.createElement("h3");
		 
		 var buttonElement = document.createElement("button");
		 var aElement = document.createElement("a");
		 
		 
		 img.setAttribute("src", sortedInventory[i][6]);
		 img.setAttribute("alt", "Item 1");
		 h1.setAttribute("id", "product-name");
		 h2.setAttribute("class", "price");
		 company.setAttribute("class", "price");
		
		 aElement.setAttribute("id", sortedInventory[i][0]);
		 aElement.onclick = function() {
			 item = this.id;
			 sessionStorage.setItem("item", item);
		 }
		 aElement.setAttribute("href", "Product Information.html");
		 
		 
		 h1.appendChild(document.createTextNode(sortedInventory[i][1]));
		 h2.appendChild(document.createTextNode(sortedInventory[i][5]));
		 company.appendChild(document.createTextNode(sortedInventory[i][3]));
		 
		 aElement.appendChild(img);
		 aElement.appendChild(h1);
		 
		 buttonElement.innerHTML = "Add to cart";
		 buttonElement.setAttribute("id", sortedInventory[i][0]);
		 buttonElement.onclick = function() {
			 for (var i = 0; i < inventory.length; i++) {
				if (this.id == inventory[i][0]) {
				cart = JSON.parse(sessionStorage.getItem("cart"));
				cart[i] += 1;
				sessionStorage.setItem("cart", JSON.stringify(cart));
				break;
				}
			}
			
			var x = document.getElementById("snackbar")
			x.innerHTML = "Added to cart."
			x.className = "show";
			setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
		}
		 
		 
		 td.appendChild(aElement);
		 td.appendChild(company);
		 td.appendChild(h2);
		 td.appendChild(buttonElement);
		 
		 
		 tr.appendChild(td);
		 pointer++;
	}
	 
	 document.getElementById("display-items").appendChild(tr);
}
 
//Display items in the search bar
function searchFunction() {
	var companies = [];
	for (var row = 0; row < inventory.length; row++) {
		for (var col = 0; col < inventory[row].length; col++) {
			if (col == 1 || col == 3 || col == 4) {
				if (col == 3 && companies.indexOf(inventory[row][col]) < 0) {
					companies.push(inventory[row][col]);
				} else if (col == 3 && companies.indexOf(inventory[row][col]) >= 0) {
					continue;
				}
				
				var optionElement = document.createElement("OPTION");
				optionElement.setAttribute('value', inventory[row][col]);
				optionElement.setAttribute('id', col + inventory[row][0]);
				document.getElementById("all-products").appendChild(optionElement);
			}
		}
	}
}
 
//Transition function from shopping cart to check out 
function transferTotal() {
	if (document.getElementById("totalSum").innerHTML != null) {
		sessionStorage.setItem("total", document.getElementById("totalSum").innerHTML);
		window.location.href = "Checkout Page.html";
	}
}
 
//Decide what webpage the search bar leads to
function onInput() {
	var value = document.getElementById("productList").value;
	var list = document.getElementById("all-products").childNodes;
	for (var i = 0; i < list.length; i++) {
		if (list[i].value === value) {
			if (list[i].id.charAt(0) === "3") {
				sessionStorage.setItem("category", value);
				sessionStorage.setItem("col", 3);
				window.location.href = "Browse by Category.html";
			} else {
				item = list[i].id.substring(1); 
				sessionStorage.setItem("item", item);
				window.location.href = "Product Information.html";
			}
		}
	}
}
 
//Display subtotal
function printSubtotal() {
	var tdSubtotal = document.createElement("TD");
	var t = document.createTextNode(sessionStorage.getItem("total"));
	tdSubtotal.appendChild(t);
	document.getElementById("subtotal").appendChild(tdSubtotal);
	
}
 
//Calculate the total price and display
function calculateTotal(){
  var cTable = document.getElementById("overview-table");
  var subtotal = sessionStorage.getItem("total");
  subtotal = subtotal.replace(/ /g, "").substring(1, subtotal.length - 1);
  var shippingPrice = document.querySelector('input[name = "shipping-type"]:checked').value;
  cTable.rows[1].cells[1].innerHTML = "$" + shippingPrice + ".00";
  total = parseFloat(subtotal) + parseFloat(shippingPrice);
  console.log(total);
  cTable.rows[2].cells[1].innerHTML = "$" + total.toFixed(2);
}
 
//Alert the user of the purchase and of the total price
function alertText() { //alert once user clicks "check out"
	var shippingSelection = document.querySelector('input[name = "shipping-type"]:checked').value;
	var days;
	
	if (shippingSelection == 6) {
		days = "in 4-5 days.";
	} else if (shippingSelection == 8) {
		days = "in 2 days.";
	} else if (shippingSelection == 10) {
		days = "in 1 day.";
	} else if (shippingSelection == 15) {
		days = "today."
	}
	
	alert("Thank you for your purchase! Your order will be delivered " + days + "\nTotal: $" + total.toFixed(2));
}
 
//Randomly generate images to display on the main page
function randomGenerator() {
	var takenNumbers = new Array(inventory.length);
	for (var i = 0; i < inventory.length; i++) {
		takenNumbers[i] = false;
	}
	
	for (var i = 0; i < 6; i++) {
		var rand;
		while (true) {
			rand = Math.floor((Math.random() * inventory.length) + 1);
			if (takenNumbers[rand]) {
				continue;
			} else {
				takenNumbers[rand] = true;
				break;
			}
		}	
		
		var pic = document.createElement("IMG");
		
		var a = document.createElement("a");
		a.setAttribute("id", inventory[rand][0]);
		
		a.onclick = function() {
			item = this.id;
			sessionStorage.setItem("item", item);
		}
		
		a.setAttribute("href", "Product Information.html");
		a.appendChild(pic);
		pic.setAttribute("src", inventory[rand][6]);
		pic.setAttribute("class", "featurePics" + i);
		if (i < 3) {
			pic.setAttribute("class", "featurePics" + (i + 1));
			document.getElementById("bestBets").appendChild(a);
		} else {
			pic.setAttribute("class", "featurePics" + (i - 2));
			document.getElementById("weekly").appendChild(a);
		}
	}
}
 
 
 
 
 
