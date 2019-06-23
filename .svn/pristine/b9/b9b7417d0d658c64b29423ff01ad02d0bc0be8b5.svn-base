using Newtonsoft.Json;
using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PointOfSale.Controllers
{
    public class AdminDashboardController : GlobalController
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: AdminDashboard
        public ActionResult Index()
        {

            if (!Authenticated || SiteUser.UserTypeId == 1) { return RedirectToAction("Login", "Authentication"); }
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
                    var obj = db.SaleDetails.Where(x => x.CreatedOn > Todaydate && x.CreatedOn < TomorrowDate && x.RefundStatus==null).Select(x => x.AmountAfterDiscount);
                    if (obj.Count() > 0)
                    {
                        var sale = new SaleDetail();
                        sale.AmountAfterDiscount = 0;
                        foreach (var item in obj)
                        {
                            sale.AmountAfterDiscount += item;
                        }
                        
                        status = JsonConvert.SerializeObject(sale.AmountAfterDiscount);
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

        public ActionResult TodaySaleAverage()
        {
            var status = "";
            if (Authenticated)
            {
                try
                {
                    var Todaydate = DateTime.Now.Date;
                    var TomorrowDate = DateTime.Now.Date.AddDays(1);
                    var obj = db.SaleDetails.Where(x => x.CreatedOn > Todaydate && x.CreatedOn < TomorrowDate && x.RefundStatus==null).Select(x => x.AmountAfterDiscount);
                    if (obj.Count() > 0)
                    {
                        var sale = new SaleDetail();
                        sale.AmountAfterDiscount = 0;
                        var i = 0;
                        foreach (var item in obj)
                        {
                            i += 1;
                            sale.AmountAfterDiscount += item;
                        }
                        var averageSale = sale.AmountAfterDiscount / i;
                        
                        status = JsonConvert.SerializeObject(averageSale);
                    }
                    else
                    {
                        status = JsonConvert.SerializeObject(0);
                    }
                }
                catch (Exception ex)
                {
                    ApplicationExceptionLogging(ex.Message, ex.StackTrace, " AdminDashboard", "TodaySaleAverage");
                }
            }

            return Content(status);
        }

        public ActionResult TodayProfit()
        {
            var status = "";
            if (Authenticated)
            {
                try
                {
                    var Todaydate = DateTime.Now.Date;
                    var TomorrowDate = DateTime.Now.Date.AddDays(1);
                    var obj = db.SaleDetails.Where(x => x.CreatedOn > Todaydate && x.CreatedOn < TomorrowDate && x.RefundStatus==null).ToList();
                    if (obj.Count() > 0)
                    {
                        var sale = new SaleDetail();
                        sale.AmountAfterDiscount = 0;
                        var totalCost = sale.AmountAfterDiscount;
                        var totalsale = sale.AmountAfterDiscount;
                        foreach (var sm in obj)
                        {
                            sale.AmountAfterDiscount += sm.AmountAfterDiscount;
                            totalsale = sale.AmountAfterDiscount; 

                            //var objsd = db.SaleDetails.Where(x => x.SMId == sm.Id);
                            //foreach (var sd in objsd)
                            //{
                                var objwh = db.Warehouses.Where(x => x.ItemId == sm.ItemId).FirstOrDefault();
                                totalCost += sm.Qty * objwh.CostRate;
                            //}
                        }
                       
                        var profit = totalsale - totalCost;
                        
                        status = JsonConvert.SerializeObject(profit);
                    }
                    else
                    {
                        status = JsonConvert.SerializeObject(0);
                    }
                }
                catch (Exception ex)
                {
                    ApplicationExceptionLogging(ex.Message, ex.StackTrace, " AdminDashboard", "TodayProfit");
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
                    var objItems = db.SaleDetails.Where(x => x.CreatedOn >= FromDate && x.CreatedOn <= ToDate && x.RefundStatus==null).Sum(x => x.Qty);
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
                    // with Sp
                    var data = db.GetTop10MostSellingItems(option);

                    //With Methode 


                    //var LastMonth = DateTime.Now.Date.AddMonths(-1);
                    //var LastWeek = DateTime.Now.Date.AddDays(-7);
                    //var Todaydate = DateTime.Now.Date;
                    //var TomorrowDate = DateTime.Now.Date.AddDays(1);

                    //var ToDate = TomorrowDate;
                    //var FromDate = TomorrowDate;
                    //if (option == 0)
                    //{
                    //    FromDate = Todaydate;
                    //}
                    //else if (option == 1)
                    //{
                    //    FromDate = LastWeek;
                    //}
                    //else if (option == 2)
                    //{
                    //    FromDate = LastMonth;
                    //}
                    //else
                    //{
                    //    status = "Invalid Entry";
                    //}

                    //var obj = db.SaleDetails.Where(x => x.CreatedOn > FromDate && x.CreatedOn < ToDate).GroupBy(x => x.ItemId).Select(x => x.Select(s => new { ItemId = s.ItemId, TotalQty = x.Sum(sUm => sUm.Qty) }).FirstOrDefault()).OrderByDescending(x => x.TotalQty).Take(10);


                    status = JsonConvert.SerializeObject(data);
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
                    //var objsd = db.SaleDetails.Where(x => x.RefundStatus == null).ToList();

                    //var objsm = db.SaleMains.Where(x => x.CreatedOn > Todaydate && x.CreatedOn < TomorrowDate ).OrderByDescending(x => x.CreatedOn).Take(15).Select(x => new { InvoiceNo = x.InvoiceNo, NetTotal = x.NetTotal });
                    var objsm = db.TodayLastFifteenSale();
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