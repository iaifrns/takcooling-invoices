import { useState } from "react";
import Invoice from "./page/Invoice";
import InvoiceGenerator, { type InvoiceItem } from "./page/InvoiceGenerator";

function App() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <>
      {showInvoice ? (
        <Invoice invoiceItems={items} setShowInvoice={setShowInvoice} />
      ) : (
        <InvoiceGenerator setShowInvoice={setShowInvoice} setInvoices={setItems} />
      )}
    </>
  );
}

export default App;
