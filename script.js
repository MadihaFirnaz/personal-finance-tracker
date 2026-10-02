const date = new Date();
document.getElementById("current-date").innerText = date.toDateString();

const modal = document.getElementById("customAlert");
const msgText = document.getElementById("alertMessage");
const deletemodal = document.getElementById("deleteAlert");
const savedTransactions = localStorage.getItem('FinanceTracker');
const searchInput = document.getElementById("search");
const editModal = document.getElementById('editModal')
let transactionToDelete = null;
let editingTransactionId = null;



let transactions = [];

if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
    renderTransactions(transactions);
    updateDashboard();
}




//adding transaction
function add_transaction(event) {
    event.preventDefault();
    let amount = Number(document.getElementById("amount").value);
    let type = document.getElementById("type").value;
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;
    let description = document.getElementById("description").value;


    if (amount <= 0) {
        msgText.textContent = "Amount must be greater than 0";
        modal.showModal();
        return;
    }

    const transaction = {
        id: Date.now(),
        amount,
        type,
        category,
        date,
        description
    };

    transactions.push(transaction);

    msgText.textContent = "transaction added successfully";
    modal.showModal();
    event.target.reset();
    renderTransactions(transactions);
    updateDashboard();
    localStorage.setItem('FinanceTracker', JSON.stringify(transactions));
    return false;

}
function closeAlert() {
    modal.close(); // Closes the popup when clicking OK
}


//displaying transactions
function renderTransactions(data) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    data.forEach(transaction => {
        let formattedDate = new Date(transaction.date).toLocaleDateString("en-GB");
        tbody.innerHTML += `
    <tr>
        <td>${formattedDate}</td>
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td>${transaction.type}</td>
        <td>${transaction.amount}</td>
        <td><button class="edit-btn" data-id ="${transaction.id}">edit</button> <button class="delete-btn" data-id ="${transaction.id}" >delete</button></td>
    </tr>
    `;
    });

}


//delete and edit button popups
const tableBody = document.querySelector("tbody");

tableBody.addEventListener("click", function (event) {

    if (event.target.classList.contains("delete-btn")) {
        const transactionId = Number(event.target.dataset.id);
        transactionToDelete = transactionId;
        deletemodal.showModal();
    }

    if (event.target.classList.contains("edit-btn")) {

        const transactionId = Number(event.target.dataset.id);
        editingTransactionId = transactionId;
        const transactionToEdit = transactions.find(transaction => transaction.id === transactionId);

        document.getElementById("edit-amount").value =
            transactionToEdit.amount;
        document.getElementById("edit-type").value =
            transactionToEdit.type;

        document.getElementById("edit-category").value =
            transactionToEdit.category;

        document.getElementById("edit-date").value =
            transactionToEdit.date;

        document.getElementById("edit-description").value =
            transactionToEdit.description;
        editModal.showModal();


    }



});

//confirm Deletion
function confirmDelete() {
    transactions = transactions.filter(transaction => transaction.id !== transactionToDelete);
    renderTransactions(transactions);
    transactionToDelete = null;
    deletemodal.close();
    localStorage.setItem('FinanceTracker', JSON.stringify(transactions));
    updateDashboard();

}
function closeDelete() {
    deletemodal.close();

}

//dashboard statistics
function updateDashboard() {
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(transaction => {
        if (transaction.type === "Income") {
            totalIncome += transaction.amount
        }
        if (transaction.type === "Expense") {
            totalExpense += transaction.amount
        }
    })
    let totalBalance = totalIncome - totalExpense;
    let totalTransactions = transactions.length;

    document.getElementById("total-balance").textContent = totalBalance;
    document.getElementById("total-income").textContent = totalIncome;
    document.getElementById("total-expenditure").textContent = totalExpense;
    document.getElementById("total-transactions").textContent = totalTransactions;
}

//search transaciton

searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();
    const filteredTransactions = transactions.filter(transaction =>
        transaction.description.toLowerCase().includes(searchText)
    );
    renderTransactions(filteredTransactions);
})

//edit transaction:
function updateTransaction() {
    event.preventDefault();
    let newAmount = Number(document.getElementById("edit-amount").value);
    let newType = document.getElementById("edit-type").value;
    let newCategory = document.getElementById("edit-category").value;
    let newDate = document.getElementById("edit-date").value;
    let newDescription = document.getElementById("edit-description").value;


    if (newAmount <= 0) {
        msgText.textContent = "Amount must be greater than 0";
        modal.showModal();
        return;
    }

    const transaction = transactions.find(transaction => transaction.id === editingTransactionId);
    transaction.amount = newAmount;
    transaction.type = newType;
    transaction.category = newCategory;
    transaction.date = newDate;
    transaction.description = newDescription;

    localStorage.setItem(
        "FinanceTracker",
        JSON.stringify(transactions)
    );
    editingTransactionId = null;

    renderTransactions(transactions);
    updateDashboard();
    editModal.close();
    msgText.textContent =
        "Transaction updated successfully";

    modal.showModal();



}
function closeEdit() {
    editModal.close();

}
