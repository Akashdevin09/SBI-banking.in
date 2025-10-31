// Demo-only client logic: validates inputs and shows mock summary

const mockAccounts = {
  // accountNumber: data
  "1234567890": {
    dob: "1990-01-15",
    name: "Rahul Sharma",
    accountType: "Savings",
    ifsc: "SBIN0001234",
    branch: "Mumbai Main",
    balance: 150000.5,
    currency: "INR",
    lastUpdated: "2025-10-25",
    transactions: [
      { date: "2025-10-24", description: "Salary Credit", amount: 85000, type: "credit" },
      { date: "2025-10-22", description: "UPI: Groceries", amount: 2450, type: "debit" },
      { date: "2025-10-20", description: "ATM Withdrawal", amount: 6000, type: "debit" },
      { date: "2025-10-18", description: "Interest Credit", amount: 325, type: "credit" },
      { date: "2025-10-16", description: "Electricity Bill", amount: 1700, type: "debit" },
    ],
  },
  "9876543210": {
    dob: "1985-07-21",
    name: "Priya Iyer",
    accountType: "Current",
    ifsc: "SBIN0005678",
    branch: "Chennai Adyar",
    balance: 42500.75,
    currency: "INR",
    lastUpdated: "2025-10-25",
    transactions: [
      { date: "2025-10-23", description: "POS: Restaurant", amount: 2150, type: "debit" },
      { date: "2025-10-22", description: "UPI: Client Payment", amount: 30000, type: "credit" },
      { date: "2025-10-20", description: "Fuel", amount: 1500, type: "debit" },
      { date: "2025-10-19", description: "POS: Pharmacy", amount: 850, type: "debit" },
      { date: "2025-10-17", description: "NEFT Fee", amount: 15, type: "debit" },
    ],
  },
};

function formatCurrencyINR(amount) {
  const formatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
  return formatter.format(amount);
}

function showMessage(msg, type = "info") {
  const el = document.getElementById("formMessage");
  el.textContent = msg;
  el.style.color = type === "error" ? "#c62828" : type === "success" ? "#2e7d32" : "inherit";
}

function validateAccountNumber(value) {
  const numericOnly = value.replace(/\D/g, "");
  if (numericOnly.length < 8 || numericOnly.length > 16) return { ok: false, normalized: numericOnly };
  return { ok: true, normalized: numericOnly };
}

function renderSummary(accNum, data) {
  const results = document.getElementById("results");
  const content = document.getElementById("summaryContent");

  const summaryHtml = `
    <div class="summary-grid">
      <div class="summary-item"><div class="label">Account Holder</div><div class="value">${data.name}</div></div>
      <div class="summary-item"><div class="label">Account Number</div><div class="value">${accNum}</div></div>
      <div class="summary-item"><div class="label">Account Type</div><div class="value">${data.accountType}</div></div>
      <div class="summary-item"><div class="label">Branch (IFSC)</div><div class="value">${data.branch} (${data.ifsc})</div></div>
      <div class="summary-item"><div class="label">Available Balance</div><div class="value">${formatCurrencyINR(data.balance)}</div></div>
      <div class="summary-item"><div class="label">Last Updated</div><div class="value">${data.lastUpdated}</div></div>
    </div>

    <div class="transactions">
      <h4>Recent Transactions</h4>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${data.transactions
            .map(
              (t) => `
              <tr>
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td>${t.type}</td>
                <td class="${t.type === "credit" ? "amount-credit" : "amount-debit"}">${
                  t.type === "credit" ? "+" : "-"
                }${formatCurrencyINR(t.amount)}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  content.innerHTML = summaryHtml;
  results.classList.remove("hidden");
}

document.getElementById("summaryForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const accInput = document.getElementById("accountNumber");
  const dobInput = document.getElementById("dob");
  const acc = accInput.value.trim();
  const dob = dobInput.value; // yyyy-mm-dd

  const v = validateAccountNumber(acc);
  if (!v.ok) {
    showMessage("Please enter a valid account number (8–16 digits).", "error");
    return;
  }

  if (!dob) {
    showMessage("Please select your Date of Birth.", "error");
    return;
  }

  const record = mockAccounts[v.normalized];
  if (!record) {
    showMessage("No demo record found for this account number.", "error");
    return;
  }

  if (record.dob !== dob) {
    showMessage("Date of Birth does not match our demo records.", "error");
    return;
  }

  showMessage("Account found. Displaying summary…", "success");
  renderSummary(v.normalized, record);
});

document.getElementById("summaryForm").addEventListener("reset", () => {
  showMessage("");
  document.getElementById("results").classList.add("hidden");
  document.getElementById("summaryContent").innerHTML = "";
});