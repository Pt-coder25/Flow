"use strict";

const FLOW_VERSION = "4.0.0";
const FLOW_SECURITY = {
    maxAmount: 1000000000,
    maxTransactions: 5000,
    maxSubscriptions: 1000,
    maxBills: 1000,
    maxGoals: 500,
    maxGroups: 500,
    maxIncomeSources: 500,
    maxSavings: 5000,
    maxLoans: 500,
    maxName: 120,
    maxMemberName: 80
};

const STORAGE_KEYS = {
    transactions: "flowTransactions",
    subscriptions: "flowSubscriptions",
    bills: "flowBills",
    goals: "flowGoals",
    groups: "flowGroups",
    savings: "flowSavings",
    loans: "flowLoans",
    budgets: "flowBudgets",
    incomeSources: "flowIncomeSources",
    incomePlan: "flowIncomePlan"
};
const THEME_KEY = "flowTheme";
const THEMES = new Set(["light", "dark", "midnight", "forest", "sunset", "ocean", "slate", "high-contrast", "black-gold", "white-gold"]);

const DEFAULT_BUDGETS = {
    Food: 500, Transport: 300, Shopping: 400, Entertainment: 300,
    Bills: 500, Education: 300, Other: 200
};
const FREQUENCIES = ["weekly", "monthly", "yearly"];
const CATEGORIES = ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Education", "Other"];
let securityState = { lastError: null, lastBackup: null };
let transactions = [];
let subscriptions = [];
let bills = [];
let goals = [];
let groups = [];
let savings = [];
let loans = [];
let budgets = {};
let incomeSources = [];
let incomePlan = { yearlySalary: 0, monthlyIncome: 0 };

function generateId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
        const values = new Uint32Array(3);
        crypto.getRandomValues(values);
        return `${Date.now().toString(36)}-${values.join("-")}`;
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function isValidId(value) {
    return (typeof value === "string" && value.trim().length > 0) || (Number.isSafeInteger(value) && value > 0);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function text(value, maxLength = FLOW_SECURITY.maxName) {
    if (typeof value !== "string") return "";
    return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function amount(value, allowZero = false) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || (!allowZero && number <= 0) || number > FLOW_SECURITY.maxAmount) return 0;
    return Math.round(number * 100) / 100;
}

function dateValue(value) {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : String(value).slice(0, 10);
}

function formatDate(value, fallback = "No date") {
    if (!value) return fallback;
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

function loadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const value = JSON.parse(raw);
        return value ?? fallback;
    } catch (error) {
        securityState.lastError = error.message;
        return fallback;
    }
}

function safeSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        securityState.lastError = error.message;
        showToast("Your data could not be saved.", true);
        return false;
    }
}

function applyTheme(theme) {
    const selectedTheme = THEMES.has(theme) ? theme : "light";
    document.documentElement.dataset.theme = selectedTheme;
    document.querySelectorAll("[data-theme-option]").forEach(option => option.setAttribute("aria-pressed", String(option.dataset.themeOption === selectedTheme)));
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", ["light", "forest", "sunset", "ocean", "white-gold"].includes(selectedTheme) ? "#fbfaf6" : "#17191d");
}

function initializeTheme() {
    applyTheme(localStorage.getItem(THEME_KEY));
    const menuButton = document.getElementById("themeMenuButton");
    const menu = document.getElementById("themeMenu");
    const themeButton = document.getElementById("themePickerButton");
    const themePicker = document.getElementById("themePicker");
    menuButton?.addEventListener("click", () => {
        const isOpen = !menu.hidden;
        menu.hidden = isOpen;
        menuButton.setAttribute("aria-expanded", String(!isOpen));
        themePicker.hidden = true;
        themeButton?.setAttribute("aria-expanded", "false");
    });
    themeButton?.addEventListener("click", () => {
        const isOpen = !themePicker.hidden;
        themePicker.hidden = isOpen;
        themeButton.setAttribute("aria-expanded", String(!isOpen));
        menu.hidden = true;
        menuButton?.setAttribute("aria-expanded", "false");
    });
    menu?.addEventListener("click", event => {
        const link = event.target.closest("[data-menu-link]");
        if (link) {
            menu.hidden = true;
            menuButton?.setAttribute("aria-expanded", "false");
            return;
        }
    });
    themePicker?.addEventListener("click", event => {
        const option = event.target.closest("[data-theme-option]");
        if (!option || !THEMES.has(option.dataset.themeOption)) return;
        localStorage.setItem(THEME_KEY, option.dataset.themeOption);
        applyTheme(option.dataset.themeOption);
        themePicker.hidden = true;
        themeButton?.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("click", event => {
        if (!event.target.closest(".app-menu") && menu && !menu.hidden) {
            menu.hidden = true;
            menuButton?.setAttribute("aria-expanded", "false");
        }
        if (!event.target.closest(".theme-menu") && themePicker && !themePicker.hidden) {
            themePicker.hidden = true;
            themeButton?.setAttribute("aria-expanded", "false");
        }
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && menu && !menu.hidden) {
            menu.hidden = true;
            menuButton?.setAttribute("aria-expanded", "false");
            menuButton?.focus();
        }
        if (event.key === "Escape" && themePicker && !themePicker.hidden) {
            themePicker.hidden = true;
            themeButton?.setAttribute("aria-expanded", "false");
            themeButton?.focus();
        }
    });
}

function initializePages() {
    const pages = new Set(["overview", "activity", "budgets", "recurring", "bills", "goals", "funds", "groups", "income", "insights"]);
    const renderPage = () => {
        const requestedPage = window.location.hash.slice(1);
        const page = pages.has(requestedPage) ? requestedPage : "overview";
        document.querySelectorAll("[data-app-page]").forEach(element => {
            element.hidden = element.dataset.appPage !== page;
        });
        document.querySelectorAll("[data-menu-link]").forEach(link => {
            link.setAttribute("aria-current", link.getAttribute("href") === `#${page}` ? "page" : "false");
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", renderPage);
    renderPage();
}

function normalizeTransaction(item) {
    if (!item || typeof item !== "object") return null;
    const name = text(item.name);
    const value = amount(item.amount);
    if (!name || !value) return null;
    return { id: isValidId(item.id) ? item.id : generateId(), name, amount: value, type: item.type === "income" ? "income" : "expense", category: CATEGORIES.includes(item.category) ? item.category : "Other", date: dateValue(item.date) || new Date().toISOString().slice(0, 10) };
}

function normalizeSubscription(item) {
    if (!item || typeof item !== "object") return null;
    const name = text(item.name);
    const value = amount(item.amount);
    if (!name || !value) return null;
    return { id: isValidId(item.id) ? item.id : generateId(), name, amount: value, date: dateValue(item.date), frequency: FREQUENCIES.includes(item.frequency) ? item.frequency : "monthly", active: item.active !== false };
}

function normalizeBill(item) {
    if (!item || typeof item !== "object") return null;
    const name = text(item.name);
    const value = amount(item.amount);
    if (!name || !value) return null;
    return { id: isValidId(item.id) ? item.id : generateId(), name, amount: value, date: dateValue(item.date) };
}

function normalizeGoal(item) {
    if (!item || typeof item !== "object") return null;
    const name = text(item.name);
    const target = amount(item.target);
    if (!name || !target) return null;
    return { id: isValidId(item.id) ? item.id : generateId(), name, target, current: Math.min(amount(item.current, true), target) };
}

function normalizeGroup(item) {
    if (!item || typeof item !== "object") return null;
    const name = text(item.name);
    const members = Array.isArray(item.members) ? [...new Set(item.members.map(member => text(member, FLOW_SECURITY.maxMemberName)).filter(Boolean))].slice(0, 50) : [];
    if (!name || members.length < 2) return null;
    const expenses = Array.isArray(item.expenses) ? item.expenses.map(expense => {
        const expenseName = text(expense?.name);
        const value = amount(expense?.amount);
        if (!expenseName || !value) return null;
        return { id: isValidId(expense.id) ? expense.id : generateId(), name: expenseName, amount: value, payer: members.includes(expense.payer) ? expense.payer : members[0] };
    }).filter(Boolean).slice(0, 500) : [];
    return { id: isValidId(item.id) ? item.id : generateId(), name, members, expenses };
}

function normalizeSaving(item) {
    if (!item || typeof item !== "object") return null;
    const name = text(item.name);
    const value = amount(item.amount);
    if (!name || !value) return null;
    return { id: isValidId(item.id) ? item.id : generateId(), name, amount: value, date: dateValue(item.date) || new Date().toISOString().slice(0, 10) };
}

function normalizeLoan(item) {
    if (!item || typeof item !== "object") return null;
    const name = text(item.name);
    const principal = amount(item.principal);
    if (!name || !principal) return null;
    return { id: isValidId(item.id) ? item.id : generateId(), name, principal, balance: Math.min(amount(item.balance ?? principal, true), principal), payment: amount(item.payment, true) };
}

function normalizeAll() {
    const list = (key, normalizer, limit) => {
        const stored = loadJSON(key, []);
        return Array.isArray(stored) ? stored.map(normalizer).filter(Boolean).slice(0, limit) : [];
    };
    transactions = list(STORAGE_KEYS.transactions, normalizeTransaction, FLOW_SECURITY.maxTransactions);
    subscriptions = list(STORAGE_KEYS.subscriptions, normalizeSubscription, FLOW_SECURITY.maxSubscriptions);
    bills = list(STORAGE_KEYS.bills, normalizeBill, FLOW_SECURITY.maxBills);
    goals = list(STORAGE_KEYS.goals, normalizeGoal, FLOW_SECURITY.maxGoals);
    groups = list(STORAGE_KEYS.groups, normalizeGroup, FLOW_SECURITY.maxGroups);
    savings = list(STORAGE_KEYS.savings, normalizeSaving, FLOW_SECURITY.maxSavings);
    loans = list(STORAGE_KEYS.loans, normalizeLoan, FLOW_SECURITY.maxLoans);
    const storedBudgets = loadJSON(STORAGE_KEYS.budgets, DEFAULT_BUDGETS);
    const normalizedBudgets = storedBudgets && typeof storedBudgets === "object" && !Array.isArray(storedBudgets) ? Object.fromEntries(Object.entries(storedBudgets).map(([key, value]) => [text(key, 50), amount(value, true)]).filter(([key, value]) => key && value > 0).slice(0, 100)) : {};
    budgets = Object.keys(normalizedBudgets).length ? normalizedBudgets : { ...DEFAULT_BUDGETS };
    const storedIncome = loadJSON(STORAGE_KEYS.incomeSources, []);
    incomeSources = Array.isArray(storedIncome) ? storedIncome.map(item => {
        const name = text(item?.name);
        const value = amount(item?.amount);
        if (!name || !value || !FREQUENCIES.includes(item?.frequency)) return null;
        const yearlyAmount = item.frequency === "weekly" ? value * 52 : item.frequency === "monthly" ? value * 12 : value;
        return { id: isValidId(item.id) ? item.id : generateId(), name, amount: value, frequency: item.frequency, yearlyAmount, monthlyAmount: yearlyAmount / 12 };
    }).filter(Boolean).slice(0, FLOW_SECURITY.maxIncomeSources) : [];
    const storedPlan = loadJSON(STORAGE_KEYS.incomePlan, {});
    if (storedPlan && typeof storedPlan === "object") {
        const storedYearlySalary = amount(storedPlan.yearlySalary, true);
        const storedMonthlySalary = amount(storedPlan.monthlyIncome, true);
        const monthlySalary = storedMonthlySalary || storedYearlySalary / 12;
        incomePlan = {
            monthlyIncome: monthlySalary,
            yearlySalary: monthlySalary * 12
        };
    } else {
        incomePlan = { yearlySalary: 0, monthlyIncome: 0 };
    }
}

function saveData() {
    transactions = transactions.slice(0, FLOW_SECURITY.maxTransactions);
    subscriptions = subscriptions.slice(0, FLOW_SECURITY.maxSubscriptions);
    bills = bills.slice(0, FLOW_SECURITY.maxBills);
    goals = goals.slice(0, FLOW_SECURITY.maxGoals);
    groups = groups.slice(0, FLOW_SECURITY.maxGroups);
    incomeSources = incomeSources.slice(0, FLOW_SECURITY.maxIncomeSources);
    savings = savings.slice(0, FLOW_SECURITY.maxSavings);
    loans = loans.slice(0, FLOW_SECURITY.maxLoans);
    return Object.entries({ transactions, subscriptions, bills, goals, groups, savings, loans, budgets, incomeSources, incomePlan }).every(([name, value]) => safeSet(STORAGE_KEYS[name], value));
}

function money(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "$0.00";
    const sign = number < 0 ? "-" : "";
    return `${sign}$${Math.abs(number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function showToast(message, error = false) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle("error", error);
    toast.classList.add("visible", "show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
        toast.classList.remove("visible", "show");
    }, 2800);
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function emptyList(id, message = "Nothing here yet.") {
    const element = document.getElementById(id);
    if (element) element.innerHTML = `<p class="empty">${escapeHTML(message)}</p>`;
}

function card(content) {
    return `<article class="item-card">${content}</article>`;
}

function actionButton(action, id, label) {
    return `<button type="button" class="secondary-button" data-action="${action}" data-id="${escapeHTML(id)}">${escapeHTML(label)}</button>`;
}

function renderTransactions() {
    const element = document.getElementById("transactionList");
    if (!transactions.length) return emptyList("transactionList", "No transactions yet.");
    element.innerHTML = transactions.slice(0, 50).map(item => card(`<div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.category)} · ${escapeHTML(formatDate(item.date))}</small></div><strong class="${item.type === "income" ? "positive" : "negative"}">${item.type === "income" ? "+" : "-"}${money(item.amount)}</strong>${actionButton("delete-transaction", item.id, "Delete")}`)).join("");
}

function renderBudgets() {
    const element = document.getElementById("budgetList");
    const entries = Object.entries(budgets);
    if (!entries.length) return emptyList("budgetList", "No budgets yet.");
    element.innerHTML = entries.map(([category, limit]) => {
        const spent = transactions.filter(item => item.type === "expense" && item.category === category).reduce((sum, item) => sum + item.amount, 0);
        const percent = Math.min(100, limit ? spent / limit * 100 : 0);
        return card(`<div class="item-card-main"><strong>${escapeHTML(category)}</strong><small>${money(spent)} of ${money(limit)}</small></div><progress max="100" value="${percent}"></progress><div class="item-card-actions">${actionButton("edit-budget", category, "Edit")}${actionButton("delete-budget", category, "Delete")}</div>`);
    }).join("");
}

function renderSubscriptions() {
    const element = document.getElementById("subscriptionList");
    if (!subscriptions.length) return emptyList("subscriptionList", "No subscriptions yet.");
    element.innerHTML = subscriptions.map(item => card(`<div><strong>${escapeHTML(item.name)}</strong><small>${money(item.amount)} · ${escapeHTML(item.frequency)} · ${escapeHTML(formatDate(item.date))}</small></div>${actionButton("edit-subscription", item.id, "Edit")}${actionButton("toggle-subscription", item.id, item.active === false ? "Enable" : "Pause")}${actionButton("delete-subscription", item.id, "Delete")}`)).join("");
}

function renderBills() {
    const element = document.getElementById("billList");
    if (!bills.length) return emptyList("billList", "No bills yet.");
    element.innerHTML = bills.map(item => card(`<div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(formatDate(item.date, "No due date"))}</small></div><strong>${money(item.amount)}</strong>${actionButton("delete-bill", item.id, "Delete")}`)).join("");
}

function renderGoals() {
    const element = document.getElementById("goalList");
    if (!goals.length) return emptyList("goalList", "No savings goals yet.");
    element.innerHTML = goals.map(item => { const percent = Math.min(100, item.target ? item.current / item.target * 100 : 0); return card(`<div><strong>${escapeHTML(item.name)}</strong><small>${money(item.current)} of ${money(item.target)}</small><progress max="100" value="${percent}"></progress></div>${actionButton("delete-goal", item.id, "Delete")}`); }).join("");
}

function renderFunds() {
    const savedTotal = goals.reduce((sum, item) => sum + item.current, 0);
    const savingsTotal = savings.reduce((sum, item) => sum + item.amount, 0);
    const borrowedTotal = loans.reduce((sum, item) => sum + item.balance, 0);
    setText("savedFundsTotal", money(savedTotal));
    setText("microSavingsTotal", money(savingsTotal));
    setText("borrowedFundsTotal", money(borrowedTotal));

    const savingsElement = document.getElementById("savingsList");
    savingsElement.innerHTML = savings.length ? savings.slice().reverse().map(item => card(`<div class="item-card-main"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(formatDate(item.date))}</small></div><strong class="positive">+${money(item.amount)}</strong><div class="card-actions">${actionButton("edit-saving", item.id, "Edit")}${actionButton("delete-saving", item.id, "Delete")}</div>`)).join("") : `<p class="empty">No saves recorded yet.</p>`;

    const loansElement = document.getElementById("loanList");
    loansElement.innerHTML = loans.length ? loans.map(item => card(`<div class="item-card-main"><strong>${escapeHTML(item.name)}</strong><small>${money(item.balance)} remaining${item.payment ? ` · ${money(item.payment)} monthly payment` : ""}</small></div><strong class="negative">${money(item.balance)}</strong><div class="card-actions">${item.payment ? actionButton("pay-loan", item.id, "Make Payment") : ""}${actionButton("delete-loan", item.id, "Delete")}</div>`)).join("") : `<p class="empty">No borrowed money recorded.</p>`;
}

function settlement(group) {
    const paid = Object.fromEntries(group.members.map(member => [member, 0]));
    group.expenses.forEach(item => { if (paid[item.payer] !== undefined) paid[item.payer] += item.amount; });
    const share = Object.values(paid).reduce((sum, value) => sum + value, 0) / group.members.length;
    const debtors = [], creditors = [];
    Object.entries(paid).forEach(([member, value]) => { const difference = value - share; if (difference < -0.01) debtors.push({ member, amount: -difference }); if (difference > 0.01) creditors.push({ member, amount: difference }); });
    const results = [];
    for (let debtorIndex = 0, creditorIndex = 0; debtorIndex < debtors.length && creditorIndex < creditors.length;) { const debtor = debtors[debtorIndex]; const creditor = creditors[creditorIndex]; const value = Math.min(debtor.amount, creditor.amount); results.push(`${debtor.member} pays ${creditor.member} ${money(value)}`); debtor.amount -= value; creditor.amount -= value; if (debtor.amount < 0.01) debtorIndex++; if (creditor.amount < 0.01) creditorIndex++; }
    return results;
}

function renderGroups() {
    const element = document.getElementById("groupList");
    if (!groups.length) return emptyList("groupList", "No groups yet.");
    element.innerHTML = groups.map(group => { const settlements = settlement(group); return card(`<div><strong>${escapeHTML(group.name)}</strong><small>${group.members.map(escapeHTML).join(", ")} · ${group.expenses.length} expense${group.expenses.length === 1 ? "" : "s"}</small>${settlements.length ? `<p>${settlements.map(escapeHTML).join("<br>")}</p>` : ""}</div>${actionButton("add-group-expense", group.id, "Add Expense")}${actionButton("delete-group", group.id, "Delete")}`); }).join("");
}

function renderIncome() {
    const projectedIncome = calculateProjectedIncome();
    const salaryMonthly = incomePlan.monthlyIncome;
    const salaryYearly = incomePlan.yearlySalary;
    setText("monthly-salary-total", money(salaryMonthly));
    setText("yearly-salary-total", money(salaryYearly));
    setText("monthly-income-total", money(projectedIncome.monthly));
    setText("yearly-income-total", money(projectedIncome.yearly));
    const element = document.getElementById("income-sources-list");
    if (!incomeSources.length) return emptyList("income-sources-list", "No income sources yet.");
    element.innerHTML = incomeSources.map(item => card(`<div><strong>${escapeHTML(item.name)}</strong><small>${money(item.amount)} · ${escapeHTML(item.frequency)}</small></div>${actionButton("delete-income", item.id, "Delete")}`)).join("");
}

function calculateProjectedIncome() {
    const otherIncomeYearly = incomeSources.reduce((sum, item) => sum + item.yearlyAmount, 0);
    const yearly = incomePlan.monthlyIncome * 12 + otherIncomeYearly;
    return {
        monthly: yearly / 12,
        yearly
    };
}

function monthlyTotals() {
    const now = new Date();
    return transactions.filter(item => { const date = new Date(item.date); return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); }).reduce((totals, item) => { totals[item.type] += item.amount; return totals; }, { income: 0, expense: 0 });
}

function yearlyTotals() {
    const year = new Date().getFullYear();
    return transactions.filter(item => new Date(item.date).getFullYear() === year).reduce((totals, item) => { totals[item.type] += item.amount; return totals; }, { income: 0, expense: 0 });
}

function renderOverview() {
    const activityElement = document.getElementById("overviewRecentActivity");
    if (activityElement) {
        const recent = transactions.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 4);
        activityElement.innerHTML = recent.length ? recent.map(item => `<div class="overview-list-row"><span class="overview-list-icon ${item.type}">${item.type === "income" ? "↑" : "↓"}</span><span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.category)} · ${escapeHTML(formatDate(item.date, "No date"))}</small></span><strong class="${item.type === "income" ? "positive" : "negative"}">${item.type === "income" ? "+" : "-"}${money(item.amount)}</strong></div>`).join("") : `<p class="empty">Your recent activity will appear here.</p>`;
    }
    setText("overviewTransactionCount", String(transactions.length));
    setText("overviewBudgetCount", String(Object.keys(budgets).length));
    setText("overviewPaymentCount", String(subscriptions.filter(item => item.active !== false).length + bills.length));
}

function renderAnalytics() {
    const monthly = monthlyTotals();
    const yearly = yearlyTotals();
    const projectedIncome = calculateProjectedIncome();
    const savings = projectedIncome.monthly - monthly.expense;
    setText("monthlyIncome", money(projectedIncome.monthly)); setText("monthlyExpenses", money(monthly.expense)); setText("monthlySavings", money(savings)); setText("savingsRate", `${projectedIncome.monthly ? Math.round(savings / projectedIncome.monthly * 100) : 0}%`); setText("yearlyIncome", money(projectedIncome.yearly)); setText("yearlyExpenses", money(yearly.expense));
    const categories = Object.entries(transactions.filter(item => item.type === "expense").reduce((result, item) => { result[item.category] = (result[item.category] || 0) + item.amount; return result; }, {}));
    document.getElementById("categoryAnalytics").innerHTML = categories.length ? categories.sort((a, b) => b[1] - a[1]).map(([name, value]) => `<div class="analytics-row"><span>${escapeHTML(name)}</span><strong>${money(value)}</strong></div>`).join("") : `<p class="empty">Add expenses to see your spending breakdown.</p>`;
    document.getElementById("monthlyAnalytics").innerHTML = transactions.length ? `<div class="analytics-row"><span>This month</span><strong>${money(monthly.income - monthly.expense)}</strong></div><div class="analytics-row"><span>This year</span><strong>${money(yearly.income - yearly.expense)}</strong></div>` : `<p class="empty">No monthly data yet.</p>`;
    const insights = []; if (projectedIncome.monthly > 0) insights.push(`You saved ${Math.round(savings / projectedIncome.monthly * 100)}% of this month's planned income.`); if (monthly.expense > projectedIncome.monthly && projectedIncome.monthly > 0) insights.push("Your spending is above your planned income this month."); if (!insights.length) insights.push("Add salary or income sources and Crest Financial will analyze them.");
    document.getElementById("financialInsights").innerHTML = insights.map(item => `<p>${escapeHTML(item)}</p>`).join("");
}

function renderStatistics() {
    const expenseTransactions = transactions.filter(item => item.type === "expense");
    const allTransactions = transactions.length;
    const avgTransaction = allTransactions ? (transactions.reduce((sum, item) => sum + item.amount, 0) / allTransactions) : 0;
    const largestExpense = expenseTransactions.length ? Math.max(...expenseTransactions.map(item => item.amount)) : 0;
    const totalSaved = savings.reduce((sum, item) => sum + item.amount, 0);
    const totalBorrowed = loans.reduce((sum, item) => sum + item.balance, 0);
    
    setText("avgTransaction", money(avgTransaction));
    setText("largestExpense", money(largestExpense));
    setText("totalSaved", money(totalSaved));
    setText("totalBorrowed", money(totalBorrowed));
}

function paymentItems() {
    return [...subscriptions.filter(item => item.active !== false && item.date).map(item => ({ ...item, kind: "Subscription" })), ...bills.filter(item => item.date).map(item => ({ ...item, kind: "Bill" }))].map(item => ({ ...item, parsedDate: new Date(item.date) })).filter(item => !Number.isNaN(item.parsedDate.getTime())).sort((a, b) => a.parsedDate - b.parsedDate);
}

function paymentStatus(item, today) {
    const difference = item.parsedDate.getTime() - today.getTime();
    if (difference < 0) return { key: "overdue", label: "Overdue" };
    if (difference <= 7 * 86400000) return { key: "due-soon", label: "Due soon" };
    return { key: "scheduled", label: "Scheduled" };
}

function renderCalendar() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(end.getDate() + 30);
    const items = paymentItems();
    const upcoming = items.filter(item => item.parsedDate <= end && item.parsedDate >= today);
    const dueSoon = upcoming.filter(item => paymentStatus(item, today).key === "due-soon");
    const overdue = items.filter(item => paymentStatus(item, today).key === "overdue");
    setText("upcoming30Days", money(upcoming.reduce((sum, item) => sum + item.amount, 0)));
    setText("dueSoonAmount", money(dueSoon.reduce((sum, item) => sum + item.amount, 0)));
    setText("overdueAmount", money(overdue.reduce((sum, item) => sum + item.amount, 0)));
    setText("dueSoonCount", dueSoon.length ? `${dueSoon.length} payment${dueSoon.length === 1 ? "" : "s"} within 7 days` : "No payments due soon");
    setText("overdueCount", overdue.length ? `${overdue.length} overdue payment${overdue.length === 1 ? "" : "s"}` : "No overdue payments");
    const element = document.getElementById("calendarPayments");
    element.innerHTML = items.length ? items.slice(0, 30).map(item => {
        const status = paymentStatus(item, today);
        return card(`<div class="calendar-payment-main"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.kind)} · ${escapeHTML(formatDate(item.date))}</small></div><span class="payment-status ${status.key}">${status.label}</span><strong>${money(item.amount)}</strong>`);
    }).join("") : `<p class="empty">No upcoming payments.</p>`;
}

function updateRecurringPayments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let changed = false;

    subscriptions.forEach(subscription => {
        if (subscription.active === false || !subscription.date) return;
        let nextDate = new Date(subscription.date);
        if (Number.isNaN(nextDate.getTime())) return;
        let subscriptionChanged = false;

        while (nextDate < today) {
            if (subscription.frequency === "weekly") nextDate.setDate(nextDate.getDate() + 7);
            else if (subscription.frequency === "monthly") nextDate.setMonth(nextDate.getMonth() + 1);
            else if (subscription.frequency === "yearly") nextDate.setFullYear(nextDate.getFullYear() + 1);
            else return;
            subscriptionChanged = true;
            changed = true;
        }

        if (subscriptionChanged) subscription.date = nextDate.toISOString().slice(0, 10);
    });

    if (changed) saveData();
}

function render() {
    const income = transactions.filter(item => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
    const expenses = transactions.filter(item => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
    const monthly = monthlyTotals();
    setText("balance", money(income - expenses));
    setText("income", money(monthly.income));
    setText("expenses", money(monthly.expense));
    setText("upcoming", money(subscriptions.filter(item => item.active !== false).reduce((sum, item) => sum + item.amount, 0) + bills.reduce((sum, item) => sum + item.amount, 0)));
    setText("balanceChange", transactions.length ? `${transactions.length} transaction${transactions.length === 1 ? "" : "s"} recorded.` : "No transactions yet.");
    renderTransactions();
    renderBudgets();
    renderSubscriptions();
    renderBills();
    renderGoals();
    renderFunds();
    renderGroups();
    renderIncome();
    renderAnalytics();
    renderStatistics();
        renderOverview();
    renderCalendar();
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) { modal.classList.add("active"); modal.setAttribute("aria-hidden", "false"); }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) { modal.classList.remove("active"); modal.setAttribute("aria-hidden", "true"); }
}

function resetForm(id) { document.getElementById(id)?.reset(); }
function findById(list, id) { return list.find(item => String(item.id) === String(id)); }

function updateCategories() {
    const type = document.getElementById("transactionType");
    const category = document.getElementById("transactionCategory");
    if (!type || !category) return;
    const options = type.value === "income" ? ["Job", "Freelance", "Side Hustle", "Gift", "Other"] : CATEGORIES;
    category.innerHTML = options.map(item => `<option value="${escapeHTML(item)}">${escapeHTML(item)}</option>`).join("");
}

function exportData() {
    try {
        const data = { application: "Crest Financial", version: FLOW_VERSION, exportedAt: new Date().toISOString(), data: { transactions, subscriptions, bills, goals, groups, savings, loans, budgets, incomeSources, incomePlan } };
        const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `crest-financial-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
        securityState.lastBackup = new Date().toISOString();
        showToast("Crest Financial data exported.");
    } catch (error) { securityState.lastError = error.message; showToast("Unable to export Crest Financial data.", true); }
}

function resetFlowData() {
    if (!window.confirm("This will permanently delete all Crest Financial data stored on this device. Continue?")) return;
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    normalizeAll();
    saveData();
    render();
    showToast("Crest Financial data was reset.");
}

function importData(file) {
    if (!file || file.size > 10 * 1024 * 1024) return showToast("The backup file is too large.", true);
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const backup = JSON.parse(reader.result);
            const data = backup?.data && typeof backup.data === "object" ? backup.data : backup;
            if (!data || typeof data !== "object" || (backup.application && !["Flow", "Crest Financial"].includes(backup.application))) throw new Error("Invalid backup");
            Object.entries({ transactions: data.transactions, subscriptions: data.subscriptions, bills: data.bills, goals: data.goals, groups: data.groups, savings: data.savings, loans: data.loans, budgets: data.budgets, incomeSources: data.incomeSources, incomePlan: data.incomePlan }).forEach(([key, value]) => { if (value !== undefined) safeSet(STORAGE_KEYS[key], value); });
            normalizeAll(); saveData(); render(); showToast("Crest Financial data imported successfully.");
        } catch (error) { securityState.lastError = error.message; showToast("The backup file could not be imported.", true); }
    };
    reader.readAsText(file);
}

function bindForms() {
    document.getElementById("transactionForm")?.addEventListener("submit", event => { event.preventDefault(); const name = text(document.getElementById("transactionName").value); const value = amount(document.getElementById("transactionAmount").value); if (!name || !value) return showToast("Enter a valid transaction.", true); transactions.unshift({ id: generateId(), name, amount: value, type: document.getElementById("transactionType").value === "income" ? "income" : "expense", category: CATEGORIES.includes(document.getElementById("transactionCategory").value) ? document.getElementById("transactionCategory").value : "Other", date: new Date().toISOString().slice(0, 10) }); saveData(); resetForm("transactionForm"); closeModal("transactionModal"); render(); });
    document.getElementById("budgetForm")?.addEventListener("submit", event => { event.preventDefault(); const key = text(document.getElementById("budgetCategory").value, 50); const value = amount(document.getElementById("budgetAmount").value); if (!key || !value) return showToast("Enter a valid budget.", true); budgets[key] = value; saveData(); resetForm("budgetForm"); closeModal("budgetModal"); render(); });
    document.getElementById("subscriptionForm")?.addEventListener("submit", event => { event.preventDefault(); const id = document.getElementById("subscriptionEditId").value; const item = id ? findById(subscriptions, id) : null; const name = text(document.getElementById("subscriptionName").value); const value = amount(document.getElementById("subscriptionAmount").value); const date = dateValue(document.getElementById("subscriptionDate").value); const frequency = FREQUENCIES.includes(document.getElementById("subscriptionFrequency").value) ? document.getElementById("subscriptionFrequency").value : "monthly"; if (!name || !value || !date) return showToast("Enter valid subscription details.", true); if (item) Object.assign(item, { name, amount: value, date, frequency }); else subscriptions.push({ id: generateId(), name, amount: value, date, frequency, active: true }); saveData(); resetForm("subscriptionForm"); closeModal("subscriptionModal"); render(); });
    document.getElementById("billForm")?.addEventListener("submit", event => { event.preventDefault(); const name = text(document.getElementById("billName").value); const value = amount(document.getElementById("billAmount").value); const date = dateValue(document.getElementById("billDate").value); if (!name || !value || !date) return showToast("Enter valid bill details.", true); bills.push({ id: generateId(), name, amount: value, date }); saveData(); resetForm("billForm"); closeModal("billModal"); render(); });
    document.getElementById("goalForm")?.addEventListener("submit", event => { event.preventDefault(); const name = text(document.getElementById("goalName").value); const target = amount(document.getElementById("goalTarget").value); if (!name || !target) return showToast("Enter a valid goal.", true); goals.push({ id: generateId(), name, target, current: Math.min(amount(document.getElementById("goalCurrent").value, true), target) }); saveData(); resetForm("goalForm"); closeModal("goalModal"); render(); });
    document.getElementById("groupForm")?.addEventListener("submit", event => { event.preventDefault(); const name = text(document.getElementById("groupName").value); const members = [...new Set(document.getElementById("groupMembers").value.split(",").map(item => text(item, FLOW_SECURITY.maxMemberName)).filter(Boolean))]; if (!name || members.length < 2) return showToast("Add a group name and at least two members.", true); groups.push({ id: generateId(), name, members, expenses: [] }); saveData(); resetForm("groupForm"); closeModal("groupModal"); render(); });
    document.getElementById("groupExpenseForm")?.addEventListener("submit", event => { event.preventDefault(); const group = findById(groups, document.getElementById("expenseGroupId").value); const name = text(document.getElementById("groupExpenseName").value); const value = amount(document.getElementById("groupExpenseAmount").value); const payer = document.getElementById("groupExpensePayer").value; if (!group || !name || !value || !group.members.includes(payer)) return showToast("Enter valid group expense details.", true); group.expenses.push({ id: generateId(), name, amount: value, payer }); saveData(); resetForm("groupExpenseForm"); closeModal("groupExpenseModal"); render(); });
    document.getElementById("microSaveForm")?.addEventListener("submit", event => {
        event.preventDefault();
        const name = text(document.getElementById("microSaveName").value);
        const value = amount(document.getElementById("microSaveAmount").value);
        const date = dateValue(document.getElementById("microSaveDate").value);
        if (!name || !value || !date) return showToast("Enter valid savings details.", true);
        savings.push({ id: generateId(), name, amount: value, date });
        saveData();
        resetForm("microSaveForm");
        render();
        showToast("Save added to your savings.");
    });
    document.getElementById("loanForm")?.addEventListener("submit", event => {
        event.preventDefault();
        const name = text(document.getElementById("loanName").value);
        const principal = amount(document.getElementById("loanAmount").value);
        const payment = amount(document.getElementById("loanPayment").value, true);
        if (!name || !principal || payment > principal) return showToast("Enter valid loan details.", true);
        loans.push({ id: generateId(), name, principal, balance: principal, payment });
        saveData();
        resetForm("loanForm");
        render();
        showToast("Borrowed balance recorded separately.");
    });
}

function bindUI() {
    const modals = { openTransactionButton: "transactionModal", openBudgetButton: "budgetModal", openSubscriptionButton: "subscriptionModal", openBillButton: "billModal", openGoalButton: "goalModal", openGroupButton: "groupModal" };
    Object.entries(modals).forEach(([id, modal]) => document.getElementById(id)?.addEventListener("click", () => openModal(modal)));
    document.getElementById("openIncomeButton")?.addEventListener("click", () => { document.getElementById("income-form-container").hidden = false; });
    document.getElementById("closeIncomeButton")?.addEventListener("click", () => { document.getElementById("income-form-container").hidden = true; });
    document.getElementById("saveIncomeButton")?.addEventListener("click", () => { const name = text(document.getElementById("income-name").value); const value = amount(document.getElementById("income-amount").value); const frequency = document.getElementById("income-frequency").value; if (!name || !value || !FREQUENCIES.includes(frequency)) return showToast("Enter valid income details.", true); const yearlyAmount = frequency === "weekly" ? value * 52 : frequency === "monthly" ? value * 12 : value; incomeSources.push({ id: generateId(), name, amount: value, frequency, yearlyAmount, monthlyAmount: yearlyAmount / 12 }); saveData(); document.getElementById("income-form-container").hidden = true; render(); });
    document.getElementById("salary-yearly")?.addEventListener("input", event => { const value = amount(event.target.value, true); if (value > FLOW_SECURITY.maxAmount) event.target.value = FLOW_SECURITY.maxAmount; });
    document.getElementById("salary-monthly")?.addEventListener("input", event => { const value = amount(event.target.value, true); if (value > FLOW_SECURITY.maxAmount) event.target.value = FLOW_SECURITY.maxAmount; });
    document.getElementById("saveSalaryButton")?.addEventListener("click", () => {
        const yearlyInput = amount(document.getElementById("salary-yearly").value, true);
        const monthlyInput = amount(document.getElementById("salary-monthly").value, true);
        if (!yearlyInput && !monthlyInput) return showToast("Enter a yearly or monthly salary.", true);
        const calculatedYearly = monthlyInput * 12;
        if (calculatedYearly > FLOW_SECURITY.maxAmount) return showToast("Monthly salary is too large.", true);
        if (yearlyInput && monthlyInput && Math.abs(yearlyInput - calculatedYearly) > 0.01) return showToast("Yearly and monthly salary values do not match.", true);
        incomePlan.yearlySalary = yearlyInput || calculatedYearly;
        incomePlan.monthlyIncome = monthlyInput || yearlyInput / 12;
        saveData();
        document.getElementById("salary-yearly").value = incomePlan.yearlySalary;
        document.getElementById("salary-monthly").value = incomePlan.monthlyIncome;
        render();
        showToast("Salary saved separately from other income.");
    });
    document.getElementById("exportDataButton")?.addEventListener("click", exportData);
    document.getElementById("resetDataButton")?.addEventListener("click", resetFlowData);
    document.getElementById("importDataInput")?.addEventListener("change", event => importData(event.target.files[0]));
    document.getElementById("transactionType")?.addEventListener("change", updateCategories);
    document.addEventListener("click", event => { const close = event.target.closest("[data-close-modal]"); if (close) closeModal(close.dataset.closeModal); const button = event.target.closest("[data-action]"); if (!button) return; const { action, id } = button.dataset; if (action === "delete-transaction") transactions = transactions.filter(item => String(item.id) !== String(id)); if (action === "delete-subscription") subscriptions = subscriptions.filter(item => String(item.id) !== String(id)); if (action === "toggle-subscription") { const item = findById(subscriptions, id); if (item) item.active = item.active === false; } if (action === "delete-bill") bills = bills.filter(item => String(item.id) !== String(id)); if (action === "delete-goal") goals = goals.filter(item => String(item.id) !== String(id)); if (action === "delete-group") groups = groups.filter(item => String(item.id) !== String(id)); if (action === "delete-income") incomeSources = incomeSources.filter(item => String(item.id) !== String(id)); if (action === "delete-saving") savings = savings.filter(item => String(item.id) !== String(id)); if (action === "delete-loan") loans = loans.filter(item => String(item.id) !== String(id)); if (action === "delete-budget") delete budgets[id]; if (action === "edit-budget") { document.getElementById("budgetCategory").value = id; document.getElementById("budgetAmount").value = budgets[id]; openModal("budgetModal"); return; } if (action === "edit-subscription") { const item = findById(subscriptions, id); if (!item) return; document.getElementById("subscriptionEditId").value = item.id; document.getElementById("subscriptionName").value = item.name; document.getElementById("subscriptionAmount").value = item.amount; document.getElementById("subscriptionDate").value = item.date; document.getElementById("subscriptionFrequency").value = item.frequency; openModal("subscriptionModal"); return; } if (action === "add-group-expense") { const group = findById(groups, id); if (!group) return; document.getElementById("expenseGroupId").value = group.id; document.getElementById("groupExpensePayer").innerHTML = group.members.map(member => `<option value="${escapeHTML(member)}">${escapeHTML(member)}</option>`).join(""); openModal("groupExpenseModal"); return; } saveData(); render(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") document.querySelectorAll(".modal.active").forEach(modal => closeModal(modal.id)); });
}

function initializeLogoAndCTA() {
    // Logo click handler - navigate to home
    document.querySelector(".brand-logo")?.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.hash = "#overview";
    });

    // CTA button handler
    document.getElementById("ctaAddTransaction")?.addEventListener("click", () => {
        openModal("transactionModal");
    });

    // Handle edit-saving action
    document.addEventListener("click", (event) => {
        const button = event.target.closest('[data-action="edit-saving"]');
        if (!button) return;
        const savingId = button.dataset.id;
        const saving = findById(savings, savingId);
        if (!saving) return;

        const newAmount = prompt(`Edit amount for "${saving.name}":`, String(saving.amount));
        if (newAmount === null) return;
        
        const validAmount = amount(newAmount);
        if (!validAmount) {
            showToast("Enter a valid amount.", true);
            return;
        }
        
        saving.amount = validAmount;
        saveData();
        render();
        showToast(`Savings updated: ${saving.name} - ${money(validAmount)}`);
    });

    // Handle pay-loan action
    document.addEventListener("click", (event) => {
        const button = event.target.closest('[data-action="pay-loan"]');
        if (!button) return;
        const loanId = button.dataset.id;
        const loan = findById(loans, loanId);
        if (!loan || !loan.payment) return;

        const confirmation = confirm(`Make a ${money(loan.payment)} payment on "${loan.name}"?`);
        if (!confirmation) return;

        // Deduct payment from loan balance
        loan.balance = Math.max(0, loan.balance - loan.payment);
        
        // Record the payment as a transaction
        transactions.push({
            id: generateId(),
            name: `Loan payment: ${loan.name}`,
            type: "expense",
            category: "Bills",
            amount: loan.payment,
            date: new Date().toISOString().slice(0, 10)
        });

        saveData();
        render();
        showToast(`Payment recorded: ${loan.name} - ${money(loan.payment)}`);
    });
}

function initialize() {
    initializeTheme();
    initializePages();
    normalizeAll();
    updateRecurringPayments();
    saveData();
    bindForms();
    bindUI();
    initializeLogoAndCTA();
    document.getElementById("microSaveDate").value = new Date().toISOString().slice(0, 10);
    document.getElementById("salary-yearly").value = incomePlan.yearlySalary || "";
    document.getElementById("salary-monthly").value = incomePlan.monthlyIncome || "";
    updateCategories();
    render();
    window.addEventListener("error", event => { securityState.lastError = event.message; });
}

initialize();
