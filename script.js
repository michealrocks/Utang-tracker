let items = [];
let debts = [];

document.getElementById("debtForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("debtorName").value.trim();
  const itemName = document.getElementById("itemSelect").value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const item = items.find(i => i.name === itemName);
  const date = new Date().toLocaleString();

  if (name && item && quantity > 0) {
    let person = debts.find(d => d.name === name);
    if (!person) {
      person = { name, items: [], paid: false };
      debts.push(person);
    }
    person.items.push({ itemName, quantity, price: item.price, date });
    renderDebts();
    this.reset();
  }
});

document.getElementById("itemForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  if (name && !isNaN(price)) {
    items.push({ name, price });
    updateItemSelect();
    renderItemList();
    this.reset();
  }
});

function updateItemSelect() {
  const select = document.getElementById("itemSelect");
  select.innerHTML = "";
  items.forEach(i => {
    const opt = document.createElement("option");
    opt.value = i.name;
    opt.textContent = `${i.name} (₱${i.price})`;
    select.appendChild(opt);
  });
}

function renderItemList() {
  const container = document.getElementById("itemList");
  container.innerHTML = "";
  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "debt-entry";
    div.innerHTML = `
      <strong>${item.name}</strong>
      <small>₱${item.price}</small>
      <button onclick="editItem(${index})">Edit</button>
      <button onclick="deleteItem(${index})">Delete</button>
    `;
    container.appendChild(div);
  });
}

function renderDebts() {
  const paidSec = document.getElementById("paidSection");
  const unpaidSec = document.getElementById("unpaidSection");
  paidSec.innerHTML = "<h3>Paid</h3>";
  unpaidSec.innerHTML = "<h3>Unpaid</h3>";

  debts.forEach((debtor, dIndex) => {
    const total = debtor.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const section = debtor.paid ? paidSec : unpaidSec;
    const wrapper = document.createElement("div");
    wrapper.className = "debt-entry";
    wrapper.innerHTML = `
      <strong>${debtor.name}</strong>
      <small>Total: ₱${total}</small>
      <label>
        <input type="checkbox" onchange="togglePaid(${dIndex})" ${debtor.paid ? "checked" : ""}/> Paid
      </label>
      <button onclick="deleteDebtor(${dIndex})">Delete</button>
    `;

    debtor.items.forEach((item, iIndex) => {
      const line = document.createElement("div");
      line.style.margin = "10px 0 0 10px";
      line.innerHTML = `
        - ${item.itemName}, Qty: ${item.quantity}, ₱${item.price} x ${item.quantity} = ₱${item.price * item.quantity}<br/>
        <small>${item.date}</small><br/>
        <button onclick="editDebtItem(${dIndex}, ${iIndex})">Edit</button>
        <button onclick="deleteDebtItem(${dIndex}, ${iIndex})">Delete</button>
      `;
      wrapper.appendChild(line);
    });

    section.appendChild(wrapper);
  });
}

function deleteItem(index) {
  items.splice(index, 1);
  updateItemSelect();
  renderItemList();
}

function editItem(index) {
  const item = items[index];
  const newName = prompt("Edit item name:", item.name);
  const newPrice = parseFloat(prompt("Edit item price:", item.price));
  if (newName && !isNaN(newPrice)) {
    items[index] = { name: newName, price: newPrice };
    updateItemSelect();
    renderItemList();
  }
}

function togglePaid(index) {
  debts[index].paid = !debts[index].paid;
  renderDebts();
}

function deleteDebtor(index) {
  debts.splice(index, 1);
  renderDebts();
}

function deleteDebtItem(debtorIndex, itemIndex) {
  debts[debtorIndex].items.splice(itemIndex, 1);
  renderDebts();
}

function editDebtItem(debtorIndex, itemIndex) {
  const item = debts[debtorIndex].items[itemIndex];
  const newQty = parseInt(prompt(`Edit quantity for ${item.itemName}:`, item.quantity));
  if (!isNaN(newQty) && newQty > 0) {
    item.quantity = newQty;
    renderDebts();
  }
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  document.querySelectorAll(".tabs button").forEach(btn => btn.classList.remove("active-tab"));
  document.querySelector(`.tabs button[onclick="switchTab('${tabId}')"]`).classList.add("active-tab");
}

// Initial load
updateItemSelect();
renderItemList();
