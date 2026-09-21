import html2canvas from "html2canvas";
import { useMemo, useRef } from "react";
import { MdArrowBack } from "react-icons/md";

type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

const formatMoney = (amount: number) => {
  return `£${amount.toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export default function Invoice({
  invoiceItems,
  setShowInvoice,
}: {
  invoiceItems: InvoiceItem[];
  setShowInvoice: (show: boolean) => void;
}) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const date = useMemo(() => new Date().toLocaleDateString("en-GB"), []);
  const invoiceNumber = useMemo(() => {
    const num = localStorage.getItem("invoiceNumber");
    if (num) {
      const nextNum = parseInt(num) + 1;
      localStorage.setItem("invoiceNumber", nextNum.toString());
      return nextNum;
    } else {
      localStorage.setItem("invoiceNumber", "2027");
      return 2027;
    }
  }, []);

  const total = invoiceItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const generateImage = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = "invoice-002026.png";
    link.href = image;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page controls */}
      <div className="mx-auto mb-6 flex w-full max-w-198.5 justify-between">
        <button
          type="button"
          className="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer transition"
          onClick={() => setShowInvoice(false)}
        >
          <MdArrowBack size={24} />
          Back
        </button>
        <button
          type="button"
          onClick={generateImage}
          className="rounded-lg bg-[#0645b5] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#053b9b]"
        >
          Generate Image
        </button>
      </div>

      {/* Invoice */}
      <div
        ref={invoiceRef}
        className="mx-auto w-full max-w-198.5 bg-white px-6 py-7 text-[#111827] shadow-lg sm:px-8"
      >
        {/* HEADER */}
        <header className="grid grid-cols-1 gap-5 border-b border-[#e5e7eb] pb-5 sm:grid-cols-[270px_1fr]">
          {/* Logo */}
          <div className="flex items-start justify-center sm:justify-start">
            <img
              src="/takcooling-logo.png"
              alt="Takcooling HVAC"
              className="w-61.25 object-contain"
            />
          </div>

          {/* Company information */}
          <div className="text-center sm:text-left">
            <h1 className="text-[28px] font-extrabold tracking-tight text-[#123f9d] sm:text-[34px]">
              TAKCOOLING LIMITED
            </h1>

            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-[11px] leading-5 sm:grid-cols-2">
              <div>
                <p>London, SE15 6RS,</p>

                <p>
                  Email:{" "}
                  <span className="text-[#0645b5] underline">
                    takcooling@gmail.com
                  </span>
                </p>

                <p>Email: info@takcooling.co.uk</p>
              </div>

              <div>
                <p>Telephone: 07449271197</p>

                <p>
                  Website:{" "}
                  <span className="text-[#0645b5] underline">
                    www.takcooling.co.uk
                  </span>
                </p>

                <p>Tel:07424665273</p>
              </div>
            </div>
          </div>
        </header>

        {/* INVOICE DETAILS */}
        <section className="py-5">
          <h2 className="text-[42px] font-extrabold leading-none tracking-tight text-[#123f9d]">
            INVOICE
          </h2>

          <div className="mt-3 space-y-1 text-[17px] font-bold text-[#123f9d]">
            <p>Invoice 00{invoiceNumber}</p>

            <p>Victoria House GB–</p>

            <p>Date: {date}</p>
          </div>
        </section>

        {/* ITEMS TABLE */}
        <section>
          <div className="overflow-hidden border-2 border-[#1554bd]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#edf5ff] text-[#123f9d]">
                  <th className="w-[45%] border-r-2 border-[#1554bd] px-3 py-2 text-left text-[12px] font-extrabold">
                    DESCRIPTION
                  </th>

                  <th className="w-[20%] border-r-2 border-[#1554bd] px-2 py-2 text-center text-[12px] font-extrabold">
                    QTY
                  </th>

                  <th className="w-[20%] border-r-2 border-[#1554bd] px-2 py-2 text-center text-[12px] font-extrabold">
                    UNIT PRICE
                  </th>

                  <th className="w-[15%] px-2 py-2 text-center text-[12px] font-extrabold">
                    AMOUNT
                  </th>
                </tr>
              </thead>

              <tbody>
                {invoiceItems.map((item, index) => (
                  <tr key={index} className="align-top">
                    <td className="border-r-2 border-[#1554bd] px-3 py-4 text-[13px]">
                      {item.description}
                    </td>

                    <td className="border-r-2 border-[#1554bd] px-2 py-4 text-center text-[13px]">
                      {item.quantity}
                    </td>

                    <td className="border-r-2 border-[#1554bd] px-2 py-4 text-center text-[13px]">
                      {formatMoney(item.unitPrice)}
                    </td>

                    <td className="px-2 py-4 text-center text-[13px]">
                      {formatMoney(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="bg-[#edf5ff] text-[#123f9d]">
                  <td
                    colSpan={3}
                    className="border-t-2 border-[#1554bd] px-3 py-2 text-[20px] font-extrabold"
                  >
                    TOTAL
                  </td>

                  <td className="border-l-2 border-t-2 border-[#1554bd] px-2 py-2 text-center text-[20px] font-extrabold">
                    {formatMoney(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* PAYMENT + BANK DETAILS */}
        <section className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Payment */}
          <div className="border-b border-[#1554bd] pb-4 sm:border-b-0 sm:border-r-2 sm:border-[#1554bd] sm:pr-6">
            <h3 className="text-[13px] font-extrabold text-[#123f9d]">
              PAYMENT TERMS
            </h3>

            <p className="mt-1 text-[12px] leading-5">
              Payment is due upon completion of the work.
              <br />
              Thank you.
            </p>

            <div className="my-4 border-t border-[#1554bd]" />

            <h3 className="text-[13px] font-extrabold text-[#123f9d]">NOTES</h3>

            <p className="mt-1 text-[12px]">No warranty.</p>
          </div>

          {/* Bank details */}
          <div>
            <h3 className="text-[13px] font-extrabold text-[#123f9d]">
              BANK DETAILS
            </h3>

            <div className="mt-2 space-y-2 text-[12px]">
              <div className="grid grid-cols-2">
                <span>Account Type:</span>
                <span>Business Account</span>
              </div>

              <div className="grid grid-cols-2">
                <span>Account Name:</span>
                <span>TAKCOOLING LIMITED</span>
              </div>

              <div className="grid grid-cols-2">
                <span>Sort Code:</span>
                <span>23-11-85</span>
              </div>

              <div className="grid grid-cols-2">
                <span>Account Number:</span>
                <span>41645855</span>
              </div>
            </div>
          </div>
        </section>

        {/* NOTICE */}
        <section className="mx-auto mt-6 rounded-lg border-2 border-[#1554bd] px-3 py-2 text-center text-[9px] font-bold leading-4 text-[#123f9d]">
          <p>
            PLEASE NOTE: THE CALL OUT FEE OF £70 WILL BE PAYABLE IN CASH ON
            SITE.
          </p>

          <p>
            ANY ADDITIONAL LABOUR OR PARTS WILL BE QUOTED SEPARATELY BEFORE WORK
            PROCEEDS.
          </p>
        </section>

        {/* FOOTER */}
        <footer className="mt-4 pb-1 text-center">
          <p className="font-serif text-[20px] italic text-[#123f9d]">
            Thank you for choosing Takcooling Limited.
          </p>
        </footer>
      </div>
    </div>
  );
}
