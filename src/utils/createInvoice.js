const fs = require("fs");

function createInvoice(invoice) {
return(`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>PDF Result Template</title>
    <style>
      .page {
        page-break-before: always;
      }

      html {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        width: 100%;
      }
      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        width: 100%;
      }

      .container {
        /* padding: 1cm; */
        display: flex;
        flex-direction: column;
        width: 20rem;
        height: 28.28rem;
        background: salmon;
      }

      .item {
        align-items: stretch;
      }

      .green {
        background-color: green;
        height: 10%;
        padding: 5%;
      }

      .grey {
        background-color: grey;
      }

      .lavendar {
        background-color: lavender;
        flex-grow: 1;
        padding: 5%;
      }

      @page {
        size: 21cm 29.7cm; /*A4*/
        margin: 0cm !important;
      }

      @media print {
        .container {
          /* padding: 1cm; */
          width: 21cm;
          height: 29.7cm;
          background: salmon;
        }
      }

      /* @page {
              margin: 0cm !important;
      }

            @media print {


              .container {
                width: 100vw;
                height: 100vh;
                background-color: green;
              }
            }
              .container {
                height: 290mm;
                width: 210mm;
                background-color: green;
              } */
    </style>
  </head>
  <body>
    <div class="container">
      <div class="item green">Title</div>
      <div class="item lavendar">${invoice.name}</div>
      <div class="item green">Title</div>
    </div>
  </body>
</html>

`);
}




module.exports = {
  createInvoice
};



// ` <!doctype html>
// <html>
//    <head>
//       <meta charset="utf-8">
//       <title>PDF Result Template</title>
//       <style>
//       .page { page-break-before: always }
//          .invoice-box {
//          max-width: 800px;
//          height: 100%;
//          margin: auto;
//          padding: 30px;
//          border: 1px solid #eee;
//          box-shadow: 0 0 10px rgba(0, 0, 0, .15);
//          font-size: 16px;
//          line-height: 24px;
//          font-family: 'Helvetica Neue', 'Helvetica',
//          color: #555;
//          }
//          .margin-top {
//          margin-top: 50px;
//          }
//          .justify-center {
//          text-align: center;
//          }
//          .invoice-box table {
//          width: 100%;
//          line-height: inherit;
//          text-align: left;
//          }
//          .invoice-box table td {
//          padding: 5px;
//          vertical-align: top;
//          }
//          .invoice-box table tr td:nth-child(2) {
//          text-align: right;
//          }
//          .invoice-box table tr.top table td {
//          padding-bottom: 20px;
//          }
//          .invoice-box table tr.top table td.title {
//          font-size: 45px;
//          line-height: 45px;
//          color: #333;
//          }
//          .invoice-box table tr.information table td {
//          padding-bottom: 40px;
//          }
//          .invoice-box table tr.heading td {
//          background: #eee;
//          border-bottom: 1px solid #ddd;
//          font-weight: bold;
//          }
//          .invoice-box table tr.details td {
//          padding-bottom: 20px;
//          }
//          .invoice-box table tr.item td {
//          border-bottom: 1px solid #eee;
//          }
//          .invoice-box table tr.item.last td {
//          border-bottom: none;
//          }
//          .invoice-box table tr.total td:nth-child(2) {
//          border-top: 2px solid #eee;
//          font-weight: bold;
//          }
//          @media only screen and (max-width: 600px) {
//          .invoice-box table tr.top table td {
//          width: 100%;
//          display: block;
//          text-align: center;
//          }
//          .invoice-box table tr.information table td {
//          width: 100%;
//          display: block;
//          text-align: center;
//          }
//          }
//       </style>
//    </head>
//    <body>
//       <div class="invoice-box">
//          <table cellpadding="0" cellspacing="0">
//             <tr class="top">
//                <td colspan="2">
//                   <table>
//                      <tr>
//                         <td class="title"><img  src="https://i2.wp.com/cleverlogos.co/wp-content/uploads/2018/05/reciepthound_1.jpg?fit=800%2C600&ssl=1"
//                            style="width:100%; max-width:156px;"></td>
//                         <td>
//                            Datum: Test 1234}
//                         </td>
//                      </tr>
//                   </table>
//                </td>
//             </tr>
//             <tr class="information">
//                <td colspan="2">
//                   <table>
//                      <tr>
//                         <td>
//                            Customer name: ${invoice.name}
//                         </td>
//                         <td>
//                            Receipt number: ${invoice.invoiceNumber}
//                         </td>
//                      </tr>
//                   </table>
//                </td>
//             </tr>
//             <tr class="heading">
//                <td>Bought items:</td>
//                <td>Price</td>
//             </tr>
//             <tr class="item">
//                <td>First item:</td>
//                <td>CHF 55$</td>
//             </tr>
//             <tr class="item">
//                <td>Second item:</td>
//                <td>CHF 77$</td>
//             </tr>
//          </table>
//          <br />
//          <h1 class="justify-center">Total price: 10234</h1>
//       </div>
//    </body>
// </html>
// `
