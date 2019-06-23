using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PointOfSale.Models;
using Newtonsoft.Json;

namespace PointOfSale.Controllers
{
    public class DailyExpensesController : GlobalController
    {
        // GET: DailyExpenses
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        PointOfSaleEntities db = new PointOfSaleEntities();

        public ActionResult AddExpense(DailyExpense dailyexpense)
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

                  
                    dailyexpense.CreatedOn = DateTime.Now;
                    dailyexpense.CreatedBy = ActiveUserId;
                    dailyexpense.UID = Guid.NewGuid();
                    dailyexpense.Status = 1;


                    db.DailyExpenses.Add(dailyexpense);
                    if(db.SaveChanges()>0)
                    {
                        status = JsonConvert.SerializeObject(dailyexpense);

                    }

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CategoryController", "AddCategory");
            }

            return Content(status);
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

                    var prdct = db.DailyExpenses.Where(u => u.UID == Id).SingleOrDefault();
                    status = JsonConvert.SerializeObject(prdct);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "DailyExpenseController", "Edit");
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
                    DailyExpense obj = new DailyExpense();

                    DailyExpense objexp = db.DailyExpenses.Where(x => x.UID == Id).FirstOrDefault();

                    objexp.Status = 2;
                    if(db.SaveChanges()>0)
                    {
                        var ListRelation = (from s in db.DailyExpenses
                                            where s.Status == 1

                                            select
                                           new
                                           {
                                               UID = s.UID,
                                               Date = s.Date,
                                               Amount = s.Amount,
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

        public ActionResult EditExpenses(DailyExpense expenses)
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

                    DailyExpense objexp = db.DailyExpenses.Where(x => x.UID == expenses.UID).FirstOrDefault();

                    objexp.UpdatedOn = DateTime.Now;
                    objexp.UpdatedBy = ActiveUserId;
                    objexp.Date = expenses.Date;
                    objexp.Amount = expenses.Amount;
                    objexp.Comments = expenses.Comments;
                        //db.Entry(size).State = System.Data.Entity.EntityState.Modified;
                        if (db.SaveChanges() > 0)
                        {
                        status = JsonConvert.SerializeObject(objexp);
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
                    var ListRelation = (from s in db.DailyExpenses
                                         where s.Status==1

                                        select
                                       new
                                       {
                                           UID = s.UID,
                                           Date = s.Date,
                                           Amount = s.Amount,
                                           Comments = s.Comments,
                                       }).ToList();


                    status = JsonConvert.SerializeObject(ListRelation);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "DailyExpensesController", "LoadGrid");
            }
            return Content(status);
        }

    }
}