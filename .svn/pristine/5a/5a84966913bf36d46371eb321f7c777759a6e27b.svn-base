using Newtonsoft.Json;
using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PointOfSale.Controllers
{
    public class SubCategoryController : GlobalController
    {
        PointOfSaleEntities db = new PointOfSaleEntities();

        // GET: SubCategory
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult AddSubCategory(SubCategory subcategory)
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
                    if (subcategory.CategoryId > 0)
                    {
                        var objSubCategory = db.SubCategories.Where(x => x.Name == subcategory.Name && x.CategoryId==subcategory.CategoryId).ToList();
                        if (objSubCategory.Count < 1)
                        {
                            objSubCategory = null;
                        }
                        if (objSubCategory == null)
                        {
                            if (subcategory.IsActive == null)
                            {
                                subcategory.IsActive = false;
                            }
                            subcategory.CreatedOn = DateTime.Now;
                            subcategory.UID = Guid.NewGuid();
                            subcategory.CreatedBy = ActiveUserId;

                            db.SubCategories.Add(subcategory);
                            if (db.SaveChanges() > 0)
                            {
                                var item = (from c in db.Categories
                                            join
                                            sc in db.SubCategories
                                            on
                                            c.Id equals sc.CategoryId
                                            
                                            where sc.UID == subcategory.UID
                                            select
                                            new
                                            {
                                                UID = sc.UID,                                                
                                                Code = sc.Code,
                                                Name = sc.Name,
                                                CategoryName = c.Name,                                                                                                
                                                Status = sc.IsActive
                                            });
                                status = JsonConvert.SerializeObject(item);
                            }

                        }
                        else
                        {
                            status = "exist";
                        }
                    }
                    else
                    {
                        status = "categorymissing";
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "SubCategoryController", "AddSubCategory");
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

                    var count = db.SubCategories.Count() + 1;
                    var code = count.ToString().PadLeft(5, '0');
                    status = code;
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "SubCategoryController", "CodeGenerate");
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

                    var prdct = db.SubCategories.Where(u => u.UID == Id).SingleOrDefault();
                    status = JsonConvert.SerializeObject(prdct);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "SubCategoryController", "Edit");
            }
            return Content(status);
        }

        public ActionResult EditCat(SubCategory subcategory)
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
                    var objExist = db.SubCategories.Where(x => x.Name == subcategory.Name && x.CategoryId==subcategory.CategoryId && x.UID != subcategory.UID).ToList();
                    if (objExist.Count < 1)
                    {
                        objExist = null;
                    }
                    if (objExist == null)
                    {
                        SubCategory objSubCategory = db.SubCategories.Where(x => x.UID == subcategory.UID).FirstOrDefault();

                        if (objSubCategory.IsAssigned != true)
                        {
                            if (subcategory.IsActive == null)
                            {
                                subcategory.IsActive = false;
                            }
                            objSubCategory.UpdatedOn = DateTime.Now;
                            objSubCategory.UpdatedBy = ActiveUserId;
                            objSubCategory.Name = subcategory.Name;
                            objSubCategory.IsActive = subcategory.IsActive;

                            //db.Entry(category).State = System.Data.Entity.EntityState.Modified;
                            if (db.SaveChanges() > 0)
                            {
                                var item = (from c in db.Categories
                                            join
                                            sc in db.SubCategories
                                            on
                                            c.Id equals sc.CategoryId

                                            where sc.UID == subcategory.UID
                                            select
                                            new
                                            {
                                                UID = sc.UID,
                                                Code = sc.Code,
                                                Name = sc.Name,
                                                CategoryName = c.Name,
                                                Status = sc.IsActive
                                            });
                                status = JsonConvert.SerializeObject(item);
                            }                            
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
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "SubCategoryController", "EditCat");
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
                    var item = (from c in db.Categories
                                join
                                sc in db.SubCategories
                                on
                                c.Id equals sc.CategoryId

                                //where sc.UID == subcategory.UID
                                select
                                new
                                {
                                    UID = sc.UID,
                                    Code = sc.Code,
                                    Name = sc.Name,
                                    CategoryName = c.Name,
                                    Status = sc.IsActive
                                });
                    status = JsonConvert.SerializeObject(item);
                    //var List = db.SubCategories.ToList();
                    //status = JsonConvert.SerializeObject(List);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "SubCategoryController", "LoadGrid");
            }
            return Content(status);
        }

        public ActionResult LoadCategories()
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
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "SubCategoryController", "LoadCategories");
            }
            return Content(status);
        }
    }
}