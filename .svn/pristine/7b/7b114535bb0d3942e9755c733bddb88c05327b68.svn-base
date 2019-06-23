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
    public class UnitOfMeasureManagementController : GlobalController
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: UnitOfMeasureManagement
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            return View();
        }
        public ActionResult LoadGrid()
        {
            string status = "error";
            //if (IsAdminUser)
            //{
            try
            {
                if (!Authenticated)
                {
                    status = "SESSION EXPIRED";
                }
                else
                {

                    List<UnitOfMeasure> objListdata = db.UnitOfMeasures.ToList();
                    status = Newtonsoft.Json.JsonConvert.SerializeObject(objListdata);
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "UnitOfMeasureManagementController", "GenerateCode");
            }
            //}
            return Content(status);
        }

        public ActionResult GenerateCode()
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

                    List<UnitOfMeasure> objListClient = db.UnitOfMeasures.ToList();

                    var TRecords = objListClient.Count();
                    TRecords += 1;

                    var Code = TRecords.ToString().PadLeft(5, '0');

                    status = Code;
                    //}
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "CategoryController", "GenerateCode");
            }
            return Content(status);
        }

        public ActionResult EditUnitOfMeasure(UnitOfMeasure objdata)
        {
            string status = "error";
            //if (IsAdminUser)
            //{
            try
            {
                if (!Authenticated)
                {
                    status = "SESSION EXPIRED";
                }
                else
                {
                    var objUom = db.UnitOfMeasures.Where(x => x.Name == objdata.Name).ToList();
                    if (objUom.Count < 1)
                    {
                        objUom = null;
                    }
                    if (objUom == null)
                    {
                        UnitOfMeasure obj = db.UnitOfMeasures.FirstOrDefault(x => x.UID == objdata.UID);
                        if (obj.IsAssigned != true)
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
                        UnitOfMeasure obj = db.UnitOfMeasures.FirstOrDefault(x => x.UID == objdata.UID);
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
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "UnitOfMeasureManagementController", "EditUnitOfMeasure");
            }
            //}
            return Content(status);
        }
        public ActionResult Edit(Guid UID)
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

                    UnitOfMeasure obj = db.UnitOfMeasures.FirstOrDefault(x => x.UID == UID);
                    status = JsonConvert.SerializeObject(obj);
                    //}
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "UnitOfMeasureManagementController", "Edit");
            }
            return Content(status);
        }
        public ActionResult AddUnitOfMeasure(UnitOfMeasure objtest)
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
                    var objUom = db.UnitOfMeasures.Where(x => x.Name == objtest.Name).ToList();
                    if (objUom.Count < 1)
                    {
                        objUom = null;
                    }
                    if (objUom == null)
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

                        UnitOfMeasure obj = db.UnitOfMeasures.FirstOrDefault();
                        db.UnitOfMeasures.Add(objtest);
                        if (db.SaveChanges() > 0)
                        {
                            status = Newtonsoft.Json.JsonConvert.SerializeObject(objtest);
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
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "UnitOfMeasureManagementController", "AddUnitOfMeasure");
            }
            //}
            return Content(status);
        }
    }
}