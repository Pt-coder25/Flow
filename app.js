<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="description"
        content="Crest Financial — personal financial planning and money management."
    >

    <meta
        name="theme-color"
        content="#111111"
    >

    <title>Crest Financial — Your Money at a Glance</title>

    <!--
        IMPORTANT:
        For production, this should be delivered as an HTTP
        Content-Security-Policy header by your server/CDN.

        This meta policy is only an additional browser-side
        protection for the prototype.
    -->
    <meta
        http-equiv="Content-Security-Policy"
        content="
            default-src 'self';
            script-src 'self';
            style-src 'self';
            img-src 'self' data:;
            font-src 'self';
            connect-src 'self';
            object-src 'none';
            base-uri 'self';
            form-action 'self';
        "
    >

    <link
        rel="stylesheet"
        href="style.css"
    >
</head>

<body>

<!-- =====================================================
     APP
===================================================== -->

<div id="app">

    <!-- =================================================
         HEADER
    ================================================== -->

    <header class="topbar">

        <div class="brand">

            <a href="#overview" class="brand-logo">
                <div class="brand-mark" role="img" aria-label="Crest Financial logo">
                    <svg class="crest-signature" viewBox="0 0 80 52" aria-hidden="true">
                        <text class="signature-f" x="28" y="40">F</text>
                        <text class="signature-c" x="12" y="34">C</text>
                    </svg>
                </div>

                <div>
                    <h1>Crest Financial</h1>

                    <span>
                        Wealth built with purpose.
                    </span>
                </div>
            </a>

        </div>

        <div class="topbar-actions">

            <div class="app-menu">
                <button type="button" id="themeMenuButton" class="secondary-button theme-menu-button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="themeMenu" title="Open navigation">
                    <span class="menu-bars" aria-hidden="true"><span></span><span></span><span></span></span>
                </button>
                <div id="themeMenu" class="theme-menu-popover" hidden>
                    <div class="menu-heading">Navigate</div>
                    <nav class="menu-nav" aria-label="Crest Financial sections">
                        <a href="#overview" data-menu-link>Overview</a>
                        <a href="#activity" data-menu-link>Transactions</a>
                        <a href="#budgets" data-menu-link>Budgets</a>
                        <a href="#recurring" data-menu-link>Recurring</a>
                        <a href="#bills" data-menu-link>Bills</a>
                        <a href="#goals" data-menu-link>Goals</a>
                        <a href="#funds" data-menu-link>Funds</a>
                        <a href="#groups" data-menu-link>Shared expenses</a>
                        <a href="#income" data-menu-link>Income</a>
                        <a href="#insights" data-menu-link>Insights</a>
                    </nav>
                </div>
            </div>

            <div class="theme-menu">
                <button type="button" id="themePickerButton" class="secondary-button theme-menu-button" aria-label="Choose a theme" aria-expanded="false" aria-controls="themePicker" title="Choose a theme">
                    <span class="moon-icon" aria-hidden="true">☾</span>
                </button>
                <div id="themePicker" class="theme-menu-popover theme-picker-popover" hidden>
                    <div class="menu-heading">Theme</div>
                    <button type="button" data-theme-option="light">Light</button>
                    <button type="button" data-theme-option="dark">Dark</button>
                    <button type="button" data-theme-option="midnight">Midnight</button>
                    <button type="button" data-theme-option="forest">Forest</button>
                    <button type="button" data-theme-option="sunset">Sunset</button>
                    <button type="button" data-theme-option="ocean">Ocean</button>
                    <button type="button" data-theme-option="slate">Slate</button>
                    <button type="button" data-theme-option="high-contrast">High contrast</button>
                    <button type="button" data-theme-option="black-gold">Black &amp; Gold</button>
                    <button type="button" data-theme-option="white-gold">White &amp; Gold</button>
                </div>
            </div>

        </div>

    </header>


    <!-- =================================================
         MAIN
    ================================================== -->

    <main class="container">

        <!-- =============================================
             GREETING
        ============================================== -->

        <section class="greeting" id="overview" data-app-page="overview">

            <p id="greetingText">
                Good afternoon 👋
            </p>

            <h2>
                Wealth built with purpose.
            </h2>

        </section>

        <!-- =============================================
             FINANCIAL SUMMARY
        ============================================== -->

        <section class="summary-grid" data-app-page="overview">

            <article class="summary-card balance-card">

                <div class="summary-label">
                    Current Balance
                </div>

                <div
                    id="balance"
                    class="summary-value"
                >
                    $0.00
                </div>

                <div
                    id="balanceChange"
                    class="summary-description"
                >
                    No transactions yet.
                </div>

            </article>


            <article class="summary-card">

                <div class="summary-label">
                    Income
                </div>

                <div
                    id="income"
                    class="summary-value"
                >
                    $0.00
                </div>

                <div class="summary-description">
                    This month
                </div>

            </article>


            <article class="summary-card">

                <div class="summary-label">
                    Expenses
                </div>

                <div
                    id="expenses"
                    class="summary-value"
                >
                    $0.00
                </div>

                <div class="summary-description">
                    This month
                </div>

            </article>


            <article class="summary-card">

                <div class="summary-label">
                    Upcoming
                </div>

                <div
                    id="upcoming"
                    class="summary-value"
                >
                    $0.00
                </div>

                <div class="summary-description">
                    Next 30 days
                </div>

            </article>

        </section>


        <section class="overview-grid" data-app-page="overview" aria-label="Account overview">
            <article class="overview-panel">
                <div class="overview-panel-header">
                    <div>
                        <span class="section-kicker">RECENT</span>
                        <h2>Recent activity</h2>
                    </div>
                    <a href="#activity" data-menu-link>View all</a>
                </div>
                <div id="overviewRecentActivity" class="overview-list"></div>
            </article>

            <article class="overview-panel">
                <div class="overview-panel-header">
                    <div>
                        <span class="section-kicker">DASHBOARD</span>
                        <h2>Account summary</h2>
                    </div>
                </div>
                <div class="health-list">
                    <div><span>Transactions</span><strong id="overviewTransactionCount">0</strong></div>
                    <div><span>Active budgets</span><strong id="overviewBudgetCount">0</strong></div>
                    <div><span>Upcoming payments</span><strong id="overviewPaymentCount">0</strong></div>
                </div>
            </article>
        </section>

        <!-- CTA Button -->
        <div class="overview-cta">
            <button id="ctaAddTransaction" class="cta-button">
                <span>+</span> Add Your First Transaction
            </button>
        </div>


        <!-- =============================================
             ACTIVITY
        ============================================== -->

        <section class="section" id="activity" data-app-page="activity">

            <div class="section-header">

                <div>
                    <span class="section-kicker">
                        ACTIVITY
                    </span>

                    <h2>
                        Recent Transactions
                    </h2>
                </div>

                <button
                    type="button"
                    id="openTransactionButton"
                    class="primary-button add-button"
                    aria-label="Add transaction"
                    title="Add transaction"
                >
                    <span aria-hidden="true">+</span>
                </button>

            </div>

            <div
                id="transactionList"
                class="card-list"
            >
                <p class="empty">
                    No transactions yet.
                </p>
            </div>

        </section>


        <!-- =============================================
             BUDGETS
        ============================================== -->

        <section class="section" id="budgets" data-app-page="budgets">

            <div class="section-header">

                <div>
                    <span class="section-kicker">
                        PLAN
                    </span>

                    <h2>
                        Budgets
                    </h2>
                </div>

                <button
                    type="button"
                    id="openBudgetButton"
                    class="primary-button add-button"
                    aria-label="Add budget"
                    title="Add budget"
                >
                    <span aria-hidden="true">+</span>
                </button>

            </div>

            <div
                id="budgetList"
                class="card-list"
            ></div>

        </section>


        <!-- =============================================
             SUBSCRIPTIONS
        ============================================== -->

        <section class="section" id="recurring" data-app-page="recurring">

            <div class="section-header">

                <div>
                    <span class="section-kicker">
                        RECURRING
                    </span>

                    <h2>
                        Subscriptions
                    </h2>
                </div>

                <button
                    type="button"
                    id="openSubscriptionButton"
                    class="primary-button add-button"
                    aria-label="Add subscription"
                    title="Add subscription"
                >
                    <span aria-hidden="true">+</span>
                </button>

            </div>

            <div
                id="subscriptionList"
                class="card-list"
            ></div>

        </section>


        <!-- =============================================
             BILLS
        ============================================== -->

        <section class="section" id="bills" data-app-page="bills">

            <div class="section-header">

                <div>
                    <span class="section-kicker">
                        UPCOMING
                    </span>

                    <h2>
                        Bills
                    </h2>
                </div>

                <button
                    type="button"
                    id="openBillButton"
                    class="primary-button add-button"
                    aria-label="Add bill"
                    title="Add bill"
                >
                    <span aria-hidden="true">+</span>
                </button>

            </div>

            <div
                id="billList"
                class="card-list"
            ></div>

        </section>


        <!-- =============================================
             SAVINGS GOALS
        ============================================== -->

        <section class="section" id="goals" data-app-page="goals">

            <div class="section-header">

                <div>
                    <span class="section-kicker">
                        GOALS
                    </span>

                    <h2>
                        Savings Goals
                    </h2>
                </div>

                <button
                    type="button"
                    id="openGoalButton"
                    class="primary-button add-button"
                    aria-label="Add savings goal"
                    title="Add savings goal"
                >
                    <span aria-hidden="true">+</span>
                </button>

            </div>

            <div
                id="goalList"
                class="card-list"
            ></div>

        </section>


        <section class="section" id="funds" data-app-page="funds">

            <div class="section-header">

                <div>
                    <span class="section-kicker">
                        SAVINGS & BORROWING
                    </span>

                    <h2>
                        Funds Overview
                    </h2>

                    <p class="section-description">
                        Track savings separately from spending and borrowed money.
                    </p>
                </div>

            </div>

            <div class="analytics-summary-grid funds-summary-grid">

                <div class="analytics-summary-card">
                    <span>Goal savings</span>
                    <strong id="savedFundsTotal">$0.00</strong>
                </div>

                <div class="analytics-summary-card">
                    <span>Total Saved</span>
                    <strong id="microSavingsTotal">$0.00</strong>
                </div>

                <div class="analytics-summary-card loan-summary-card">
                    <span>Borrowed balance</span>
                    <strong id="borrowedFundsTotal">$0.00</strong>
                </div>

            </div>

            <div class="funds-entry-grid">

                <form id="microSaveForm" class="inline-form">
                    <div class="form-header">
                        <h3>Add Save</h3>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="microSaveName">Label</label>
                            <input id="microSaveName" type="text" maxlength="120" placeholder="Emergency fund save" required>
                        </div>

                        <div class="form-group">
                            <label for="microSaveAmount">Amount</label>
                            <input id="microSaveAmount" type="number" min="0.01" max="1000000000" step="0.01" required>
                        </div>

                        <div class="form-group">
                            <label for="microSaveDate">Date</label>
                            <input id="microSaveDate" type="date" required>
                        </div>
                    </div>

                    <button type="submit" class="primary-button">Add Save</button>
                </form>

                <form id="loanForm" class="inline-form">
                    <div class="form-header">
                        <h3>Record Borrowing</h3>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="loanName">Loan Name</label>
                            <input id="loanName" type="text" maxlength="120" placeholder="Student loan" required>
                        </div>

                        <div class="form-group">
                            <label for="loanAmount">Amount Borrowed</label>
                            <input id="loanAmount" type="number" min="0.01" max="1000000000" step="0.01" required>
                        </div>

                        <div class="form-group">
                            <label for="loanPayment">Monthly Payment</label>
                            <input id="loanPayment" type="number" min="0" max="1000000000" step="0.01">
                        </div>
                    </div>

                    <button type="submit" class="primary-button">Add Loan</button>
                </form>

            </div>

            <div class="funds-columns">
                <div>
                    <h3>Savings activity</h3>
                    <div id="savingsList" class="card-list"></div>
                </div>

                <div>
                    <h3>Borrowed money</h3>
                    <div id="loanList" class="card-list"></div>
                </div>
            </div>

        </section>


        <!-- =============================================
             SHARED MONEY
        ============================================== -->

        <section class="section" id="groups" data-app-page="groups">

            <div class="section-header">

                <div>
                    <span class="section-kicker">
                        SHARED EXPENSES
                    </span>

                    <h2>
                        Shared expenses
                    </h2>
                </div>

                <button
                    type="button"
                    id="openGroupButton"
                    class="primary-button add-button"
                    aria-label="Add shared expense group"
                    title="Add shared expense group"
                >
                    <span aria-hidden="true">+</span>
                </button>

            </div>

            <div
                id="groupList"
                class="card-list"
            ></div>

        </section>


        <!-- =============================================
             INCOME PLANNING
        ============================================== -->

        <section class="section" id="income" data-app-page="income">

            <div class="section-header">

                <div>
                    <span class="section-kicker">
                        INCOME
                    </span>

                    <h2>
                        Income Planning
                    </h2>

                    <p class="section-description">
                        Manage your income sources and see
                        your projected income.
                    </p>
                </div>

                <button
                    type="button"
                    id="openIncomeButton"
                    class="primary-button add-button"
                    aria-label="Add income"
                    title="Add income"
                >
                    <span aria-hidden="true">+</span>
                </button>

            </div>


            <div class="income-summary-grid">

                <div class="mini-card">

                    <span>
                        Total Monthly Income
                    </span>

                    <strong id="monthly-income-total">
                        $0.00
                    </strong>

                </div>


                <div class="mini-card">

                    <span>
                        Total Yearly Income
                    </span>

                    <strong id="yearly-income-total">
                        $0.00
                    </strong>

                </div>

            </div>


            <div class="inline-form salary-form">

                <div class="form-header">

                    <div>
                        <h3>
                            Salary
                        </h3>

                        <p class="section-description">
                            Keep your regular salary separate from other income funds.
                        </p>
                    </div>

                </div>

                <div class="form-grid">

                    <div class="form-group">

                        <label for="salary-yearly">
                            Yearly Salary
                        </label>

                        <input
                            id="salary-yearly"
                            type="number"
                            min="0"
                            max="1000000000"
                            step="0.01"
                            inputmode="decimal"
                            placeholder="0.00"
                        >

                    </div>

                    <div class="form-group">

                        <label for="salary-monthly">
                            Monthly Salary
                        </label>

                        <input
                            id="salary-monthly"
                            type="number"
                            min="0"
                            max="1000000000"
                            step="0.01"
                            inputmode="decimal"
                            placeholder="0.00"
                        >

                    </div>

                </div>

                <button
                    type="button"
                    id="saveSalaryButton"
                    class="primary-button"
                >
                    Save Salary
                </button>

            </div>


            <div class="income-summary-grid salary-summary-grid">

                <div class="mini-card">

                    <span>
                        Monthly Salary
                    </span>

                    <strong id="monthly-salary-total">
                        $0.00
                    </strong>

                </div>

                <div class="mini-card">

                    <span>
                        Yearly Salary
                    </span>

                    <strong id="yearly-salary-total">
                        $0.00
                    </strong>

                </div>

            </div>


            <div
                id="income-form-container"
                class="inline-form"
                hidden
            >

                <div class="form-header">

                    <h3>
                        Add Income Source
                    </h3>

                    <button
                        type="button"
                        id="closeIncomeButton"
                        class="close-button"
                    >
                        ×
                    </button>

                </div>


                <div class="form-grid">

                    <div class="form-group">

                        <label for="income-name">
                            Income Name
                        </label>

                        <input
                            id="income-name"
                            type="text"
                            maxlength="100"
                            autocomplete="off"
                            placeholder="Salary"
                        >

                    </div>


                    <div class="form-group">

                        <label for="income-amount">
                            Amount
                        </label>

                        <input
                            id="income-amount"
                            type="number"
                            min="0.01"
                            max="100000000"
                            step="0.01"
                            inputmode="decimal"
                            placeholder="0.00"
                        >

                    </div>


                    <div class="form-group">

                        <label for="income-frequency">
                            Frequency
                        </label>

                        <select id="income-frequency">

                            <option value="monthly">
                                Monthly
                            </option>

                            <option value="weekly">
                                Weekly
                            </option>

                            <option value="yearly">
                                Yearly
                            </option>

                        </select>

                    </div>

                </div>


                <button
                    type="button"
                    id="saveIncomeButton"
                    class="primary-button"
                >
                    Save Income
                </button>

            </div>


            <div
                id="income-sources-list"
                class="card-list"
            ></div>

        </section>


        <!-- =============================================
             ANALYTICS
        ============================================== -->

        <section class="section" id="insights" data-app-page="insights">

            <div class="section-header">

                <div>

                    <span class="section-kicker">
                        YOUR MONEY
                    </span>

                    <h2>
                        Analytics
                    </h2>

                </div>

            </div>


            <div class="analytics-summary-grid">

                <div class="analytics-summary-card">

                    <span>
                        Monthly Income
                    </span>

                    <strong id="monthlyIncome">
                        $0.00
                    </strong>

                </div>


                <div class="analytics-summary-card">

                    <span>
                        Monthly Spending
                    </span>

                    <strong id="monthlyExpenses">
                        $0.00
                    </strong>

                </div>


                <div class="analytics-summary-card">

                    <span>
                        Monthly Savings
                    </span>

                    <strong id="monthlySavings">
                        $0.00
                    </strong>

                </div>


                <div class="analytics-summary-card">

                    <span>
                        Savings Rate
                    </span>

                    <strong id="savingsRate">
                        0%
                    </strong>

                </div>


                <div class="analytics-summary-card">

                    <span>
                        Yearly Income
                    </span>

                    <strong id="yearlyIncome">
                        $0.00
                    </strong>

                </div>


                <div class="analytics-summary-card">

                    <span>
                        Yearly Spending
                    </span>

                    <strong id="yearlyExpenses">
                        $0.00
                    </strong>

                </div>

            </div>


            <!-- Spending Categories -->

            <div class="analytics-panel">

                <h3>
                    Spending by Category
                </h3>

                <div
                    id="categoryAnalytics"
                    class="analytics-list"
                >
                    <p class="empty">
                        Add expenses to see
                        your spending breakdown.
                    </p>
                </div>

            </div>


            <!-- Monthly -->

            <div class="analytics-panel">

                <h3>
                    Monthly Overview
                </h3>

                <div
                    id="monthlyAnalytics"
                    class="analytics-list"
                >
                    <p class="empty">
                        No monthly data yet.
                    </p>
                </div>

            </div>


            <!-- Insights -->

            <div class="analytics-panel">

                <h3>
                    Crest Insights
                </h3>

                <div
                    id="financialInsights"
                    class="insights-list"
                >
                    <p class="empty">
                        Add some transactions and
                        Crest Financial will analyze them.
                    </p>
                </div>

            </div>

            <!-- Statistics Section -->
            <div class="analytics-panel">
                <h3>Key Statistics</h3>
                <div class="statistics-grid" id="statisticsGrid">
                    <div class="statistic-card">
                        <h3>Average Transaction</h3>
                        <div class="stat-value" id="avgTransaction">$0.00</div>
                    </div>
                    <div class="statistic-card">
                        <h3>Largest Expense</h3>
                        <div class="stat-value" id="largestExpense">$0.00</div>
                    </div>
                    <div class="statistic-card">
                        <h3>Total Saved</h3>
                        <div class="stat-value" id="totalSaved">$0.00</div>
                    </div>
                    <div class="statistic-card">
                        <h3>Total Borrowed</h3>
                        <div class="stat-value" id="totalBorrowed">$0.00</div>
                    </div>
                </div>
            </div>

        </section>


        <!-- =============================================
             FINANCIAL CALENDAR
        ============================================== -->

        <section class="section" data-app-page="bills">

            <div class="section-header">

                <div>

                    <span class="section-kicker">
                        UPCOMING
                    </span>

                    <h2>
                        Financial Calendar
                    </h2>

                </div>

            </div>


            <div class="calendar-summary-grid">

                <div class="calendar-summary-card">

                    <span>
                        Next 30 Days
                    </span>

                    <strong id="upcoming30Days">
                        $0.00
                    </strong>

                </div>


                <div class="calendar-summary-card">

                    <span class="calendar-status-label due-soon-label">
                        Attention needed
                    </span>

                    <span>
                        Due Soon
                    </span>

                    <strong id="dueSoonAmount">
                        $0.00
                    </strong>

                    <small id="dueSoonCount">
                        No payments due soon
                    </small>

                </div>


                <div class="calendar-summary-card">

                    <span class="calendar-status-label overdue-label">
                        Past due
                    </span>

                    <span>
                        Overdue
                    </span>

                    <strong id="overdueAmount">
                        $0.00
                    </strong>

                    <small id="overdueCount">
                        No overdue payments
                    </small>

                </div>

            </div>


            <div class="analytics-panel">

                <h3>
                    Upcoming Payments
                </h3>

                <div
                    id="calendarPayments"
                    class="card-list"
                >
                    <p class="empty">
                        No upcoming payments.
                    </p>
                </div>

            </div>

        </section>

    </main>

</div>


<!-- =====================================================
     MODALS
===================================================== -->


<!-- =====================================================
     TRANSACTION MODAL
===================================================== -->

<div
    id="transactionModal"
    class="modal"
    aria-hidden="true"
>

    <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transactionModalTitle"
    >

        <div class="modal-header">

            <h2 id="transactionModalTitle">
                Add Transaction
            </h2>

            <button
                type="button"
                class="close-button"
                data-close-modal="transactionModal"
                aria-label="Close"
            >
                ×
            </button>

        </div>


        <form id="transactionForm">

            <div class="form-group">

                <label for="transactionName">
                    Description
                </label>

                <input
                    id="transactionName"
                    type="text"
                    maxlength="120"
                    required
                    autocomplete="off"
                    placeholder="e.g. Groceries"
                >

            </div>


            <div class="form-group">

                <label for="transactionAmount">
                    Amount
                </label>

                <input
                    id="transactionAmount"
                    type="number"
                    min="0.01"
                    max="100000000"
                    step="0.01"
                    inputmode="decimal"
                    required
                >

            </div>


            <div class="form-group">

                <label for="transactionType">
                    Type
                </label>

                <select
                    id="transactionType"
                    required
                >

                    <option value="expense">
                        Expense
                    </option>

                    <option value="income">
                        Income
                    </option>

                </select>

            </div>


            <div class="form-group">

                <label for="transactionCategory">
                    Category
                </label>

                <select
                    id="transactionCategory"
                    required
                >

                    <option value="Food">
                        Food
                    </option>

                    <option value="Transport">
                        Transport
                    </option>

                    <option value="Shopping">
                        Shopping
                    </option>

                    <option value="Entertainment">
                        Entertainment
                    </option>

                    <option value="Bills">
                        Bills
                    </option>

                    <option value="Education">
                        Education
                    </option>

                    <option value="Other">
                        Other
                    </option>

                </select>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="secondary-button"
                    data-close-modal="transactionModal"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="primary-button"
                >
                    Add Transaction
                </button>

            </div>

        </form>

    </div>

</div>


<!-- =====================================================
     BUDGET MODAL
===================================================== -->

<div
    id="budgetModal"
    class="modal"
    aria-hidden="true"
>

    <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="budgetModalTitle"
    >

        <div class="modal-header">

            <h2 id="budgetModalTitle">
                Add / Edit Budget
            </h2>

            <button
                type="button"
                class="close-button"
                data-close-modal="budgetModal"
                aria-label="Close"
            >
                ×
            </button>

        </div>


        <form id="budgetForm">

            <div class="form-group">

                <label for="budgetCategory">
                    Category
                </label>

                <input
                    id="budgetCategory"
                    type="text"
                    maxlength="50"
                    required
                    autocomplete="off"
                >

            </div>


            <div class="form-group">

                <label for="budgetAmount">
                    Monthly Limit
                </label>

                <input
                    id="budgetAmount"
                    type="number"
                    min="0.01"
                    max="100000000"
                    step="0.01"
                    required
                >

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="secondary-button"
                    data-close-modal="budgetModal"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="primary-button"
                >
                    Save Budget
                </button>

            </div>

        </form>

    </div>

</div>


<!-- =====================================================
     SUBSCRIPTION MODAL
===================================================== -->

<div
    id="subscriptionModal"
    class="modal"
    aria-hidden="true"
>

    <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscriptionModalTitle"
    >

        <div class="modal-header">

            <h2 id="subscriptionModalTitle">
                Add Subscription
            </h2>

            <button
                type="button"
                class="close-button"
                data-close-modal="subscriptionModal"
                aria-label="Close"
            >
                ×
            </button>

        </div>


        <form id="subscriptionForm">

            <input
                type="hidden"
                id="subscriptionEditId"
                value=""
            >


            <div class="form-group">

                <label for="subscriptionName">
                    Subscription Name
                </label>

                <input
                    id="subscriptionName"
                    type="text"
                    maxlength="100"
                    required
                    autocomplete="off"
                    placeholder="Streaming service"
                >

            </div>


            <div class="form-group">

                <label for="subscriptionAmount">
                    Amount
                </label>

                <input
                    id="subscriptionAmount"
                    type="number"
                    min="0.01"
                    max="100000000"
                    step="0.01"
                    required
                >

            </div>


            <div class="form-group">

                <label for="subscriptionDate">
                    First Payment
                </label>

                <input
                    id="subscriptionDate"
                    type="date"
                    required
                >

            </div>


            <div class="form-group">

                <label for="subscriptionFrequency">
                    Frequency
                </label>

                <select
                    id="subscriptionFrequency"
                    required
                >

                    <option value="monthly">
                        Monthly
                    </option>

                    <option value="weekly">
                        Weekly
                    </option>

                    <option value="yearly">
                        Yearly
                    </option>

                </select>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="secondary-button"
                    data-close-modal="subscriptionModal"
                >
                    Cancel
                </button>

                <button
                    id="subscriptionSubmit"
                    type="submit"
                    class="primary-button"
                >
                    Add Subscription
                </button>

            </div>

        </form>

    </div>

</div>


<!-- =====================================================
     BILL MODAL
===================================================== -->

<div
    id="billModal"
    class="modal"
    aria-hidden="true"
>

    <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="billModalTitle"
    >

        <div class="modal-header">

            <h2 id="billModalTitle">
                Add Bill
            </h2>

            <button
                type="button"
                class="close-button"
                data-close-modal="billModal"
                aria-label="Close"
            >
                ×
            </button>

        </div>


        <form id="billForm">

            <div class="form-group">

                <label for="billName">
                    Bill Name
                </label>

                <input
                    id="billName"
                    type="text"
                    maxlength="100"
                    required
                    autocomplete="off"
                >

            </div>


            <div class="form-group">

                <label for="billAmount">
                    Amount
                </label>

                <input
                    id="billAmount"
                    type="number"
                    min="0.01"
                    max="100000000"
                    step="0.01"
                    required
                >

            </div>


            <div class="form-group">

                <label for="billDate">
                    Due Date
                </label>

                <input
                    id="billDate"
                    type="date"
                    required
                >

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="secondary-button"
                    data-close-modal="billModal"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="primary-button"
                >
                    Add Bill
                </button>

            </div>

        </form>

    </div>

</div>


<!-- =====================================================
     GOAL MODAL
===================================================== -->

<div
    id="goalModal"
    class="modal"
    aria-hidden="true"
>

    <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="goalModalTitle"
    >

        <div class="modal-header">

            <h2 id="goalModalTitle">
                Create Savings Goal
            </h2>

            <button
                type="button"
                class="close-button"
                data-close-modal="goalModal"
                aria-label="Close"
            >
                ×
            </button>

        </div>


        <form id="goalForm">

            <div class="form-group">

                <label for="goalName">
                    Goal Name
                </label>

                <input
                    id="goalName"
                    type="text"
                    maxlength="100"
                    required
                    autocomplete="off"
                    placeholder="Emergency fund"
                >

            </div>


            <div class="form-group">

                <label for="goalTarget">
                    Target Amount
                </label>

                <input
                    id="goalTarget"
                    type="number"
                    min="0.01"
                    max="100000000"
                    step="0.01"
                    required
                >

            </div>


            <div class="form-group">

                <label for="goalCurrent">
                    Current Savings
                </label>

                <input
                    id="goalCurrent"
                    type="number"
                    min="0"
                    max="100000000"
                    step="0.01"
                    value="0"
                    required
                >

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="secondary-button"
                    data-close-modal="goalModal"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="primary-button"
                >
                    Create Goal
                </button>

            </div>

        </form>

    </div>

</div>


<!-- =====================================================
     GROUP MODAL
===================================================== -->

<div
    id="groupModal"
    class="modal"
    aria-hidden="true"
>

    <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="groupModalTitle"
    >

        <div class="modal-header">

            <h2 id="groupModalTitle">
                Create Group
            </h2>

            <button
                type="button"
                class="close-button"
                data-close-modal="groupModal"
                aria-label="Close"
            >
                ×
            </button>

        </div>


        <form id="groupForm">

            <div class="form-group">

                <label for="groupName">
                    Group Name
                </label>

                <input
                    id="groupName"
                    type="text"
                    maxlength="100"
                    required
                    autocomplete="off"
                    placeholder="Apartment expenses"
                >

            </div>


            <div class="form-group">

                <label for="groupMembers">
                    Members
                </label>

                <input
                    id="groupMembers"
                    type="text"
                    maxlength="500"
                    required
                    autocomplete="off"
                    placeholder="Justin, Alex, Sam"
                >

                <small>
                    Separate members with commas.
                        width: 78px;
                        height: 52px;
            </div>

                        stroke: url(#crestGold);
                        stroke-width: 2.5;

                <button
                    type="button"
                    class="secondary-button"
                    data-close-modal="groupModal"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="primary-button"
                >
                    Create Group
                </button>

            </div>

        </form>

    </div>

</div>


<!-- =====================================================
     GROUP EXPENSE MODAL
===================================================== -->

<div
    id="groupExpenseModal"
    class="modal"
    aria-hidden="true"
>

    <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="groupExpenseModalTitle"
    >

        <div class="modal-header">

            <h2 id="groupExpenseModalTitle">
                Add Group Expense
            </h2>

            <button
                type="button"
                class="close-button"
                data-close-modal="groupExpenseModal"
                aria-label="Close"
            >
                ×
            </button>

        </div>


        <form id="groupExpenseForm">

            <input
                type="hidden"
                id="expenseGroupId"
            >


            <div class="form-group">

                <label for="groupExpenseName">
                    Expense Name
                </label>

                <input
                    id="groupExpenseName"
                    type="text"
                    maxlength="100"
                    required
                    autocomplete="off"
                    placeholder="Dinner"
                >

            </div>


            <div class="form-group">

                <label for="groupExpenseAmount">
                    Amount
                </label>

                <input
                    id="groupExpenseAmount"
                    type="number"
                    min="0.01"
                    max="100000000"
                    step="0.01"
                    required
                >

            </div>


            <div class="form-group">

                <label for="groupExpensePayer">
                    Paid By
                </label>

                <select
                    id="groupExpensePayer"
                    required
                ></select>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="secondary-button"
                    data-close-modal="groupExpenseModal"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="primary-button"
                >
                    Add Expense
                </button>

            </div>

        </form>

    </div>

</div>


<!-- =====================================================
     SECURITY / ERROR MESSAGE
===================================================== -->

<div
    id="toast"
    class="toast"
    role="status"
    aria-live="polite"
></div>


<!-- =====================================================
     JAVASCRIPT
===================================================== -->

<script
    src="app.js"
    defer
></script>

</body>
</html>
