﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PointOfSale.Models;
using Newtonsoft.Json;

namespace PointOfSale.Controllers
{
    public class ReportsController : GlobalController
    {
        PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: Reports
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }


        public ActionResult CustomerDetailView()
        {
            ViewBag.ClientName = db.ClientDetails.Select(s => s.Name).FirstOrDefault();

            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }
        public ActionResult StockInHandSummaryIndex()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult ItemProfitLoss()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult LoadCategories()
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {

                    var obj = db.Categories.ToList();
                    status = JsonConvert.SerializeObject(obj);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "LoadCategories");
            }

            return Content(status);
        }


        public ActionResult LoadSubCategories(int Cat)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {

                    var obj = db.SubCategories.Where(x => x.CategoryId == Cat).ToList();
                    status = JsonConvert.SerializeObject(obj);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "LoadCategories");
            }

            return Content(status);
        }


        public ActionResult ItemProfitLossGet(string FromDate, string ToDate, int Cat, int SubCat)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var From = DateTime.Parse(FromDate);
                    var To = DateTime.Parse(ToDate);
                    To = To.AddDays(1);

                    var obj = (from sd in db.SaleDetails
                               join
                               i in db.Items
                             on sd.ItemId equals i.Id
                               join
                               catg in db.Categories
                               on i.CategoryId equals catg.Id
                               join
                               sCat in db.SubCategories
                               on i.SubCategoryId equals sCat.Id
                               where (sd.CreatedOn >= From && sd.CreatedOn < To) && (i.CategoryId == Cat || Cat == 0) && (i.SubCategoryId == SubCat || SubCat == 0)
                               orderby sd.CreatedOn
                               select
                               new
                               {
                                   Date = sd.CreatedOn,
                                   Item = i.Name,
                                   Barcode = sd.Barcode,
                                   CategoryName = catg.Name,
                                   SubCategoryName = sCat.Name,
                                   Qty = sd.Qty,
                                   CostPrice = i.CostPrice,
                                   SalePrice = sd.Price,
                                   NetCost = (i.CostPrice == null ? 0 : i.CostPrice) * (sd.Qty),
                                   NetSale = (sd.Price == null ? 0 : sd.Price) * (sd.Qty),
                                   Discount = sd.Discount * sd.Qty,
                                   Profit = ((sd.Price == null ? 0 : sd.Price) * (sd.Qty)) - ((i.CostPrice == null ? 0 : i.CostPrice) * (sd.Qty)) - ((sd.Discount * sd.Qty))
                               });


                    status = JsonConvert.SerializeObject(obj);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "LoadSaleMainAndDetail");
            }
            return Content(status);
        }




        public ActionResult LoadSellingItemsSummary(int Cat, int SubCat)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var obj = db.GetStockInHandReportSummary(Cat, SubCat);
                    status = JsonConvert.SerializeObject(obj);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "LoadSellingItems");
            }
            return Content(status);
        }


        public ActionResult LoadStockInhand(int Cat, int SubCat)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var obj = db.GetStockInHandReport(Cat, SubCat);
                    status = JsonConvert.SerializeObject(obj);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "LoadSellingItems");
            }
            return Content(status);
        }
        public ActionResult CustomerIndex()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult VendorDetailView()
        {
            ViewBag.ClientName = db.ClientDetails.Select(s => s.Name).FirstOrDefault();

            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult VendorIndex()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult VendorLoadGrid()
        {
            var status = "error";
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }

            var objC = (from v in db.Vendors
                        select new
                        {
                            v.UID,
                            v.Name,
                            City=v.Address,
                            v.Contact,
                            Balance = (db.VendorPayments.Where(x => x.VendorId == v.Id).Sum(s => s.Debit)) - (db.VendorPayments.Where(x => x.VendorId == v.Id).Sum(s => s.Credit))
                        }).ToList();
            status = JsonConvert.SerializeObject(objC);

            return Content(status);
        }


        public ActionResult CustomerLoadGrid()
        {
            var status = "error";
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }

            var objC = (from c in db.Customers
                        select new
                        {
                            c.UID,
                            c.Name,
                            c.City,
                            c.Contact,
                            Balance = (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(s => s.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(s => s.Credit))
                        }).ToList();
            status = JsonConvert.SerializeObject(objC);

            return Content(status);
        }

      

        public ActionResult CustomerTransactionDetail(Guid UID)
        {
            var status = "error";

            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var StringUID = Convert.ToString(UID);

                    var Detail = db.CustomerLedgerReport(StringUID);



                    //var objIpm = db.Customers.Where(x => x.UID == UID).Select(s => s.Id).FirstOrDefault();


                    //var Detail = (from cp in db.CustomerPayments
                    //              join c in db.Customers on
                    //              cp.CustomerId equals c.Id
                    //              where cp.CustomerId == objIpm
                    //              select new
                    //              {
                    //                  cp.SoNumber,
                    //                  Name = c.Name,
                    //                  cp.EntryType,
                    //                  cp.CreatedOn,
                    //                  Debit = cp.Debit,
                    //                  Credit = cp.Credit,
                    //              }).ToList();

                    status = JsonConvert.SerializeObject(Detail);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "PoDetail");
            }

            return Content(status);
        }

        public ActionResult VendorTransactionDetail(Guid UID)
        {
            var status = "error";

            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    //var objIpm = db.Vendors.Where(x => x.UID == UID).Select(s => s.Id).FirstOrDefault();

                    var StringUID = Convert.ToString(UID);

                    var Detail = db.VendorLedgerReport(StringUID);

                    //var Detail = (from vp in db.VendorPayments
                    //              join v in db.Vendors on
                    //              vp.VendorId equals v.Id
                    //              where vp.VendorId == objIpm
                    //              select new
                    //              {
                    //                  vp.PoNumber,
                    //                  Name = v.Name,
                    //                  vp.EntryType,
                    //                  vp.CreatedOn,
                    //                  Debit = vp.Debit,
                    //                  Credit = vp.Credit,
                    //                  Comment=vp.Comment
                    //              }).ToList();

                    status = JsonConvert.SerializeObject(Detail);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "PoDetail");
            }

            return Content(status);
        }

        public ActionResult CustomerTransactionDetailWithDate(Guid UID,DateTime fDate,DateTime tDate)
        {
            var status = "error";

            try
            {
                tDate = tDate.AddDays(1);
                fDate = fDate.AddDays(-1);


                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var objIpm = db.Customers.Where(x => x.UID == UID).Select(s => s.Id).FirstOrDefault();
                    var StringUID = Convert.ToString(UID);
                    var Detail = db.CustomerLedgerReportWithDateRange(StringUID, fDate, tDate);

                    //var Detail = (from cp in db.CustomerPayments
                    //              join c in db.Customers on
                    //              cp.CustomerId equals c.Id
                    //              where cp.CustomerId == objIpm
                    //              && cp.CreatedOn>=fDate && cp.CreatedOn <=tDate
                    //              select new
                    //              {
                    //                  cp.SoNumber,
                    //                  Name = c.Name,
                    //                  cp.EntryType,
                    //                  cp.CreatedOn,
                    //                  Debit = cp.Debit,
                    //                  Credit = cp.Credit,
                    //              }).ToList();

                    status = JsonConvert.SerializeObject(Detail);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "PoDetail");
            }

            return Content(status);
        }

        public ActionResult VendorTransactionDetailWithDate(Guid UID, DateTime fDate, DateTime tDate)
        {
            var status = "error";

            try
            {

                tDate = tDate.AddDays(1);
                fDate = fDate.AddDays(-1);

                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {

                    var StringUID = Convert.ToString(UID);
                    var Detail = db.VendorLedgerReportWithDate(StringUID, fDate, tDate);


                    //var objIpm = db.Vendors.Where(x => x.UID == UID).Select(s => s.Id).FirstOrDefault();


                    //var Detail = (from vp in db.VendorPayments
                    //              join v in db.Vendors on
                    //              vp.VendorId equals v.Id
                    //              where vp.VendorId == objIpm
                    //              && vp.CreatedOn >= fDate && vp.CreatedOn <= tDate
                    //              select new
                    //              {
                    //                  vp.PoNumber,
                    //                  Name = v.Name,
                    //                  vp.EntryType,
                    //                  vp.CreatedOn,
                    //                  Debit = vp.Debit,
                    //                  Credit = vp.Credit,
                    //                  Comment=vp.Comment
                    //              }).ToList();

                    status = JsonConvert.SerializeObject(Detail);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "PoDetail");
            }

            return Content(status);
        }

        public ActionResult CustomerDetail(Guid UID)
        {
            var status = "error";

            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var objIpm = db.Customers.Where(x => x.UID == UID).FirstOrDefault();

                    status = JsonConvert.SerializeObject(objIpm);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "PoDetail");
            }

            return Content(status);
        }

        public ActionResult VendorDetail(Guid UID)
        {
            var status = "error";

            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var objIpm = db.Vendors.Where(x => x.UID == UID).FirstOrDefault();

                    status = JsonConvert.SerializeObject(objIpm);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "PoDetail");
            }

            return Content(status);
        }

        public ActionResult PurchaseOrder()
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {

                    var obj = (from ipm in db.ItemPurchaseMains
                               join
                               v in db.Vendors
                               on ipm.VendorId equals v.Id
                               select
                               new
                               {
                                   UID = ipm.UID,
                                   PurchaseOrderNo = ipm.PurchaseOrderNo,
                                   VendorId = v.Name,
                                   Status = ipm.IsPosted
                               }).ToList();
                    status = JsonConvert.SerializeObject(obj);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "PurchaseOrder");
            }
            return Content(status);
        }

    
        public ActionResult PoDetailView()
        {
            ViewBag.ClientName = db.ClientDetails.Select(s=>s.Name).FirstOrDefault();
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }
        public ActionResult PoDetail(Guid UID)
        {
            var status = "error";

            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var objIpm = (from ipm in db.ItemPurchaseMains where ipm.UID == UID select ipm.Id).SingleOrDefault();
                    //var objIpd = db.ItemPurchaseDetails.Where(x => x.IPMId == objIpm).ToList();
                    //var list = JsonConvert.SerializeObject(objIpd);
                    var detail = (from ipd in db.ItemPurchaseDetails
                                  join
                                  i in db.Items
                                  on ipd.ItemId equals i.Id
                                  where ipd.IPMId == objIpm
                                  select new
                                  {
                                      itemName = i.Name,
                                      Barcode = i.Barcode,
                                      Quantity = ipd.Quantity,
                                      costRate = ipd.Rate,
                                      costAmount = ipd.Amount,
                                      saleRate = ipd.SaleRate,
                                      saleAmount = ipd.SaleAmount,
                                      Expiry = ipd.Expired,
                                      Batch = ipd.Batch

                                  }).ToList();

                    status = JsonConvert.SerializeObject(detail);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "PoDetail");
            }

            return Content(status);
        }

        public ActionResult PoMain(Guid UID)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var objMain = from ipm in db.ItemPurchaseMains
                                  join
                                  v in db.Vendors
                                  on ipm.VendorId equals v.Id
                                  where ipm.UID == UID
                                  select
                                  new
                                  {
                                      vendorName = v.Name,
                                      orderNo = ipm.PurchaseOrderNo,
                                      orderDate = ipm.PurchaseOrderDate
                                  };
                    status = JsonConvert.SerializeObject(objMain);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "PoMain");
            }
            return Content(status);
        }

        //Issuance Controller code Start................................................................

        public ActionResult TransferIndex()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }


        public ActionResult LoadTransferMain()
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {

                    var obj = (from wtm in db.WarehouseTransferMains
                               join
                               l in db.Locations
                               on wtm.LocationId equals l.Id
                               select
                               new
                               {
                                   UID = wtm.UID,
                                   Location = l.Name,
                                   Date = wtm.TransferDate,
                                   TransferNo = wtm.TransactionNo
                               }).ToList();
                    status = JsonConvert.SerializeObject(obj);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "LoadTransferMain");
            }
            return Content(status);
        }

        public ActionResult TransferDetailView()
        {
            ViewBag.ClientName = db.ClientDetails.Select(s => s.Name).FirstOrDefault();

            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }


        public ActionResult TransferDetail(Guid UID)
        {
            var status = "error";

            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var objWtm = (from Wtm in db.WarehouseTransferMains where Wtm.UID == UID select Wtm.Id).SingleOrDefault();
                    //var objIpd = db.ItemPurchaseDetails.Where(x => x.IPMId == objIpm).ToList();
                    //var list = JsonConvert.SerializeObject(objIpd);
                    var detail = (from wt in db.WarehouseTransfers
                                  join
                                  c in db.Categories
                                  on wt.CategoryId equals c.Id
                                  join
                                  i in db.Items
                                  on wt.ItemId equals i.Id
                                  where wt.WtmId == objWtm
                                  select new
                                  {
                                      itemName = i.Name,
                                      Barcode = wt.Barcode,
                                      Category = c.Name,
                                      BeforeQty = wt.AvailableQty,
                                      IssueQty = wt.IssueQty,
                                      AfterQty = wt.BalanceQty,
                                      Date = wt.CreatedOn


                                  }).ToList();

                    status = JsonConvert.SerializeObject(detail);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "TransferDetail");
            }

            return Content(status);
        }

        public ActionResult TransferMain(Guid UID)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var objMain = from Wtm in db.WarehouseTransferMains
                                  join
                                  l in db.Locations
                                  on Wtm.LocationId equals l.Id
                                  where Wtm.UID == UID
                                  select
                                  new
                                  {
                                      Location = l.Name,
                                      TransferNo = Wtm.TransactionNo,
                                  };
                    status = JsonConvert.SerializeObject(objMain);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "TransferMain");
            }
            return Content(status);
        }

        //Sale Controller code Start................................................................

        public ActionResult SaleIndex()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }


        public ActionResult LoadSaleByCategoryId(string FromDate, string ToDate, int CatId)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var From = DateTime.Parse(FromDate);
                    var To = DateTime.Parse(ToDate).AddDays(1);


                    var SdByCat = from sd in db.SaleDetails
                                  join
                                  i in db.Items
                                  on sd.ItemId equals i.Id


                                  where sd.CreatedOn > From && sd.CreatedOn < To && i.CategoryId == CatId
                                  select sd;
                    if (SdByCat != null)
                    {
                        var GetSum = SdByCat.GroupBy(x => x.ItemId).Select(x => x.Select(s => new
                        {
                            ItemName = db.Items.Where(d => d.Id == s.ItemId).Select(n => n.Name).FirstOrDefault(),
                            Barcode = db.Items.Where(d => d.Id == s.ItemId).Select(n => n.Barcode).FirstOrDefault(),
                            TotalQty = x.Sum(sUm => sUm.Qty),
                            CategoryName = (from i in db.Items join c in db.Categories on i.CategoryId equals c.Id where i.Id == s.ItemId select c.Name).FirstOrDefault()

                        }).FirstOrDefault());
                        status = JsonConvert.SerializeObject(GetSum);
                        if (GetSum.Count() < 1)
                        {
                            status = "No Item";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "LoadSaleByCategoryId");
            }

            return Content(status);
        }


        public ActionResult SaleDetailView()
        {
            ViewBag.ClientName = db.ClientDetails.Select(s => s.Name).FirstOrDefault();

            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult LoadCustomers()
        {
            string status = "error";
            try
            {

                var ListCustomer = (from c in db.Customers
                                    select new
                                    {
                                        Id = c.Id,
                                        Name = c.Name
                                    }).ToList();


                status = JsonConvert.SerializeObject(ListCustomer);

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "LoadCustomers");
            }
            return Content(status);
        }

        public ActionResult RefundStockIndex()
        {
            ViewBag.ClientName = db.ClientDetails.Select(s => s.Name).FirstOrDefault();

            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult LoadRefundDetailData(string FromDate, string ToDate, int CustomerId)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var From = DateTime.Parse(FromDate);
                    var To = DateTime.Parse(ToDate);
                    To = To.AddDays(1);

                    var objRd = (from rd in db.RefundDetails
                                 join
                                 rm in db.RefundMains
                                 on rd.RMId equals rm.Id
                                 join
                                 c in db.Customers
                                 on rm.CustomerId equals c.Id
                                 join
                                 i in db.Items
                                 on rd.RItemId equals i.Id
                                 join
                                 sc in db.SubCategories
                                 on i.SubCategoryId equals sc.Id
                                 where rd.CreatedOn >= From && rd.CreatedOn < To && (rm.CustomerId==CustomerId || rm.CustomerId !=0)
                                 select new
                                 {
                                     CustomerName = c.Name,
                                     InvoiceNo = rm.InvoiceNo,
                                     Date = rd.CreatedOn,
                                     Description = sc.Name +"-"+ i.Name +"-"+ rd.RBarcode,
                                     Qty = rd.RQty,
                                     Rate = rd.RPrice,
                                     Discount = rd.RDiscount,
                                     NetAmount = rd.RPrice - rd.RDiscount,
                                     Amount = (rd.RPrice - rd.RDiscount) * rd.RQty

                                 });


 

                    status = JsonConvert.SerializeObject(objRd);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "LoadSaleMainAndDetail");
            }
            return Content(status);
        }


        public ActionResult LoadSaleMainAndDetail(string FromDate, string ToDate)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var From = DateTime.Parse(FromDate);
                    var To = DateTime.Parse(ToDate);
                    To = To.AddDays(1);

                    var obj = (from sm in db.SaleMains
                               join
                               sd in db.SaleDetails
                               on sm.Id equals sd.SMId
                               join
                               i in db.Items
                             on sd.ItemId equals i.Id
                               join
                               c in db.Customers
                               on sm.CustomerId equals c.Id
                               where sm.CreatedOn >= From && sm.CreatedOn < To && sd.RefundStatus==null
                               orderby sm.CreatedOn
                               select
                               new
                               {
                                   InvoiceNo = sm.InvoiceNo,
                                   CustomerName = c.Name,
                                   ItemName = i.Name,
                                   Barcode = sd.Barcode,
                                   Quantity = sd.Qty,
                                   Price = sd.Price,
                                   Amount = sd.Amount,
                                   Discount = sd.Discount,
                                   AmountAfterDiscount = sd.AmountAfterDiscount,
                                   TotalBill = sm.SubTotal,
                                   BillDiscount = sm.BillDiscount,
                                   Adjustment = sm.Adjustment,
                                   NetBill = sm.NetTotal,
                                   Recieved = sm.Recieved,
                                   Change = sm.Change,

                                   SaleMainId = sm.Id,
                                   CountRow = db.SaleDetails.Where(x => x.SMId == sm.Id).Count()
                               });


                    status = JsonConvert.SerializeObject(obj);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "LoadSaleMainAndDetail");
            }
            return Content(status);
        }


        //Stock in hand code start from here................

        public ActionResult StockIndex()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult LoadSellingItems()
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    var obj = from si in db.SellingItems
                              join
                              i in db.Items
                              on si.ItemId equals i.Id
                              join
                              c in db.Categories
                              on si.CategoryId equals c.Id
                              select new
                              {
                                  ItemName = i.Name,
                                  Barcode = si.Barcode,
                                  CategoryName = c.Name,
                                  Quantity = si.Quantity
                              };
                    status = JsonConvert.SerializeObject(obj);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ReportsController", "LoadSellingItems");
            }
            return Content(status);
        }


        public ActionResult DailyExpenseReport()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }

            return View();
        }

        public ActionResult DailyReport(string FromDate, string ToDate)
        {
            string status = "error";
            try
            {
                var From = DateTime.Parse(FromDate);
                var To = DateTime.Parse(ToDate);
                To = To.AddDays(1);

                var obj = (from r in db.DailyExpenses
                           where r.Date>=From && r.Date<To && r.Status==1
                           select new
                           {
                               UID = r.UID,
                               Date = r.Date,
                               Amount = r.Amount,
                               Comments = r.Comments

                           }).ToList();
                status = JsonConvert.SerializeObject(obj);
            }
            catch (Exception ex)
            {

                throw;
            }

            

            return Content(status);

        }
        public ActionResult LoadPerfect(string FromDate, string ToDate)
        {
            string status = "error";
            try
            {
                var From = DateTime.Parse(FromDate);
                var To = DateTime.Parse(ToDate);
                To = To.AddDays(1);

                var obj = (from sm in db.SaleMains
                           join
                           sd in db.SaleDetails
                           on sm.Id equals sd.SMId
                           join
                           i in db.Items
                         on sd.ItemId equals i.Id
                           join
                           ct in db.Categories on i.CategoryId equals ct.Id
                        
                          
                           where sm.CreatedOn >= From && sm.CreatedOn < To
                           orderby sm.CreatedOn
                           select
                           new
                           {
                               ItemName = i.Name,
                               Barcode = sd.Barcode,
                               Quantity = sd.Qty,
                               Category = ct.Name,
                               Cost=sd.CostPrice,
                               Sale=sd.Price,
                               Perfect=sd.Price-sd.CostPrice,
                               Qty=sd.Qty
                           });


                status = JsonConvert.SerializeObject(obj);

            }
            catch (Exception ex)
            {

                throw;
            }
            return Content(status);
        }
        public ActionResult PerfectReport()
        {
            return View();
        }

        }
}