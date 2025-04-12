// ========== STORAGE SETUP ==========
let debts = JSON.parse(localStorage.getItem("debts")) || [];
let items = JSON.parse(localStorage.getItem("items")) || [];
let debtors = JSON.parse(localStorage.getItem("debtors")) || [];

function saveDebtsToLocalStorage() {
  localStorage.setItem("debts", JSON.stringify(debts));
}

function saveItemsToLocalStorage() {
  localStorage.setItem("items", JSON.stringify(items));
}

function saveDebtorsToLocalStorage() {
  localStorage.setItem("debtors", JSON.stringify(debtors));
}

// ========== DEBTOR MANAGEMENT ==========
function addDebtor() {
  const name = document.getElementById("newDebtorName").value.trim();
  if (!name) return alert("Please enter a name.");
  if (!debtors.includes(name)) {
    debtors.push(name);
    saveDebtorsToLocalStorage();
    loadDebtorDropdown();
    renderDebtors();
  }
  document.getElementById("newDebtorName").value = "";
}

function deleteDebtor(name) {
  debtors = debtors.filter(debtor => debtor !== name);
  saveDebtorsToLocalStorage();
  loadDebtorDropdown();
  renderDebtors();
}

function loadDebtorDropdown() {
  const select = document.getElementById("debtorSelect");
  select.innerHTML = "";
  debtors.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

function renderDebtors() {
  const list = document.getElementById("debtorList");
  list.innerHTML = "";
  debtors.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteDebtor(name);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

// ========== DEBT MANAGEMENT ==========
function addDebt() {
  const name = document.getElementById("debtorSelect").value;
  const itemName = document.getElementById("itemSelect").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  if (!name || !itemName || isNaN(quantity) || quantity <= 0) {
    alert("Fill in all fields correctly.");
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
  document.getElementById("quantity").value = "";
}

function deleteDebt(id) {
  debts = debts.filter(debt => debt.id !== id);
  saveDebtsToLocalStorage();
  renderDebts();
}

function togglePaid(id) {
  const debt = debts.find(d => d.id === id);
  if (debt) debt.paid = !debt.paid;
  saveDebtsToLocalStorage();
  renderDebts();
}

function filterDebts(filter) {
  renderDebts(filter);
}

function renderDebts(filter = "all") {
  const list = document.getElementById("debtList");
  list.innerHTML = "";

  let filteredDebts = debts;
  if (filter === "paid") filteredDebts = debts.filter(d => d.paid);
  else if (filter === "unpaid") filteredDebts = debts.filter(d => !d.paid);

  const groupedDebts = filteredDebts.reduce((group, debt) => {
    if (!group[debt.name]) group[debt.name] = [];
    group[debt.name].push(debt);
    return group;
  }, {});

  for (const debtorName in groupedDebts) {
    const debtorDebts = groupedDebts[debtorName];
    const div = document.createElement("div");
    div.className = "debt-entry";
    const debtorTotal = debtorDebts.reduce((total, debt) => total + debt.total, 0);
    div.innerHTML = `
      <div>
        <strong>${debtorName}</strong> - Total Debt: ₱${debtorTotal}
        <br><small>Debts: ${debtorDebts.length}</small>
      </div>
      <div>
        <button onclick="togglePaid(${debtorDebts[0].id})">${debtorDebts[0].paid ? "Mark Unpaid" : "Mark Paid"}</button>
        <button onclick="deleteDebt(${debtorDebts[0].id})">Delete All</button>
      </div>
      <ul>
        ${debtorDebts.map(debt => `
          <li>${debt.item} x${debt.quantity} = ₱${debt.total} <button onclick="deleteDebt(${debt.id})">Delete</button></li>
        `).join('')}
      </ul>
    `;
    list.appendChild(div);
  }

  // Grand total
  const grandTotal = filteredDebts.reduce((sum, d) => sum + d.total, 0);
  const totalDiv = document.createElement("div");
  totalDiv.style.marginTop = "15px";
  totalDiv.style.fontWeight = "bold";
  totalDiv.textContent = `Grand Total: ₱${grandTotal}`;
  list.appendChild(totalDiv);
}

// ========== ITEM MANAGEMENT ==========
function addItem() {
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);

  if (!name || isNaN(price) || price <= 0) {
    alert("Enter valid item and price.");
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
      ${item.name} - ₱${item.price}
      <button onclick="deleteItem(${index})">Delete</button>
    `;
    itemList.appendChild(div);
  });
}

function loadItemDropdown() {
  const select = document.getElementById("itemSelect");
  select.innerHTML = "";
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item.name;
    option.textContent = `${item.name} (₱${item.price})`;
    select.appendChild(option);
  });
}

// ========== TAB SWITCHING ==========
function switchTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}

// ========== INIT ==========
window.onload = function () {
  loadDebtorDropdown();
  loadItemDropdown();
  renderDebts();
  renderItems();
  renderDebtors();
};
