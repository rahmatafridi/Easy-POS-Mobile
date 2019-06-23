using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PointOfSale.Models;
using Newtonsoft.Json;

namespace PointOfSale.Controllers
{
    public class StockTransferController : GlobalController
    {
        PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: StockTransfer
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult GetTransferNo()
        {
            var status = "error";
            try
            {
                var count = db.WarehouseTransferMains.Count() + 1;
                var code = count.ToString().PadLeft(6, '0');
                status = "TRNS-" + code;

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "StockTransfer", "GetTransferNo");
            }
            return Content(status);
        }

        public ActionResult LoadBarcode(int Id)
        {
            var status = "error";
            try
            {
                var getItem = db.Items.Where(x => x.Id == Id).SingleOrDefault();
                var itemBcode = getItem.Barcode;
                status = itemBcode.ToString();

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "StockTransfer", "GetTransferNo");
            }
            return Content(status);
        }

        public ActionResult LoadCategory(int Id)
        {
            var status = "error";
            try
            {
                var getItem = (from i in db.Items
                               join c in db.Categories
                               on i.CategoryId equals c.Id
                               where i.Id == Id
                               select new
                               {
                                   CategoryName = c.Name
                               }).SingleOrDefault();

                status = getItem.CategoryName.ToString();

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "StockTransfer", "GetTransferNo");
            }
            return Content(status);
        }


        public ActionResult LoadUom(int Id)
        {
            var status = "error";
            try
            {
                var getItem = (from i in db.Items
                               join u in db.UnitOfMeasures
                               on i.UomId equals u.Id
                               where i.Id == Id
                               select new
                               {
                                   UomName = u.Name
                               }).SingleOrDefault();

                status = getItem.UomName.ToString();

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "StockTransfer", "GetTransferNo");
            }
            return Content(status);
        }

        public ActionResult LoadAvailQty(int Id)
        {
            var status = "error";
            try
            {
                var objWh = (from w in db.Warehouses
                             where w.ItemId == Id
                             select w.QtyAvailable).SingleOrDefault();

                status = objWh.ToString();

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "StockTransfer", "LoadAvailQty");
            }
            return Content(status);
        }

        public ActionResult LoadItems()
        {
            string status = "0:{choose}";
            try
            {
                var itemWh = (from w in db.Warehouses
                              join i in db.Items
                              on w.ItemId equals i.Id
                              select new
                              {
                                  Id = w.ItemId,
                                  Name = i.Name
                              }).ToList();

                foreach (var item in itemWh)
                {
                    status += ";" + item.Id + ":" + item.Name;
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "LoadItems");
            }
            return Content(status);
        }



        public ActionResult LoadLocation()
        {
            string status = "0:{choose}";
            try
            {

                List<Location> lstItem = db.Locations.Where(x => x.IsActive == true).ToList();

                status = JsonConvert.SerializeObject(lstItem);

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "StockTransfer", "LoadLocation");
            }
            return Content(status);
        }

        public ActionResult AddTransaction(string tNo, string tDate, int ShipToLoc, WarehouseTransfer[] GridItems)
        {
            var status = "error";
            try
            {
                WarehouseTransferMain objWHTM = new WarehouseTransferMain();
                objWHTM.TransactionNo = tNo;
                objWHTM.TransferDate = DateTime.Parse(tDate);
                objWHTM.LocationId = ShipToLoc;
                objWHTM.UID = Guid.NewGuid();
                objWHTM.CreatedBy = ActiveUserId;
                objWHTM.UpdatedBy = ActiveUserId;
                objWHTM.CreatedOn = DateTime.Now;
                objWHTM.UpdatedOn = DateTime.Now;
                db.WarehouseTransferMains.Add(objWHTM);
                db.SaveChanges();


                WarehouseTransfer objWhT = new WarehouseTransfer();
                for (var i = 0; i < GridItems.Length; i++)
                {
                    var items = GridItems[i];
                    var objItem = (from itm in db.Items where itm.Id == items.ItemId select itm).SingleOrDefault();
                    var objWh = (from w in db.Warehouses where w.ItemId == items.ItemId select w).SingleOrDefault();

                    objWhT.ItemId = items.ItemId;
                    objWhT.WtmId = objWHTM.Id;
                    objWhT.CategoryId = objItem.CategoryId;
                    objWhT.UomId = objItem.UomId;
                    objWhT.Barcode = objItem.Barcode;
                    objWhT.AvailableQty = objWh.QtyAvailable;
                    objWhT.IssueQty = items.IssueQty;
                    objWhT.BalanceQty = (objWhT.AvailableQty) - (items.IssueQty);
                    objWhT.SaleRate = objWh.SaleRate;
                    objWhT.CostRate = objWh.CostRate;
                    objWhT.CreatedOn = DateTime.Now;
                    objWhT.CreatedBy = ActiveUserId;

                    objWh.QtyAvailable = (objWh.QtyAvailable) - (items.IssueQty);
                    db.WarehouseTransfers.Add(objWhT);

                    //save in selling item table
                    var alreadyExist = db.SellingItems.Where(x => x.ItemId == items.ItemId).SingleOrDefault();
                    SellingItem objSi = new SellingItem();
                    if (alreadyExist == null)
                    {
                        objSi.ItemId = items.ItemId;
                        objSi.Barcode = objItem.Barcode;
                        objSi.CategoryId = objItem.CategoryId;
                        objSi.UomId = objItem.UomId;
                        objSi.Quantity = items.IssueQty;
                        objSi.CostRate = objWh.CostRate;
                        objSi.SaleRate = objWh.SaleRate;
                        objSi.CreatedBy = ActiveUserId;
                        objSi.CreatedOn = DateTime.Now;
                        db.SellingItems.Add(objSi);
                    }
                    else
                    {
                        alreadyExist.Quantity += items.IssueQty;
                        alreadyExist.CostRate = objWh.CostRate;
                        alreadyExist.SaleRate = objWh.SaleRate;
                        alreadyExist.UpdatedBy = ActiveUserId;
                        alreadyExist.UpdatedOn = DateTime.Now;
                    }

                    db.SaveChanges();


                }
                status = "Success";
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "StockTransfer", "AddTransaction");
            }
            return Content(status);
        }


    }
}