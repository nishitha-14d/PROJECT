/* ================= LOGIN ================= */

const accounts = {

    admin: {
        email: "dnishitha14@gmail.com",
        password: "Nishi123@"
    },

    user: {
        email: "nivi@gmail.com",
        password: "nivi123"
    }

};


/* LOGIN */

function login(event) {

    event.preventDefault();

    const role = document.getElementById("role").value;

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();


    if (role === "") {

        alert("Please select Admin or User.");
        return;

    }


    if (
        email === accounts[role].email &&
        password === accounts[role].password
    ) {

        alert("Login Successful!");

        document.getElementById("loggedInRole").textContent =
            "Logged in as: " +
            (role === "admin" ? "Admin" : "User");

        document.getElementById("loginPage").style.display =
            "none";

        document.getElementById("website").style.display =
            "block";

    }

    else {

        alert("Invalid email or password for the selected role.");

    }

}


/* LOGOUT */

function logout() {

    document.getElementById("website").style.display =
        "none";

    document.getElementById("loginPage").style.display =
        "flex";

    document.getElementById("role").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

}


/* FORGOT PASSWORD */

function forgotPassword(event) {

    event.preventDefault();

    alert("Password reset option will be available soon.");

}


/* SIGN UP */

function signUp(event) {

    event.preventDefault();

    alert("Sign Up page will be available soon.");

}


/* ================= EXPENSE TRACKER ================= */

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

let budget =
    Number(localStorage.getItem("budget")) || 0;


const form =
    document.getElementById("transactionForm");


/* ADD TRANSACTION */

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const title =
        document.getElementById("title").value;

    const amount =
        Number(document.getElementById("amount").value);

    const type =
        document.getElementById("type").value;

    const category =
        document.getElementById("category").value;

    const date =
        document.getElementById("date").value;

    const description =
        document.getElementById("description").value;


    const transaction = {

        id: Date.now(),

        title: title,

        amount: amount,

        type: type,

        category: category,

        date: date,

        description: description

    };


    transactions.unshift(transaction);

    saveData();

    form.reset();

    displayData();

});


/* DELETE TRANSACTION */

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );

    saveData();

    displayData();

}


/* SET BUDGET */

function setBudget() {

    const value =
        Number(document.getElementById("budgetInput").value);


    if (value < 0) {

        alert("Budget cannot be negative.");

        return;

    }


    budget = value;

    localStorage.setItem("budget", budget);

    displayData();

}


/* SAVE DATA */

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


/* DISPLAY DATA */

function displayData() {

    calculateTotals();

    displayTransactions();

    displayReports();

    displayBudget();

}


/* CALCULATE TOTALS */

function calculateTotals() {

    let income = 0;

    let expense = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += Number(transaction.amount);

        }

        else {

            expense += Number(transaction.amount);

        }

    });


    const currentBalance =
        income - expense;


    document.getElementById("totalIncome").textContent =
        "₹" + income.toLocaleString("en-IN");


    document.getElementById("totalExpense").textContent =
        "₹" + expense.toLocaleString("en-IN");


    document.getElementById("balance").textContent =
        "₹" + currentBalance.toLocaleString("en-IN");


    document.getElementById("displayBudget").textContent =
        "₹" + budget.toLocaleString("en-IN");

}


/* DISPLAY TRANSACTIONS */

function displayTransactions() {

    const list =
        document.getElementById("transactionList");

    list.innerHTML = "";


    if (transactions.length === 0) {

        list.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No transactions added yet.
                </td>
            </tr>
        `;

        return;

    }


    transactions.forEach(transaction => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${transaction.title}</strong>
                <br>
                <small>
                    ${transaction.description || ""}
                </small>
            </td>

            <td>
                ${transaction.category}
            </td>

            <td>

                <span class="${
                    transaction.type === "income"
                    ? "income-type"
                    : "expense-type"
                }">

                    ${
                        transaction.type === "income"
                        ? "Income"
                        : "Expense"
                    }

                </span>

            </td>

            <td>

                <strong>

                    ${
                        transaction.type === "income"
                        ? "+"
                        : "-"
                    }

                    ₹${Number(transaction.amount)
                        .toLocaleString("en-IN")}

                </strong>

            </td>

            <td>
                ${transaction.date}
            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">

                    <i class="fa-solid fa-trash"></i>
                    Delete

                </button>

            </td>

        `;


        list.appendChild(row);

    });

}


/* DISPLAY BUDGET */

function displayBudget() {

    let totalExpense = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "expense") {

            totalExpense +=
                Number(transaction.amount);

        }

    });


    document.getElementById("budgetSpent").textContent =
        "₹" + totalExpense.toLocaleString("en-IN");


    document.getElementById("budgetAmount").textContent =
        "₹" + budget.toLocaleString("en-IN");


    let percentage = 0;


    if (budget > 0) {

        percentage =
            (totalExpense / budget) * 100;

    }


    percentage =
        Math.min(percentage, 100);


    document.getElementById("progressBar")
        .style.width = percentage + "%";


    const status =
        document.getElementById("budgetStatus");


    if (budget === 0) {

        status.textContent =
            "Set a budget to start tracking.";

        status.style.color =
            "#666";

    }

    else if (totalExpense > budget) {

        status.textContent =
            "⚠️ You have exceeded your budget!";

        status.style.color =
            "#dc2626";

    }

    else {

        const remaining =
            budget - totalExpense;

        status.textContent =
            "₹" +
            remaining.toLocaleString("en-IN") +
            " remaining";

        status.style.color =
            "#16a34a";

    }

}


/* EXPENSE REPORT */

function displayReports() {

    const reports =
        document.getElementById("reports");

    const categoryTotals = {};


    transactions.forEach(transaction => {

        if (transaction.type === "expense") {

            const category =
                transaction.category;

            categoryTotals[category] =
                (categoryTotals[category] || 0) +
                Number(transaction.amount);

        }

    });


    const categories =
        Object.entries(categoryTotals);


    if (categories.length === 0) {

        reports.innerHTML =
            "<p>Add expenses to see your report.</p>";

        return;

    }


    const totalExpense =
        categories.reduce(
            (sum, item) =>
                sum + item[1],
            0
        );


    reports.innerHTML = "";


    categories
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, amount]) => {

            const percentage =
                (amount / totalExpense) * 100;


            reports.innerHTML += `

                <div class="report-item">

                    <div class="report-header">

                        <span>
                            ${category}
                        </span>

                        <strong>
                            ₹${amount.toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <div class="report-background">

                        <div
                            class="report-bar"
                            style="width:${percentage}%">
                        </div>

                    </div>


                    <small>
                        ${percentage.toFixed(1)}%
                        of total expenses
                    </small>

                </div>

            `;

        });

}


/* LOAD DATA */

displayData();