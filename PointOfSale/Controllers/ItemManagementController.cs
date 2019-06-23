using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PointOfSale.Models;
using Newtonsoft.Json;

namespace PointOfSale.Controllers
{
    public class ItemManagementController : GlobalController
    {
        PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: ItemManagement
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
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
                    var count = db.Items.Count() + 1;
                    var code = count.ToString().PadLeft(5, '0');
                    status = code;
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ItemManagementController", "CodeGenerate");
            }
            return Content(status);
        }

        public ActionResult LoadBarcode()
        {
            string status = "error";
            try
            {
                if (Authenticated)
                {
                    Random generator = new Random();
                    long r = generator.Next(1, 10000000);
                    List<Item> lstItem = db.Items.ToList();
                    foreach (Item item in lstItem)
                    {
                        while (r == long.Parse(item.Code))
                        {
                            r = generator.Next(1, 1000000);
                        }
                    }

                    var Code = r.ToString().PadLeft(8, '0');


                    status = Code;
                }
                else
                {
                    status = "SESSION EXPIRED";
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "ItemManagementController", "LoadBarcode");

            }
            return Content(status);
        }
        public ActionResult AddItem(Item objitem)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "SESSION EXPIRED";
                }
                else if (objitem.SalePrice < objitem.CostPrice)
                {
                    status = "costgreaterthansale";
                }
                else
                {
                    var objExist = db.Items.Where(x => x.Name == objitem.Name && x.CategoryId==objitem.CategoryId && x.SubCategoryId==objitem.SubCategoryId).ToList();
                    if (objExist.Count < 1)
                    {
                        objExist = null;
                    }
                    if (objExist == null)
                    {
                        if (objitem.IsActive == null)
                        {
                            objitem.IsActive = false;
                        }
                        if(objitem.SubCategoryId==0 || objitem.SubCategoryId==null)
                        {
                            objitem.SubCategoryId = null;
                        }
                        objitem.UID = Guid.NewGuid();
                        objitem.CreatedBy = ActiveUserId;
                        objitem.CreatedOn = DateTime.Now;
                        db.Items.Add(objitem);
                        if (db.SaveChanges() > 0)
                        {
                            var item = db.GetItemByUID(objitem.UID);
                            status = JsonConvert.SerializeObject(item);
                            //Assigned true to size ,uom and color that use in this item
                            var objSize = db.Sizes.Where(x => x.Id == objitem.SizeId).SingleOrDefault();
                            var objUom = db.UnitOfMeasures.Where(x => x.Id == objitem.UomId).SingleOrDefault();
                            var objColor = db.Colors.Where(x => x.Id == objitem.ColorId).SingleOrDefault();
                            var objCategory = db.Categories.Where(x => x.Id == objitem.CategoryId).SingleOrDefault();
                            var objSubCategory = db.SubCategories.Where(x => x.Id == objitem.SubCategoryId).SingleOrDefault();
                            objSize.IsAssigned = true;
                            objUom.IsAssigned = true;
                            objColor.IsAssigned = true;
                            objCategory.IsAssigned = true;
                           objSubCategory.IsAssigned = true;
                            db.SaveChanges();
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
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ItemManagementController", "AddItem");
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
                    var item = db.Items.Where(i => i.UID == Id).SingleOrDefault();
                    status = JsonConvert.SerializeObject(item);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ItemManagementController", "Edit");
            }
            return Content(status);
        }

        public ActionResult EditItem(Item objitem)
        {
            var status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "SESSION EXPIRED";
                }
                else if (objitem.SalePrice < objitem.CostPrice)
                {
                    status = "costgreaterthansale";
                }
                else
                {
                    var objExist = db.Items.Where(x => x.Name == objitem.Name && x.UID != objitem.UID && x.CategoryId==objitem.CategoryId && x.SubCategoryId==objitem.SubCategoryId).ToList();
                    if (objExist.Count < 1)
                    {
                        objExist = null;
                    }
                    if (objExist == null)
                    {
                        var item = db.Items.Where(x => x.UID == objitem.UID).SingleOrDefault();
                        if (item.IsAssigned != true)
                        {
                            if (objitem.IsActive == null)
                            {
                                objitem.IsActive = true;
                            }
                            item.Name = objitem.Name;
                            item.Description = objitem.Description;
                            item.IsActive = objitem.IsActive;
                            item.SizeId = objitem.SizeId;
                            item.ColorId = objitem.ColorId;
                            item.UomId = objitem.UomId;
                            item.CategoryId = objitem.CategoryId;
                            item.SubCategoryId = objitem.SubCategoryId;
                            if(objitem.SubCategoryId==0 || objitem.SubCategoryId==null)
                            {
                                item.SubCategoryId = null;
                            }
                            item.CostPrice = objitem.CostPrice;
                            item.SalePrice = objitem.SalePrice;

                            item.UpdatedBy = ActiveUserId;
                            item.UpdatedOn = DateTime.Now;
                            if (db.SaveChanges() > 0)
                            {
                                var str = db.GetItemByUID(item.UID);
                                status = JsonConvert.SerializeObject(str);
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
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ItemManagementController", "EditItem");
            }
            return Content(status);
        }

        public ActionResult LoadCategories()
        {
            var status = "error";
            try
            {
                if (!Authenticated) { status = "SESSION EXPIRED"; }
                else
                {
                    var list = db.Categories.Where(x => x.IsActive == true).ToList();
                    status = JsonConvert.SerializeObject(list);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ItemManagementController", "LoadCategories");
            }
            return Content(status);
        }


        public ActionResult LoadSize()
        {
            var status = "error";
            try
            {
                if (!Authenticated) { status = "SESSION EXPIRED"; }
                else
                {
                    var list = db.Sizes.Where(x => x.IsActive == true ).ToList();
                    status = JsonConvert.SerializeObject(list);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ItemManagementController", "LoadSize");
            }
            return Content(status);
        }

        public ActionResult LoadSubCategory(int CatId)
        {
            var status = "error";
            try
            {
                if (!Authenticated) { status = "SESSION EXPIRED"; }
                else
                {
                    var list = db.SubCategories.Where(x => x.IsActive == true && x.CategoryId == CatId).ToList();
                    status = JsonConvert.SerializeObject(list);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ItemManagementController", "LoadSubCategory");
            }
            return Content(status);
        }


        public ActionResult LoadColor()
        {
            var status = "error";
            try
            {
                if (!Authenticated) { status = "SESSION EXPIRED"; }
                else
                {
                    var list = db.Colors.Where(x => x.IsActive == true).ToList();
                    status = JsonConvert.SerializeObject(list);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ItemManagementController", "LoadColor");
            }
            return Content(status);
        }

        public ActionResult LoadUom()
        {
            var status = "error";
            try
            {
                if (!Authenticated) { status = "SESSION EXPIRED"; }
                else
                {
                    var list = db.UnitOfMeasures.Where(x => x.IsActive == true).ToList();
                    status = JsonConvert.SerializeObject(list);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ItemManagementController", "LoadUom");
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
                    var item = db.GetAllItem();
                    status = JsonConvert.SerializeObject(item);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ItemManagement", "LoadGrid");
            }
            return Content(status);
        }

    }
}