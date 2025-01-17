﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PointOfSale.Models;
using Newtonsoft.Json;

namespace PointOfSale.Controllers
{
    public class BarcodeManagementController : GlobalController
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: BarcodeManagement
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }

        public ActionResult LoadColors()
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
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ItemManagementController", "LoadCategories");
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
                    //var item = (from i in db.Items
                    //            join
                    //            c in db.Categories
                    //            on
                    //            i.CategoryId equals c.Id
                    //            join
                    //            sc in db.SubCategories
                    //            on
                    //            i.SubCategoryId equals sc.Id
                    //            join
                    //            u in db.UnitOfMeasures
                    //            on
                    //            i.UomId equals u.Id
                    //            select
                    //            new
                    //            {
                    //                UID = i.UID,
                    //                Name = i.Name,
                    //                Barcode = i.Barcode,
                    //                CategoryName = c.Name,
                    //                SubCategoryName = sc.Name,
                    //                UomName = u.Name,
                    //                Comment = i.Description,
                    //            });

                    var item = db.LoadProductBarcode();

                    status = JsonConvert.SerializeObject(item);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "BarcodeManagement", "LoadGrid");
            }
            return Content(status);
        }

        public ActionResult ItemByUidForBarcode(Guid Id)
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
                    var obj = from i in db.Items
                              join
                              c in db.Categories
                              on i.CategoryId equals c.Id
                              join
                              u in db.UnitOfMeasures
                              on i.UomId equals u.Id
                              where i.UID == Id
                              select
                              new
                              {
                                  UID = i.UID,
                                  ItemName = i.Name,
                                  Barcode = i.Barcode,
                                  CategoryName = c.Name,
                                
                                  Uom = u.Name,
                              };

                    status = JsonConvert.SerializeObject(obj);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "BarcodeManagement", "ItemByUid");
            }
            return Content(status);
        }

        public ActionResult ItemByUid(Guid Id)
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
                    var obj = from b in db.Barcodes
                              join
                              c in db.Categories
                              on b.CategoryId equals c.Id
                              
                              join
                              i in db.Items
                              on b.ItemId equals i.Id
                              where b.UID == Id
                              select
                              new
                              {
                                  UID=b.UID,
                                  ItemName = i.Name,
                                  Barcode = b.Barcode1,
                                  CategoryName = c.Name,
                               
                                  

                              };
                    
                    status = JsonConvert.SerializeObject(obj);

                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "BarcodeManagement", "ItemByUid");
            }
            return Content(status);
        }

        public ActionResult AddBarcode(AddBarcode objitem)
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
                    var checkbarcode = db.Barcodes.Where(x => x.Barcode1 == objitem.Barcode).ToList();
                    if(checkbarcode.Count <1)
                    {
                        checkbarcode = null;
                    }
                    if (checkbarcode == null)
                    { 

                    Item objItemss = db.Items.Where(x => x.UID == objitem.UID).SingleOrDefault();
                        if (objItemss != null)
                        {
                            Barcode objBrcode = new Barcode();

                            objBrcode.ItemId = objItemss.Id;
                            objBrcode.ColorId = objitem.ColorId;
                            objBrcode.CategoryId = (int)objItemss.CategoryId;
                        //    if (objItemss.SubCategoryId == 0 || objItemss.SubCategoryId == null)
                        //    {
                        //        objBrcode.SubCategoryId = "NULL";
                        //    }
                               
                        //objBrcode.SubCategoryId = (int)objItemss.SubCategoryId;
                        objBrcode.BarcodeType = (int)objitem.BarcodeType;
                        objBrcode.Barcode1 = objitem.Barcode;
                        objBrcode.UID = Guid.NewGuid();
                        objBrcode.CreatedBy = ActiveUserId;
                        objBrcode.CreatedOn = DateTime.Now;
                        objBrcode.UpdatedBy = SiteUser.Id;
                        objBrcode.UpdatedOn = DateTime.Now;

                        db.Barcodes.Add(objBrcode);
                        if (db.SaveChanges() > 0)
                        {
                            status = JsonConvert.SerializeObject(db.LoadProductBarcode());
                        }
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
                ApplicationExceptionLogging(ex.Message, ex.StackTrace, "ItemManagementController", "AddBarcode");
            }

            return Content(status);
        }

        public ActionResult PrintBarcodeIndex()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }

            return View();
        }

        public ActionResult PrintBarcode()
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
                    var item = db.LoadProductBarcodeForPrint();

                    status = JsonConvert.SerializeObject(item);
                }
            }
            catch (Exception ex)
            {

                throw;
            }   
            return Content(status);
        }
    }
}