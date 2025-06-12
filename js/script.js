// set up memory for local storage  with an empty cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// firstly we  need to wait for the current page to fully load

document.addEventListener("DOMContentLoaded", () => {
  //add eventlisteners to the buttons
  //first select all add-to -cart buttons
  const addToCartBtns = document.querySelectorAll(".cart-btn");
  //loop through each  addToCartBtns and ad eventlisteners
  addToCartBtns.forEach((button) => {
    button.addEventListener("click", function (e) {
      // find the closest product card to the object where happened event
      const productCard = e.target.closest(".product-div");
      //then  extract  details about that product card

      const productName = productCard.querySelector("h3").innerText;
      const price = parseFloat(
        productCard.querySelector("p").innerText.replace("€", "")
      );

      // console.log(productName);
      // console.log(price);
      //add the details to local storage
      addToCart(productName, price);
    });
  });
  if (window.location.pathname.includes("checkout.html")) {
    const processBtn = document.querySelector(".checkout-btn");
    if (processBtn) {
      processBtn.addEventListener("click", function () {
        //prompt the user to confirm
        if (cart.length === 0) {
          alert("cart is empty add the items");
        } else {
          alert("order has been placed");
          //empty the cart

          cart = [];
          localStorage.removeItem("cart");

          updateCart();
        }
      });
    }

    const clearBtn = document.querySelector(".clear-btn");
    console.log(clearBtn);

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (cart.length === 0) {
          alert("cart is empty");
        } else {
          //prompt the user to confirm
          if (confirm("Do you want to clear cart?")) {
            //empty the cart

            cart = [];
            localStorage.removeItem("cart");

            updateCart();
          }
        }
      });
    }
  }

  updateCart();
});
updateCartCounter();

// add selected items to the local storqage adn card

function addToCart(name, price) {
  console.log(name);
  console.log(price);
  // check if the item is already in the cart, if it is then  update quantity, if not  add it to cart
  const currentItem = cart.find((item) => item.name === name);
  if (currentItem) {
    currentItem.quantity++;
  } else {
    cart.push({ name, quantity: 1, price });
  }
  // Save the data
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} has been added to the cart.`);
  updateCartCounter();
}

//update the cart
function updateCart() {
  // Get  cart table and checkout section elements
  const tableItems = document.querySelector("#cart-table");
  console.log(tableItems);
  const totalCart = document.querySelector(".checkout-div");
  console.log(totalCart);
  // Clear any existing items in the cart table
  tableItems.innerHTML = "";

  let total = 0;
  //loop throug cart items and add the row to the table
  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    //create row
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.name}</td>
            <td><input type="number" min="1" value="${
              item.quantity
            }" class="quantity-input" data-index="${index}"></td>
            <td>€${item.price.toFixed(2)}</td>
            <td>€${subtotal.toFixed(2)}</td>
            <td><button class="remove-btn" data-index="${index}"><i class="icon fa-solid fa-x"></i></i></button></td>`;

    // Insert the row into the table
    tableItems.appendChild(row);
  });
  //update total amount
  const totalAmount = document.querySelector(".total-amount");
  totalAmount.innerText = `€${total.toFixed(2)}`;
  updateQuantity();
  updateCartCounter();
}

//update quantity

function updateQuantity() {
  //get all quantity inputs
  const quantityInputs = document.querySelectorAll(".quantity-input");
  console.log(quantityInputs);
  //loop through each quantity input
  quantityInputs.forEach((input) => {
    //add eventlisteners to  eah input
    input.addEventListener("change", function (e) {
      const rowIndex = e.target.dataset.index;
      const newQuantity = parseInt(e.target.value);
      if (newQuantity > 0) {
        cart[rowIndex].quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
      }
    });
  });

  //remove product
  //get all remove btns
  const removeButtons = document.querySelectorAll(".remove-btn");
  console.log(removeButtons);
  //loop through each remove btn
  removeButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const rowIndex = e.target.dataset.index;
      //remove 1 element from the cart
      cart.splice(rowIndex, 1);
      //update cart
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
    });
  });
}

// update cart counter in nav bar

function updateCartCounter() {
  const cartCounter = document.querySelector("#cart-count");

  let itemCount = cart.reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);
  console.log(cartCounter);
  if (cartCounter) {
    cartCounter.innerText = `(${itemCount})`;
  }
}
