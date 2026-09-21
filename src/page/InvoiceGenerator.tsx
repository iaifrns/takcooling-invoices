import { useMemo, useState } from "react";

export type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
};

export default function InvoiceGenerator({setShowInvoice, setInvoices}: {setShowInvoice: (show: boolean) => void, setInvoices: (invoices: InvoiceItem[]) => void}) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [message, setMessage] = useState("");

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
  }, [items]);

  const addItem = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanDescription = description.trim();
    const parsedQuantity = Number(quantity);
    const parsedUnitPrice = Number(unitPrice);

    if (!cleanDescription) {
      setMessage("Please enter a description.");
      return;
    }

    if (
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      setMessage("Quantity must be a whole number greater than 0.");
      return;
    }

    if (!Number.isFinite(parsedUnitPrice) || parsedUnitPrice < 0) {
      setMessage("Please enter a valid unit price.");
      return;
    }

    const newItem: InvoiceItem = {
      id: Date.now(),
      description: cleanDescription,
      quantity: parsedQuantity,
      unitPrice: parsedUnitPrice,
    };

    setItems((currentItems) => [...currentItems, newItem]);

    setDescription("");
    setQuantity(0);
    setUnitPrice(0);
    setMessage("Item added successfully.");
  };

  const removeItem = (id: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const generateInvoice = () => {
    if (items.length === 0) {
      setMessage("Please add at least one item.");
      return;
    }

    setMessage("Invoice is ready to be generated.");

    setShowInvoice(true);
    setInvoices(items);
    
    // Later we can connect this to:
    // PDF generation
    // Image generation
    // Printing
  };

  const formatMoney = (value: number) => {
    return `£${value.toFixed(2)}`;
  };

  return (
    <main className="min-h-screen bg-(--color-bg) px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-(--color-text-heading) sm:text-4xl">
            Invoice Generator
          </h1>

          <p className="mt-2 text-sm text-(--color-text) sm:text-base">
            Add your products or services and generate an invoice.
          </p>
        </div>

        {/* Item Form */}
        <section className="rounded-xl border border-(--color-border) bg-white p-4 sm:p-6">
          <form
            onSubmit={addItem}
            className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_0.7fr_1fr_auto] md:items-end"
          >
            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-(--color-text-heading)"
              >
                Description
              </label>

              <input
                id="description"
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="e.g. Emergency repair"
                className="w-full rounded-lg border border-(--color-border) bg-white px-3 py-2.5 text-base text-(--color-text-heading) outline-none transition focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent-bg)"
              />
            </div>

            {/* Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="mb-1.5 block text-sm font-medium text-(--color-text-heading)"
              >
                Qty
              </label>

              <input
                id="quantity"
                type="number"
                min="1"
                step="0.01"
                value={quantity}
                onChange={(event) => setQuantity(parseFloat(event.target.value))}
                placeholder="1"
                className="w-full rounded-lg border border-(--color-border) bg-white px-3 py-2.5 text-base text-(--color-text-heading) outline-none transition focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent-bg)"
              />
            </div>

            {/* Unit Price */}
            <div>
              <label
                htmlFor="unit-price"
                className="mb-1.5 block text-sm font-medium text-(--color-text-heading)"
              >
                Unit Price
              </label>

              <input
                id="unit-price"
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={(event) => setUnitPrice(parseFloat(event.target.value))}
                placeholder="0.00"
                className="w-full rounded-lg border border-(--color-border) bg-white px-3 py-2.5 text-base text-(--color-text-heading) outline-none transition focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent-bg)"
              />
            </div>

            {/* Add Button */}
            <button
              type="submit"
              className="min-h-11 rounded-lg bg-(--color-accent) px-6 py-2.5 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-(--color-accent) focus:ring-offset-2"
            >
              Add
            </button>
          </form>

          {message && (
            <p
              className="mt-3 text-sm text-red-500"
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </section>

        {/* Items Table */}
        <section className="mt-6 rounded-xl border border-(--color-border) bg-white p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 border-collapse">
              <thead>
                <tr className="border-b border-(--color-border)">
                  <th className="px-3 py-3 text-left text-sm font-semibold text-(--color-text)">
                    Description
                  </th>

                  <th className="px-3 py-3 text-right text-sm font-semibold text-(--color-text)">
                    Qty
                  </th>

                  <th className="px-3 py-3 text-right text-sm font-semibold text-(--color-text)">
                    Unit Price
                  </th>

                  <th className="px-3 py-3 text-right text-sm font-semibold text-(--color-text)">
                    Total Price
                  </th>

                  <th className="w-10 px-3 py-3"></th>
                </tr>
              </thead>

              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-10 text-center text-sm text-(--color-text)"
                    >
                      No items added yet.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const itemTotal = item.quantity * item.unitPrice;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-(--color-border) last:border-0"
                      >
                        <td className="px-3 py-4 text-sm font-medium text-(--color-text-heading)">
                          {item.description}
                        </td>

                        <td className="px-3 py-4 text-right text-sm">
                          {item.quantity}
                        </td>

                        <td className="px-3 py-4 text-right text-sm">
                          {formatMoney(item.unitPrice)}
                        </td>

                        <td className="px-3 py-4 text-right text-sm font-semibold text-(--color-text-heading)">
                          {formatMoney(itemTotal)}
                        </td>

                        <td className="px-3 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-sm font-medium text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          <div className="mt-5 flex items-center justify-end gap-8 border-t border-(--color-border) pt-5">
            <span className="font-semibold text-(--color-text-heading)">
              Total
            </span>

            <span className="text-xl font-bold text-(--color-text-heading)">
              {formatMoney(total)}
            </span>
          </div>
        </section>

        {/* Generate Button */}
        <button
          type="button"
          onClick={generateInvoice}
          className="mt-6 min-h-11 w-full rounded-lg bg-(--color-accent) px-5 py-3 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-(--color-accent) focus:ring-offset-2"
        >
          Generate Invoice
        </button>
      </div>
    </main>
  );
}