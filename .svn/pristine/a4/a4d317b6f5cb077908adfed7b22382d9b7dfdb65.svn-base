using Newtonsoft.Json;
using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace PointOfSale.Controllers
{
    public class SizeController : GlobalController
    {

        PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: Product
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult AddSize(Size size)
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
                    var objSize = db.Sizes.Where(x => x.Name == size.Name).ToList();
                    if (objSize.Count < 1)
                    {
                        objSize = null;
                    }
                    if (objSize == null)
                    {
                        if (size.IsActive == null)
                        {
                            size.IsActive = false;
                        }
                        size.CreatedOn = DateTime.Now;
                        size.UID = Guid.NewGuid();
                        size.CreatedBy = ActiveUserId;

                        db.Sizes.Add(size);

                        if (db.SaveChanges() > 0)
                        {
                            var ListRelation = (from s in db.Sizes
                                                where s.UID==size.UID

                                                select
                                               new
                                               {
                                                   UID = s.UID,
                                                   Name = s.Name,
                                                   Code = s.Code,
                                                   IsActive = s.IsActive
                                               });
                          

                            status = JsonConvert.SerializeObject(ListRelation);
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
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "SizeController", "AddSize");
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

                    var count = db.Sizes.Count() + 1;
                    var code = count.ToString().PadLeft(5, '0');
                    status = code;
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "SizeController", "CodeGenerate");
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

                    var prdct = db.Sizes.Where(u => u.UID == Id).SingleOrDefault();
                    status = JsonConvert.SerializeObject(prdct);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "SizeController", "Edit");
            }
            return Content(status);
        }

        public ActionResult EditSize(Size size)
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
                    var objExist = db.Sizes.Where(x => x.Name == size.Name && x.UID != size.UID).ToList();
                    if (objExist.Count < 1)
                    {
                        objExist = null;
                    }
                    if (objExist == null)
                    {
                        Size objSize = db.Sizes.Where(x => x.UID == size.UID).FirstOrDefault();
                        if (objSize.IsAssigned != true || objSize.IsAssigned==true || objSize.IsAssigned==null)
                        {
                            if (size.IsActive == null)
                            {
                                size.IsActive = false;
                            }
                            objSize.UpdatedOn = DateTime.Now;
                            objSize.UpdatedBy = ActiveUserId;
                            objSize.CategoryId = size.CategoryId;
                            objSize.Name = size.Name;
                            objSize.IsActive = size.IsActive;
                            //db.Entry(size).State = System.Data.Entity.EntityState.Modified;
                            if (db.SaveChanges() > 0)
                            {
                                var ListRelation = (from s in db.Sizes
                                                  where s.UID==size.UID
                                                    select
                                                   new
                                                   {
                                                       UID = s.UID,
                                                       Name = s.Name,
                                                       Code = s.Code,
                                                       IsActive = s.IsActive
                                                   });
                                status = JsonConvert.SerializeObject(ListRelation);
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
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "SizeController", "EditCat");
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
                    var ListRelation = (from s in db.Sizes
                                  
                                        select
                                       new
                                       {
                                           UID = s.UID,
                                           Name = s.Name,
                                           Code = s.Code,
                                         
                                           IsActive = s.IsActive
                                       }).ToList();
                    status = JsonConvert.SerializeObject(ListRelation);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "SizeController", "LoadGrid");
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
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "SizeController", "LoadGrid");
            }
            return Content(status);
        }

    }
}