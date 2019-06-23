using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PointOfSale.ASPXPages
{
    public partial class SaleRecieptForReseller : System.Web.UI.Page
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
                SaleMain objSaleMain = db.SaleMains.Where(x => x.Id == BillNo).SingleOrDefault();

                Customer objCustomer = db.Customers.Where(x => x.Id == objSaleMain.CustomerId).FirstOrDefault();
                //if (objCustomer.IsResaler == true)
                //{
                //    changeHide.Visible = false;
                //}
                //else
                //{
                //    RemainBalHide.Visible = false;
                //    trPBal.Visible = false;

                //}
                var RemainBalance = (db.CustomerPayments.Where(x => x.CustomerId == objCustomer.Id).Sum(cp => cp.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == objCustomer.Id).Sum(cp => cp.Credit));

                List<SaleDetail> objSaleDetail = db.SaleDetails.Where(x => x.SMId == objSaleMain.Id).ToList();
                var qty = 0;
                var str = db.InvoiceDetailForReseller(objSaleMain.Id);
                List<InvoiceDetailForReseller_Result> objList = new List<InvoiceDetailForReseller_Result>();

                dvCustomer.InnerHtml = "Customer: <b>" + objCustomer.Name+"</b>";
                CusAddress.InnerHtml = "Address: " + objCustomer.Address;
                CusRef.InnerHtml = "Ref # : "+objSaleMain.Refrence;
                CusPhone.InnerHtml = "Phone # : " + objCustomer.Contact;


                dvDate.InnerHtml = "Date: <b>" + DateTime.Parse(objSaleMain.CreatedOn.ToString()).Date.ToString("dd MMM yyyy") + "</b>";
                //dvTime.InnerHtml = "Time: " + DateTime.Parse(objSaleMain.CreatedOn.ToString()).ToString("hh:mm tt");

                dvBillNo.InnerHtml = "Invoice # :<b>" + objSaleMain.InvoiceNo + "</b>";
                foreach (InvoiceDetailForReseller_Result item in str)
                {                    
                    objList.Add(item);
                }

                rptBillItems.DataSource = objList;
                rptBillItems.DataBind();

                tPrice.Text = "Total : ";

                //lbltotalbill.InnerHtml = Convert.ToDecimal(objSaleMain.SubTotal).ToString("#,##0");
                InvoBal.InnerText ="Invoice Bill # : "+ Convert.ToDecimal(objSaleMain.SubTotal).ToString("#,##0");
                


                decimal BillDisc = 0;

                if (objSaleMain.BillDiscountType == 1) // Amount
                {
                    BillDisc = decimal.Parse(Convert.ToDecimal(objSaleMain.BillDiscount).ToString());
                }
                else // %age
                {
                    BillDisc = (decimal.Parse(objSaleMain.TotalAfterDiscount.ToString()) * decimal.Parse(objSaleMain.BillDiscount.ToString())) / 100;
                }

                decimal strDisc = Convert.ToDecimal(objSaleMain.ItemDiscount) + Convert.ToDecimal(BillDisc);
                //lbldiscount.InnerHtml = Convert.ToDecimal(strDisc).ToString("#,##0");
                tDiscount.Text = Convert.ToDecimal(strDisc).ToString("#,##0");
                tQty.Text = Convert.ToDecimal(objSaleMain.TotalQty).ToString("#,##0");
                tAmountAfterDiscount.Text = Convert.ToDecimal(objSaleMain.NetTotal).ToString("#,##0");
                tAmount.Text = Convert.ToDecimal(objSaleMain.SubTotal).ToString("#,##0");






                //if (decimal.Parse(lbldiscount.InnerHtml) <= 0)
                //{
                //    trdisc.Visible = false;
                //}

                //lblAdjustment.InnerHtml = Convert.ToDecimal(objSaleMain.Adjustment).ToString("#,##0");

                //if (decimal.Parse(lblAdjustment.InnerHtml) <= 0)
                //{
                //    tradjustment.Visible = false;
                //}

                var pBalance = (RemainBalance + objSaleMain.NetTotal) - objSaleMain.Recieved;
                //if (pBalance < 0)
                //{
                //    pBal.InnerHtml = '(' + Convert.ToDecimal(-pBalance).ToString("#,##0") + ')';

                //}
                //else
                //{
                //    pBal.InnerHtml = pBalance.ToString();

                //}
                //lblnetpayable.InnerHtml = Convert.ToDecimal(objSaleMain.NetTotal).ToString("#,##0");
                //lblcashreceived.InnerHtml = Convert.ToDecimal(objSaleMain.Recieved).ToString("#,##0");

                //lblreturnback.InnerHtml = Convert.ToDecimal(objSaleMain.Change).ToString("#,##0");
                if (RemainBalance < 0)
                {
                    var negB = -1 * RemainBalance;
                    //rBal.InnerHtml = '(' + Convert.ToDecimal(negB).ToString("#,##0") + ')';

                    CurBal.InnerText = "(" + Convert.ToDecimal(negB).ToString("#,##0") +")";

                }
                else
                {
                    CurBal.InnerText =Convert.ToDecimal(RemainBalance).ToString("#,##0");

                    //rBal.InnerHtml = Convert.ToDecimal(RemainBalance).ToString("#,##0");

                }

                if (pBalance < 0)
                {
                    var negB = -1 * pBalance;
                    //rBal.InnerHtml = '(' + Convert.ToDecimal(negB).ToString("#,##0") + ')';
                    PreBal.InnerText = "(" + Convert.ToDecimal(negB).ToString("#,##0") + ")";
                }
                else
                {
                    PreBal.InnerText = Convert.ToDecimal(pBalance).ToString("#,##0");
                    //rBal.InnerHtml = Convert.ToDecimal(RemainBalance).ToString("#,##0");
                }



                InvoBal.InnerText = Convert.ToDecimal(objSaleMain.SubTotal).ToString("#,##0");
                NetBill.InnerText =  Convert.ToDecimal(objSaleMain.NetTotal).ToString("#,##0");
                Rec.InnerText = Convert.ToDecimal(objSaleMain.Recieved).ToString("#,##0");
                var Digits = n2w.ConvertAmount(Convert.ToDouble(objSaleMain.NetTotal));
                DigitToWords.InnerText = Digits.ToString();





            }
        }
    }
}