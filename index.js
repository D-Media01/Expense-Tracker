let balance = 0;
let transactionInput = [];

const expenseInput = document.getElementById("expense");
const dateInput = document.getElementById("date");
const categoryInput = document.getElementById("category");
const transactionTypeInput = document.getElementById("transaction-type");
const addBtn = document.getElementById("button");
const summaryIncomeOutput = document.getElementById("summary-income");
const summaryExpenseOutput = document.getElementById("summary-expense");
const summaryBalanceOutput = document.getElementById("summary-balance");
const transactionHistoryOutput = document.getElementById("transaction-history");
const filterOptionDisplay = document.getElementById("filter-option");

// --- SAVE TRANSACTION ---
addBtn.addEventListener("click", function () {
    const amount = Number(expenseInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;
    const transactionType = transactionTypeInput.value;
    let summaryBalance = Number(summaryBalanceOutput.textContent) || 0;
    let summaryIncome = Number(summaryIncomeOutput.textContent) || 0;
    let summaryExpense = Number(summaryExpenseOutput.textContent) || 0;

    if (isNaN(amount) || amount <= 0) {
        alert("Please input a valid amount");
        return;
    }
    if (date === "") {
        alert("Please input a date");
        return;
    }
    if (transactionType === "") {
        alert("Please choose a transaction type.");
        return;
    }
    if (category === "") {
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

    const sign = transactionType === "income" ? "+ $" : "- $";
    const typeClass = transactionType === "income" ? "income" : "expense"; // ✅ add class

    const transactionItem = `
        <div class="transaction-item">
            <div class="category-expense">
                <p class="transaction-category">${category}</p>
                <p class="transaction-expense ${typeClass}">${sign}${amount}</p>
            </div>
            <p class="transaction-date">${date}</p>
        </div>
    `;

    // ✅ PREPEND to UI immediately
    transactionHistoryOutput.innerHTML =
        transactionItem + transactionHistoryOutput.innerHTML;

    // Update summary values
    if (transactionType === "income") {
        summaryIncome += amount;
    } else if (transactionType === "expense") {
        summaryExpense += amount;
    }
    summaryBalance = summaryIncome - summaryExpense;

    summaryIncomeOutput.textContent = "+ $" + summaryIncome;
    summaryExpenseOutput.textContent = "- $" + summaryExpense;
    summaryBalanceOutput.textContent =
        (summaryBalance >= 0 ? "+ $" : "- $") + Math.abs(summaryBalance);

    // Get existing transactions
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Add the new one to the TOP
    transactions.unshift(transaction);

    // Save updated list
    localStorage.setItem("transactions", JSON.stringify(transactions));
});

// --- LOAD TRANSACTIONS ON PAGE REFRESH ---
function loadTransactions() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    let summaryIncome = 0;
    let summaryExpense = 0;

    transactionHistoryOutput.innerHTML = ""; // clear first

    // ✅ Append in stored order (newest already at top because of unshift)
    transactions.forEach(transaction => {
        const sign = transaction.transactionType === "income" ? "+ $" : "- $";
        const typeClass = transaction.transactionType === "income" ? "income" : "expense"; 

        const transactionItem = `
            <div class="transaction-item">
                <div class="category-expense">
                    <p class="transaction-category">${transaction.category}</p>
                    <p class="transaction-expense ${typeClass}">${sign}${transaction.amount}</p>
                </div>
                <p class="transaction-date">${transaction.date}</p>
            </div>
        `;

        transactionHistoryOutput.innerHTML += transactionItem; // ✅ FIXED (was prepending)
        
        if (transaction.transactionType === "income") {
            summaryIncome += transaction.amount;
        } else if (transaction.transactionType === "expense") {
            summaryExpense += transaction.amount;
        }
    });

    // Update summary values
    const summaryBalance = summaryIncome - summaryExpense;
    summaryIncomeOutput.textContent = "+ $" + summaryIncome;
    summaryExpenseOutput.textContent = "- $" + summaryExpense;
    summaryBalanceOutput.textContent =
        (summaryBalance >= 0 ? "+ $" : "- $") + Math.abs(summaryBalance);
}

// Run once when the page loads
document.addEventListener("DOMContentLoaded", loadTransactions);
