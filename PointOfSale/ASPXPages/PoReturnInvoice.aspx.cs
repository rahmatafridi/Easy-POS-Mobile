using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PointOfSale.ASPXPages
{
    public partial class PoReturnInvoice : System.Web.UI.Page
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

                VendorRefundMain objvRm = db.VendorRefundMains.Where(x => x.Id == BillNo).FirstOrDefault();

                Vendor objVendor= db.Vendors.Where(x => x.Id == objvRm.VendorId).FirstOrDefault();

                var RemainBalance = (db.VendorPayments.Where(x => x.VendorId == objVendor.Id).Sum(cp => cp.Debit)) - (db.VendorPayments.Where(x => x.VendorId == objVendor.Id).Sum(cp => cp.Credit));

                List<VendorRefundDetail> objRd = db.VendorRefundDetails.Where(x => x.VRMId == objvRm.Id).ToList();
                var str = db.InvoiceDetailForVendorRefund(objvRm.Id);
                List<InvoiceDetailForVendorRefund_Result> objList = new List<InvoiceDetailForVendorRefund_Result>();
                CustomerBalance.InnerHtml = "Remaining Balance: <b>" + Convert.ToDecimal(RemainBalance).ToString("#,##0") + "</b>";
                dvCustomer.InnerHtml = "Vendor: <b>" + objVendor.Name + "</b>";
                CusRef.InnerHtml = "Ref # :<b>" + objvRm.Reference + "</b>";
                dvDate.InnerHtml = "Date: <b>" + DateTime.Parse(objvRm.CreatedOn.ToString()).Date.ToString("dd MMM yyyy") + "</b>";
                dvBillNo.InnerHtml = "Reversal # :<b>" + objvRm.ReversalNo + "</b>";
                foreach (InvoiceDetailForVendorRefund_Result item in str)
                {
                    objList.Add(item);
                }
                rptBillItems.DataSource = objList;
                rptBillItems.DataBind();
                tPrice.Text = "Total : ";
                
                tQty.Text = Convert.ToDecimal(objvRm.RQty).ToString("#,##0");
                tAmount.Text = Convert.ToDecimal(objvRm.RSubTotal).ToString("#,##0");
                NetBill.InnerHtml= Convert.ToDecimal(objvRm.RSubTotal).ToString("#,##0");
                var Digits = n2w.ConvertAmount(Convert.ToDouble(objvRm.RSubTotal));
                DigitToWords.InnerText = Digits.ToString();





            }
        }
    }
}