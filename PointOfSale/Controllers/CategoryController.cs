using Logger;
using Newtonsoft.Json;
using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PointOfSale.Controllers
{
    public class CategoryController : GlobalController
    {
        private ILog _ILog;
        PointOfSaleEntities db = new PointOfSaleEntities();

        public CategoryController()
        {
            _ILog = Log.GetInstance;
        }

        //protected override void OnException(ExceptionContext filterContext)
        //{
        //    _ILog.LogException(filterContext.Exception.ToString());
        //    filterContext.ExceptionHandled = true;
        //    this.View("Error").ExecuteResult(this.ControllerContext);
        //}

        // GET: Product
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }



        public ActionResult AddCategory(Category category)
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
                    var objCategory = db.Categories.Where(x => x.Name == category.Name).ToList();
                    if (objCategory.Count < 1)
                    {
                        objCategory = null;
                    }
                    if (objCategory == null)
                    {

                        if (category.IsActive == null)
                        {
                            category.IsActive = false;
                        }
                        category.CreatedOn = DateTime.Now;
                        category.UID = Guid.NewGuid();
                        category.CreatedBy = ActiveUserId;

                        db.Categories.Add(category);
                        db.SaveChanges();
                        status = JsonConvert.SerializeObject(category);
                    }
                    else
                    {
                        status = "exist";
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CategoryController", "AddCategory");
            }

            return Content(status);
        }

        public ActionResult CodeGenerate()
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

                    var count = db.Categories.Count() + 1;
                    var code = count.ToString().PadLeft(5, '0');
                    status = code;
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CategoryController", "CodeGenerate");
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

                    var prdct = db.Categories.Where(u => u.UID == Id).SingleOrDefault();
                    status = JsonConvert.SerializeObject(prdct);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CategoryController", "Edit");
            }
            return Content(status);
        }

        public ActionResult EditCat(Category category)
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
                    var objExist = db.Categories.Where(x => x.Name == category.Name && x.UID != category.UID).ToList();
                    if (objExist.Count < 1)
                    {
                        objExist = null;
                    }
                    if (objExist == null)
                    {
                        Category objCategory = db.Categories.Where(x => x.UID == category.UID).FirstOrDefault();

                        if (objCategory.IsAssigned != true)
                        {
                            if (category.IsActive == null)
                            {
                                category.IsActive = false;
                            }
                            objCategory.UpdatedOn = DateTime.Now;
                            objCategory.UpdatedBy = ActiveUserId;
                            objCategory.Name = category.Name;
                            objCategory.IsActive = category.IsActive;

                            //db.Entry(category).State = System.Data.Entity.EntityState.Modified;
                            db.SaveChanges();
                            status = JsonConvert.SerializeObject(category);
                        }
                        else
                        {
                            status = "assigned";
                        }
                    }

                    else
                    {
                        status = "exist";
                    }

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CategoryController", "EditCat");
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

                    var List = db.Categories.ToList();
                    status = JsonConvert.SerializeObject(List);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "CategoryController", "LoadGrid");
            }
            return Content(status);
        }

    }
}