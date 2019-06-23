using System;
using System.Collections.Generic;
using System.Linq;
using PointOfSale.Models;
using System.Web;
using System.Web.Mvc;

namespace PointOfSale.Controllers
{
    public class CustomerManagementController : GlobalController
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: CustomerManagement
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }

            var List = db.SubCategories.Where(x => x.CategoryId == 1).ToList();
            return View(List);
        }

        public ActionResult Payments()
        {
            if (!Authenticated)
            {
                RedirectToAction("Login", "Authentication");
            }
            return View();
        }

        public ActionResult LoadGridPayments()
        {
            string status = "error";
            try
            {

                var obj = (from c in db.Customers
                           select new
                           {
                               c.UID,
                               c.Code,
                               c.Name,
                               c.Contact,
                               c.Address,
                               c.Email,
                               c.IsActive,
                               Balance = (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(s => s.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(s => s.Credit))
                           }).ToList();

                status = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CustomerManagementController", "LoadGridPayments");
            }
            return Content(status);
        }


        public ActionResult LoadCustomerByUID(Guid UID)
        {
            string status = "error";
            try
            {

                var obj = (from v in db.Customers
                           where v.UID == UID
                           select new
                           {
                               v.UID,
                               v.Name,
                               v.Contact,
                               Balance = (db.CustomerPayments.Where(x => x.CustomerId == v.Id).Sum(s => s.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == v.Id).Sum(s => s.Credit))
                           }).FirstOrDefault();

                status = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CustomerManagementController", "LoadGridPayments");
            }
            return Content(status);
        }


        //pay to customer

        public ActionResult PaymentToCustomer(Guid UID, double totalPay)
        {
            string status = "error";
            try
            {

                var c = db.Customers.Where(x => x.UID == UID).FirstOrDefault();
                var objCp = new CustomerPayment();

           

                // Entry in customer Payment

                objCp.UID = Guid.NewGuid();
                objCp.CustomerId = c.Id;
                objCp.EntryType = 5;
                objCp.PaymentMethode = 1;
                objCp.Credit = Convert.ToDecimal(totalPay);
                objCp.Debit = 0;
                objCp.EntryDate = DateTime.Now;
                objCp.CreatedBy = ActiveUserId;
                objCp.CreatedOn = DateTime.Now;
                objCp.UpdatedBy = ActiveUserId;
                objCp.UpdatedOn = DateTime.Now;
                db.CustomerPayments.Add(objCp);
                db.SaveChanges();
                
                var objCpl = new CustomerPaymentLog();

                objCpl.UID = Guid.NewGuid();
                objCpl.CustomerId = c.Id;
                objCpl.EntryType = 5;
                objCpl.CustomerPaymentId = objCp.Id;
                objCpl.PaymentMethode = 1;
                objCpl.CreatedBy = ActiveUserId;
                objCpl.Credit = Convert.ToDecimal(totalPay);
                objCpl.Debit = 0;
                objCpl.CreatedOn = DateTime.Now;
                objCpl.UpdatedBy = ActiveUserId;
                objCpl.UpdatedOn = DateTime.Now;
                db.CustomerPaymentLogs.Add(objCpl);

                db.SaveChanges();


                //return UID and Balance  to js 
                var objUpdatedCustomer = db.Customers.Where(cU => cU.UID == UID).Select(s => new
                {
                    UID = s.UID,
                    CpId = objCp.Id,
                    Balance = (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(cp => cp.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(cp => cp.Credit))
                }).FirstOrDefault();

                status = Newtonsoft.Json.JsonConvert.SerializeObject(objUpdatedCustomer);
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CustomerManagementController", "LoadGridPayments");
            }
            return Content(status);
        }






        // recieve from customer
        public ActionResult PayToCustomer(Guid UID, double totalPay)
        {
            string status = "error";
            try
            {

                var c = db.Customers.Where(x => x.UID == UID).FirstOrDefault();
                var objCp = new CustomerPayment();

                //var exist = db.CustomerPayments.Where(x => x.CustomerId == c.Id && x.EntryType == 3).FirstOrDefault();

                //if (exist == null)
                //{
                   
                
                // Entry in customer Payment

                    objCp.UID = Guid.NewGuid();
                    objCp.CustomerId = c.Id;
                    objCp.EntryType = 2;
                    objCp.PaymentMethode = 1;
                    objCp.Debit = Convert.ToDecimal(totalPay);
                    objCp.Credit = 0;
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

                //    exist.UID = Guid.NewGuid();
                //    exist.CustomerId = c.Id;
                //    exist.EntryType = 3;
                //    exist.PaymentMethode = 1;
                //    exist.Debit = 0;
                //    exist.Credit += Convert.ToDecimal(totalPay);
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
                objCpl.CustomerId = c.Id;
                objCpl.EntryType = 2;
                objCpl.CustomerPaymentId = objCp.Id;
                objCpl.PaymentMethode = 1;
                objCpl.CreatedBy = ActiveUserId;
                objCpl.Debit = Convert.ToDecimal(totalPay);
                objCpl.Credit = 0;
                objCpl.CreatedOn = DateTime.Now;
                objCpl.UpdatedBy = ActiveUserId;
                objCpl.UpdatedOn = DateTime.Now;
                db.CustomerPaymentLogs.Add(objCpl);

                db.SaveChanges();


                //return UID and Balance  to js 
                var objUpdatedCustomer = db.Customers.Where(cU=>cU.UID==UID).Select(s => new
                {
                 UID =s.UID,
                 CpId=objCp.Id,
                 Balance = (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(cp => cp.Debit)) - (db.CustomerPayments.Where(x => x.CustomerId == c.Id).Sum(cp => cp.Credit))
                 }).FirstOrDefault();
                
                status = Newtonsoft.Json.JsonConvert.SerializeObject(objUpdatedCustomer);
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CustomerManagementController", "LoadGridPayments");
            }
            return Content(status);
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
                    var Count = db.Customers.Count() + 1;
                    var Code = Count.ToString().PadLeft(5, '0');
                    status = Code;
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CustomerManagementController", "GenerateCode");
            }
            return Content(status);
        }

        public ActionResult LoadGrid()
        {
            string status = "error";
            try
            {
                var str = db.Customers.Where(x=>x.Id !=1).ToList();
                status = Newtonsoft.Json.JsonConvert.SerializeObject(str);
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CustomerManagementController", "LoadGrid");
            }
            return Content(status);
        }


        public ActionResult AddCustomer(Customer objCustomer, List<string> SubCategoryName,List<int> SubCategoryId)
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

                    if (objCustomer.IsActive == null)
                    {
                        objCustomer.IsActive = false;
                    }
                    if (objCustomer.IsResaler == null)
                    {
                        objCustomer.IsResaler = false;
                    }

                    objCustomer.UID = Guid.NewGuid();
                    objCustomer.CreatedBy = ActiveUserId;
                    objCustomer.CreatedOn = DateTime.Now;
                    objCustomer.UpdatedBy = ActiveUserId;
                    objCustomer.UpdatedOn = DateTime.Now;

                    db.Customers.Add(objCustomer);
                    if (db.SaveChanges() > 0)
                    {

                        // Discount Entry



                        for (int i = 0; i < SubCategoryName.Count(); i++)
                        {
                            var objDsc = new DiscountOnBrand();
                            if (SubCategoryName[i]=="" || string.IsNullOrEmpty(SubCategoryName[i]))
                            {
                                SubCategoryName[i] = "0";
                            }

                            objDsc.SubCatId = SubCategoryId[i];
                            objDsc.Discount = Convert.ToDecimal(SubCategoryName[i]);
                            objDsc.CustomerId = objCustomer.Id;
                            objDsc.CreatedOn = DateTime.Now;
                            db.DiscountOnBrands.Add(objDsc);
                        }


                        // Entry in Customer Payment

                        var objCp = new CustomerPayment();
                        objCp.UID = Guid.NewGuid();
                        objCp.CustomerId = objCustomer.Id;
                        if (objCustomer.OpeningBalance == 0)
                        {
                            objCp.Debit = 0;
                            objCp.Credit = 0;
                        }
                        if (objCustomer.OpeningBalance > 0)
                        {
                            objCp.Debit = objCustomer.OpeningBalance;
                            objCp.Credit = 0;
                        }
                        if (objCustomer.OpeningBalance < 0)
                        {
                            objCp.Credit = -(objCustomer.OpeningBalance);
                            objCp.Debit = 0;
                        }
                        objCp.EntryType = 1;
                        objCp.PaymentMethode = 1;
                        objCp.EntryDate = DateTime.Now;
                        objCp.CreatedBy = ActiveUserId;
                        objCp.CreatedOn = DateTime.Now;
                        objCp.UpdatedBy = ActiveUserId;
                        objCp.UpdatedOn = DateTime.Now;
                        db.CustomerPayments.Add(objCp);

                        // Entry in Customer Payment Logs
                        var objCpl = new CustomerPaymentLog();

                        objCpl.UID = Guid.NewGuid();
                        objCpl.CustomerId = objCustomer.Id;
                        if (objCustomer.OpeningBalance == 0)
                        {
                            objCpl.Debit = 0;
                            objCpl.Credit = 0;
                        }
                        if (objCustomer.OpeningBalance > 0)
                        {
                            objCpl.Debit = objCustomer.OpeningBalance;
                            objCpl.Credit = 0;
                        }
                        if (objCustomer.OpeningBalance < 0)
                        {
                            objCpl.Credit = -(objCustomer.OpeningBalance);
                            objCpl.Debit = 0;
                        }
                        objCpl.EntryType = 1;
                        objCpl.PaymentMethode = 1;
                        objCpl.CreatedBy = ActiveUserId;
                        objCpl.CreatedOn = DateTime.Now;
                        objCpl.UpdatedBy = ActiveUserId;
                        objCpl.UpdatedOn = DateTime.Now;
                        db.CustomerPaymentLogs.Add(objCpl);

                        db.SaveChanges();


                        status = Newtonsoft.Json.JsonConvert.SerializeObject(objCustomer);
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CustomerManagementController", "AddVendor");
            }
            return Content(status);
        }

        public ActionResult Edit(Guid Id)
        {
            string status = "error";
            try
            {
                var objCustomer = db.Customers.Where(x => x.UID == Id).FirstOrDefault();
                status = Newtonsoft.Json.JsonConvert.SerializeObject(objCustomer);
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CustomerManagementController", "Edit");
            }
            return Content(status);
        }

        public ActionResult EditDiscount(Guid Id)
        {
            var status = "error";
            try
            {
                var objCustomer = db.Customers.Where(x => x.UID == Id).FirstOrDefault();
                var objDisc = db.DiscountOnBrands.Where(x => x.CustomerId == objCustomer.Id).ToList();
                status = Newtonsoft.Json.JsonConvert.SerializeObject(objDisc);
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CustomerManagementController", "Edit");
            }
            return Content(status);
        }


        public ActionResult EditCustomer(Customer objCustomer, List<string> SubCategoryName, List<int> SubCategoryId)
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
                    if (objCustomer.IsActive == null)
                    {
                        objCustomer.IsActive = false;
                    }
                    if (objCustomer.IsResaler == null)
                    {
                        objCustomer.IsResaler = false;
                    }
                    var objEdit = db.Customers.Where(x => x.UID == objCustomer.UID).FirstOrDefault();
                    objEdit.IsActive = objCustomer.IsActive;
                    objEdit.IsResaler = objCustomer.IsResaler;

                    objEdit.Name = objCustomer.Name;
                    objEdit.OpeningBalance = objCustomer.OpeningBalance;
                    objEdit.Contact = objCustomer.Contact;
                    objEdit.Address = objCustomer.Address;
                    objEdit.Email = objCustomer.Email;

                    objEdit.UpdatedBy = ActiveUserId;
                    objEdit.UpdatedOn = DateTime.Now;

                    if (db.SaveChanges() > 0)
                    {


                        // For discount edit

                        //remove all discount first
                        var exist = db.DiscountOnBrands.Where(x => x.CustomerId == objEdit.Id).ToList();
                        db.DiscountOnBrands.RemoveRange(exist);

                        for (int i = 0; i < SubCategoryName.Count(); i++)
                        {
                            var objDsc = new DiscountOnBrand();

                            if (SubCategoryName[i]=="" || string.IsNullOrEmpty(SubCategoryName[i]))
                            {
                                SubCategoryName[i] = "0";
                            }

                            objDsc.SubCatId = SubCategoryId[i];
                            objDsc.Discount = Convert.ToDecimal(SubCategoryName[i]);
                            objDsc.CustomerId = objEdit.Id;
                            objDsc.CreatedOn = DateTime.Now;
                            db.DiscountOnBrands.Add(objDsc);
                            db.SaveChanges();
                        }

                        // Entry in Customer Payment

                        var objCp = db.CustomerPayments.Where(x => x.EntryType == 1 && x.CustomerId == objEdit.Id).FirstOrDefault();
                        objCp.UID = Guid.NewGuid();
                        objCp.CustomerId = objEdit.Id;
                        if (objCustomer.OpeningBalance == 0)
                        {
                            objCp.Debit = 0;
                            objCp.Credit = 0;
                        }
                        if (objCustomer.OpeningBalance > 0)
                        {
                            objCp.Debit = objCustomer.OpeningBalance;
                            objCp.Credit = 0;
                        }
                        if (objCustomer.OpeningBalance < 0)
                        {
                            objCp.Credit = -(objCustomer.OpeningBalance);
                            objCp.Debit = 0;
                        }
                        objCp.EntryType = 1;
                        objCp.PaymentMethode = 1;
                        objCp.EntryDate = DateTime.Now;
                        objCp.CreatedBy = ActiveUserId;
                        objCp.CreatedOn = DateTime.Now;
                        objCp.UpdatedBy = ActiveUserId;
                        objCp.UpdatedOn = DateTime.Now;
                        

                        // Entry in Customer Payment Logs
                        var objCpl = new CustomerPaymentLog();

                        objCpl.UID = Guid.NewGuid();
                        objCpl.CustomerId = objEdit.Id;
                        if (objCustomer.OpeningBalance == 0)
                        {
                            objCpl.Debit = 0;
                            objCpl.Credit = 0;
                        }
                        if (objCustomer.OpeningBalance > 0)
                        {
                            objCpl.Debit = objCustomer.OpeningBalance;
                            objCpl.Credit = 0;
                        }
                        if (objCustomer.OpeningBalance < 0)
                        {
                            objCpl.Credit = -(objCustomer.OpeningBalance);
                            objCpl.Debit = 0;
                        }
                        objCpl.EntryType = 1;
                        objCpl.PaymentMethode = 1;
                        objCpl.CreatedBy = ActiveUserId;
                        objCpl.CreatedOn = DateTime.Now;
                        objCpl.UpdatedBy = ActiveUserId;
                        objCpl.UpdatedOn = DateTime.Now;
                        db.CustomerPaymentLogs.Add(objCpl);

                        db.SaveChanges();



                        status = Newtonsoft.Json.JsonConvert.SerializeObject(objEdit);
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CustomerManagementController", "EditVendor");
            }

            return Content(status);
        }


    }
}