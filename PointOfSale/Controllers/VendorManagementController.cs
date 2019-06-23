using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PointOfSale.Models;

namespace PointOfSale.Controllers
{
    public class VendorManagementController : GlobalController
    {
        PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: VendorManagement
        public ActionResult Index()
        {
            if (!Authenticated)
            {
                RedirectToAction("Login", "Authentication");
            }
            return View();
        }


        public ActionResult Payments()
        {
            if (!Authenticated)
            {
                RedirectToAction("Login", "Authentication");
            }
            return View();
        }


        public ActionResult GenerateCode()
        {
            string status = "error";
            try
            {
                if (!Authenticated)
                {
                    RedirectToAction("Login", "Authentication");
                }
                else
                {
                    var Count = db.Vendors.Count() + 1;
                    var Code = Count.ToString().PadLeft(5, '0');
                    status = Code;
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "VendorManagementController", "GenerateCode");
            }
            return Content(status);
        }

        public ActionResult AddVendor(Vendor objVendor)
        {
            string status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {

                    if (objVendor.IsActive == null)
                    {
                        objVendor.IsActive = false;
                    }

                    objVendor.UID = Guid.NewGuid();
                    objVendor.CreatedBy = ActiveUserId;
                    objVendor.CreatedOn = DateTime.Now;
                    objVendor.UpdatedBy = ActiveUserId;
                    objVendor.UpdatedOn = DateTime.Now;

                    db.Vendors.Add(objVendor);
                    if (db.SaveChanges() > 0)
                    {

                        // Entry in Vendor Payment

                        var objVp = new VendorPayment();
                        objVp.UID = Guid.NewGuid();
                        objVp.VendorId = objVendor.Id;
                        if (objVendor.OpeningBalance == 0)
                        {
                            objVp.Debit = 0;
                            objVp.Credit = 0;
                        }
                        if (objVendor.OpeningBalance > 0)
                        {
                            objVp.Debit = objVendor.OpeningBalance;
                            objVp.Credit = 0;
                        }
                        if (objVendor.OpeningBalance < 0)
                        {
                            objVp.Credit = -(objVendor.OpeningBalance);
                            objVp.Debit = 0;
                        }
                        objVp.EntryType = 1;
                        objVp.PaymentMethode = 1;
                        objVp.EntryDate = DateTime.Now;
                        objVp.CreatedBy = ActiveUserId;
                        objVp.CreatedOn = DateTime.Now;
                        objVp.UpdatedBy = ActiveUserId;
                        objVp.UpdatedOn = DateTime.Now;
                        db.VendorPayments.Add(objVp);

                        // Entry in Vendor Payment Logs
                        var objVpl = new VendorPaymentLog();

                        objVpl.UID = Guid.NewGuid();
                        objVpl.VendorId = objVendor.Id;
                        if (objVendor.OpeningBalance == 0)
                        {
                            objVpl.Debit = 0;
                            objVpl.Credit = 0;
                        }
                        if (objVendor.OpeningBalance > 0)
                        {
                            objVpl.Debit = objVendor.OpeningBalance;
                            objVpl.Credit = 0;
                        }
                        if (objVendor.OpeningBalance < 0)
                        {
                            objVpl.Credit = -(objVendor.OpeningBalance);
                            objVpl.Debit = 0;
                        }
                        objVpl.EntryType = 1;
                        objVpl.PaymentMethode = 1;
                        objVpl.CreatedBy = ActiveUserId;
                        objVpl.CreatedOn = DateTime.Now;
                        objVpl.UpdatedBy = ActiveUserId;
                        objVpl.UpdatedOn = DateTime.Now;
                        db.VendorPaymentLogs.Add(objVpl);

                        db.SaveChanges();

                        status = Newtonsoft.Json.JsonConvert.SerializeObject(objVendor);
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "VendorManagementController", "AddVendor");
            }
            return Content(status);
        }

        public ActionResult Edit(Guid Id)
        {
            string status = "error";
            try
            {
                var objVendor = db.Vendors.Where(x => x.UID == Id).FirstOrDefault();
                status = Newtonsoft.Json.JsonConvert.SerializeObject(objVendor);
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "VendorManagementController", "Edit");
            }
            return Content(status);
        }

        public ActionResult EditVendor(Vendor objVendor)
        {
            string status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "Session Expired";
                }
                else
                {
                    if (objVendor.IsActive == null)
                    {
                        objVendor.IsActive = false;
                    }
                    Vendor objEdit = db.Vendors.Where(x => x.UID == objVendor.UID).FirstOrDefault();
                    objEdit.IsActive = objVendor.IsActive;
                    objEdit.Name = objVendor.Name;
                    objEdit.OpeningBalance = objVendor.OpeningBalance;
                    objEdit.Contact = objVendor.Contact;
                    objEdit.Address = objVendor.Address;
                    objEdit.Email = objVendor.Email;

                    objEdit.UpdatedBy = ActiveUserId;
                    objEdit.UpdatedOn = DateTime.Now;

                    if (db.SaveChanges() > 0)
                    {

                        // Entry in Vendor Payment

                        var objVp = db.VendorPayments.Where(x => x.EntryType == 1 && x.VendorId == objEdit.Id).FirstOrDefault();
                        objVp.VendorId = objEdit.Id;
                        if (objEdit.OpeningBalance == 0)
                        {
                            objVp.Debit = 0;
                            objVp.Credit = 0;
                        }
                        if (objEdit.OpeningBalance > 0)
                        {
                            objVp.Debit = objEdit.OpeningBalance;
                            objVp.Credit = 0;
                        }
                        if (objEdit.OpeningBalance < 0)
                        {
                            objVp.Credit = -(objEdit.OpeningBalance);
                            objVp.Debit = 0;
                        }
                        objVp.EntryType = 1;
                        objVp.PaymentMethode = 1;
                        objVp.EntryDate = DateTime.Now;
                        objVp.UpdatedBy = ActiveUserId;
                        objVp.UpdatedOn = DateTime.Now;
                        db.SaveChanges();

                        // Entry in Vendor Payment Logs
                        var objVpl = new VendorPaymentLog();

                        objVpl.UID = Guid.NewGuid();
                        objVpl.VendorId = objEdit.Id;
                        if (objEdit.OpeningBalance == 0)
                        {
                            objVpl.Debit = 0;
                            objVpl.Credit = 0;
                        }
                        if (objEdit.OpeningBalance > 0)
                        {
                            objVpl.Debit = objEdit.OpeningBalance;
                            objVpl.Credit = 0;
                        }
                        if (objEdit.OpeningBalance < 0)
                        {
                            objVpl.Credit = -(objEdit.OpeningBalance);
                            objVpl.Debit = 0;
                        }
                        objVpl.EntryType = 1;
                        objVpl.PaymentMethode = 1;
                        objVpl.CreatedBy = ActiveUserId;
                        objVpl.CreatedOn = DateTime.Now;
                        objVpl.UpdatedBy = ActiveUserId;
                        objVpl.UpdatedOn = DateTime.Now;
                        db.VendorPaymentLogs.Add(objVpl);
                        db.SaveChanges();

                        status = Newtonsoft.Json.JsonConvert.SerializeObject(objEdit);
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "VendorManagementController", "EditVendor");
            }

            return Content(status);
        }
        public ActionResult LoadGrid()
        {
            string status = "error";
            try
            {
                var str = db.Vendors.ToList();
                status = Newtonsoft.Json.JsonConvert.SerializeObject(str);
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "VendorManagementController", "LoadGrid");
            }
            return Content(status);
        }

        public ActionResult LoadGridPayments()
        {
            string status = "error";
            try
            {

                var obj = (from v in db.Vendors
                           select new
                           {
                               v.UID,
                               v.Code,
                               v.Name,
                               v.Contact,
                               v.Address,
                               v.Email,
                               v.IsActive,
                               Balance = (db.VendorPayments.Where(x => x.VendorId == v.Id).Sum(s => s.Debit)) - (db.VendorPayments.Where(x => x.VendorId == v.Id).Sum(s => s.Credit))
                           }).ToList();

                status = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "VendorManagementController", "LoadGridPayments");
            }
            return Content(status);
        }

        public ActionResult LoadVendorByUID(Guid UID)
        {
            string status = "error";
            try
            {

                var obj = (from v in db.Vendors
                           where v.UID == UID
                           select new
                           {
                               v.UID,
                               v.Name,
                               v.Contact,
                               Balance = (db.VendorPayments.Where(x => x.VendorId == v.Id).Sum(s => s.Debit)) - (db.VendorPayments.Where(x => x.VendorId == v.Id).Sum(s => s.Credit))
                           }).FirstOrDefault();

                status = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "VendorManagementController", "LoadGridPayments");
            }
            return Content(status);
        }


        public ActionResult PayToVendor(Guid UID, double totalPay, string Comment)
        {
            string status = "error";
            try
            {

                var v = db.Vendors.Where(x => x.UID == UID).FirstOrDefault();
                //var exist = db.VendorPayments.Where(x => x.VendorId == v.Id && x.EntryType == 3).FirstOrDefault();
                var objVp = new VendorPayment();

                //if (exist==null)
                //{
                // Entry in Vendor Payment

                objVp.UID = Guid.NewGuid();
                objVp.VendorId = v.Id;
                objVp.EntryType = 2;
                objVp.PaymentMethode = 1;
                objVp.Credit = 0;
                objVp.Comment = Comment;
                objVp.Debit = Convert.ToDecimal(totalPay);
                objVp.EntryDate = DateTime.Now;
                objVp.CreatedBy = ActiveUserId;
                objVp.CreatedOn = DateTime.Now;
                objVp.UpdatedBy = ActiveUserId;
                objVp.UpdatedOn = DateTime.Now;
                db.VendorPayments.Add(objVp);


                //}
                //else
                //{

                //    exist.UID = Guid.NewGuid();
                //    exist.VendorId = v.Id;
                //    exist.EntryType = 3;
                //    exist.PaymentMethode = 1;
                //    exist.Debit = 0;
                //    exist.Credit = Convert.ToDecimal(totalPay);
                //    exist.EntryDate = DateTime.Now;
                //    exist.CreatedBy = ActiveUserId;
                //    exist.CreatedOn = DateTime.Now;
                //    exist.UpdatedBy = ActiveUserId;
                //    exist.UpdatedOn = DateTime.Now;
                //    db.VendorPayments.Add(exist);
                //    db.SaveChanges();

                //}

                // Entry in Vendor Payment Logs
                var objVpl = new VendorPaymentLog();

                objVpl.UID = Guid.NewGuid();
                objVpl.VendorId = v.Id;
                objVpl.EntryType = 2;
                objVp.Comment = Comment;    
                objVpl.VendorPaymentId = objVp.Id;
                objVpl.PaymentMethode = 1;
                objVpl.CreatedBy = ActiveUserId;
                objVpl.Credit = 0;
                objVpl.Debit = Convert.ToDecimal(totalPay);
                objVpl.CreatedOn = DateTime.Now;
                objVpl.UpdatedBy = ActiveUserId;
                objVpl.UpdatedOn = DateTime.Now;
                db.VendorPaymentLogs.Add(objVpl);

                db.SaveChanges();


                //return UID and Balance  to js 
                var objUpdatedCustomer = db.Vendors.Where(cU => cU.UID == UID).Select(s => new
                {
                    UID = s.UID,
                    VpId = objVp.Id,
                    Balance = (db.VendorPayments.Where(x => x.VendorId == v.Id).Sum(cp => cp.Debit)) - (db.VendorPayments.Where(x => x.VendorId == v.Id).Sum(cp => cp.Credit))
                }).FirstOrDefault();

                status = Newtonsoft.Json.JsonConvert.SerializeObject(objUpdatedCustomer);


            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "VendorManagementController", "LoadGridPayments");
            }
            return Content(status);
        }


    }
}