```javascript
/* =========================================
   QUOTATION & INVOICE APP
   Main Application JavaScript
   ========================================= */

function showMessage(message) {
    alert(message);
}


/* =========================================
   NAVIGATION
   ========================================= */

function goHome() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function newQuotation() {
    showMessage("Quotation module coming next.");
}


function newInvoice() {
    showMessage("Invoice module coming next.");
}


function openCustomers() {
    showMessage("Customer module coming next.");
}


function openDocuments() {
    showMessage("Quotation & Invoice list coming next.");
}


function openSettings() {
    showMessage("Company settings coming next.");
}


/* =========================================
   APP INITIALIZATION
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Quotation & Invoice App loaded.");

});
```

