let debts = JSON.parse(localStorage.getItem("debts")) || [];
let items = [
  { name: "Rice", price: 50 },
  { name: "Oil", price: 100 },
  { name: "Eggs", price: 8 }
];

function saveToLocalStorage() {
  localStorage.setItem("debts", JSON.stringify(debts));
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
  saveToLocalStorage();
  renderDebts();

  document.getElementById("name").value = "";
  document.getElementById("quantity").value = "";
}

function togglePaid(id) {
  const debt = debts.find(d => d.id === id);
  if (debt) {
    debt.paid = !debt.paid;
    saveToLocalStorage();
    renderDebts();
  }
}

function deleteDebt(id) {
  debts = debts.filter(d => d.id !== id);
  saveToLocalStorage();
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

loadItemDropdown();
renderDebts();
