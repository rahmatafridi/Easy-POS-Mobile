﻿using PointOfSale.CustomModels;
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
    public class UserManagementController : GlobalController
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: User
        public ActionResult Index()
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            if (!UserHavePermission("UserManagement"))
            {
                if (SiteUser.UserTypeId == 1)
                {
                    return RedirectToAction("Index", "UserDashboard");
                }
                else
                {
                    return RedirectToAction("Index", "AdminDashboard");
                }
            }
            return View();
        }

 


        public ActionResult AddUser(User objUser)
        {
            string status = "error";
            //if (Authenticated)
            //{
            try
            {

                User obj = db.Users.Where(x => x.UserName == objUser.UserName).FirstOrDefault();
                

                if (obj != null)
                {
                    status = "exist";
                }
                else
                {
                    if (objUser.IsActive == null)
                    {
                        objUser.IsActive = false;
                    }

                    objUser.Password = ApplicationSecurity.Encrypt(objUser.Password);
                                   

                    objUser.UID = Guid.NewGuid();
                    objUser.CreatedOn = DateTime.Now;
                    objUser.CreatedBy = ActiveUserId;
                    //objUser.UpdatedOn = DateTime.Now;
                    //objUser.UpdatedBy = ActiveUserId;

                    db.Users.Add(objUser);
                    if (db.SaveChanges() > 0)
                    {
                        var str = (from u in db.Users
                                   join
                                   t in db.UserTypeLookups
                                   on u.UserTypeId equals t.Id
                                   where u.Id == objUser.Id
                                   select
                                   new UserGrid
                                   {
                                       UID = u.UID,
                                       Name = u.Name,
                                       UserName = u.UserName,
                                       Email = u.Email,
                                       ContactNo = u.ContactNo,
                                       UserType=t.Name,
                                       IsActive = u.IsActive
                                   }).ToList<UserGrid>();

                        status = Newtonsoft.Json.JsonConvert.SerializeObject(str);
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "UserManagementController", "AddUser");
            }
            //}
            return Content(status);
        }
        public ActionResult LoadGrid()
        {
            string status = "error";
            //if (IsAdminUser)
            //{
            try
            {
                var str = (from u in db.Users
                           join
                            t in db.UserTypeLookups
                            on u.UserTypeId equals t.Id
                           select
                           new UserGrid
                           {
                               UID = u.UID,
                               Name = u.Name,
                               UserName = u.UserName,
                               Email = u.Email,
                               ContactNo = u.ContactNo,
                               UserType = t.Name,
                               IsActive = u.IsActive
                           }).ToList<UserGrid>();

                status = Newtonsoft.Json.JsonConvert.SerializeObject(str);
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "UserManagementController", "LoadGrid");
            }
            //}
            return Content(status);
        }
        public ActionResult EditUser(User objUser)
        {
            string status = "error";
            //if (IsAdminUser)
            //{
            try
            {
                User obj = db.Users.FirstOrDefault(x => x.UID == objUser.UID);
               
                obj.Name = objUser.Name;
                
                obj.Password = ApplicationSecurity.Encrypt(objUser.Password);
                obj.ContactNo = objUser.ContactNo;
                obj.Email = objUser.Email;
                obj.Address = objUser.Address;
                if (objUser.IsActive == null)
                {
                    objUser.IsActive = false;
                }
                obj.IsActive = objUser.IsActive;

                obj.UpdatedBy = ActiveUserId;
                obj.UpdatedOn = DateTime.Now;

                User NewObj = db.Users.Where(x => x.UserName == obj.UserName && x.Id != obj.Id).FirstOrDefault();
                if (NewObj == null)
                {
                    if (db.SaveChanges() > 0)
                    {
                        var str = (from u in db.Users
                                   join
                                   t in db.UserTypeLookups
                                   on u.UserTypeId equals t.Id
                                   where u.Id == obj.Id
                                   select
                                   new UserGrid
                                   {
                                       UID = u.UID,
                                       Name = u.Name,
                                       UserName = u.UserName,
                                       Email = u.Email,
                                       ContactNo = u.ContactNo,
                                       UserType = t.Name,
                                       IsActive = u.IsActive
                                   }).ToList<UserGrid>();
                        status = Newtonsoft.Json.JsonConvert.SerializeObject(str);
                    }
                }
                else
                {
                    status = "exist";
                }

            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "UserManagementController", "EditUser");
            }
            //}
            return Content(status);
        }

        public ActionResult Edit(Guid UID)
        {
            string status = "error";
            try
            {
                //if (UserHavePermission("FabricManagement"))
                //{
                User obj = db.Users.FirstOrDefault(x => x.UID == UID);

                obj.Password = ApplicationSecurity.Decrypt(obj.Password);

                status = JsonConvert.SerializeObject(obj);
                //}
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "UserManagementController", "Edit");
            }
            return Content(status);
        }
        
        public ActionResult LoadUserType()
        {

            string status = "0:{choose}";
            try
            {
                List<UserTypeLookup> lstUserType = db.UserTypeLookups.ToList();
                status = JsonConvert.SerializeObject(lstUserType);
            }
            catch (Exception ex)
            {

                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "UserManagementController", "LoadUserType");
            }
            return Content(status);
        }
    }
}