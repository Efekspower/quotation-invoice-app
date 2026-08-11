/* EFEXPOWER QUOTATION & INVOICE APP */

let quotationItems = [];

function showMessage(message) {
    alert(message);
}

function formatMoney(value) {
    return "RM " + Number(value || 0).toLocaleString("en-MY", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function todayDate() {
    return new Date().toISOString().split("T")[0];
}

function addDays(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
}

function getNextQuotationNumber() {
    const quotations = JSON.parse(
        localStorage.getItem("quotations") || "[]"
    );

    return "QT-" +
        new Date().getFullYear() +
        "-" +
        String(quotations.length + 1).padStart(4, "0");
}

function goHome() {
    location.reload();
}

function newQuotation() {
    showQuotationForm();
}

function newInvoice() {
    showMessage("Invoice module will be added next.");
}

function openCustomers() {
    showMessage("Customer module will be added next.");
}

function openDocuments() {
    showMessage("Document list will be added next.");
}

function openSettings() {
    showMessage("Company settings will be added next.");
}

function showQuotationForm() {

    quotationItems = [];

    const app = document.querySelector("main.container");

    if (!app) {
        alert("Application container was not found.");
        return;
    }

    app.innerHTML = `
        <div class="page-header">
            <button class="back-button" onclick="goHome()">←</button>

            <div>
                <h2>New Quotation</h2>
                <p>Create a quotation for your customer</p>
            </div>
        </div>

        <section class="form-section">
            <h3>Document Information</h3>

            <div class="form-grid">

                <div class="form-group">
                    <label>Quotation No.</label>
                    <input
                        type="text"
                        id="quotationNumber"
                        value="${getNextQuotationNumber()}"
                        readonly
                    >
                </div>

                <div class="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        id="quotationDate"
                        value="${todayDate()}"
                    >
                </div>

                <div class="form-group">
                    <label>Valid Until</label>
                    <input
                        type="date"
                        id="validUntil"
                        value="${addDays(todayDate(), 14)}"
                    >
                </div>

                <div class="form-group">
                    <label>Reference / PO No.</label>
                    <input
                        type="text"
                        id="referenceNumber"
                        placeholder="Optional"
                    >
                </div>

            </div>
        </section>

        <section class="form-section">

            <h3>Customer</h3>

            <div class="form-group">
                <label>Customer Name / Company</label>
                <input
                    type="text"
                    id="customerName"
                    placeholder="Enter customer name"
                >
            </div>

            <div class="form-grid">

                <div class="form-group">
                    <label>Contact Person</label>
                    <input
                        type="text"
                        id="customerContact"
                        placeholder="Contact person"
                    >
                </div>

                <div class="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        id="customerPhone"
                        placeholder="Phone number"
                    >
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        id="customerEmail"
                        placeholder="Email address"
                    >
                </div>

                <div class="form-group">
                    <label>Address</label>
                    <input
                        type="text"
                        id="customerAddress"
                        placeholder="Customer address"
                    >
                </div>

            </div>
        </section>

        <section class="form-section">

            <div class="form-section-title">
                <h3>Items</h3>

                <button
                    class="small-button"
                    onclick="addQuotationItem()"
                >
                    + Add Item
                </button>
            </div>

            <div id="quotationItems"></div>

            <div class="empty-items" id="emptyItems">
                <div>🧾</div>
                <p>No items added yet.</p>
            </div>

        </section>

        <section class="form-section">

            <h3>Summary</h3>

            <div class="total-row">
                <span>Subtotal</span>
                <strong id="subtotal">RM 0.00</strong>
            </div>

            <div class="total-row">
                <span>Discount</span>

                <div class="total-input">
                    <input
                        type="number"
                        id="discount"
                        value="0"
                        min="0"
                        step="0.01"
                        oninput="calculateQuotation()"
                    >
                    <span>RM</span>
                </div>
            </div>

            <div class="total-row">
                <span>SST</span>

                <div class="total-input">
                    <input
                        type="number"
                        id="sstRate"
                        value="0"
                        min="0"
                        step="0.01"
                        oninput="calculateQuotation()"
                    >
                    <span>%</span>
                </div>
            </div>

            <div class="grand-total">
                <span>Total</span>
                <strong id="grandTotal">RM 0.00</strong>
            </div>

        </section>

        <section class="form-section">

            <h3>Notes & Terms</h3>

            <div class="form-group">
                <label>Notes</label>

                <textarea
                    id="quotationNotes"
                    rows="4"
                    placeholder="Additional notes"
                ></textarea>
            </div>

            <div class="form-group">
                <label>Terms & Conditions</label>

                <textarea
                    id="quotationTerms"
                    rows="5"
                >Payment is due according to the agreed payment terms.
Quotation validity is as stated above.</textarea>
            </div>

        </section>

        <section class="form-actions">

            <button
                class="secondary-button"
                onclick="goHome()"
            >
                Cancel
            </button>

            <button
                class="primary-button large-button"
                onclick="saveQuotation()"
            >
                Save Quotation
            </button>

        </section>
    `;

    addQuotationItem();
}

function addQuotationItem() {

    quotationItems.push({
        id: Date.now(),
        description: "",
        quantity: 1,
        unit: "Unit",
        price: 0
    });

    renderQuotationItems();
}

function removeQuotationItem(id) {

    quotationItems = quotationItems.filter(
        item => item.id !== id
    );

    renderQuotationItems();
}

function updateItem(id, field, value) {

    const item = quotationItems.find(
        item => item.id === id
    );

    if (!item) return;

    if (field === "quantity" || field === "price") {
        item[field] = Number(value) || 0;
    } else {
        item[field] = value;
    }

    renderQuotationItems();
}

function renderQuotationItems() {

    const container =
        document.getElementById("quotationItems");

    const empty =
        document.getElementById("emptyItems");

    if (!container) return;

    if (quotationItems.length === 0) {
        container.innerHTML = "";

        if (empty) {
            empty.style.display = "block";
        }

        calculateQuotation();
        return;
    }

    if (empty) {
        empty.style.display = "none";
    }

    container.innerHTML = quotationItems.map(
        (item, index) => {

            const total =
                Number(item.quantity || 0) *
                Number(item.price || 0);

            return `
                <div class="quotation-item">

                    <div class="item-header">

                        <strong>
                            Item ${index + 1}
                        </strong>

                        <button
                            class="delete-button"
                            onclick="removeQuotationItem(${item.id})"
                        >
                            ×
                        </button>

                    </div>

                    <div class="form-group">

                        <label>Description</label>

                        <input
                            type="text"
                            placeholder="Product or service"
                            value="${escapeHtml(item.description)}"
                            onchange="updateItem(
                                ${item.id},
                                'description',
                                this.value
                            )"
                        >

                    </div>

                    <div class="item-grid">

                        <div class="form-group">

                            <label>Quantity</label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value="${item.quantity}"
                                onchange="updateItem(
                                    ${item.id},
                                    'quantity',
                                    this.value
                                )"
                            >

                        </div>

                        <div class="form-group">

                            <label>Unit</label>

                            <select
                                onchange="updateItem(
                                    ${item.id},
                                    'unit',
                                    this.value
                                )"
                            >

                                <option>Unit</option>
                                <option>Lot</option>
                                <option>Hour</option>
                                <option>Day</option>
                                <option>Month</option>
                                <option>Job</option>

                            </select>

                        </div>

                        <div class="form-group">

                            <label>Unit Price</label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value="${item.price}"
                                onchange="updateItem(
                                    ${item.id},
                                    'price',
                                    this.value
                                )"
                            >

                        </div>

                    </div>

                    <div class="item-total">

                        <span>Item Total</span>

                        <strong>
                            ${formatMoney(total)}
                        </strong>

                    </div>

                </div>
            `;
        }
    ).join("");

    calculateQuotation();
}

function calculateQuotation() {

    let subtotal = 0;

    quotationItems.forEach(item => {

        subtotal +=
            Number(item.quantity || 0) *
            Number(item.price || 0);

    });

    const discount =
        Number(
            document.getElementById("discount")?.value || 0
        );

    const sstRate =
        Number(
            document.getElementById("sstRate")?.value || 0
        );

    const taxableAmount =
        Math.max(subtotal - discount, 0);

    const sst =
        taxableAmount * (sstRate / 100);

    const total =
        taxableAmount + sst;

    const subtotalElement =
        document.getElementById("subtotal");

    const totalElement =
        document.getElementById("grandTotal");

    if (subtotalElement) {
        subtotalElement.textContent =
            formatMoney(subtotal);
    }

    if (totalElement) {
        totalElement.textContent =
            formatMoney(total);
    }

    return {
        subtotal,
        discount,
        taxableAmount,
        sstRate,
        sst,
        total
    };
}

function saveQuotation() {

    const customerName =
        document.getElementById(
            "customerName"
        )?.value.trim();

    if (!customerName) {
        alert("Please enter the customer name.");
        return;
    }

    const hasEmptyDescription =
        quotationItems.some(
            item => !item.description.trim()
        );

    if (hasEmptyDescription) {
        alert(
            "Please enter a description for every item."
        );
        return;
    }

    const quotation = {

        id: Date.now(),

        quotationNumber:
            document.getElementById(
                "quotationNumber"
            ).value,

        date:
            document.getElementById(
                "quotationDate"
            ).value,

        validUntil:
            document.getElementById(
                "validUntil"
            ).value,

        referenceNumber:
            document.getElementById(
                "referenceNumber"
            ).value,

        customer: {

            name: customerName,

            contact:
                document.getElementById(
                    "customerContact"
                ).value,

            phone:
                document.getElementById(
                    "customerPhone"
                ).value,

            email:
                document.getElementById(
                    "customerEmail"
                ).value,

            address:
                document.getElementById(
                    "customerAddress"
                ).value
        },

        items: quotationItems,

        totals: calculateQuotation(),

        notes:
            document.getElementById(
                "quotationNotes"
            ).value,

        terms:
            document.getElementById(
                "quotationTerms"
            ).value,

        status: "Draft",

        createdAt:
            new Date().toISOString()
    };

    const quotations =
        JSON.parse(
            localStorage.getItem(
                "quotations"
            ) || "[]"
        );

    quotations.push(quotation);

    localStorage.setItem(
        "quotations",
        JSON.stringify(quotations)
    );

    alert(
        quotation.quotationNumber +
        " has been saved successfully."
    );

    goHome();
}

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

console.log(
    "Efekspower quotation app loaded successfully."
);
