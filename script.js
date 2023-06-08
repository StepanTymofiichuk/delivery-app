console.log("Loaded");
if(document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready)
} else {
    ready()
}


function ready() {
    var addItemBtn = document.getElementsByClassName("cart-btn");
    console.log(addItemBtn);
    var removeItemBtn = document.getElementsByClassName("remove-btn");
    console.log(removeItemBtn);

    //add item to cart

    for(var i = 0; i < addItemBtn.length; i++) {
        var button = addItemBtn[i];
        button.addEventListener("click", addCartItem)
    }

    // remove item from cart

    for(var i = 0; i < removeItemBtn.length; i++) {
        var button = removeItemBtn[i];
        button.addEventListener("click", removeCartItem)
    }

    // listen for quantity change

    var itemQty = document.getElementsByClassName("item-qty");
    for(var i = 0; i < itemQty.length; i++) {
        var input = itemQty[i];
        input.addEventListener("change", qtyChanged)
    }

    appendProduct();
    updateCartTotal();

    var submit = document.getElementsByClassName("submit-btn")[0].addEventListener("click", function() {
        if(!localStorage.getItem("cart")) {
            alert("Cart is empty! Please add products");
        } else {
            alert("Your order is accepted!");
        }
    })
}

function addCartItem (event) {
    console.log("Clicked");
    var item = event.target;
    var itemElement = item.parentElement.parentElement;
    var itemImage = itemElement.getElementsByClassName("item-image")[0].innerText;
    var itemTitle = itemElement.getElementsByClassName("item")[0].innerText;
    var itemPrice = itemElement.getElementsByClassName("item-price")[0].innerText.replace("Price:", "");
    //console.log(itemImage, itemTitle, itemPrice);
    // add item to local storage
    storeItemLocally(itemImage, itemTitle, itemPrice);
}

// add item to local storage
function storeItemLocally(itemImage, itemTitle, itemPrice) {
    //localStorage.removeItem('cart');
    var cartItems = [];
    let cartItem = {
        image: itemImage,
        title: itemTitle,
        price: itemPrice
    }
    console.log(cartItem);
    cartItems.push(cartItem);
    cartItems = cartItems.concat(JSON.parse(localStorage.getItem('cart')||'[]'));
    let objSerialized = JSON.stringify(cartItems);
    localStorage.setItem("cart", objSerialized)
    console.log(localStorage);
    alert("Added to Cart (into local storage)");
}

function appendProduct() {
    let objParsed = JSON.parse(localStorage.getItem("cart"));
    //console.log(objParsed);
    for(var i = 0; i < objParsed.length; i++) {
        var cartItems = objParsed[i];
        var container = document.getElementsByClassName("shopping-cart-container")[0];
        var cartContents = `
        <div class="container3-item">
        <div class="cart-item-image">
          ${cartItems.image}
        </div>
        <div class="cart-item">
          <p>${cartItems.title}</p>
          <p class="item-price">Price: ${cartItems.price}</p>
          <input type="number" class="item-qty" value="4">
          <button type="button" name="button" class="remove-btn">Remove</button>
        </div>
      </div>`
      var div = document.createElement("div");
      div.innerHTML = cartContents;
      div.getElementsByClassName("remove-btn")[0].addEventListener("click", removeCartItem);
      div.getElementsByClassName("item-qty")[0].addEventListener("change", qtyChanged);
      container.append(div);
    }
}

function removeCartItem (event) {
    console.log("Clicked");
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
    localStorage.removeItem('cart');
}

function qtyChanged(event) {
    var input = event.target;
    console.log(input);
    if(isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

// update caart total price
function updateCartTotal() {
    var total = 0;
    var cartItems = document.getElementsByClassName("cart-item");
    for(var i = 0; i < cartItems.length; i++) {
        var cartItem = cartItems[i];
        var priceElement = cartItem.getElementsByClassName("item-price")[0];
        var qtyElement = cartItem.getElementsByClassName("item-qty")[0];
        var price = parseInt(priceElement.innerText.replace("Price:", ""));
        var qty = qtyElement.value;
        console.log(price * qty);
        var total = total + price * qty;
        total = Math.round(total * 100) / 100;
    }
    var totalPriceElement = document.getElementsByClassName("total-price")[0];
    totalPriceElement.innerText = "Total price: " + total;

}
