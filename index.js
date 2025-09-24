// Use a single source of truth
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// DOM refs
const expenseInput = document.getElementById("expense");
const dateInput = document.getElementById("date");
const categoryInput = document.getElementById("category");
const transactionTypeInput = document.getElementById("transaction-type");
const addBtn = document.getElementById("button");
const summaryIncomeOutput = document.getElementById("summary-income");
const summaryExpenseOutput = document.getElementById("summary-expense");
const summaryBalanceOutput = document.getElementById("summary-balance");
const transactionHistoryOutput = document.getElementById("transaction-history");

// Save helper
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Render / load function (rebuilds the UI + recalculates totals)
function loadTransactions() {
  transactionHistoryOutput.innerHTML = ""; // clear UI
  let summaryIncome = 0;
  let summaryExpense = 0;

  // transactions already ordered newest-first (we use unshift when adding)
  transactions.forEach(transaction => {
    const sign = transaction.transactionType === "income" ? "+ $" : "- $";
    const typeClass = transaction.transactionType === "income" ? "income" : "expense";

    // build one transaction item (matches your CSS classes)
    const transactionItem = `
      <div class="transaction-item">
        <div class="category-expense">
          <p class="transaction-category">${transaction.category}</p>
          <p class="transaction-expense ${typeClass}">${sign}${Number(transaction.amount).toLocaleString()}</p>
        </div>
        <p class="transaction-date">${transaction.date}</p>
      </div>
    `;

    // append in array order (array already has newest first)
    transactionHistoryOutput.innerHTML += transactionItem;

    if (transaction.transactionType === "income") {
      summaryIncome += Number(transaction.amount);
    } else {
      summaryExpense += Number(transaction.amount);
    }
  });

  const summaryBalance = summaryIncome - summaryExpense;

  // update summary outputs (formatted)
  summaryIncomeOutput.textContent = "+ $" + summaryIncome.toLocaleString();
  summaryExpenseOutput.textContent = "- $" + summaryExpense.toLocaleString();
  summaryBalanceOutput.textContent =
    (summaryBalance >= 0 ? "+ $" : "- $") + Math.abs(summaryBalance).toLocaleString();

  // optionally add color class to balance element here via CSS if you want
}

// Add transaction handler
addBtn.addEventListener("click", function () {
  const amount = Number(expenseInput.value);
  const category = categoryInput.value.trim();
  const date = dateInput.value;
  const transactionType = transactionTypeInput.value;

  // validations
  if (isNaN(amount) || amount <= 0) {
    alert("Please input a valid amount");
    return;
  }
  if (!date) {
    alert("Please input a date");
    return;
  }
  if (!transactionType) {
    alert("Please choose a transaction type.");
    return;
  }
  if (!category) {
    alert("Please choose a category");
    return;
  }

  const transaction = {
    id: Date.now(),
    amount: amount,
    date: date,
    transactionType: transactionType,
    category: category
  };

  // add to the top of the array
  transactions.unshift(transaction);

  // persist + re-render
  saveTransactions();
  loadTransactions();

  // clear inputs (nice UX)
  expenseInput.value = "";
  dateInput.value = "";
  categoryInput.value = "";
  transactionTypeInput.value = "income";
});

// initial render
document.addEventListener("DOMContentLoaded", loadTransactions);
