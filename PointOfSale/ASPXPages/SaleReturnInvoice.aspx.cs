using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PointOfSale.ASPXPages
{
    public partial class SaleReturnInvoice : System.Web.UI.Page
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();

        private Num2Word n2w = new Num2Word();
        protected void Page_Load(object sender, EventArgs e)
        {

            if (Request["BillNo"] != null && Request["BillNo"] != "")
            {

                var BillNo = int.Parse(Request["BillNo"].ToString());

                var Client = db.ClientDetails.FirstOrDefault();
                ClientName.InnerText = Client.Name;
                ClientAddress.InnerText = Client.Address;
                ClientPhone.InnerText = Client.ContactNo;
                ClientEmail.InnerText = Client.Email;

                RefundMain objRm = db.RefundMains.Where(x => x.Id == BillNo).FirstOrDefault();

                Customer objCustomer = db.Customers.Where(x => x.Id == objRm.CustomerId).FirstOrDefault();

                var RemainBalance = (db.CustomerPayments.Where(x => x.CustomerId == objCustomer.Id).Sum(cp => cp.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == objCustomer.Id).Sum(cp => cp.Credit));

                List<RefundDetail> objRd = db.RefundDetails.Where(x => x.RMId == objRm.Id).ToList();
                var str = db.InvoiceDetailForRefund(objRm.Id);
                List<InvoiceDetailForRefund_Result> objList = new List<InvoiceDetailForRefund_Result>();
                CustomerBalance.InnerHtml= "Remaining Balance: <b>"+ Convert.ToDecimal(RemainBalance).ToString("#,##0")+"</b>";
                dvCustomer.InnerHtml = "Customer: <b>" + objCustomer.Name + "</b>";
                CusRef.InnerHtml = "Ref # :<b>"+objRm.Reference+"</b>";
                dvDate.InnerHtml = "Date: <b>" + DateTime.Parse(objRm.CreatedOn.ToString()).Date.ToString("dd MMM yyyy") + "</b>";
                dvBillNo.InnerHtml = "Reversal # :<b>" + objRm.InvoiceNo + "</b>";
                foreach (InvoiceDetailForRefund_Result item in str)
                {
                    objList.Add(item);
                }
                rptBillItems.DataSource = objList;
                rptBillItems.DataBind();
                tPrice.Text = "Total : ";
                decimal BillDisc = 0;
                if (objRm.RBillDiscountType == 1) // Amount
                {
                    BillDisc = decimal.Parse(Convert.ToDecimal(objRm.RBillDiscount).ToString());
                }
                else // %age
                {
                    BillDisc = (decimal.Parse(objRm.RTotalAfterDiscount.ToString()) * decimal.Parse(objRm.RBillDiscount.ToString())) / 100;
                }
                decimal strDisc = Convert.ToDecimal(objRm.RItemDiscount) + Convert.ToDecimal(BillDisc);
                tDiscount.Text = Convert.ToDecimal(strDisc).ToString("#,##0");
                tQty.Text = Convert.ToDecimal(objRm.RQty).ToString("#,##0");
                tAmountAfterDiscount.Text = Convert.ToDecimal(objRm.RNetTotal).ToString("#,##0");
                tAmount.Text = Convert.ToDecimal(objRm.RSubTotal).ToString("#,##0");
                NetBill.InnerText = Convert.ToDecimal(objRm.RNetTotal).ToString("#,##0");
                //Rec.InnerText = Convert.ToDecimal(objRm.RRecieved).ToString("#,##0");
                var Digits = n2w.ConvertAmount(Convert.ToDouble(objRm.RNetTotal));
                DigitToWords.InnerText = Digits.ToString();





            }
        }
    }
}
