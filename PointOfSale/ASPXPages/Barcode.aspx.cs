using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using PointOfSale.Models;

namespace WebixoftBoutiqueProduction.ASPX_Pages
{
    public partial class Barcode : System.Web.UI.Page
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request["UID"] != null && Request["UID"].ToString() != "")
            {
                Guid? UID = Guid.Parse(Request["UID"].ToString());
                var str = (from b in db.Barcodes
                           join
                           c in db.Categories
                           on b.CategoryId equals c.Id
                           join
                          
                           i in db.Items on b.ItemId equals i.Id
                           where b.UID == UID
                           select
                             new 
                             {
                                 UID = b.UID,
                                 Item = i.Name,
                                 Price = i.SalePrice,
                                 Barcode = b.Barcode1
                             }).ToList();

                if (str != null)
                {                    
                    barcode.Value = str[0].Barcode;
                    lblItem.InnerHtml = str[0].Item;
                    lblCategory.InnerHtml = "Price : Rs. " + str[0].Price.ToString() + "/-";
                    //if (Request["PrintName"].ToString() == "1")
                    //{
                    //    trDescp.Visible = true;                        
                    //}
                    //else
                    //{
                    //    trDescp.Visible = false;
                    //}
                }

            }
        }
    }
}