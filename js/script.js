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
      const productCard = e.target.closest(".product-cart");
      //then  extract  details about that product card

      const name = productCard.querySelector("h3").innerText;
      const price = parceFloat(
        productCard.querySelector("p").replace("&euro;", "")
      );
      //add the details to local storage
      addToCartBtns(name, price);
    });
  });
});

// add selected items to the local storqage adn card

function addToCart(name, price) {
  // check if the item is already in the cart, if it is then  update quantity, if not  add it to cart
  const currentItem = cart.find((item) => item.name === name);
  if (currentItem) {
    currentItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  // Save the data
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} has been added to the cart.`);
}

//update the cart
function updateCart() {
  // Get  cart table and checkout section elements
  const tableItems = document.querySelector("#cart-table");
  const totalCart = document.querySelector(".checkout-div");
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
            }" class="qty-input" data-index="${index}"></td>
            <td>€${item.price.toFixed(2)}</td>
            <td>€${subtotal.toFixed(2)}</td>
            <td><button class="remove-btn" data-index="${index}">Remove</button></td>`;

    // Insert the row into the table
    tableItems.appendChild(row);
  });
  //update total amount
  const totalAmount = document.querySelector(".total-amount");
  totalAmount.innerText = `€${total.toFixed(2)}`;
}

//update quantity
