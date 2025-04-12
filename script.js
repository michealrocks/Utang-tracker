let debts = JSON.parse(localStorage.getItem("debts")) || [];
let items = JSON.parse(localStorage.getItem("items")) || [];

function saveDebtsToLocalStorage() {
  localStorage.setItem("debts", JSON.stringify(debts));
}

function saveItemsToLocalStorage() {
  localStorage.setItem("items", JSON.stringify(items));
}

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabName).style.display = 'block';
  if (tabName === 'manageItems') renderItems();
  if (tabName === 'tracker') {
    loadItemDropdown();
    renderDebts();
  }
}

function loadItemDropdown() {
  const itemSelect = document.getElementById("itemSelect");
  itemSelect.innerHTML = "";
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item.name;
    option.textContent = `${item.name} (₱${item.price})`;
    itemSelect.appendChild(option);
  });
}

function addDebt() {
  const name = document.getElementById("name").value.trim();
  const itemName = document.getElementById("itemSelect").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  if (!name || !itemName || !quantity || quantity <= 0) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const item = items.find(i => i.name === itemName);
  const total = item.price * quantity;

  const newDebt = {
    id: Date.now(),
    name,
    item: itemName,
    quantity,
    price: item.price,
    total,
    date: new Date().toLocaleString(),
    paid: false
  };

  debts.push(newDebt);
  saveDebtsToLocalStorage();
  renderDebts();

  document.getElementById("name").value = "";
  document.getElementById("quantity").value = "";
}

function togglePaid(id) {
  const debt = debts.find(d => d.id === id);
  if (debt) {
    debt.paid = !debt.paid;
    saveDebtsToLocalStorage();
    renderDebts();
  }
}

function deleteDebt(id) {
  debts = debts.filter(d => d.id !== id);
  saveDebtsToLocalStorage();
  renderDebts();
}

function renderDebts() {
  const unpaidList = document.getElementById("unpaidList");
  const paidList = document.getElementById("paidList");

  unpaidList.innerHTML = "";
  paidList.innerHTML = "";

  debts.forEach(debt => {
    const div = document.createElement("div");
    div.className = "debt-entry";
    div.innerHTML = `
      <div>
        <strong>${debt.name}</strong> - ${debt.quantity}x ${debt.item} @ ₱${debt.price} = ₱${debt.total}<br/>
        <small>${debt.date}</small>
      </div>
      <div>
        <button onclick="togglePaid(${debt.id})">${debt.paid ? "Unpay" : "Pay"}</button>
        <button onclick="deleteDebt(${debt.id})">Delete</button>
      </div>
    `;

    if (debt.paid) paidList.appendChild(div);
    else unpaidList.appendChild(div);
  });
}

function addItem() {
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);

  if (!name || isNaN(price) || price <= 0) {
    alert("Please enter valid item name and price.");
    return;
  }

  items.push({ name, price });
  saveItemsToLocalStorage();
  renderItems();
  loadItemDropdown();

  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
}

function deleteItem(index) {
  items.splice(index, 1);
  saveItemsToLocalStorage();
  renderItems();
  loadItemDropdown();
}

function renderItems() {
  const itemList = document.getElementById("itemList");
  itemList.innerHTML = "";

  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item-entry";
    div.innerHTML = `
      <div>${item.name} - ₱${item.price}</div>
      <button onclick="deleteItem(${index})">Delete</button>
    `;
    itemList.appendChild(div);
  });
}

loadItemDropdown();
renderDebts();
