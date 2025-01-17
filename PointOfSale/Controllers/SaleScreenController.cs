﻿using Newtonsoft.Json;
using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PointOfSale.Controllers
{
    public class SaleScreenController : GlobalController
    {
        PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: SaleScreen
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }


        public ActionResult CheckCustomerIsReSalerForReprint()
        {
            string status = "error";
            try
            {
                SaleMain objSM = db.SaleMains.Where(x => x.CreatedBy == ActiveUserId).OrderByDescending(x => x.Id).FirstOrDefault();

                var ListCustomer = db.Customers.Where(x => x.Id == objSM.CustomerId).Select(s => s.IsResaler).FirstOrDefault();
                if (ListCustomer != null && ListCustomer == true)
                {
                    status = "success";
                }
                status = JsonConvert.SerializeObject(status);

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "LoadCustomers");
            }
            return Content(status);
        }



        public ActionResult LoadInvoicesAgainstBarcode(string ScanBarcode)
        {
            string status = "error";
            try
            {

                var obj = (from sd in db.SaleDetails
                           join sm in db.SaleMains
                           on sd.SMId equals sm.Id
                            where sd.Barcode ==ScanBarcode
                           select sm.InvoiceNo
                            ).ToList();
                status = JsonConvert.SerializeObject(obj);

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "LoadCustomers");
            }
            return Content(status);
        }



        public ActionResult LoadItemByBarcodeAndInvoiceNo(string ScanBarcode,string InvoiceNo)
        {
            string status = "error";
            try
            {
                var checkInvo = db.SaleMains.Where(x => x.InvoiceNo == InvoiceNo).FirstOrDefault();
                if (checkInvo!=null)
                {
                    var checkCode = db.Barcodes.Where(x => x.Barcode1 == ScanBarcode).FirstOrDefault();
                    if (checkCode != null)
                    {
                        var SaleEver = db.SaleDetails.Where(x => x.Barcode == checkCode.Barcode1).FirstOrDefault();
                        if (SaleEver != null)
                        {
                            var alreadyRevers = db.SaleDetails.Where(x => x.Barcode == ScanBarcode && x.SMId == checkInvo.Id).FirstOrDefault();
                            if ((alreadyRevers.Qty - (alreadyRevers.RefundQty == null ? 0 : alreadyRevers.RefundQty)) > 0)
                            {

                                var obj = (from sd in db.SaleDetails
                                           join i in db.Items on
                                           sd.ItemId equals i.Id
                                           join sm in db.SaleMains
                                           on sd.SMId equals sm.Id
                                           join c in db.Categories
                                           on i.CategoryId equals c.Id
                                           join u in db.UnitOfMeasures
                                           on i.UomId equals u.Id
                                           where sd.Barcode == ScanBarcode && sm.InvoiceNo == InvoiceNo && (sd.Qty - (sd.RefundQty == null ? 0 : sd.RefundQty)) > 0
                                           select new
                                           {
                                               SmId = sm.Id,
                                               InvoiceNo = sm.InvoiceNo,
                                               SaleDetailId = sd.Id,
                                               barcode = sd.Barcode,
                                               itemName = i.Name,
                                               itemId = sd.ItemId,
                                               category = c.Name,
                                               categoryId = i.CategoryId,
                                               uom = u.Name,
                                               uomId = u.Id,
                                               quantity = sd.Qty - (sd.RefundQty == null ? 0 : sd.RefundQty),
                                               discount = sd.Discount,
                                               rate = sd.Price,
                                               amount = sd.Amount,
                                               discountedamount = sd.AmountAfterDiscount,
                                               costPrice=(sd.CostPrice==null?0: sd.CostPrice)
                                           }).ToList();
                                status = JsonConvert.SerializeObject(obj);




                            }
                            else
                            {
                                status = "AlreadyReversal";
                                status = JsonConvert.SerializeObject(status);

                            }
                        }
                        else
                        {
                            status = "NotSaleEver";
                            status = JsonConvert.SerializeObject(status);
                        }

                    }
                    else
                    {
                        status = "InvalidBarcode";
                        status = JsonConvert.SerializeObject(status);
                    }

                }
                else
                {
                    status = "InvalidInvoiceNo";
                    status = JsonConvert.SerializeObject(status);
                }
               
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "LoadCustomers");
            }
            return Content(status);
        }



  


        public ActionResult LoadSaleDetailDataForMobile(string ScanBarcode)
        {
            string status = "error";
            try
            {

                var obj = (from sd in db.SaleDetails
                           join i in db.Items on
                           sd.ItemId equals i.Id
                           join sm in db.SaleMains
                           on sd.SMId equals sm.Id
                           join c in db.Categories
                           on i.CategoryId equals c.Id
                           join u in db.UnitOfMeasures
                           on i.UomId equals u.Id
                           where sd.Barcode== ScanBarcode && (sd.Qty - (sd.RefundQty == null ? 0 : sd.RefundQty)) > 0
                           select new
                           {
                               SmId=sm.Id,
                               InvoiceNo=sm.InvoiceNo,
                               SaleDetailId = sd.Id,
                               barcode = sd.Barcode,
                               itemName = i.Name,
                               itemId = sd.ItemId,
                               category = c.Name,
                               categoryId = i.CategoryId,
                               uom = u.Name,
                               uomId = u.Id,
                               quantity = sd.Qty - (sd.RefundQty == null ? 0 : sd.RefundQty),
                               discount = sd.Discount,
                               rate = sd.Price,
                               amount = sd.Amount,
                               discountedamount = sd.AmountAfterDiscount,
                               costPrice = (sd.CostPrice == null ? 0 : sd.CostPrice)

                           }).ToList();
                status = JsonConvert.SerializeObject(obj);

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "LoadCustomers");
            }
            return Content(status);
        }






        public ActionResult LoadSaleDetailData(string InvoNo)
        {
            string status = "error";
            try
            {

                var obj = (from sd in db.SaleDetails
                           join i in db.Items on
                           sd.ItemId equals i.Id
                           join sm in db.SaleMains
                           on sd.SMId equals sm.Id
                           join c in db.Categories
                           on i.CategoryId equals c.Id
                           join u in db.UnitOfMeasures
                           on i.UomId equals u.Id
                           where sm.InvoiceNo == InvoNo && (sd.Qty - (sd.RefundQty==null ? 0 : sd.RefundQty)) > 0 && sm.IsActive == true
                           select new
                           {
                               SaleDetailId = sd.Id,
                               barcode = sd.Barcode,
                               itemName = i.Name,
                               itemId = sd.ItemId,
                               category = c.Name,
                               categoryId = i.CategoryId,
                               uom = u.Name,
                               uomId = u.Id,
                               quantity = sd.Qty,
                               discount = sd.Discount,
                               rate = sd.Price,
                               amount = sd.Amount,
                               discountedamount = sd.AmountAfterDiscount
                           }).ToList();
                status = JsonConvert.SerializeObject(obj);

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "LoadCustomers");
            }
            return Content(status);
        }


        public ActionResult LoadMainBillByInvoice(string InvoNo)
        {
            string status = "error";
            try
            {

                var obj = db.SaleMains.Where(x => x.InvoiceNo == InvoNo && x.IsActive == true).FirstOrDefault();
                status = JsonConvert.SerializeObject(obj);

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "LoadCustomers");
            }
            return Content(status);
        }

        public ActionResult CheckCustomerIsReSaler(int Id)
        {
            string status = "error";
            try
            {

                var ListCustomer = db.Customers.Where(x => x.Id == Id).Select(s => s.IsResaler).FirstOrDefault();
                if (ListCustomer != null && ListCustomer == true)
                {
                    status = "success";
                }
                status = JsonConvert.SerializeObject(status);

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "LoadCustomers");
            }
            return Content(status);
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

        public string GenerateReversalNo()
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var lstSaleMain = db.RefundMains.ToList();

                    var TRecords = lstSaleMain.Count();
                    TRecords += 1;

                    var Code = "REV" + TRecords.ToString().PadLeft(8, '0');

                    status = Code;
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return status;
        }


        public ActionResult GenerateInvoiceNo()
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var lstSaleMain = db.SaleMains.ToList();

                    var TRecords = lstSaleMain.Count();
                    TRecords += 1;

                    var Code = "INV" + TRecords.ToString().PadLeft(8, '0');

                    status = Code;
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }

        public ActionResult LoadCustomerBalanceById(int id)
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var obj = (from c in db.Customers
                               where c.Id == id
                               select new
                               {
                                   Balance = (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(cp => cp.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(cp => cp.Credit))
                               }).FirstOrDefault();

                    status = JsonConvert.SerializeObject(obj);
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }

        public ActionResult LoadSellingItemByBarcode(string Barcode)
        {
            string status = "error";
            try
            {
                if (Authenticated)
                {
                    var objItem = (from si in db.SellingItems
                                   join
                                   c in db.Categories
                                   on si.CategoryId equals c.Id
                                   join
                                   u in db.UnitOfMeasures
                                   on si.UomId equals u.Id
                                   join
                                   i in db.Items
                                   on si.ItemId equals i.Id
                                   join
                                   w in db.Warehouses
                                   on si.ItemId equals w.ItemId
                                   where si.Barcode == Barcode
                                   select
                                   new
                                   {
                                       barcode = si.Barcode,
                                       category = c.Name,
                                       categoryId = si.CategoryId,
                                       uom = u.Name,
                                       uomId = si.UomId,
                                       quantity = "1",
                                       itemName = i.Name,
                                       itemId = si.ItemId,
                                       rate = si.SaleRate,
                                       availQty = w.QtyAvailable


                                   });
                    status = JsonConvert.SerializeObject(objItem);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "LoadSellingItemByBarcode");
            }
            return Content(status);
        }

        public ActionResult CheckItemCategoryIsMobile(string ScanBarcode)
        {
            string status = "error";
            try
            {
                var CheckItemCat = (from b in db.Barcodes
                                join cat in db.Categories
                                on b.CategoryId equals cat.Id
                                where b.Barcode1 == ScanBarcode
                                select cat.Name).FirstOrDefault();

                if (Authenticated)
                {
                    var checkCode = db.Barcodes.Where(x => x.Barcode1== ScanBarcode).FirstOrDefault();
                    if (checkCode !=null)
                    {
                        var SaleEver = db.SaleDetails.Where(x => x.Barcode == checkCode.Barcode1).FirstOrDefault();


                        if (SaleEver !=null)
                        {

                            var alreadyRevers = db.SaleDetails.Where(x => x.Barcode == ScanBarcode).FirstOrDefault();


                            if ((((alreadyRevers.Qty - (alreadyRevers.RefundQty == null ? 0 : alreadyRevers.RefundQty)) > 0) && (CheckItemCat=="Mobile" || CheckItemCat == "Used Mobile") ) || (CheckItemCat != "Mobile" && CheckItemCat != "Used Mobile"))
                            {
                                var CheckCat = (from b in db.Barcodes
                                                join cat in db.Categories
                                                on b.CategoryId equals cat.Id
                                                where b.Barcode1 == checkCode.Barcode1
                                                select cat.Name).FirstOrDefault();
                                status = JsonConvert.SerializeObject(CheckCat);
                            }
                            else
                            {
                                status = "AlreadyReversal";
                                status = JsonConvert.SerializeObject(status);

                            }
                        }
                        else
                        {
                            status = "NotSaleEver";
                            status = JsonConvert.SerializeObject(status);
                        }

                    }
                    else
                    {
                        status = "InvalidBarcode";
                        status = JsonConvert.SerializeObject(status);
                    }


                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }


        public ActionResult LoadCustomerInfoByInvoiceNo(string InvoiceNo)
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var GetCustomer = (from sm in db.SaleMains
                                       where sm.InvoiceNo== InvoiceNo
                                       select sm.CustomerId).FirstOrDefault();

                    if (GetCustomer != null)
                    {
                        var Customer = (from c in db.Customers
                                        where c.Id == GetCustomer
                                        select new
                                        {
                                            Id = c.Id,
                                            Name = c.Name,
                                            Type = c.IsResaler,
                                            Balance = (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(cp => cp.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(cp => cp.Credit))
                                        }).FirstOrDefault();
                        status = JsonConvert.SerializeObject(Customer);
                    }
                    else
                    {
                        status = "CustomerNotFound";
                        status = JsonConvert.SerializeObject(status);

                    }

                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }


        public ActionResult LoadCustomerByMobileBarcode(string MobileBarcode)
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var GetCustomer = (from sd in db.SaleDetails
                                      join sm in db.SaleMains
                                      on sd.SMId equals sm.Id
                                      where sd.Barcode == MobileBarcode
                                      select sm.CustomerId).FirstOrDefault();

                    if (GetCustomer != null)
                    {
                        var Customer = (from c in db.Customers
                                        where c.Id==GetCustomer
                                        select new
                                        {
                                            Id=c.Id,
                                            Name = c.Name,
                                            Type = c.IsResaler,
                                            Balance = (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(cp => cp.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(cp => cp.Credit))
                                        }).FirstOrDefault();
                        status = JsonConvert.SerializeObject(Customer);
                    }
                    else
                    {
                        status = "CustomerNotFound";
                        status = JsonConvert.SerializeObject(status);

                    }

                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }



        public ActionResult LoadCustomerByInvoice(string InvoNo)
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var check = db.SaleMains.Where(x => x.InvoiceNo == InvoNo).FirstOrDefault();
                    if (check !=null)
                    {
                        if (check.IsActive != false)
                        {
                            var Customer = (from c in db.Customers
                                            join sm in db.SaleMains
                                            on c.Id equals sm.CustomerId
                                            where sm.InvoiceNo == InvoNo && sm.IsActive == true
                                            select new
                                            {
                                                Name = c.Name,
                                                Type = c.IsResaler,
                                                Balance = (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(cp => cp.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(cp => cp.Credit))
                                            }).FirstOrDefault();
                            status = JsonConvert.SerializeObject(Customer);
                        }
                        else
                        {
                            status = "AlreadyReturned";
                            status = JsonConvert.SerializeObject(status);

                        }
                    }
                    else
                    {
                        status = "InvalidInvoice";
                        status = JsonConvert.SerializeObject(status);

                    }

                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }

        public ActionResult LoadBarcodes()
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var objBarcode = db.SellingItems.Select(x => x.Barcode).ToList();
                    status = JsonConvert.SerializeObject(objBarcode);
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }


        public ActionResult LoadInvoices()
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var ObjInv = db.SaleMains.OrderByDescending(d=>d.Id).Where(x => x.IsActive == true).Select(s => s.InvoiceNo).ToList();

                    status = JsonConvert.SerializeObject(ObjInv);
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }

        public ActionResult LoaditemNames()
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var objSitems = from s in db.SellingItems
                                    join
                                    i in db.Items
                                    on s.ItemId equals i.Id
                                    where s.Quantity > 0
                                    select i.Name + "-" + s.Barcode;


                    //var objSitems = from si in db.SellingItems
                    //                join
                    //                i in db.Items
                    //                on si.ItemId equals i.Id
                    //                select i.Name;

                    status = JsonConvert.SerializeObject(objSitems);
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }



        public ActionResult LoadItemDiscountByCustomerIdwithBarcode(string itemName, int CustomerId)
        {
            string status = "error";
            try
            {
                if (Authenticated)
                {

                    if (itemName != null)
                    {
                        var discoun = db.GetDiscount(CustomerId, itemName).FirstOrDefault();
                        var disc = (discoun.SaleRate * discoun.Discount) / 100;
                        status = JsonConvert.SerializeObject(disc);
                    }

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }


        public ActionResult LoadItemDiscountByCustomerId(string itemName, int CustomerId)
        {
            string status = "error";
            try
            {
                if (Authenticated)
                {
                    var split = itemName.Split('-');
                    itemName = split[1];
                    if (itemName != null)
                    {
                        var discoun = db.GetDiscount(CustomerId, itemName).FirstOrDefault();
                        var disc = (discoun.SaleRate * discoun.Discount) / 100;
                        status = JsonConvert.SerializeObject(disc);
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }


        public ActionResult LoadItemByName(string itemName)
        {
            string status = "error";
            try
            {
                if (Authenticated)
                {

                    var splitBarcode = itemName.Split('-');
                    var item = splitBarcode[0];

                    var barcode = splitBarcode[1];

                    //var objitemBarcode = db.Barcodes.Where(x => x.Barcode1 == barcode).FirstOrDefault();
                    //var objitem = db.Items.Where(x => x.Id == objitemBarcode.ItemId).FirstOrDefault();
                    //var convertObj = Convert.ToInt64(objitem.Id);
                    var objSitem = (from si in db.SellingItems
                                    join
                                    c in db.Categories
                                    on si.CategoryId equals c.Id
                                    join
                                    u in db.UnitOfMeasures
                                    on si.UomId equals u.Id
                                    join
                                    i in db.Items
                                    on si.ItemId equals i.Id
                                    where si.Barcode == barcode
                                    select
                                    new
                                    {
                                        barcode = si.Barcode,
                                        category = c.Name,
                                        categoryId = si.CategoryId,
                                        uom = u.Name,
                                        uomId = si.UomId,
                                        quantity = "1",
                                        itemName = i.Name,
                                        itemId = si.ItemId,
                                        rate = si.SaleRate,
                                        availQty = si.Quantity
                                    });

                    status = JsonConvert.SerializeObject(objSitem);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }


        public ActionResult rFullSaveInvoice(string InvNo)
        {
            string status = "error";
            try
            {
                var objsm = db.SaleMains.Where(x => x.InvoiceNo == InvNo).FirstOrDefault();
                if (objsm != null)
                {
                    if (objsm.IsActive != false)
                    {

                        if (objsm.IsPartialRefund !=true)
                        {
                            objsm.IsActive = false;
                            var objsd = db.SaleDetails.Where(x => x.SMId == objsm.Id).ToList();

                            var objRm = new RefundMain();
                            objRm.InvoiceNo = InvNo;
                            objRm.CustomerId = objsm.CustomerId;
                            objRm.RSubTotal = objsm.SubTotal;
                            objRm.RRecieved = objsm.Recieved;
                            objRm.RChange = objsm.Change;
                            objRm.UID = Guid.NewGuid();
                            objRm.IsActive = true;
                            objRm.RItemDiscount = objsm.ItemDiscount;
                            objRm.RTotalAfterDiscount = objsm.TotalAfterDiscount;
                            objRm.RNetTotal = objsm.NetTotal;
                            objRm.RBillDiscount = objsm.BillDiscount;
                            objRm.RBillDiscountType = objsm.BillDiscountType;
                            objRm.RAdjustment = objsm.Adjustment;
                            objRm.RQty = Convert.ToInt32(objsm.TotalQty);
                            objRm.CreatedBy = ActiveUserId;
                            objRm.UpdatedBy = ActiveUserId;
                            objRm.CreatedOn = DateTime.Now;
                            objRm.UpdatedOn = DateTime.Now;
                            objRm.InvoiceId = objsm.Id;
                            db.RefundMains.Add(objRm);
                            db.SaveChanges();

                            foreach (var item in objsd)
                            {
                                var si = db.SellingItems.Where(x => x.ItemId == item.ItemId).FirstOrDefault();
                                si.Quantity += item.Qty;
                                item.RefundQty += Convert.ToInt32(item.Qty);
                                item.RefundStatus = true;


                                var objRd = new RefundDetail();

                                objRd.RMId = objRm.Id;
                                objRd.RBarcode = item.Barcode;
                                objRd.RItemId = item.ItemId;
                                objRd.RUomId = item.UomId;
                                objRd.RPrice = item.Price;
                                objRd.RAmount = item.Amount;
                                objRd.RDiscount = item.Discount;
                                objRd.RAmountAfterDiscount = item.AmountAfterDiscount;
                                objRd.UID = Guid.NewGuid();
                                objRd.IsActive = true;
                                objRd.RQty = item.Qty;
                                objRd.CreatedBy = ActiveUserId;
                                objRd.UpdatedBy = ActiveUserId;
                                objRd.CreatedOn = DateTime.Now;
                                objRd.UpdatedOn = DateTime.Now;
                                db.RefundDetails.Add(objRd);
                                db.SaveChanges();
                            }


                            var objCp = new CustomerPayment();
                            objCp.UID = Guid.NewGuid();
                            objCp.CustomerId = objsm.CustomerId;
                            objCp.EntryType = 4;
                            objCp.SoNumber = InvNo;
                            objCp.PaymentMethode = 1;
                            objCp.SoNumber = InvNo;
                            objCp.Debit = objsm.NetTotal;
                            objCp.Credit = 0;
                            objCp.EntryDate = DateTime.Now;
                            objCp.CreatedBy = ActiveUserId;
                            objCp.CreatedOn = DateTime.Now;
                            objCp.UpdatedBy = ActiveUserId;
                            objCp.UpdatedOn = DateTime.Now;
                            db.CustomerPayments.Add(objCp);

                            var objCpl = new CustomerPaymentLog();
                            objCpl.UID = Guid.NewGuid();
                            objCpl.CustomerId = objsm.CustomerId;
                            objCpl.EntryType = 4;
                            objCpl.SoNumber = InvNo;
                            objCpl.PaymentMethode = 1;
                            objCpl.SoNumber = InvNo;
                            objCpl.Debit = objsm.NetTotal;
                            objCpl.Credit = 0;
                            objCpl.EntryDate = DateTime.Now;
                            objCpl.CreatedBy = ActiveUserId;
                            objCpl.CreatedOn = DateTime.Now;
                            objCpl.UpdatedBy = ActiveUserId;
                            objCpl.UpdatedOn = DateTime.Now;
                            db.CustomerPaymentLogs.Add(objCpl);


                            db.SaveChanges();

                            status = JsonConvert.ToString(objRm.Id);
                        }
                        else
                        {
                            status = "PartialRefund";
                            status = JsonConvert.SerializeObject(status);
                        }
                    }
                    else
                    {
                        status = "AlreadyReturned";
                        status = JsonConvert.SerializeObject(status);

                    }
                }
                else
                {
                    status = "InvalidInvoice";
                    status = JsonConvert.SerializeObject(status);

                }



            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }


        public ActionResult rSaveInvoice(int CustomerId, string Reference, decimal GrossBill, decimal ItemsDiscount, decimal BillAfterDisc, int DiscType, decimal DiscValue, decimal Adjustment, decimal NetBill, decimal NetPayable, decimal CashReceived, decimal Balance, decimal TotalQty, SaleDetail[] GridItems)
        {
            string status = "error";
            try
            {
                bool QtyInSd = true;
                foreach (var item in GridItems)
                {
                    var sd = db.SaleDetails.Where(x => x.Id == item.Id).FirstOrDefault();
                    sd.RefundQty=sd.RefundQty == null ? 0 : sd.RefundQty;

                    var availQty = sd.Qty - sd.RefundQty;
                    if (item.Qty>availQty)
                    {
                        QtyInSd = false;
                    }
                }

                if (QtyInSd==true)
                {
                    var objCus = db.Customers.Where(x => x.Id == CustomerId).FirstOrDefault();

                    if (objCus != null)
                    {
                        foreach (var iteme in GridItems)
                        {
                            var items = iteme.SMId;



                            var objRm = new RefundMain();
                            objRm.InvoiceNo = GenerateReversalNo().ToString();
                            objRm.CustomerId = CustomerId;
                            objRm.RSubTotal = GrossBill;
                            objRm.RRecieved = CashReceived;
                            objRm.RChange = Balance;
                            objRm.Reference = Reference;
                            objRm.UID = Guid.NewGuid();
                            objRm.IsActive = true;
                            objRm.RItemDiscount = ItemsDiscount;
                            objRm.RTotalAfterDiscount = BillAfterDisc;
                            objRm.RNetTotal = NetBill;
                            objRm.RBillDiscount = DiscValue;
                            objRm.RBillDiscountType = DiscType;
                            objRm.RAdjustment = Adjustment;
                            objRm.RQty = Convert.ToInt32(TotalQty);
                            objRm.CreatedBy = ActiveUserId;
                            objRm.UpdatedBy = ActiveUserId;
                            objRm.CreatedOn = DateTime.Now;
                            objRm.UpdatedOn = DateTime.Now;
                            objRm.InvoiceId = items;
                            db.RefundMains.Add(objRm);
                            db.SaveChanges();

                            foreach (var item in GridItems)
                            {
                                var si = db.SellingItems.Where(x => x.ItemId == item.ItemId && x.Barcode == item.Barcode).FirstOrDefault();
                                si.Quantity += item.Qty;

                                var sd = db.SaleDetails.Where(x => x.Id == item.Id).FirstOrDefault();
                                sd.RefundQty += item.Qty;
                                sd.RefundStatus = true;
                                db.SaveChanges();


                                var objRd = new RefundDetail();
                                objRd.RMId = objRm.Id;
                                objRd.RBarcode = item.Barcode;
                                objRd.RItemId = item.ItemId;
                                objRd.RUomId = item.UomId;
                                objRd.RPrice = item.Price;
                                objRd.RAmount = item.Amount;
                                objRd.RDiscount = item.Discount;
                                objRd.RAmountAfterDiscount = item.AmountAfterDiscount;
                                objRd.UID = Guid.NewGuid();
                                objRd.IsActive = true;
                                objRd.RQty = item.Qty;
                                objRd.CreatedBy = ActiveUserId;
                                objRd.UpdatedBy = ActiveUserId;
                                objRd.CreatedOn = DateTime.Now;
                                objRd.UpdatedOn = DateTime.Now;
                                db.RefundDetails.Add(objRd);
                                db.SaveChanges();

                            }

                            var objCp = new CustomerPayment();
                            objCp.UID = Guid.NewGuid();
                            objCp.CustomerId = CustomerId;
                            objCp.SoNumber = objRm.InvoiceNo;
                            objCp.EntryType = 4;
                            objCp.PaymentMethode = 1;
                            objCp.Debit = NetPayable;
                            objCp.Credit = 0;
                            objCp.EntryDate = DateTime.Now;
                            objCp.CreatedBy = ActiveUserId;
                            objCp.CreatedOn = DateTime.Now;
                            objCp.UpdatedBy = ActiveUserId;
                            objCp.UpdatedOn = DateTime.Now;
                            db.CustomerPayments.Add(objCp);

                            var objCpl = new CustomerPaymentLog();
                            objCpl.UID = Guid.NewGuid();
                            objCpl.CustomerId = CustomerId;
                            objCpl.EntryType = 4;
                            objCpl.PaymentMethode = 1;
                            objCpl.SoNumber = objRm.InvoiceNo;

                            objCpl.Debit = NetPayable;
                            objCpl.Credit = 0;
                            objCpl.EntryDate = DateTime.Now;
                            objCpl.CreatedBy = ActiveUserId;
                            objCpl.CreatedOn = DateTime.Now;
                            objCpl.UpdatedBy = ActiveUserId;
                            objCpl.UpdatedOn = DateTime.Now;
                            db.CustomerPaymentLogs.Add(objCpl);

                            db.SaveChanges();

                            status = JsonConvert.SerializeObject(objRm.Id);

                        }
                    }
                    else
                    {
                        status = "CustomerNotFound";
                        status = JsonConvert.SerializeObject(status);
                    }

                }
                else
                {
                    status = "NotValidQty";
                    status = JsonConvert.SerializeObject(status);
                }

            
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }

        public ActionResult SaveInvoice(string InvNo,string RefrenceName, int Customer, decimal GrossBill, decimal ItemsDiscount, decimal BillAfterDisc, int DiscType, decimal DiscValue, decimal Adjustment, decimal NetBill, decimal NetPayable, decimal CashReceived, decimal Balance, decimal TotalQty, SaleDetail[] GridItems)
        {
            string status = "error";
            try
            {
                if (Authenticated)
                {
                    SaleDetail objSd = new SaleDetail();
                    for (var i = 0; i < GridItems.Length; i++)
                    {
                        var itemInGrid = GridItems[i];

                        objSd.ItemId = itemInGrid.ItemId;
                        objSd.Qty = itemInGrid.Qty;
                        objSd.Barcode = itemInGrid.Barcode;

                        var objSi = db.SellingItems.Where(x => x.Barcode == itemInGrid.Barcode).FirstOrDefault();
                        if (objSi.Quantity < objSd.Qty)
                        {
                            status = "Not Enough Stock";
                            break;
                        }
                    }

                    if (status != "Not Enough Stock")
                    {
                        SaleMain objSm = new SaleMain();
                        objSm.CustomerId = Customer;
                        objSm.InvoiceNo = InvNo;
                        objSm.SubTotal = GrossBill;
                        objSm.Recieved = CashReceived;
                        objSm.Change = Balance;
                        objSm.UID = Guid.NewGuid();
                        objSm.IsActive = true;
                        objSm.Refrence = RefrenceName;
                        objSm.ItemDiscount = ItemsDiscount;
                        objSm.TotalAfterDiscount = BillAfterDisc;
                        objSm.NetTotal = NetBill;
                        objSm.BillDiscount = DiscValue;
                        objSm.BillDiscountType = DiscType;
                        objSm.Adjustment = Adjustment;
                        objSm.TotalQty = TotalQty;
                        objSm.CreatedBy = ActiveUserId;
                        objSm.UpdatedBy = ActiveUserId;
                        objSm.CreatedOn = DateTime.Now;
                        objSm.UpdatedOn = DateTime.Now;

                        db.SaleMains.Add(objSm);

                        if (db.SaveChanges() > 0)
                        {
                            for (var i = 0; i < GridItems.Length; i++)
                            {
                                objSd = new SaleDetail();

                                var itemInGrid = GridItems[i];

                                var itemCostPrice = db.Items.Where(x => x.Id == itemInGrid.ItemId).Select(s => s.CostPrice).FirstOrDefault();

                                
                                objSd.SMId = objSm.Id;
                                objSd.Barcode = itemInGrid.Barcode;
                                objSd.ItemId = itemInGrid.ItemId;
                                objSd.UomId = itemInGrid.UomId;
                                objSd.Price = itemInGrid.Price;
                                objSd.Price = itemInGrid.Price;
                                objSd.RefundQty = 0;
                                objSd.CostPrice = (itemCostPrice == null ? 0 : itemCostPrice);
                                objSd.Amount = itemInGrid.Amount;
                                objSd.Discount = itemInGrid.Discount;
                                objSd.AmountAfterDiscount = itemInGrid.AmountAfterDiscount;
                                objSd.UID = Guid.NewGuid();
                                objSd.IsActive = true;
                                objSd.Qty = itemInGrid.Qty;
                                objSd.CreatedBy = ActiveUserId;
                                objSd.UpdatedBy = ActiveUserId;
                                objSd.CreatedOn = DateTime.Now;
                                objSd.UpdatedOn = DateTime.Now;

                                var objSellingItem = db.SellingItems.Where(x => x.Barcode == objSd.Barcode).FirstOrDefault();
                                objSellingItem.Quantity = objSellingItem.Quantity - objSd.Qty;
                                if (db.SaveChanges() > 0)
                                {
                                    db.SaleDetails.Add(objSd);
                                    if (db.SaveChanges() > 0)
                                    {

                                        status = JsonConvert.SerializeObject(objSm.Id);
                                    }
                                }
                            }

                            var objCus = db.Customers.Where(x => x.Id == Customer).FirstOrDefault();
                            //....................  Start customer  Credit............. //

                            var objCp = new CustomerPayment();

                            //var exist = db.CustomerPayments.Where(x => x.CustomerId == Customer && x.EntryType == 3).FirstOrDefault();

                            //if (exist == null)
                            //{


                            // Entry in customer Payment
                            objCp.UID = Guid.NewGuid();
                            objCp.CustomerId = Customer;
                            objCp.EntryType = 3;
                            objCp.PaymentMethode = 1;
                            objCp.SoNumber = InvNo;
                            objCp.Debit = 0;
                            objCp.Credit = Convert.ToDecimal(NetBill);
                            objCp.EntryDate = DateTime.Now;
                            objCp.CreatedBy = ActiveUserId;
                            objCp.CreatedOn = DateTime.Now;
                            objCp.UpdatedBy = ActiveUserId;
                            objCp.UpdatedOn = DateTime.Now;
                            db.CustomerPayments.Add(objCp);
                            db.SaveChanges();


                            //}
                            //else
                            //{


                            //    exist.CustomerId = Customer;
                            //    exist.EntryType = 3;
                            //    exist.PaymentMethode = 1;
                            //    exist.Debit = 0;
                            //    exist.Credit += Convert.ToDecimal(NetBill);
                            //    exist.EntryDate = DateTime.Now;
                            //    exist.CreatedBy = ActiveUserId;
                            //    exist.CreatedOn = DateTime.Now;
                            //    exist.UpdatedBy = ActiveUserId;
                            //    exist.UpdatedOn = DateTime.Now;

                            //    db.SaveChanges();

                            //}

                            // Entry in customer Payment Logs
                            var objCpl = new CustomerPaymentLog();

                            objCpl.UID = Guid.NewGuid();
                            objCpl.CustomerId = Customer;
                            objCpl.EntryType = 3;
                            objCpl.SoNumber = InvNo;
                            objCpl.CustomerPaymentId = objCp.Id;
                            objCpl.PaymentMethode = 1;
                            objCpl.CreatedBy = ActiveUserId;
                            objCpl.Debit = 0;
                            objCpl.Credit = Convert.ToDecimal(NetBill);
                            objCpl.Debit = 0;
                            objCpl.Credit = Convert.ToDecimal(NetBill);
                            objCpl.CreatedOn = DateTime.Now;
                            objCpl.UpdatedBy = ActiveUserId;
                            objCpl.UpdatedOn = DateTime.Now;
                            db.CustomerPaymentLogs.Add(objCpl);

                            db.SaveChanges();


                            //....................  End customer  Credit............. //



                            //....................  Start customer  debit............. //


                            var objCpNew = new CustomerPayment();

                            //var existDeb = db.CustomerPayments.Where(x => x.CustomerId == Customer && x.EntryType == 2).FirstOrDefault();

                            //if (existDeb == null)
                            //{
                            //  


                            // Entry in customer Payment
                            objCpNew.UID = Guid.NewGuid();
                            objCpNew.CustomerId = Customer;
                            objCpNew.EntryType = 2;
                            objCpNew.PaymentMethode = 1;
                            if (objCus.IsResaler == true)
                            {
                                objCpNew.Credit = 0;
                                objCpNew.Debit = Convert.ToDecimal(CashReceived);
                            }
                            else
                            {
                                objCpNew.Credit = 0;
                                objCpNew.Debit = Convert.ToDecimal(NetBill);

                            }
                            objCpNew.EntryDate = DateTime.Now;
                            objCpNew.CreatedBy = ActiveUserId;
                            objCpNew.CreatedOn = DateTime.Now;
                            objCpNew.UpdatedBy = ActiveUserId;
                            objCpNew.UpdatedOn = DateTime.Now;
                            db.CustomerPayments.Add(objCpNew);
                            db.SaveChanges();


                            //}
                            //else
                            //{


                            //    existDeb.CustomerId = Customer;
                            //    existDeb.EntryType = 2;
                            //    existDeb.PaymentMethode = 1;
                            //    existDeb.Credit = 0;
                            //    existDeb.Debit += Convert.ToDecimal(CashReceived);
                            //    existDeb.EntryDate = DateTime.Now;
                            //    existDeb.CreatedBy = ActiveUserId;
                            //    existDeb.CreatedOn = DateTime.Now;
                            //    existDeb.UpdatedBy = ActiveUserId;
                            //    existDeb.UpdatedOn = DateTime.Now;

                            //    db.SaveChanges();

                            //}

                            // Entry in customer Payment Logs
                            var objCplNew = new CustomerPaymentLog();

                            objCplNew.UID = Guid.NewGuid();
                            objCplNew.CustomerId = Customer;
                            objCplNew.EntryType = 2;
                            objCplNew.CustomerPaymentId = objCp.Id;

                            objCplNew.PaymentMethode = 1;
                            objCplNew.CreatedBy = ActiveUserId;
                            if (objCus.IsResaler == true)
                            {
                                objCplNew.Credit = 0;
                                objCplNew.Debit = Convert.ToDecimal(CashReceived);
                            }
                            else
                            {
                                objCplNew.Credit = 0;
                                objCplNew.Debit = Convert.ToDecimal(NetBill);

                            }
                            objCplNew.CreatedOn = DateTime.Now;
                            objCplNew.UpdatedBy = ActiveUserId;
                            objCplNew.UpdatedOn = DateTime.Now;
                            db.CustomerPaymentLogs.Add(objCplNew);

                            db.SaveChanges();


                            //....................  End customer  debit............. //



                        }
                    }
                    else
                    {
                        status = JsonConvert.SerializeObject(status);
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }

        public ActionResult GetLastBillBySameUser()
        {
            string status = "error";
            try
            {
                if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }

                using (PointOfSaleEntities db = new PointOfSaleEntities())
                {
                    SaleMain objSM = db.SaleMains.Where(x => x.CreatedBy == ActiveUserId).OrderByDescending(x => x.Id).FirstOrDefault();

                    status = objSM.Id.ToString();
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GetLastBillBySameUser");
            }
            return Content(status);
        }
    }
}