using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PointOfSale.Models;
using Newtonsoft.Json;

namespace PointOfSale.Controllers
{
    public class PersonalAccountController : GlobalController
    {
        // GET: PersonalAccount

        PointOfSaleEntities db = new PointOfSaleEntities();

        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }
        public ActionResult Edit(Guid Id)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "SESSION EXPIRED";
                }
                else
                {

                    var prdct = db.PersonalAccounts.Where(u => u.UID == Id).SingleOrDefault();
                    status = JsonConvert.SerializeObject(prdct);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "DailyExpenseController", "Edit");
            }
            return Content(status);
        }

        public ActionResult AddAccount(PersonalAccount Account)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "SESSION EXPIRED";
                }
                else
                {
                    Account.CreatedOn = DateTime.Now;
                    Account.CreatedBy = ActiveUserId;
                    Account.UID = Guid.NewGuid();
                    Account.Status =1;


                    db.PersonalAccounts.Add(Account);
                    if (db.SaveChanges() > 0)
                    {
                        status = JsonConvert.SerializeObject(Account);

                    }

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PersonalAccountController", "AddAccount");
            }

            return Content(status);
        }


        public ActionResult EditAccount(PersonalAccount Account)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "SESSION EXPIRED";
                }
                else
                {

                    PersonalAccount objacc = db.PersonalAccounts.Where(x => x.UID == Account.UID).FirstOrDefault();

                    objacc.UpdatedOn = DateTime.Now;
                    objacc.UpdatedBy = ActiveUserId;
                    objacc.Date = Account.Date;
                    objacc.Receive = Account.Receive;
                    objacc.Paid = Account.Paid;
                    objacc.Comments = Account.Comments;
                    //db.Entry(size).State = System.Data.Entity.EntityState.Modified;
                    if (db.SaveChanges() > 0)
                    {
                        status = JsonConvert.SerializeObject(objacc);
                    }



                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "DailyExpensesController", "EditExpenses");
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
                    status = "SESSION EXPIRED";
                }
                else
                {
                    var ListRelation = (from s in db.PersonalAccounts
                                        where s.Status == 1

                                        select
                                       new
                                       {
                                           UID = s.UID,
                                           Date = s.Date,
                                           Receive = s.Receive,
                                           Paid = s.Paid,
                                           Comments = s.Comments,
                                       }).ToList();


                    status = JsonConvert.SerializeObject(ListRelation);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "PersonalAccountController", "LoadGrid");
            }
            return Content(status);
        }

        public ActionResult PresonalAccountReport()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }

            return View();
        }
        public ActionResult AccountReport(string FromDate, string ToDate)
        {
            string status = "error";
            try
            {
                var From = DateTime.Parse(FromDate);
                var To = DateTime.Parse(ToDate);
                To = To.AddDays(1);

                var obj = (from r in db.PersonalAccounts
                           where r.Date >= From && r.Date < To && r.Status == 1
                           select new
                           {
                               UID = r.UID,
                               Date = r.Date,
                               Receive=r.Receive,
                               Paid =r.Paid,
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
        public ActionResult Delete(Guid Id)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "SESSION EXPIRED";
                }
                else
                {
                    PersonalAccount obj = new PersonalAccount();

                    PersonalAccount objexp = db.PersonalAccounts.Where(x => x.UID == Id).FirstOrDefault();

                    objexp.Status = 2;
                    if (db.SaveChanges() > 0)
                    {
                        var ListRelation = (from s in db.PersonalAccounts
                                            where s.Status == 1

                                            select
                                           new
                                           {
                                               UID = s.UID,
                                               Date = s.Date,
                                               Receive = s.Receive,
                                               Paid = s.Paid,
                                               Comments = s.Comments,
                                           }).ToList();

                        status = JsonConvert.SerializeObject(ListRelation);
                    }


                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "DailyExpenseController", "Edit");
            }
            return Content(status);
        }
    }
}