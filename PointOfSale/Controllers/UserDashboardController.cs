using Newtonsoft.Json;
using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PointOfSale.Controllers
{
    public class UserDashboardController : GlobalController
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: UserDashboard
        public ActionResult Index()
        {
            if (!Authenticated || SiteUser.UserTypeId != 1) { return RedirectToAction("Login", "Authentication"); }            
            return View();
        }

        public ActionResult TodayTotalSale()
        {
            var status = "";
            if (Authenticated)
            {
                try
                {
                    var Todaydate = DateTime.Now.Date;
                    var TomorrowDate = DateTime.Now.Date.AddDays(1);
                    var obj = db.SaleMains.Where(x => x.CreatedOn > Todaydate && x.CreatedOn < TomorrowDate && x.CreatedBy==ActiveUserId).Select(x => x.NetTotal);
                    if (obj.Count() > 0)
                    {
                        var sale = new SaleMain();
                        sale.NetTotal = 0;
                        foreach (var item in obj)
                        {
                            sale.NetTotal += item;
                        }

                        status = JsonConvert.SerializeObject(sale.NetTotal);
                    }
                    else
                    {
                        status = JsonConvert.SerializeObject(0);
                    }
                }
                catch (Exception ex)
                {
                    ApplicationExceptionLogging(ex.Message, ex.StackTrace, " AdminDashboard", "TodayTotalSale");
                }
            }
            return Content(status);
        }


        public ActionResult TotalItems()
        {
            var status = "";
            if (Authenticated)
            {
                try
                {
                    var FromDate = DateTime.Now.Date;
                    var ToDate = DateTime.Now.Date.AddDays(1);
                    var objItems = db.SaleDetails.Where(x => x.CreatedOn >= FromDate && x.CreatedOn <= ToDate && x.CreatedBy == ActiveUserId).Sum(x => x.Qty);
                    if (objItems == null)
                    {
                        objItems = 0;
                    }
                    status = JsonConvert.SerializeObject(objItems);
                }
                catch (Exception ex)
                {
                    ApplicationExceptionLogging(ex.Message, ex.StackTrace, " AdminDashboard", "TotalItems");
                }
            }

            return Content(status);
        }


        public ActionResult TopTenSale(int option)
        {
            var status = "";
            if (Authenticated)
            {
                try
                {

                    var LastMonth = DateTime.Now.Date.AddMonths(-1);
                    var LastWeek = DateTime.Now.Date.AddDays(-7);
                    var Todaydate = DateTime.Now.Date;
                    var TomorrowDate = DateTime.Now.Date.AddDays(1);

                    var ToDate = TomorrowDate;
                    var FromDate = TomorrowDate;
                    if (option == 0)
                    {
                        FromDate = Todaydate;
                    }
                    else if (option == 1)
                    {
                        FromDate = LastWeek;
                    }
                    else if (option == 2)
                    {
                        FromDate = LastMonth;
                    }
                    else
                    {
                        status = "Invalid Entry";
                    }

                    var obj = db.SaleDetails.Where(x => x.CreatedOn > FromDate && x.CreatedOn < ToDate && x.CreatedBy == ActiveUserId).GroupBy(x => x.ItemId).Select(x => x.Select(s => new { ItemName = db.Items.Where(d=>d.Id== s.ItemId).Select(n=>n.Name), TotalQty = x.Sum(sUm => sUm.Qty) }).FirstOrDefault()).OrderByDescending(x => x.TotalQty).Take(10);


                    status = JsonConvert.SerializeObject(obj);
                }
                catch (Exception ex)
                {
                    ApplicationExceptionLogging(ex.Message, ex.StackTrace, " AdminDashboard", "TopTenSale");
                }
            }

            return Content(status);
        }


        public ActionResult TodayLastFifteenSale()
        {
            var status = "";
            if (Authenticated)
            {
                try
                {
                    var Todaydate = DateTime.Now.Date;
                    var TomorrowDate = DateTime.Now.Date.AddDays(1);
                    var objsm = db.SaleMains.Where(x => x.CreatedOn > Todaydate && x.CreatedOn < TomorrowDate && x.CreatedBy == ActiveUserId).OrderByDescending(x => x.CreatedOn).Take(15).Select(x => new { InvoiceNo = x.InvoiceNo, NetTotal = x.NetTotal });

                    status = JsonConvert.SerializeObject(objsm);
                }
                catch (Exception ex)
                {
                    ApplicationExceptionLogging(ex.Message, ex.StackTrace, " AdminDashboard", "TopTenSale");
                }
            }

            return Content(status);
        }

    }
}