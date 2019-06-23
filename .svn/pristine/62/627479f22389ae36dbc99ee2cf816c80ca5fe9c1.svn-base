using PointOfSale.CustomModels;
using PointOfSale.Libraries;
using PointOfSale.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PointOfSale.Controllers
{
    public class ColorManagementController : GlobalController
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: ColorManagement
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }
        public ActionResult LoadGrid()
        {
            
            string status = "error";

            try
            {
                if (!Authenticated)
               {
                    status = "SESSION EXPIRED";
                }
                else
                {

                    List<Color> objListdata = db.Colors.ToList();
                    status = Newtonsoft.Json.JsonConvert.SerializeObject(objListdata);
                }
               }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "ColorManagementController", "LoadGrid");
            }

            return Content(status);
        }

        public ActionResult GenerateCode()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            string status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "SESSION EXPIRED";
                }
                else
                {

                    List<Color> objListClient = db.Colors.ToList();

                var TRecords = objListClient.Count();
                TRecords += 1;

                var Code = TRecords.ToString().PadLeft(5, '0');

                status = Code;
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "ColorManagementController", "GenerateCode");
            }
            return Content(status);
        }

        public ActionResult EditColor(Color objdata)
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            string status = "error";

            try
            {
                if (!Authenticated)
                {
                    status = "SESSION EXPIRED";
                }
                else
                {
                    var objColor = db.Colors.Where(x => x.Name == objdata.Name && x.UID!=objdata.UID).ToList();
                    if (objColor.Count < 1)
                    {
                        objColor = null;
                    }
                    if (objColor==null)
                    {
                        Color obj = db.Colors.FirstOrDefault(x => x.UID == objdata.UID);

                      
                        if (obj.IsAssigned!=true)
                        {
                            obj.Code = objdata.Code;
                            obj.Name = objdata.Name;
                            if (objdata.IsActive == null)
                            {
                                objdata.IsActive = false;
                            }
                            obj.IsActive = objdata.IsActive;

                            obj.UpdatedBy = ActiveUserId;
                            obj.UpdatedOn = DateTime.Now;

                            if (db.SaveChanges() > 0)
                            {
                                status = JsonConvert.SerializeObject(obj);
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
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "ColorManagementController", "EditColor");
            }

            return Content(status);
        }
        public ActionResult Edit(Guid UID)
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            string status = "error";
            try
            {
                if (!Authenticated)
                {
                    status = "SESSION EXPIRED";
                }
                else
                {

                    Color obj = db.Colors.FirstOrDefault(x => x.UID == UID);
                    status = JsonConvert.SerializeObject(obj);
                }
               }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "ColorManagementController", "Edit");
            }
            return Content(status);
        }
        public ActionResult AddColor(Color objtest)
        {

            string status = "error";
            
            try
            {
                if (!Authenticated)
                {
                    status = "SESSION EXPIRED";
                }
                else
                {
                    var objColor = db.Colors.Where(x => x.Name == objtest.Name).ToList();
                    if (objColor.Count < 1)
                    {
                        objColor = null;
                    }
                    if (objColor==null)
                    {
                        if (objtest.IsActive == null)
                        {
                            objtest.IsActive = false;
                        }
                        objtest.UID = Guid.NewGuid();
                        objtest.CreatedOn = DateTime.Now;
                        objtest.CreatedBy = ActiveUserId;
                        objtest.UpdatedOn = DateTime.Now;
                        objtest.UpdatedBy = ActiveUserId;

                        Color obj = db.Colors.FirstOrDefault();
                        db.Colors.Add(objtest);
                        if (db.SaveChanges() > 0)
                        {
                            status = JsonConvert.SerializeObject(objtest);
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
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "ColorManagementController", "AddColor");
            }

            return Content(status);
        }
    }
}