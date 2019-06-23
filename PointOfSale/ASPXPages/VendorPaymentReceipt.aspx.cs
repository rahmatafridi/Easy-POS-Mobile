using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PointOfSale.ASPXPages
{
    public partial class VendorPaymentReceipt : System.Web.UI.Page
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request["UID"] != null && Request["UID"] != "" && Request["VpId"] != null && Request["VpId"] != "")
            {
                var Client = db.ClientDetails.FirstOrDefault();
                ClientName.InnerText = Client.Name;
               


                var UID = Guid.Parse(Request["UID"].ToString());
                var VpId= int.Parse(Request["VpId"].ToString());
                var Vendor = db.Vendors.Where(x => x.UID == UID).FirstOrDefault();
                var RemainBalance = (db.VendorPayments.Where(x => x.VendorId == Vendor.Id).Sum(cp => cp.Debit)) - (db.VendorPayments.Where(x => x.VendorId == Vendor.Id).Sum(cp => cp.Credit));
                var paymentAmount = db.VendorPayments.Where(x => x.Id == VpId).Select(s => s.Debit).FirstOrDefault();
                var ExBalance = RemainBalance - paymentAmount;
                spnCustomer.InnerHtml = Vendor.Name.ToString().ToUpper();
                dvDate.InnerHtml = "Date:" + DateTime.Now.Date.ToString("dd MMM yyyy");
                dvTime.InnerHtml = "Time:" + DateTime.Now.ToString("hh:mm tt");


                lblcurrbal.InnerHtml = Convert.ToDecimal(RemainBalance).ToString("#,##0");

                lblprevbal.InnerHtml = Convert.ToDecimal(ExBalance).ToString("#,##0");
                lblreceived.InnerHtml = Convert.ToDecimal(paymentAmount).ToString("#,##0");

            }
        }
    }
}