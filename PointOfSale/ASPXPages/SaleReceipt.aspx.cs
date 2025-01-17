﻿using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PointOfSale.ASPXPages
{
    public partial class SaleReceipt : System.Web.UI.Page
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request["BillNo"] != null && Request["BillNo"] != "")
            {

                var BillNo = int.Parse(Request["BillNo"].ToString());


                var Client = db.ClientDetails.FirstOrDefault();
                //ClientName.InnerText = Client.Name;
                ClientAddress.InnerText = Client.Address;
                ClientPhone.InnerText = Client.ContactNo;
                ClientEmail.InnerText = Client.Email;
                SaleMain objSaleMain = db.SaleMains.Where(x => x.Id == BillNo).SingleOrDefault();

                Customer objCustomer = db.Customers.Where(x => x.Id == objSaleMain.CustomerId).FirstOrDefault();
                if (objCustomer.IsResaler==true)
                {
                    changeHide.Visible = false;                    
                }
                else
                {
                    RemainBalHide.Visible = false;
                    trPBal.Visible = false;

                }
                var RemainBalance = (db.CustomerPayments.Where(x => x.CustomerId == objCustomer.Id).Sum(cp => cp.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == objCustomer.Id).Sum(cp => cp.Credit));

                List<SaleDetail> objSaleDetail = db.SaleDetails.Where(x => x.SMId == objSaleMain.Id).ToList();
                var qty = 0;
                var str = db.InvoiceDetail(objSaleMain.Id);
                List<InvoiceDetail_Result> objList = new List<InvoiceDetail_Result>();
                if(objCustomer.Id==1)
                {
                    dvCustomer.InnerHtml = "Customer: WalkIn  ";
                }
                else
                {
                    dvCustomer.InnerHtml = "Customer: " + objCustomer.Name;
                }
               
                dvDate.InnerHtml = "Date: " + DateTime.Parse(objSaleMain.CreatedOn.ToString()).Date.ToString("dd MMM yyyy");
                dvTime.InnerHtml = "Time: " + DateTime.Parse(objSaleMain.CreatedOn.ToString()).ToString("hh:mm tt");

                dvBillNo.InnerHtml = "Invoice # " + objSaleMain.InvoiceNo;
                foreach (InvoiceDetail_Result item in str)
                {
                    objList.Add(item);                    
                }

                rptBillItems.DataSource = objList;
                rptBillItems.DataBind();
                

                lbltotalbill.InnerHtml = Convert.ToDecimal(objSaleMain.SubTotal).ToString("#,##0");


                decimal BillDisc = 0;

                if (objSaleMain.BillDiscountType == 1) // Amount
                {
                    BillDisc = decimal.Parse(Convert.ToDecimal(objSaleMain.BillDiscount).ToString("#,##0"));
                }
                else // %age
                {
                    BillDisc = (decimal.Parse(objSaleMain.TotalAfterDiscount.ToString()) * decimal.Parse(objSaleMain.BillDiscount.ToString())) / 100;
                }

                decimal strDisc = Convert.ToDecimal(objSaleMain.ItemDiscount) + Convert.ToDecimal(BillDisc);
                lbldiscount.InnerHtml = Convert.ToDecimal(strDisc).ToString("#,##0");

                if (decimal.Parse(lbldiscount.InnerHtml) <= 0)
                {
                    trdisc.Visible = false;
                }

                lblAdjustment.InnerHtml = Convert.ToDecimal(objSaleMain.Adjustment).ToString("#,##0");

                if (decimal.Parse(lblAdjustment.InnerHtml) <= 0)
                {
                    tradjustment.Visible = false;
                }

                var pBalance = (RemainBalance +objSaleMain.NetTotal)- objSaleMain.Recieved;
                if (pBalance<0)
                {
                    pBal.InnerHtml = '('+Convert.ToDecimal(-pBalance).ToString("#,##0") +')';

                }
                else
                {
                    pBal.InnerHtml = pBalance.ToString();

                }
                lblnetpayable.InnerHtml = Convert.ToDecimal(objSaleMain.NetTotal).ToString("#,##0");
                lblcashreceived.InnerHtml = Convert.ToDecimal(objSaleMain.Recieved).ToString("#,##0");

                lblreturnback.InnerHtml = Convert.ToDecimal(objSaleMain.Change).ToString("#,##0");
                if (RemainBalance<0)
                {
                    var negB = -1 * RemainBalance;
                    rBal.InnerHtml = '('+Convert.ToDecimal(negB).ToString("#,##0") +')';
                }
                else
                {
                    rBal.InnerHtml = Convert.ToDecimal(RemainBalance).ToString("#,##0") ;

                }




            }
        }
    }
}