// ========================================
// FLOW — PART 3
// ========================================


// ========================================
// DATA
// ========================================

let transactions =
    JSON.parse(localStorage.getItem("flowTransactions")) || [];

let subscriptions =
    JSON.parse(localStorage.getItem("flowSubscriptions")) || [];

let bills =
    JSON.parse(localStorage.getItem("flowBills")) || [];

let goals =
    JSON.parse(localStorage.getItem("flowGoals")) || [];

let groups =
    JSON.parse(localStorage.getItem("flowGroups")) || [];


// ========================================
// BUDGETS
// ========================================

let budgets =
    JSON.parse(
        localStorage.getItem("flowBudgets")
    ) || {

        Food: 500,

        Transport: 300,

        Shopping: 400,

        Entertainment: 300,

        Bills: 500,

        Education: 300,

        Other: 200

    };


// ========================================
// SAVE DATA
// ========================================

function saveData() {

    localStorage.setItem(
        "flowTransactions",
        JSON.stringify(transactions)
    );

    localStorage.setItem(
        "flowSubscriptions",
        JSON.stringify(subscriptions)
    );

    localStorage.setItem(
        "flowBills",
        JSON.stringify(bills)
    );

    localStorage.setItem(
        "flowGoals",
        JSON.stringify(goals)
    );

    localStorage.setItem(
        "flowGroups",
        JSON.stringify(groups)
    );
    localStorage.setItem(
    "flowBudgets",
    JSON.stringify(budgets)
    );
}

// ========================================
// MODALS
// ========================================

function openTransactionModal() {

    document
        .getElementById("transactionModal")
        .classList.add("active");

}
function updateTransactionCategories() {

    const type =
        document.getElementById(
            "transactionType"
        ).value;

    const category =
        document.getElementById(
            "transactionCategory"
        );

    if (type === "income") {

        category.innerHTML = `

            <option>Job</option>
            <option>Freelance</option>
            <option>Side Hustle</option>
            <option>Gift</option>
            <option>Other</option>

        `;

    }

    else {

        category.innerHTML = `

            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Entertainment</option>
            <option>Bills</option>
            <option>Education</option>
            <option>Other</option>

        `;

    }

}

function openBillModal() {

    document
        .getElementById("billModal")
        .classList.add("active");
}


function openGoalModal() {

    document
        .getElementById("goalModal")
        .classList.add("active");
}


function openGroupModal() {

    document
        .getElementById("groupModal")
        .classList.add("active");
}


function openGroupExpenseModal(groupId) {

    const group =
        groups.find(
            group =>
                group.id === groupId
        );


    if (!group) return;


    const payerSelect =
        document.getElementById(
            "groupExpensePayer"
        );


    payerSelect.innerHTML =

        group.members

            .map(member => `

                <option value="${member}">
                    ${member}
                </option>

            `)

            .join("");


    document
        .getElementById("expenseGroupId")
        .value = groupId;


    document
        .getElementById("groupExpenseModal")
        .classList.add("active");
}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("active");
}


// ========================================
// MONEY
// ========================================

function money(amount) {

    return "$" +

        amount.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}


// ========================================
// TRANSACTIONS
// ========================================

document
    .getElementById("transactionForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "transactionName"
                    )
                    .value
                    .trim();


            const amount =
                Number(
                    document
                        .getElementById(
                            "transactionAmount"
                        )
                        .value
                );


            const type =
                document
                    .getElementById(
                        "transactionType"
                    )
                    .value;


            const category =
                document
                    .getElementById(
                        "transactionCategory"
                    )
                    .value;


            if (amount <= 0) {

                alert(
                    "Please enter an amount greater than zero."
                );

                return;
            }


            transactions.unshift({

                id: Date.now(),

                name,

                amount,

                type,

                category,

                date:
                    new Date().toISOString()
                  

            });


            saveData();

            render();

            this.reset();

            closeModal(
                "transactionModal"
            );

        }
    );


// ========================================
// DELETE TRANSACTION
// ========================================

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveData();

    render();
}


// ========================================
// SUBSCRIPTIONS
// ========================================

document
    .getElementById("subscriptionForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "subscriptionName"
                    )
                    .value
                    .trim();


            const amount =
                Number(
                    document
                        .getElementById(
                            "subscriptionAmount"
                        )
                        .value
                );


            const date =
                document
                    .getElementById(
                        "subscriptionDate"
                    )
                    .value;


            if (amount <= 0) {

                alert(
                    "Please enter a valid subscription price."
                );

                return;
            }


const frequency =
    document
        .getElementById(
            "subscriptionFrequency"
        )
        .value;


subscriptions.push({

    id: Date.now(),

    name,

    amount,

    date,

    frequency,

    active: true

});


            saveData();

            render();

            this.reset();

            closeModal(
                "subscriptionModal"
            );

        }
    );


// ========================================
// DELETE SUBSCRIPTION
// ========================================

function deleteSubscription(id) {

    subscriptions =
        subscriptions.filter(
            subscription =>
                subscription.id !== id
        );


    saveData();

    render();
}
function toggleSubscription(id) {

    const subscription =
        subscriptions.find(
            subscription =>
                subscription.id === id
        );

    if (!subscription) return;

    subscription.active =
        subscription.active === false;

    saveData();

    render();
}

// ========================================
// SUBSCRIPTION TOTALS
// ========================================

function calculateMonthlySubscriptions() {

    return subscriptions.reduce(

        (total, subscription) => {

            if (
                subscription.active === false
            ) {
                return total;
            }

            if (
                subscription.frequency === "weekly"
            ) {

                return total +
                    (
                        subscription.amount *
                        52 /
                        12
                    );

            }

            if (
                subscription.frequency === "yearly"
            ) {

                return total +
                    (
                        subscription.amount /
                        12
                    );

            }

            return total +
                subscription.amount;

        },

        0

    );

}


function calculateYearlySubscriptions() {

    return calculateMonthlySubscriptions()
        * 12;
}


// ========================================
// BILLS
// ========================================

document
    .getElementById("billForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "billName"
                    )
                    .value
                    .trim();


            const amount =
                Number(
                    document
                        .getElementById(
                            "billAmount"
                        )
                        .value
                );


            const date =
                document
                    .getElementById(
                        "billDate"
                    )
                    .value;


            if (amount <= 0) {

                alert(
                    "Please enter a valid bill amount."
                );

                return;
            }


            bills.push({

                id: Date.now(),

                name,

                amount,

                date

            });


            saveData();

            render();

            this.reset();

            closeModal(
                "billModal"
            );

        }
    );


// ========================================
// DELETE BILL
// ========================================

function deleteBill(id) {

    bills =
        bills.filter(
            bill =>
                bill.id !== id
        );


    saveData();

    render();
}


// ========================================
// SAVINGS GOALS
// ========================================

document
    .getElementById("goalForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "goalName"
                    )
                    .value
                    .trim();


            const target =
                Number(
                    document
                        .getElementById(
                            "goalTarget"
                        )
                        .value
                );


            const current =
                Number(
                    document
                        .getElementById(
                            "goalCurrent"
                        )
                        .value
                );


            if (target <= 0) {

                alert(
                    "Your target must be greater than zero."
                );

                return;
            }


            goals.push({

                id: Date.now(),

                name,

                target,

                current

            });


            saveData();

            render();

            this.reset();

            closeModal(
                "goalModal"
            );

        }
    );


// ========================================
// DELETE GOAL
// ========================================

function deleteGoal(id) {

    goals =
        goals.filter(
            goal =>
                goal.id !== id
        );


    saveData();

    render();
}


// ========================================
// GROUPS
// ========================================

document
    .getElementById("groupForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "groupName"
                    )
                    .value
                    .trim();


            const membersText =
                document
                    .getElementById(
                        "groupMembers"
                    )
                    .value;


            const members =
                membersText

                    .split(",")

                    .map(
                        member =>
                            member.trim()
                    )

                    .filter(
                        member =>
                            member.length > 0
                    );


            if (members.length < 2) {

                alert(
                    "A group needs at least two members."
                );

                return;
            }


            groups.push({

                id: Date.now(),

                name,

                members,

                expenses: []

            });


            saveData();

            render();

            this.reset();

            closeModal(
                "groupModal"
            );

        }
    );


// ========================================
// GROUP EXPENSES
// ========================================

document
    .getElementById("groupExpenseForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const groupId =
                Number(
                    document
                        .getElementById(
                            "expenseGroupId"
                        )
                        .value
                );


            const name =
                document
                    .getElementById(
                        "groupExpenseName"
                    )
                    .value
                    .trim();


            const amount =
                Number(
                    document
                        .getElementById(
                            "groupExpenseAmount"
                        )
                        .value
                );


            const payer =
                document
                    .getElementById(
                        "groupExpensePayer"
                    )
                    .value;


            if (amount <= 0) {

                alert(
                    "Expense must be greater than zero."
                );

                return;
            }


            const group =
                groups.find(
                    group =>
                        group.id === groupId
                );


            if (!group) return;


            group.expenses.push({

                id: Date.now(),

                name,

                amount,

                payer

            });


            saveData();

            render();

            this.reset();

            closeModal(
                "groupExpenseModal"
            );

        }
    );


// ========================================
// DELETE GROUP
// ========================================

function deleteGroup(id) {

    groups =
        groups.filter(
            group =>
                group.id !== id
        );


    saveData();

    render();
}


// ========================================
// DELETE GROUP EXPENSE
// ========================================

function deleteGroupExpense(
    groupId,
    expenseId
) {

    const group =
        groups.find(
            group =>
                group.id === groupId
        );


    if (!group) return;


    group.expenses =
        group.expenses.filter(
            expense =>
                expense.id !== expenseId
        );


    saveData();

    render();
}


// ========================================
// CALCULATE GROUP SETTLEMENT
// ========================================

function calculateSettlements(group) {

    const members =
        group.members;


    const expenses =
        group.expenses;


    if (expenses.length === 0) {

        return [];
    }


    // Total amount spent

    const total =
        expenses.reduce(

            (sum, expense) =>

                sum + expense.amount,

            0
        );


    // Everyone's equal share

    const share =
        total / members.length;


    // How much each person actually paid

    const paid = {};


    members.forEach(
        member => {

            paid[member] = 0;

        }
    );


    expenses.forEach(
        expense => {

            paid[expense.payer] +=
                expense.amount;

        }
    );


    // Positive = person should receive money
    // Negative = person owes money

    const balances = {};


    members.forEach(
        member => {

            balances[member] =
                paid[member] - share;

        }
    );


    const creditors = [];

    const debtors = [];


    members.forEach(
        member => {

            if (balances[member] > 0.01) {

                creditors.push({

                    name: member,

                    amount:
                        balances[member]

                });

            }

            else if (
                balances[member] < -0.01
            ) {

                debtors.push({

                    name: member,

                    amount:
                        -balances[member]

                });

            }

        }
    );


    const settlements = [];


    let debtorIndex = 0;

    let creditorIndex = 0;


    while (

        debtorIndex < debtors.length &&

        creditorIndex < creditors.length

    ) {

        const debtor =
            debtors[debtorIndex];


        const creditor =
            creditors[creditorIndex];


        const amount =
            Math.min(
                debtor.amount,
                creditor.amount
            );


        settlements.push({

            from: debtor.name,

            to: creditor.name,

            amount: amount

        });


        debtor.amount -= amount;

        creditor.amount -= amount;


        if (
            debtor.amount < 0.01
        ) {

            debtorIndex++;

        }


        if (
            creditor.amount < 0.01
        ) {

            creditorIndex++;

        }

    }


    return settlements;
}


// ========================================
// GROUP RENDERING
// ========================================

function renderGroups() {

    const container =
        document.getElementById(
            "groupList"
        );


    if (groups.length === 0) {

        container.innerHTML =
            `<p class="empty">

                Create a group to start
                splitting expenses.

            </p>`;

        return;
    }


    container.innerHTML =

        groups

            .map(group => {


                const total =

                    group.expenses.reduce(

                        (sum, expense) =>

                            sum + expense.amount,

                        0

                    );


                const settlements =
                    calculateSettlements(group);


                return `

                <div
                    style="
                        border:1px solid #eee;
                        border-radius:14px;
                        padding:18px;
                        margin-bottom:15px;
                    "
                >

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            margin-bottom:12px;
                        "
                    >

                        <div>

                            <div
                                style="
                                    font-weight:700;
                                    font-size:17px;
                                "
                            >

                                ${group.name}

                            </div>


                            <div
                                style="
                                    font-size:12px;
                                    color:#888;
                                    margin-top:4px;
                                "
                            >

                                ${group.members.join(", ")}

                            </div>

                        </div>


                        <strong>

                            ${money(total)}

                        </strong>

                    </div>


                    <div
                        style="
                            display:flex;
                            gap:8px;
                            flex-wrap:wrap;
                            margin-bottom:15px;
                        "
                    >

                        <button
                            onclick="openGroupExpenseModal(${group.id})"
                        >

                            + Expense

                        </button>


                        <button
                            onclick="deleteGroup(${group.id})"
                            style="
                                background:#eee;
                                color:#222;
                            "
                        >

                            Delete

                        </button>

                    </div>


                    ${
                        group.expenses.length === 0

                        ?

                        `<p
                            style="
                                color:#999;
                                font-size:13px;
                            "
                        >

                            No expenses yet.

                        </p>`

                        :

                        group.expenses

                            .map(expense => `

                                <div
                                    style="
                                        display:flex;
                                        justify-content:space-between;
                                        align-items:center;
                                        padding:9px 0;
                                        border-top:1px solid #eee;
                                        font-size:13px;
                                    "
                                >

                                    <span>

                                        ${expense.name}

                                        <span
                                            style="
                                                color:#888;
                                            "
                                        >

                                            •
                                            ${expense.payer}
                                            paid

                                        </span>

                                    </span>


                                    <span>

                                        ${money(expense.amount)}

                                        <button
                                            onclick="
                                                deleteGroupExpense(
                                                    ${group.id},
                                                    ${expense.id}
                                                )
                                            "
                                            style="
                                                margin-left:6px;
                                                padding:3px 6px;
                                                background:#eee;
                                                color:#222;
                                            "
                                        >

                                            ×

                                        </button>

                                    </span>

                                </div>

                            `)

                            .join("")

                    }


                    ${
                        settlements.length > 0

                        ?

                        `

                        <div
                            style="
                                margin-top:15px;
                                padding-top:15px;
                                border-top:1px solid #eee;
                            "
                        >

                            <div
                                style="
                                    font-size:11px;
                                    letter-spacing:1px;
                                    color:#888;
                                    margin-bottom:8px;
                                "
                            >

                                SETTLEMENTS

                            </div>


                            ${
                                settlements

                                    .map(
                                        settlement => `

                                            <div
                                                style="
                                                    display:flex;
                                                    justify-content:space-between;
                                                    padding:7px 0;
                                                    font-size:13px;
                                                "
                                            >

                                                <span>

                                                    ${settlement.from}

                                                    →
                                                    
                                                    ${settlement.to}

                                                </span>


                                                <strong>

                                                    ${money(
                                                        settlement.amount
                                                    )}

                                                </strong>

                                            </div>

                                        `
                                    )

                                    .join("")
                            }

                        </div>

                        `

                        :

                        ""

                    }

                </div>

                `;

            })

            .join("");
}


// ========================================
// MONEY CALCULATIONS
// ========================================

function calculateIncome() {

    return transactions

        .filter(
            transaction =>
                transaction.type === "income"
        )

        .reduce(

            (total, transaction) =>

                total + transaction.amount,

            0

        );
}
function calculateMonthlyIncome() {

    const now = new Date();

    const month =
        now.getMonth();

    const year =
        now.getFullYear();


    return transactions

        .filter(transaction => {

            if (
                transaction.type !== "income"
            ) {
                return false;
            }

            const date =
                new Date(transaction.date);

            return (
                date.getMonth() === month &&
                date.getFullYear() === year
            );

        })

        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );
}
function calculateMonthlyExpenses() {

    const now = new Date();

    const month =
        now.getMonth();

    const year =
        now.getFullYear();


    return transactions

        .filter(transaction => {

            if (
                transaction.type !== "expense"
            ) {
                return false;
            }

            const date =
                new Date(transaction.date);

            return (
                date.getMonth() === month &&
                date.getFullYear() === year
            );

        })

        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );
}
function calculateYearlyIncome() {

    const year =
        new Date().getFullYear();


    return transactions

        .filter(transaction => {

            if (
                transaction.type !== "income"
            ) {
                return false;
            }

            const date =
                new Date(transaction.date);

            return (
                date.getFullYear() === year
            );

        })

        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );
}
function calculateYearlyExpenses() {

    const year =
        new Date().getFullYear();


    return transactions

        .filter(transaction => {

            if (
                transaction.type !== "expense"
            ) {
                return false;
            }

            const date =
                new Date(transaction.date);

            return (
                date.getFullYear() === year
            );

        })

        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );
}

function calculateExpenses() {

    return transactions

        .filter(
            transaction =>
                transaction.type === "expense"
        )

        .reduce(

            (total, transaction) =>

                total + transaction.amount,

            0

        );
}


function calculateBalance() {

    return calculateIncome()
        -
        calculateExpenses();
}


// ========================================
// UPCOMING
// ========================================

function calculateUpcoming() {

    const subscriptionTotal =
        calculateMonthlySubscriptions();


    const billTotal =

        bills.reduce(

            (total, bill) =>

                total + bill.amount,

            0

        );


    return subscriptionTotal
        +
        billTotal;
}


// ========================================
// TRANSACTION RENDERING
// ========================================

function renderTransactions() {

    const container =
        document.getElementById(
            "transactionList"
        );


    if (transactions.length === 0) {

        container.innerHTML =
            `<p class="empty">
                No transactions yet.
            </p>`;

        return;
    }


    container.innerHTML =

        transactions

            .slice(0, 8)

            .map(transaction => {

                const isIncome =
                    transaction.type === "income";


                const sign =
                    isIncome ? "+" : "-";


                const amountClass =
                    isIncome
                        ? "amount-income"
                        : "amount-expense";


                return `

                <div class="transaction">

                    <div class="transaction-left">

                        <div class="transaction-icon">

                            ${isIncome ? "↑" : "↓"}

                        </div>


                        <div>

                            <div class="transaction-name">

                                ${transaction.name}

                            </div>


                            <div class="transaction-category">

                                ${transaction.category}
                                •
                                ${transaction.date}

                            </div>

                        </div>

                    </div>


                    <div>

                        <span
                            class="${amountClass}"
                        >

                            ${sign}
                            ${money(transaction.amount)}

                        </span>


                        <button
                            onclick="
                                deleteTransaction(
                                    ${transaction.id}
                                )
                            "
                            style="
                                margin-left:8px;
                                padding:5px 8px;
                                background:#eee;
                                color:#222;
                            "
                        >

                            ×

                        </button>

                    </div>

                </div>

                `;

            })

            .join("");
}


// ========================================
// BUDGETS
// ========================================

function renderBudgets() {

    const container =
        document.getElementById(
            "budgetList"
        );


    const entries =
        Object.entries(budgets);


    if (entries.length === 0) {

        container.innerHTML = `

            <p class="empty">

                No budgets created yet.

            </p>

        `;

        return;

    }


    container.innerHTML =

        entries

            .map(
                ([category, limit]) => {


                    const spent =

                        transactions

                            .filter(

                                transaction =>

                                    transaction.type ===
                                    "expense"

                                    &&

                                    transaction.category ===
                                    category

                            )

                            .reduce(

                                (
                                    total,
                                    transaction
                                ) =>

                                    total +
                                    transaction.amount,

                                0

                            );


                    const percentage =

                        Math.min(

                            (
                                spent /
                                limit
                            ) * 100,

                            100

                        );


                    const exceeded =
                        spent > limit;


                    return `

                    <div class="budget">

                        <div
                            class="budget-header"
                        >

                            <span>

                                ${category}

                            </span>


                            <span>

                                ${money(spent)}
                                /
                                ${money(limit)}

                            </span>

                        </div>


                        <div
                            class="progress"
                        >

                            <div
                                class="progress-bar"
                                style="
                                    width:
                                    ${percentage}%;

                                    background:
                                    ${
                                        exceeded
                                        ? "#c53b3b"
                                        : "#17181c"
                                    };
                                "
                            ></div>

                        </div>


                        ${
                            exceeded

                            ?

                            `

                            <div
                                style="
                                    color:#c53b3b;
                                    font-size:12px;
                                    margin-top:5px;
                                "
                            >

                                ⚠️ Over budget by

                                ${money(
                                    spent -
                                    limit
                                )}

                            </div>

                            `

                            :

                            `

                            <div
                                style="
                                    color:#777;
                                    font-size:12px;
                                    margin-top:5px;
                                "
                            >

                                ${money(
                                    limit -
                                    spent
                                )}

                                remaining

                            </div>

                            `

                        }


                        <div
                            style="
                                margin-top:10px;
                                display:flex;
                                gap:6px;
                            "
                        >

                            <button
                                onclick="
                                    editBudget(
                                        '${category}'
                                    )
                                "
                            >

                                Edit

                            </button>


                            <button
                                onclick="
                                    deleteBudget(
                                        '${category}'
                                    )
                                "
                                style="
                                    background:#eee;
                                    color:#222;
                                "
                            >

                                Delete

                            </button>

                        </div>

                    </div>

                    `;

                }
            )

            .join("");

}
function editBudget(category) {

    const amount =
        budgets[category];


    document
        .getElementById(
            "budgetCategory"
        )
        .value =
            category;


    document
        .getElementById(
            "budgetAmount"
        )
        .value =
            amount;


    openBudgetModal();

}

// ========================================
// SUBSCRIPTIONS
// ========================================

function renderSubscriptions() {

    const container =
        document.getElementById(
            "subscriptionList"
        );


    if (subscriptions.length === 0) {

        container.innerHTML =
            `<p class="empty">
                No subscriptions yet.
            </p>`;

        return;
    }


    const monthly =
        calculateMonthlySubscriptions();


    const yearly =
        calculateYearlySubscriptions();


    container.innerHTML = `

        <div
            style="
                background:#f5f5f7;
                padding:15px;
                border-radius:12px;
                margin-bottom:15px;
            "
        >

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    margin-bottom:5px;
                "
            >

                <span>
                    Monthly
                </span>


                <strong>
                    ${money(monthly)}
                </strong>

            </div>


            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    font-size:13px;
                    color:#777;
                "
            >

                <span>
                    Estimated yearly
                </span>


                <span>
                    ${money(yearly)}
                </span>

            </div>

        </div>

    `;


    container.innerHTML +=

        subscriptions

            .map(subscription => `

                <div class="subscription">

                    <div>

                        <div class="item-title">

                            ${subscription.name}

                        </div>


                        <div class="item-subtitle">

                    <div class="item-subtitle">

    ${subscription.active === false
        ? "Paused"
        : `${subscription.frequency} • Next payment: ${subscription.date}`
    }

</div>

                    </div>


                    <div>

                        <span class="item-price">

                            ${money(subscription.amount)}

                        </span>


<button
    onclick="
        toggleSubscription(
            ${subscription.id}
        )
    "
    style="
        margin-left:4px;
        padding:5px 8px;
    "
>
    ${
        subscription.active === false
            ? "Resume"
            : "Pause"
    }
</button>

<button
    onclick="
        deleteSubscription(
            ${subscription.id}
        )
    "
    style="
        margin-left:4px;
        padding:5px 8px;
        background:#eee;
        color:#222;
    "
>
    Delete
</button>

                    </div>

                </div>

            `)

            .join("");
}


// ========================================
// BILLS
// ========================================

function renderBills() {

    const container =
        document.getElementById(
            "billList"
        );


    if (bills.length === 0) {

        container.innerHTML =
            `<p class="empty">
                No upcoming bills.
            </p>`;

        return;
    }


    container.innerHTML =

        bills

            .sort(
                (a, b) =>
                    new Date(a.date)
                    -
                    new Date(b.date)
            )

            .map(bill => `

                <div class="bill">

                    <div>

                        <div class="item-title">

                            ${bill.name}

                        </div>


                        <div class="item-subtitle">

                            Due:
                            ${bill.date}

                        </div>

                    </div>


                    <div>

                        <span class="item-price">

                            ${money(bill.amount)}

                        </span>


                        <button
                            onclick="
                                deleteBill(
                                    ${bill.id}
                                )
                            "
                            style="
                                margin-left:8px;
                                padding:5px 8px;
                                background:#eee;
                                color:#222;
                            "
                        >

                            ×

                        </button>

                    </div>

                </div>

            `)

            .join("");
}


// ========================================
// GOALS
// ========================================

function renderGoals() {

    const container =
        document.getElementById(
            "goalList"
        );


    if (goals.length === 0) {

        container.innerHTML =
            `<p class="empty">

                Create your first savings goal.

            </p>`;

        return;
    }


    container.innerHTML =

        goals

            .map(goal => {


                const percentage =

                    Math.min(

                        (goal.current /
                        goal.target) *
                        100,

                        100

                    );


                return `

                <div class="goal">

                    <div class="goal-header">

                        <span class="goal-name">

                            ${goal.name}

                        </span>


                        <span class="goal-percent">

                            ${Math.round(
                                percentage
                            )}%

                        </span>

                    </div>


                    <div class="progress">

                        <div
                            class="progress-bar"
                            style="
                                width:${percentage}%;
                            "
                        ></div>

                    </div>


                    <div class="item-subtitle">

                        ${money(goal.current)}

                        saved of

                        ${money(goal.target)}


                        <button
                            onclick="
                                deleteGoal(
                                    ${goal.id}
                                )
                            "
                            style="
                                margin-left:8px;
                                padding:4px 7px;
                                background:#eee;
                                color:#222;
                            "
                        >

                            ×

                        </button>

                    </div>

                </div>

                `;

            })

            .join("");
}


// ========================================
// DASHBOARD
// ========================================

function renderDashboard() {

    const income =
        calculateIncome();


    const expenses =
        calculateExpenses();


    const balance =
        calculateBalance();


    const upcoming =
        calculateUpcoming();


    document
        .getElementById("income")
        .textContent =
            money(income);


    document
        .getElementById("expenses")
        .textContent =
            money(expenses);


    document
        .getElementById("balance")
        .textContent =
            money(balance);


    document
        .getElementById("upcoming")
        .textContent =
            money(upcoming);


    const balanceMessage =
        document.getElementById(
            "balanceChange"
        );


    if (balance > 0) {

        balanceMessage.textContent =
            "You're currently in the green.";

    }

    else if (balance === 0) {

        balanceMessage.textContent =
            "Your income and expenses are equal.";

    }

    else {

        balanceMessage.textContent =
            "You're spending more than you've earned.";

    }

}


// ========================================
// MASTER RENDER
// ========================================

function render() {

    renderDashboard();
    renderTransactions();
    renderBudgets();
    renderSubscriptions();
    renderBills();
    renderGoals();
    renderGroups();
    renderAnalytics();
    renderCalendar();

}


// ========================================
// START
// ========================================

render();
// ========================================
// ANALYTICS
// ========================================

function renderAnalytics() {

    renderAnalyticsSummary();

    renderCategoryAnalytics();

    renderMonthlyAnalytics();

    renderFinancialInsights();

}


// ========================================
// ANALYTICS SUMMARY
// ========================================

function renderAnalyticsSummary() {

    const monthlyIncome =
        calculateMonthlyIncome();


    const monthlyExpenses =
        calculateMonthlyExpenses();


    const monthlySavings =
        monthlyIncome -
        monthlyExpenses;


    const yearlyIncome =
        calculateYearlyIncome();


    const yearlyExpenses =
        calculateYearlyExpenses();


    let savingsPercentage = 0;


    if (monthlyIncome > 0) {

        savingsPercentage =
            (
                monthlySavings /
                monthlyIncome
            ) * 100;

    }


    document
        .getElementById("monthlyIncome")
        .textContent =
            money(monthlyIncome);


    document
        .getElementById("monthlyExpenses")
        .textContent =
            money(monthlyExpenses);


    document
        .getElementById("monthlySavings")
        .textContent =
            money(monthlySavings);


    document
        .getElementById("yearlyIncome")
        .textContent =
            money(yearlyIncome);


    document
        .getElementById("yearlyExpenses")
        .textContent =
            money(yearlyExpenses);


    document
        .getElementById("savingsRate")
        .textContent =
            `${Math.round(
                savingsPercentage
            )}%`;

}


// ========================================
// CATEGORY ANALYTICS
// ========================================

function renderCategoryAnalytics() {

    const container =
        document.getElementById(
            "categoryAnalytics"
        );


    const expenses =
        transactions.filter(

            transaction =>
                transaction.type === "expense"

        );


    if (expenses.length === 0) {

        container.innerHTML =
            `<p class="empty">

                Add expenses to see
                your spending breakdown.

            </p>`;

        return;

    }


    const categories = {};


    expenses.forEach(
        transaction => {

            if (
                !categories[
                    transaction.category
                ]
            ) {

                categories[
                    transaction.category
                ] = 0;

            }


            categories[
                transaction.category
            ] += transaction.amount;

        }
    );


    const total =
        expenses.reduce(

            (sum, transaction) =>

                sum + transaction.amount,

            0

        );


    const sortedCategories =

        Object.entries(categories)

            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    container.innerHTML =

        sortedCategories

            .map(
                ([category, amount]) => {

                    const percentage =
                        (amount / total) * 100;


                    return `

                    <div
                        class="analytics-row"
                    >

                        <div
                            class="analytics-label"
                        >

                            <span>
                                ${category}
                            </span>

                        </div>


                        <div
                            class="
                                analytics-bar-container
                            "
                        >

                            <div
                                class="analytics-bar"
                                style="
                                    width:
                                    ${percentage}%;
                                "
                            ></div>

                        </div>


                        <span
                            class="
                                analytics-value
                            "
                        >

                            ${money(amount)}

                        </span>

                    </div>

                    `;

                }
            )

            .join("");

}


// ========================================
// MONTHLY ANALYTICS
// ========================================

function renderMonthlyAnalytics() {

    const container =
        document.getElementById(
            "monthlyAnalytics"
        );


    if (transactions.length === 0) {

        container.innerHTML =
            `<p class="empty">

                No monthly data yet.

            </p>`;

        return;

    }


    const months = {};


    transactions.forEach(
        transaction => {

            const date =
                new Date(
                    transaction.date
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return;

            }


            const month =
                date.toLocaleString(
                    "en-US",
                    {
                        month: "long",
                        year: "numeric"
                    }
                );


            if (!months[month]) {

                months[month] = {

                    income: 0,

                    expenses: 0

                };

            }


            if (
                transaction.type ===
                "income"
            ) {

                months[month].income +=
                    transaction.amount;

            }

            else {

                months[month].expenses +=
                    transaction.amount;

            }

        }
    );


    container.innerHTML =

        Object.entries(months)

            .map(
                ([month, data]) => `

                <div
                    class="analytics-row"
                >

                    <div>

                        <strong>
                            ${month}
                        </strong>

                    </div>


                    <div>

                        <span
                            class="amount-income"
                        >

                            +${money(
                                data.income
                            )}

                        </span>


                        &nbsp;


                        <span
                            class="amount-expense"
                        >

                            -${money(
                                data.expenses
                            )}

                        </span>

                    </div>

                </div>

                `
            )

            .join("");

}
// ========================================
// FINANCIAL CALENDAR
// ========================================

function getToday() {

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    return today;

}


// ========================================
// PARSE PAYMENT DATE
// ========================================

function parsePaymentDate(dateString) {

    if (!dateString) {

        return null;

    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    date.setHours(
        0,
        0,
        0,
        0
    );


    return date;

}


// ========================================
// GET ALL UPCOMING PAYMENTS
// ========================================

function getUpcomingPayments() {

    const payments = [];


    // Bills

    bills.forEach(
        bill => {

            const date =
                parsePaymentDate(
                    bill.date
                );


            if (!date) return;


            payments.push({

                id:
                    `bill-${bill.id}`,

                name:
                    bill.name,

                amount:
                    bill.amount,

                date:

                    date,

                type:
                    "Bill"

            });

        }
    );


    // Subscriptions

   subscriptions.forEach(
    subscription => {

        if (
            subscription.active === false
        ) {
            return;
        }

            const date =
                parsePaymentDate(
                    subscription.date
                );


            if (!date) return;


            payments.push({

                id:
                    `subscription-${subscription.id}`,

                name:
                    subscription.name,

                amount:
                    subscription.amount,

                date:
                    date,

                type:
                    "Subscription"

            });

        }
    );


    return payments.sort(

        (a, b) =>

            a.date - b.date

    );

}


// ========================================
// PAYMENT STATUS
// ========================================

function getPaymentStatus(date) {

    const today =
        getToday();


    const difference =
        date.getTime()
        -
        today.getTime();


    const days =
        Math.ceil(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (days < 0) {

        return {

            text:
                `${Math.abs(days)} day${
                    Math.abs(days) === 1
                    ? ""
                    : "s"
                } overdue`,

            className:
                "status-overdue"

        };

    }


    if (days === 0) {

        return {

            text:
                "Due today",

            className:
                "status-soon"

        };

    }


    if (days <= 7) {

        return {

            text:
                `Due in ${days} day${
                    days === 1
                    ? ""
                    : "s"
                }`,

            className:
                "status-soon"

        };

    }


    return {

        text:
            `Due in ${days} days`,

        className:
            "status-normal"

    };

}


// ========================================
// CALENDAR SUMMARY
// ========================================

function renderCalendarSummary() {

    const payments =
        getUpcomingPayments();


    const today =
        getToday();


    const next30Days =
        new Date(today);


    next30Days.setDate(
        today.getDate() + 30
    );


    let upcomingTotal = 0;

    let dueSoonTotal = 0;

    let overdueTotal = 0;


    payments.forEach(
        payment => {

            const difference =
                Math.ceil(

                    (
                        payment.date
                        -
                        today
                    )

                    /

                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )

                );


            if (
                difference >= 0 &&
                payment.date <= next30Days
            ) {

                upcomingTotal +=
                    payment.amount;

            }


            if (
                difference >= 0 &&
                difference <= 7
            ) {

                dueSoonTotal +=
                    payment.amount;

            }


            if (
                difference < 0
            ) {

                overdueTotal +=
                    payment.amount;

            }

        }
    );


    document
        .getElementById(
            "upcoming30Days"
        )
        .textContent =
            money(upcomingTotal);


    document
        .getElementById(
            "dueSoonAmount"
        )
        .textContent =
            money(dueSoonTotal);


    document
        .getElementById(
            "overdueAmount"
        )
        .textContent =
            money(overdueTotal);

}


// ========================================
// RENDER PAYMENTS
// ========================================

function renderCalendarPayments() {

    const container =
        document.getElementById(
            "calendarPayments"
        );


    const payments =
        getUpcomingPayments();


    if (
        payments.length === 0
    ) {

        container.innerHTML =
            `<p class="empty">

                No upcoming payments.

            </p>`;

        return;

    }


    container.innerHTML =

        payments

            .map(
                payment => {

                    const status =
                        getPaymentStatus(
                            payment.date
                        );


                    const dateText =
                        payment.date
                            .toLocaleDateString(
                                "en-US",
                                {
                                    month:
                                        "short",

                                    day:
                                        "numeric",

                                    year:
                                        "numeric"
                                }
                            );


                    return `

                    <div
                        class="
                            calendar-payment
                        "
                    >

                        <div
                            class="
                                payment-left
                            "
                        >

                            <div
                                class="
                                    payment-icon
                                "
                            >

                                ${
                                    payment.type ===
                                    "Bill"
                                    ? "B"
                                    : "S"
                                }

                            </div>


                            <div>

                                <div
                                    class="
                                        payment-name
                                    "
                                >

                                    ${payment.name}

                                </div>


                                <div
                                    class="
                                        payment-date
                                    "
                                >

                                    ${payment.type}
                                    •
                                    ${dateText}

                                </div>

                            </div>

                        </div>


                        <div
                            class="
                                payment-right
                            "
                        >

                            <div
                                class="
                                    payment-amount
                                "
                            >

                                ${money(
                                    payment.amount
                                )}

                            </div>


                            <div
                                class="
                                    payment-status
                                    ${status.className}
                                "
                            >

                                ${status.text}

                            </div>

                        </div>

                    </div>

                    `;

                }
            )

            .join("");

}


// ========================================
// RENDER CALENDAR
// ========================================

function renderCalendar() {

    renderCalendarSummary();

    renderCalendarPayments();

}

// ========================================
// FINANCIAL INSIGHTS
// ========================================

function renderFinancialInsights() {

    const container =
        document.getElementById(
            "financialInsights"
        );


    const income =
        calculateIncome();


    const expenses =
        calculateExpenses();


    const insights = [];


    // No transactions

    if (
        transactions.length === 0
    ) {

        container.innerHTML =
            `<p class="empty">

                Add transactions to
                receive financial insights.

            </p>`;

        return;

    }


    // Spending more than income

    if (
        expenses > income &&
        income > 0
    ) {

        insights.push(`

            <div class="insight">

                ⚠️ You're currently spending
                more than your recorded income.

            </div>

        `);

    }


    // Positive savings

    if (
        income > 0 &&
        expenses < income
    ) {

        const saved =
            income - expenses;


        insights.push(`

            <div class="insight">

                💰 You've kept
                ${money(saved)}
                of your recorded income
                after expenses.

            </div>

        `);

    }


    // Highest category

    const categoryTotals = {};


    transactions

        .filter(
            transaction =>
                transaction.type ===
                "expense"
        )

        .forEach(
            transaction => {

                categoryTotals[
                    transaction.category
                ] =

                    (
                        categoryTotals[
                            transaction.category
                        ] || 0
                    )

                    +

                    transaction.amount;

            }
        );


    const highestCategory =

        Object.entries(
            categoryTotals
        )

        .sort(
            (a, b) =>
                b[1] - a[1]
        )[0];


    if (highestCategory) {

        insights.push(`

            <div class="insight">

                📊 Your largest spending
                category is
                <strong>
                    ${highestCategory[0]}
                </strong>

                at
                <strong>
                    ${money(
                        highestCategory[1]
                    )}
                </strong>.

            </div>

        `);

    }


    // Subscription warning

    const subscriptionTotal =
        calculateMonthlySubscriptions();


    if (
        income > 0 &&
        subscriptionTotal >
        income * 0.10
    ) {

        insights.push(`

            <div class="insight">

                💳 Your subscriptions
                currently represent more
                than 10% of your recorded
                income.

            </div>

        `);

    }


    // Budget warnings

    Object.entries(budgets)

        .forEach(
            ([category, limit]) => {

                const spent =

                    transactions

                        .filter(
                            transaction =>

                                transaction.type ===
                                "expense"

                                &&

                                transaction.category ===
                                category

                        )

                        .reduce(

                            (
                                total,
                                transaction
                            ) =>

                                total +
                                transaction.amount,

                            0

                        );


                if (
                    spent > limit
                ) {

                    insights.push(`

                        <div
                            class="insight"
                        >

                            🚨 You've exceeded
                            your
                            <strong>
                                ${category}
                            </strong>
                            budget by
                            <strong>
                                ${money(
                                    spent -
                                    limit
                                )}
                            </strong>.

                        </div>

                    `);

                }

            }
        );


    if (
        insights.length === 0
    ) {

        insights.push(`

            <div class="insight">

                ✅ Your finances are
                looking good based on
                the data you've entered.

            </div>

        `);

    }


    container.innerHTML =
        insights.join("");

}
// ========================================
// BUDGET MANAGEMENT
// ========================================

function openBudgetModal() {

    document
        .getElementById("budgetModal")
        .classList.add("active");

}


// ========================================
// SAVE / UPDATE BUDGET
// ========================================

document
    .getElementById("budgetForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const category =
                document
                    .getElementById(
                        "budgetCategory"
                    )
                    .value
                    .trim();


            const amount =
                Number(
                    document
                        .getElementById(
                            "budgetAmount"
                        )
                        .value
                );


            if (!category) {

                alert(
                    "Please enter a category."
                );

                return;

            }


            if (amount <= 0) {

                alert(
                    "Budget must be greater than zero."
                );

                return;

            }


            budgets[category] =
                amount;


            saveData();

            render();

            this.reset();

            closeModal(
                "budgetModal"
            );

        }
    );


// ========================================
// DELETE BUDGET
// ========================================

function deleteBudget(category) {

    const confirmed =
        confirm(
            `Delete the ${category} budget?`
        );


    if (!confirmed) return;


    delete budgets[category];


    saveData();

    render();

}
// ========================================
// RECURRING PAYMENT ENGINE
// ========================================

function getNextPaymentDate(
    currentDate,
    frequency
) {

    const date =
        new Date(currentDate);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    if (
        frequency === "weekly"
    ) {

        date.setDate(
            date.getDate() + 7
        );

    }


    else if (
        frequency === "monthly"
    ) {

        date.setMonth(
            date.getMonth() + 1
        );

    }


    else if (
        frequency === "yearly"
    ) {

        date.setFullYear(
            date.getFullYear() + 1
        );

    }


    return date;

}
function updateRecurringPayments() {

    const today = getToday();

    let changed = false;

    subscriptions.forEach(subscription => {

        if (subscription.active === false) {
            return;
        }

        let nextDate =
            parsePaymentDate(subscription.date);

        if (!nextDate) {
            return;
        }

        while (nextDate < today) {

            const updatedDate =
                getNextPaymentDate(
                    nextDate,
                    subscription.frequency
                );

            if (!updatedDate) {
                return;
            }

            nextDate = updatedDate;

            subscription.date =
                nextDate
                    .toISOString()
                    .split("T")[0];

            changed = true;
        }

    });

    if (changed) {
        saveData();
    }

}
function editSubscription(id) {

    const subscription =
        subscriptions.find(
            subscription =>
                subscription.id === id
        );

    if (!subscription) return;

    document
        .getElementById("subscriptionName")
        .value = subscription.name;

    document
        .getElementById("subscriptionAmount")
        .value = subscription.amount;

    document
        .getElementById("subscriptionDate")
        .value = subscription.date;

    document
        .getElementById("subscriptionFrequency")
        .value = subscription.frequency;

    document
        .getElementById("subscriptionEditId")
        .value = subscription.id;

    document
        .getElementById("subscriptionSubmit")
        .textContent = "Save Changes";

    
       openSubscriptionModal();
    }     
    function openSubscriptionModal() {

    document
        .getElementById("subscriptionEditId")
        .value = "";

    document
        .getElementById("subscriptionSubmit")
        .textContent = "Add Subscription";

    document
        .getElementById("subscriptionModal")
        .classList.add("active");
}
render();