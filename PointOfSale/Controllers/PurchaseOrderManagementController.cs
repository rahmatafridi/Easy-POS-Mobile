﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PointOfSale.Models;
using Newtonsoft.Json;

namespace PointOfSale.Controllers
{
    public class PurchaseOrderManagementController : GlobalController
    {
        PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: PurchaseOrderManagement

        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }
        public ActionResult LoaditemNames()
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var objSitems = from s in db.Barcodes
                                    join
                                    i in db.Items
                                    on s.ItemId equals i.Id
                                    where i.IsActive == true
                                    select i.Name + "-" + s.Barcode1;
                    status = JsonConvert.SerializeObject(objSitems);
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "PurchesOrderManagementScreenController", "LoaditemNames");
            }
            return Content(status);
        }
        public ActionResult VendorReversalIndex()


        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult LoadCustomerInfoByInvoiceNo(string InvoiceNo)
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var GetCustomer = (from ipm in db.ItemPurchaseMains
                                       where ipm.PurchaseOrderNo == InvoiceNo
                                       select ipm.VendorId).FirstOrDefault();

                    if (GetCustomer != null)
                    {
                        var Customer = (from v in db.Vendors
                                        where v.Id == GetCustomer
                                        select new
                                        {
                                            Id = v.Id,
                                            Name = v.Name,
                                            Balance = (db.VendorPayments.Where(x => x.VendorId == v.Id).Sum(cp => cp.Debit)) - (db.VendorPayments.Where(x => x.VendorId == v.Id).Sum(cp => cp.Credit))
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

        public ActionResult LoadItemByBarcodeAndInvoiceNo(string ScanBarcode, string InvoiceNo)
        {
            string status = "error";
            try
            {
                var checkInvo = db.ItemPurchaseMains.Where(x => x.PurchaseOrderNo == InvoiceNo).FirstOrDefault();
                if (checkInvo != null)
                {
                    var checkCode = db.Barcodes.Where(x => x.Barcode1 == ScanBarcode).FirstOrDefault();
                    if (checkCode != null)
                    {
                        var SaleEver = db.ItemPurchaseDetails.Where(x => x.Barcode == checkCode.Barcode1).FirstOrDefault();
                        if (SaleEver != null)
                        {
                            var alreadyRevers = db.ItemPurchaseDetails.Where(x => x.Barcode == ScanBarcode && x.IPMId == checkInvo.Id).FirstOrDefault();
                            if ((alreadyRevers.Quantity - (alreadyRevers.RefundQty == null ? 0 : alreadyRevers.RefundQty)) > 0)
                            {

                                var obj = (from ipd in db.ItemPurchaseDetails
                                           join i in db.Items on
                                           ipd.ItemId equals i.Id
                                           join ipm in db.ItemPurchaseMains
                                           on ipd.IPMId equals ipm.Id
                                           join c in db.Categories
                                           on i.CategoryId equals c.Id
                                           join u in db.UnitOfMeasures
                                           on i.UomId equals u.Id
                                           where ipd.Barcode == ScanBarcode && ipm.PurchaseOrderNo == InvoiceNo && (ipd.Quantity - (ipd.RefundQty == null ? 0 : ipd.RefundQty)) > 0
                                           select new
                                           {
                                               SmId = ipm.Id,
                                               InvoiceNo = ipm.PurchaseOrderNo,
                                               SaleDetailId = ipd.Id,
                                               barcode = ipd.Barcode,
                                               itemName = i.Name,
                                               itemId = ipd.ItemId,
                                               category = c.Name,
                                               categoryId = i.CategoryId,
                                               uom = u.Name,
                                               uomId = u.Id,
                                               quantity = ipd.Quantity - (ipd.RefundQty == null ? 0 : ipd.RefundQty),
                                               rate = ipd.Rate,
                                               amount = ipd.Amount
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

        public string GenerateVendorReversalNo()
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var lstSaleMain = db.VendorRefundMains.ToList();

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

        public ActionResult LoadInvoices()
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var ObjInv = db.SaleMains.OrderByDescending(d => d.Id).Where(x => x.IsActive == true).Select(s => s.InvoiceNo).ToList();

                    status = JsonConvert.SerializeObject(ObjInv);
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
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
        public ActionResult LoadSaleDetailDataForMobile(string ScanBarcode)
        {
            string status = "error";
            try
            {

                var obj = (from ipd in db.ItemPurchaseDetails
                           join i in db.Items on
                           ipd.ItemId equals i.Id
                           join ipm in db.ItemPurchaseMains
                           on ipd.IPMId equals ipm.Id
                           join c in db.Categories
                           on i.CategoryId equals c.Id
                           join u in db.UnitOfMeasures
                           on i.UomId equals u.Id
                           where ipd.Barcode == ScanBarcode && (ipd.Quantity - (ipd.RefundQty == null ? 0 : ipd.RefundQty)) > 0
                           select new
                           {
                               SmId = ipm.Id,
                               InvoiceNo = ipm.PurchaseOrderNo,
                               SaleDetailId = ipd.Id,
                               barcode = ipd.Barcode,
                               itemName = i.Name,
                               itemId = ipd.ItemId,
                               category = c.Name,
                               categoryId = i.CategoryId,
                               uom = u.Name,
                               uomId = u.Id,
                               quantity = ipd.Quantity - (ipd.RefundQty == null ? 0 : ipd.RefundQty),
                               rate = ipd.Rate,
                               amount = ipd.Amount


                           }).ToList();
                status = JsonConvert.SerializeObject(obj);

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

                var obj = (from ipd in db.ItemPurchaseDetails
                           join ipm in db.ItemPurchaseMains
                           on ipd.IPMId equals ipm.Id
                           where ipd.Barcode == ScanBarcode
                           select ipm.PurchaseOrderNo
                            ).ToList();
                status = JsonConvert.SerializeObject(obj);

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "LoadCustomers");
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
                    var GetVendor = (from ipd in db.ItemPurchaseDetails
                                     join ipm in db.ItemPurchaseMains
                                     on ipd.IPMId equals ipm.Id
                                     where ipd.Barcode == MobileBarcode
                                     select ipm.VendorId).FirstOrDefault();

                    if (GetVendor != null)
                    {
                        var Customer = (from v in db.Vendors
                                        where v.Id == GetVendor
                                        select new
                                        {
                                            Id = v.Id,
                                            Name = v.Name,
                                            Balance = (db.VendorPayments.Where(x => x.VendorId == v.Id).Sum(cp => cp.Debit)) - (db.VendorPayments.Where(x => x.VendorId == v.Id).Sum(cp => cp.Credit))
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
                    var checkCode = db.Barcodes.Where(x => x.Barcode1 == ScanBarcode).FirstOrDefault();
                    if (checkCode != null)
                    {
                        var SaleEver = db.ItemPurchaseDetails.Where(x => x.Barcode == checkCode.Barcode1).FirstOrDefault();


                        if (SaleEver != null)
                        {

                            var alreadyRevers = db.ItemPurchaseDetails.Where(x => x.Barcode == ScanBarcode).FirstOrDefault();


                            if ((((alreadyRevers.Quantity - (alreadyRevers.RefundQty == null ? 0 : alreadyRevers.RefundQty)) > 0) && (CheckItemCat == "Mobile" || CheckItemCat == "Used Mobile")) || (CheckItemCat != "Mobile" && CheckItemCat != "Used Mobile"))
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

        public ActionResult VendorRefund(int VendorId, string Reference, decimal GrossBill, decimal TotalQty, SaleDetail[] GridItems)
        {
            string status = "error";
            try
            {
                bool QtyInIpd = true;
                foreach (var item in GridItems)
                {
                    var ipd = db.ItemPurchaseDetails.Where(x => x.Id == item.Id).FirstOrDefault();
                    ipd.RefundQty = ipd.RefundQty == null ? 0 : ipd.RefundQty;

                    var availQty = ipd.Quantity - ipd.RefundQty;
                    if (item.Qty > availQty)
                    {
                        QtyInIpd = false;
                    }
                }

                if (QtyInIpd == true)
                {
                    var objCus = db.Vendors.Where(x => x.Id == VendorId).FirstOrDefault();
                    if (objCus != null)
                    {

                        var objvRm = new VendorRefundMain();
                        objvRm.ReversalNo = GenerateVendorReversalNo().ToString();
                        objvRm.VendorId = VendorId;
                        objvRm.RSubTotal = GrossBill;
                        objvRm.Reference = Reference;
                        objvRm.UID = Guid.NewGuid();
                        objvRm.IsActive = true;
                        
                        objvRm.RQty = Convert.ToInt32(TotalQty);
                        objvRm.CreatedBy = ActiveUserId;
                        objvRm.UpdatedBy = ActiveUserId;
                        objvRm.CreatedOn = DateTime.Now;
                        objvRm.UpdatedOn = DateTime.Now;
                        db.VendorRefundMains.Add(objvRm);
                        db.SaveChanges();
                        foreach (var item in GridItems)
                        {
                            var si = db.SellingItems.Where(x => x.ItemId == item.ItemId && x.Barcode == item.Barcode).FirstOrDefault();
                            si.Quantity -= item.Qty;

                            var ipd = db.ItemPurchaseDetails.Where(x => x.Id == item.Id).FirstOrDefault();
                            ipd.RefundQty += item.Qty;
                            ipd.RefundStatus = true;
                            db.SaveChanges();


                            var objvRd = new VendorRefundDetail();
                            objvRd.VRMId = objvRm.Id;
                            objvRd.RBarcode = item.Barcode;
                            objvRd.RItemId = item.ItemId;
                            objvRd.RUomId = item.UomId;
                            objvRd.RPrice = item.Price;
                            objvRd.RAmount = item.Amount;
                            objvRd.UID = Guid.NewGuid();
                            objvRd.IsActive = true;
                            objvRd.RQty = item.Qty;
                            objvRd.CreatedBy = ActiveUserId;
                            objvRd.UpdatedBy = ActiveUserId;
                            objvRd.CreatedOn = DateTime.Now;
                            objvRd.UpdatedOn = DateTime.Now;
                            db.VendorRefundDetails.Add(objvRd);
                            db.SaveChanges();

                        }

                        var objvp = new VendorPayment();
                        objvp.UID = Guid.NewGuid();
                        objvp.VendorId = VendorId;
                        objvp.PoNumber = objvRm.ReversalNo;
                        objvp.EntryType = 4;
                        objvp.PaymentMethode = 1;
                        objvp.Credit = 0;
                        objvp.Debit = GrossBill;
                        objvp.EntryDate = DateTime.Now;
                        objvp.CreatedBy = ActiveUserId;
                        objvp.CreatedOn = DateTime.Now;
                        objvp.UpdatedBy = ActiveUserId;
                        objvp.UpdatedOn = DateTime.Now;
                        db.VendorPayments.Add(objvp);

                        var objVpl = new VendorPaymentLog();
                        objVpl.UID = Guid.NewGuid();
                        objVpl.VendorId = VendorId;
                        objVpl.EntryType = 4;
                        objVpl.PaymentMethode = 1;
                        objVpl.PoNumber = objvRm.ReversalNo;

                        objVpl.Credit = 0;
                        objVpl.Debit = GrossBill;
                        objVpl.EntryDate = DateTime.Now;
                        objVpl.CreatedBy = ActiveUserId;
                        objVpl.CreatedOn = DateTime.Now;
                        objVpl.UpdatedBy = ActiveUserId;
                        objVpl.UpdatedOn = DateTime.Now;
                        db.VendorPaymentLogs.Add(objVpl);

                        db.SaveChanges();

                        status = JsonConvert.SerializeObject(objvRm.Id);

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


        public ActionResult GetPurchaseOrderNo()
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
                    var count = db.ItemPurchaseMains.Count() + 1;
                    var code = count.ToString().PadLeft(6, '0');
                    status = "PO-" + code;
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "GetPurchaseOrderNo");
            }
            return Content(status);
        }


        public ActionResult LoaditemcBarcode()
        {
            string status = "error";
            try
            {

                if (Authenticated)
                {
                    var objSitems = from b in db.Barcodes
                                    join
              c in db.Categories on
              b.CategoryId equals c.Id
                                    join si in db.SellingItems
                                    on b.Barcode1 equals si.Barcode into bnSi
                                    from nSi in bnSi.DefaultIfEmpty()

                                    where (b.Barcode1 != nSi.Barcode && (c.Name == "Mobile" || c.Name == "Used Mobile")) || (c.Name != "Mobile" && c.Name != "Used Mobile")

                                    select b.Barcode1;
                    status = JsonConvert.SerializeObject(objSitems);
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "SaleScreenController", "GenerateInvoiceNo");
            }
            return Content(status);
        }



        public ActionResult AddPO(string PONum,string RNo, string PODate, int Vendor, int ShipToLoc, string Comments, int Status, string UID, bool IsEdit, ItemPurchaseDetail[] GridItems)
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

                    if (!IsEdit)
                    {
                        ItemPurchaseMain objMain = new ItemPurchaseMain();
                        objMain.IsPosted = false;
                        if (Status == 1)
                        {
                            objMain.IsPosted = true;
                        }
                        objMain.PurchaseOrderNo = PONum;
                        objMain.PurchaseOrderDate = DateTime.Parse(PODate);
                        objMain.VendorId = Vendor;
                        objMain.LocationId = ShipToLoc;
                        objMain.RNo = RNo;
                        objMain.Comments = Comments;
                        objMain.UID = Guid.NewGuid();
                        objMain.CreatedBy = ActiveUserId;
                        objMain.CreatedOn = DateTime.Now;
                        db.ItemPurchaseMains.Add(objMain);

                        db.SaveChanges();

                        for (var i = 0; i < GridItems.Length; i++)
                        {
                            ItemPurchaseDetail objDetail = new ItemPurchaseDetail();
                            objDetail = GridItems[i];
                            objDetail.IPMId = objMain.Id;
                            objDetail.CreatedBy = ActiveUserId;
                            objDetail.CreatedOn = DateTime.Now;
                            db.ItemPurchaseDetails.Add(objDetail);

                            db.SaveChanges();
                        }

                        if (Status == 1) // Posted Status
                        {
                            var totalAmount = 0m;

                            for (var i = 0; i < GridItems.Length; i++)
                            {
                                Warehouse objWh = new Warehouse();
                                var itemDetail = GridItems[i];
                                var ObjitemWh = db.Warehouses.Where(x => x.ItemId == itemDetail.ItemId && x.Barcode == itemDetail.Barcode).FirstOrDefault();
                                var objitem = db.Items.Where(x => x.Id == itemDetail.ItemId).FirstOrDefault();

                                if (ObjitemWh == null)
                                {
                                    objWh.UID = Guid.NewGuid();
                                    objWh.CreatedOn = DateTime.Now;
                                    objWh.CreatedBy = ActiveUserId;
                                    objWh.ColorId = itemDetail.ColorId;
                                    objWh.CategoryId = itemDetail.CategoryId;
                                    objWh.CostRate = itemDetail.Rate;
                                    objWh.SaleRate = itemDetail.SaleRate;
                                    objWh.UomId = itemDetail.UomId;
                                    objWh.ItemId = itemDetail.ItemId;
                                    objWh.Expired = itemDetail.Expired;
                                    objWh.Batch = itemDetail.Batch;
                                    objWh.Barcode = itemDetail.Barcode;
                                    objWh.QtyGiven = itemDetail.Quantity;
                                    objWh.QtyAvailable = itemDetail.Quantity;
                                    objWh.SubCategoryId = itemDetail.SubCategoryId;
                                    db.Warehouses.Add(objWh);
                                    db.SaveChanges();


                                    var totalPrice = (itemDetail.Quantity) * (itemDetail.Rate);
                                    totalAmount += Convert.ToDecimal(totalPrice);
                                }
                                else
                                {
                                    objWh = db.Warehouses.Where(x => x.ItemId == itemDetail.ItemId && x.Barcode == itemDetail.Barcode).FirstOrDefault();

                                    objWh.UpdatedBy = ActiveUserId;
                                    objWh.UpdatedOn = DateTime.Now;
                                    objWh.CostRate = itemDetail.Rate;
                                    objWh.SaleRate = itemDetail.SaleRate;
                                    objWh.QtyGiven += itemDetail.Quantity;
                                    objWh.QtyAvailable += itemDetail.Quantity;
                                    db.SaveChanges();

                                    var totalPrice = (itemDetail.Quantity) * (itemDetail.Rate);
                                    totalAmount += Convert.ToDecimal(totalPrice);
                                }


                                // Salling Items Start

                                var alreadyExist = db.SellingItems.Where(x => x.ItemId == itemDetail.ItemId && x.Barcode == itemDetail.Barcode).FirstOrDefault();
                                SellingItem objSi = new SellingItem();
                                if (alreadyExist == null)
                                {
                                    objSi.ItemId = itemDetail.ItemId;
                                    objSi.Barcode = itemDetail.Barcode;
                                    objSi.CategoryId = itemDetail.CategoryId;
                                    objSi.UomId = itemDetail.UomId;
                                    objSi.Quantity = itemDetail.Quantity;
                                    objSi.CostRate = itemDetail.Rate;
                                    objSi.SaleRate = itemDetail.SaleRate;
                                    objSi.CreatedBy = ActiveUserId;
                                    objSi.CreatedOn = DateTime.Now;
                                    db.SellingItems.Add(objSi);
                                }
                                else
                                {
                                    alreadyExist.Quantity += itemDetail.Quantity;
                                    alreadyExist.CostRate = itemDetail.Rate;
                                    alreadyExist.SaleRate = itemDetail.SaleRate;
                                    alreadyExist.UpdatedBy = ActiveUserId;
                                    alreadyExist.UpdatedOn = DateTime.Now;
                                }

                                db.SaveChanges();
                            }

                            var objVp = new VendorPayment();

                            objVp.UID = Guid.NewGuid();
                            objVp.VendorId = Vendor;
                            objVp.PaymentMethode = 1;
                            objVp.EntryType = 3;
                            objVp.EntryDate = DateTime.Now;
                            objVp.Comment = Comments;
                            objVp.Credit = totalAmount;
                            objVp.Debit = 0;
                            objVp.PoNumber = PONum;
                            objVp.CreatedOn = DateTime.Now;
                            objVp.CreatedBy = SiteUser.Id;
                            db.VendorPayments.Add(objVp);
                            db.SaveChanges();

                            var objVpl = new VendorPaymentLog();

                            objVpl.UID = Guid.NewGuid();
                            objVpl.VendorPaymentId = objVp.Id;
                            objVpl.VendorId = Vendor;
                            objVpl.PaymentMethode = 1;
                            objVpl.Comment = Comments;
                            objVpl.EntryType = 3;
                            objVpl.EntryDate = DateTime.Now;
                            objVpl.Credit = totalAmount;
                            objVpl.Debit = 0;
                            objVpl.PoNumber = PONum;
                            objVpl.CreatedOn = DateTime.Now;
                            objVpl.CreatedBy = SiteUser.Id;
                            db.VendorPaymentLogs.Add(objVpl);
                            db.SaveChanges();

                        }

                        var load = (from Ipm in db.ItemPurchaseMains
                                    join
                                    v in db.Vendors
                                    on Ipm.VendorId equals v.Id
                                    where Ipm.UID == objMain.UID
                                    select
                                    new
                                    {
                                        UID = Ipm.UID,
                                        PurchaseOrderNo = Ipm.PurchaseOrderNo,
                                        PurchaseOrderDate = Ipm.PurchaseOrderDate,
                                        Vendor = v.Name,
                                        Comments = Ipm.Comments,
                                        Status = Ipm.IsPosted,
                                        ReciptNo = Ipm.RNo

                                    });
                        status = JsonConvert.SerializeObject(load);
                    }

                    else if (IsEdit)
                    {
                        var Uid = Guid.Parse(UID);
                        var edit = db.ItemPurchaseMains.Where(x => x.UID == Uid).FirstOrDefault();
                        edit.IsPosted = false;
                        if (Status == 1)
                        {
                            edit.IsPosted = true;
                        }
                        edit.RNo = RNo;
                        edit.PurchaseOrderNo = PONum;
                        edit.PurchaseOrderDate = DateTime.Parse(PODate);
                        edit.VendorId = Vendor;
                        edit.LocationId = ShipToLoc;
                        edit.Comments = Comments;
                        edit.UpdatedBy = ActiveUserId;
                        edit.UpdatedOn = DateTime.Now;

                        db.SaveChanges();

                        var p = db.ItemPurchaseDetails.Where(x => x.IPMId == edit.Id).ToList();
                        db.ItemPurchaseDetails.RemoveRange(p);

                        for (var i = 0; i < GridItems.Length; i++)
                        {
                            ItemPurchaseDetail objDetail = new ItemPurchaseDetail();
                            objDetail = GridItems[i];
                            objDetail.IPMId = edit.Id;
                            objDetail.CreatedBy = ActiveUserId;
                            objDetail.CreatedOn = DateTime.Now;
                            db.ItemPurchaseDetails.Add(objDetail);
                            db.SaveChanges();
                        }

                        if (Status == 1)
                        {
                            var totalAmount = 0m;
                            for (var i = 0; i < GridItems.Length; i++)
                            {
                                Warehouse objWh = new Warehouse();
                                var itemDetail = GridItems[i];
                                var ObjitemWh = db.Warehouses.Where(x => x.ItemId == itemDetail.ItemId && x.Barcode == itemDetail.Barcode).FirstOrDefault();
                                var objitem = db.Items.Where(x => x.Id == itemDetail.ItemId).FirstOrDefault();
                                if (ObjitemWh == null || ObjitemWh.Batch != itemDetail.Batch)
                                {
                                    objWh.UID = Guid.NewGuid();
                                    objWh.CreatedOn = DateTime.Now;
                                    objWh.CreatedBy = ActiveUserId;
                                    objWh.CategoryId = itemDetail.CategoryId;
                                    objWh.SubCategoryId = itemDetail.SubCategoryId;
                                    objWh.CostRate = itemDetail.Rate;
                                    objWh.SaleRate = itemDetail.SaleRate;
                                    objWh.UomId = itemDetail.UomId;
                                    objWh.ItemId = itemDetail.ItemId;
                                    objWh.Batch = itemDetail.Batch;
                                    objWh.Expired = itemDetail.Expired;
                                    objWh.Barcode = itemDetail.Barcode;
                                    objWh.QtyGiven = itemDetail.Quantity;
                                    objWh.QtyAvailable = itemDetail.Quantity;
                                    db.Warehouses.Add(objWh);
                                    db.SaveChanges();
                                    var totalPrice = (itemDetail.Quantity) * (itemDetail.Rate);
                                    totalAmount += Convert.ToDecimal(totalPrice);
                                }
                                else
                                {
                                    objWh = db.Warehouses.Where(x => x.ItemId == itemDetail.ItemId && x.Barcode == itemDetail.Barcode).FirstOrDefault();

                                    objWh.UpdatedBy = ActiveUserId;
                                    objWh.UpdatedOn = DateTime.Now;
                                    objWh.CostRate = itemDetail.Rate;
                                    objWh.SaleRate = itemDetail.SaleRate;
                                    objWh.QtyGiven += itemDetail.Quantity;
                                    objWh.QtyAvailable += itemDetail.Quantity;
                                    db.SaveChanges();
                                    var totalPrice = (itemDetail.Quantity) * (itemDetail.Rate);
                                    totalAmount += Convert.ToDecimal(totalPrice);
                                }

                                // Salling Items Start

                                var alreadyExist = db.SellingItems.Where(x => x.ItemId == itemDetail.ItemId && x.Barcode == itemDetail.Barcode).FirstOrDefault();
                                SellingItem objSi = new SellingItem();
                                if (alreadyExist == null)
                                {
                                    objSi.ItemId = itemDetail.ItemId;
                                    objSi.Barcode = itemDetail.Barcode;
                                    objSi.CategoryId = itemDetail.CategoryId;
                                    objSi.UomId = itemDetail.UomId;
                                    objSi.Quantity = itemDetail.Quantity;
                                    objSi.CostRate = itemDetail.Rate;
                                    objSi.SaleRate = itemDetail.SaleRate;
                                    objSi.CreatedBy = ActiveUserId;
                                    objSi.CreatedOn = DateTime.Now;
                                    db.SellingItems.Add(objSi);
                                }
                                else
                                {
                                    alreadyExist.Quantity += itemDetail.Quantity;
                                    alreadyExist.CostRate = itemDetail.Rate;
                                    alreadyExist.SaleRate = itemDetail.SaleRate;
                                    alreadyExist.UpdatedBy = ActiveUserId;
                                    alreadyExist.UpdatedOn = DateTime.Now;
                                }

                                db.SaveChanges();

                            }


                            var objVp = new VendorPayment();

                            objVp.UID = Guid.NewGuid();
                            objVp.VendorId = Vendor;
                            objVp.PaymentMethode = 1;
                            objVp.EntryType = 3;
                            objVp.Comment = Comments;
                            objVp.EntryDate = DateTime.Now;
                            objVp.Credit = totalAmount;
                            objVp.Debit = 0;
                            objVp.PoNumber = PONum;
                            objVp.UpdatedOn = DateTime.Now;
                            objVp.UpdatedBy = SiteUser.Id;
                            db.SaveChanges();

                            var objVpl = new VendorPaymentLog();

                            objVpl.UID = Guid.NewGuid();
                            objVpl.VendorPaymentId = objVp.Id;
                            objVpl.Comment = Comments;
                            objVpl.VendorId = Vendor;
                            objVpl.PaymentMethode = 1;
                            objVpl.EntryType = 3;
                            objVpl.EntryDate = DateTime.Now;
                            objVpl.Credit = totalAmount;
                            objVpl.Debit = 0;
                            objVpl.PoNumber = PONum;
                            objVpl.CreatedOn = DateTime.Now;
                            objVpl.CreatedBy = SiteUser.Id;
                            db.VendorPaymentLogs.Add(objVpl);
                            db.SaveChanges();


                        }

                        var load = (from Ipm in db.ItemPurchaseMains
                                    join
                                    v in db.Vendors
                                    on Ipm.VendorId equals v.Id
                                    where Ipm.UID == edit.UID
                                    select
                                    new
                                    {
                                        UID = Ipm.UID,
                                        PurchaseOrderNo = Ipm.PurchaseOrderNo,
                                        PurchaseOrderDate = Ipm.PurchaseOrderDate,
                                        Vendor = v.Name,
                                        Comments = Ipm.Comments,
                                        Status = Ipm.IsPosted,
                                        ReciptNo = Ipm.RNo

                                    });

                        status = JsonConvert.SerializeObject(load);
                    }

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "AddPO");
            }
            return Content(status);
        }


        public ActionResult LoadVendor()
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
                    var list = db.Vendors.Where(x => x.IsActive == true).ToList();
                    status = JsonConvert.SerializeObject(list);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "LoadVendor");
            }
            return Content(status);
        }

        public ActionResult LoadLocation()
        {
            string status = "0:{choose}";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    List<Location> lstItem = db.Locations.Where(x => x.IsActive == true).ToList();

                    status = JsonConvert.SerializeObject(lstItem);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "LoadLocation");
            }
            return Content(status);
        }



        public ActionResult LoadItems()
        {
            string status = "0:{choose}";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {

                    List<Item> lstItem = db.Items.Where(x => x.IsActive == true).ToList();

                    foreach (Item item in lstItem)
                    {
                        status += ";" + item.Id + ":" + item.Name;
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "LoadItems");
            }
            return Content(status);
        }



        public ActionResult LoadColor()
        {
            string status = "0:{choose}";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    List<Color> lstItem = db.Colors.Where(x => x.IsActive == true).ToList();

                    foreach (Color item in lstItem)
                    {
                        status += ";" + item.Id + ":" + item.Name;
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "LoadColor");
            }
            return Content(status);
        }



        public ActionResult LoadUom()
        {
            var status = "{Choose}";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    List<UnitOfMeasure> lstItem = db.UnitOfMeasures.Where(x => x.IsActive == true).ToList();

                    foreach (UnitOfMeasure item in lstItem)
                    {
                        status += ";" + item.Id + ":" + item.Name;
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "LoadUom");
            }
            return Content(status);
        }

        public ActionResult LoadCategories()
        {
            var status = "{Choose}";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    List<Category> lstItem = db.Categories.Where(x => x.IsActive == true).ToList();

                    foreach (Category item in lstItem)
                    {
                        status += ";" + item.Id + ":" + item.Name;
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "LoadCategories");
            }
            return Content(status);
        }


        public ActionResult LoadCategoryById(int Id)
        {
            var status = "{choose}";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    Item Item = db.Items.Where(x => x.Id == Id).FirstOrDefault();
                    status = Item.CategoryId.ToString();
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "LoadCategories");
            }
            return Content(status);
        }

        public ActionResult LoadColorById(int Id)
        {
            var status = "{choose}";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    Item Item = db.Items.Where(x => x.Id == Id).FirstOrDefault();
                    status = Item.ColorId.ToString();

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "LoadCategories");
            }
            return Content(status);
        }

        public ActionResult LoadUomById(int Id)
        {
            var status = "{choose}";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    Item Item = db.Items.Where(x => x.Id == Id).FirstOrDefault();
                    status = Item.UomId.ToString();
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "LoadCategories");
            }
            return Content(status);
        }

        public ActionResult LoadGrid()
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
                    var list = (from Ipm in db.ItemPurchaseMains
                                join
                                v in db.Vendors
                                on Ipm.VendorId equals v.Id
                                select
                                new
                                {
                                    UID = Ipm.UID,
                                    PurchaseOrderNo = Ipm.PurchaseOrderNo,
                                    PurchaseOrderDate = Ipm.PurchaseOrderDate,
                                    Vendor = v.Name,
                                    Comments = Ipm.Comments,
                                    Status = Ipm.IsPosted,
                                    ReciptNo=Ipm.RNo

                                }
                          ).ToList();

                    status = JsonConvert.SerializeObject(list);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "LoadGrid");
            }
            return Content(status);
        }


        public ActionResult EditMain(Guid UID)
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
                    var person = db.ItemPurchaseMains.Where(x => x.UID == UID).FirstOrDefault();
                    status = JsonConvert.SerializeObject(person);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "EditMain");
            }

            return Content(status);
        }

        public ActionResult EditDetail(Guid UID)
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
                    var person = (from ipm in db.ItemPurchaseMains
                                  join
                                  ipd in db.ItemPurchaseDetails
                                  on
                                  ipm.Id equals ipd.IPMId
                                  join
                                  i in db.Items
                                  on
                                  ipd.ItemId equals i.Id
                                  join
                                  uom in db.UnitOfMeasures
                                  on
                                  i.UomId equals uom.Id
                                  join
                                  c in db.Categories
                                  on
                                  i.CategoryId equals c.Id
                                 
                                  
                                  where ipm.UID == UID
                                  select new
                                  {
                                      itemid = ipd.ItemId,
                                      name = i.Name,
                                      barcode = ipd.Barcode,
                                      CategoryId = ipd.CategoryId,
                                      category = c.Name,
                                      SubCategoryId = ipd.SubCategoryId,
                                     
                                      uomid = ipd.UomId,
                                      uom = uom.Name,
                                      qty = ipd.Quantity,
                                      rate = ipd.Rate,
                                      amount = ipd.Amount,
                                      saleRate = ipd.SaleRate,
                                      saleAmount = ipd.SaleAmount,
                                      Batch = ipd.Batch,
                                      Expired = ipd.Expired

                                  }
                           );
                    status = JsonConvert.SerializeObject(person);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "EditMain");
            }

            return Content(status);
        }

        public ActionResult ProductDetailsByBarcode(string Barcode)
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
                    var person = db.ProductDetailsByBarcode(Barcode);
                    status = JsonConvert.SerializeObject(person);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "ProductDetailsByBarcode");
            }

            return Content(status);
        }
        public ActionResult GetProductDetailsByBarcode(string Barcode)
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
                    var person = db.GetProductDetailsByBarcode(Barcode);
                    status = JsonConvert.SerializeObject(person);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "GetProductDetailsByBarcode");
            }

            return Content(status);
        }
        public ActionResult GetProductDetailsByBarcodeByName(string Barcode)
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
                    var splitBarcode = Barcode.Split('-');
                    var item = splitBarcode[0];

                    var barcode = splitBarcode[1];
                    var person = db.GetProductDetailsByBarcode(barcode);
                    status = JsonConvert.SerializeObject(person);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PurchaseOrderManagement", "GetProductDetailsByBarcode");
            }

            return Content(status);
        }


    }
}