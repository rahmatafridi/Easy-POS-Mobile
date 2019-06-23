using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PointOfSale.ASPXPages
{
    public partial class CustomerReceivedReceipt : System.Web.UI.Page
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request["UID"] != null && Request["UID"] != "" && Request["CpId"] != null && Request["CpId"] != "")
            {


                var Client = db.ClientDetails.FirstOrDefault();
                ClientName.InnerText = Client.Name;
          

                var UID = Guid.Parse(Request["UID"].ToString());
                var VpId = int.Parse(Request["CpId"].ToString());
                var Customer = db.Customers.Where(x => x.UID == UID).FirstOrDefault();
                var RemainBalance = (db.CustomerPayments.Where(x => x.CustomerId == Customer.Id).Sum(cp => cp.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == Customer.Id).Sum(cp => cp.Credit));
                var paymentAmount = db.CustomerPayments.Where(x => x.Id == VpId).Select(s => s.Debit).FirstOrDefault();
                var ExBalance = RemainBalance - paymentAmount;
                spnCustomer.InnerHtml = Customer.Name.ToString().ToUpper();
                dvDate.InnerHtml = "Date:" + DateTime.Now.Date.ToString("dd MMM yyyy");
                dvTime.InnerHtml = "Time:" + DateTime.Now.ToString("hh:mm tt");


                lblcurrbal.InnerHtml = Convert.ToDecimal(RemainBalance).ToString("#,##0"); 

                lblprevbal.InnerHtml = Convert.ToDecimal(ExBalance).ToString("#,##0");
                lblreceived.InnerHtml = Convert.ToDecimal(paymentAmount).ToString("#,##0");


            }
        }
    }
}