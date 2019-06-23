using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PointOfSale.Controllers
{
    public class GlobalController : Controller
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();

        public void ApplicationExceptionLogging(string ExceptionMessage, string StackTrace, string Controller, string Method)
        {
            try
            {
                ApplicationLogging al = new ApplicationLogging();

                al.Application = "Point Of Sale";
                al.Message = ExceptionMessage;
                al.StackTrace = StackTrace;
                al.Controller = Controller;
                al.Method = Method;
                al.CreatedOn = DateTime.Now;
                db.ApplicationLoggings.Add(al);
                db.SaveChanges();
            }
            catch
            { }
        }



        public User SiteUser //Get Site User
        {
            set
            {
                Session["ActiveUser"] = value;
            }
            get
            {
                User user = new User();
                user = Session["ActiveUser"] as User;
                return user;
            }
        }
        public List<string> UserPermissions //Get Site User Rights
        {
            set
            {
                Session["ActiveUserPermissions"] = value;
            }
            get
            {
                List<string> p = new List<string>();
                p = Session["ActiveUserPermissions"] as List<string>;
                return p;
            }
        }
        public bool Authenticated
        {
            get
            {
                User u = SiteUser;
                if (u != null)
                {
                    ViewBag.SiteUserName = u.UserName;
                    ViewBag.UserTypeId = u.UserTypeId;

                    //if (u.ProfileImage != "" && !string.IsNullOrEmpty(u.ProfileImage))
                    //{
                    //    ViewBag.SiteUserPic = u.ProfileImage;
                    //}
                    //else
                    //{
                        ViewBag.SiteUserPic = "Images/img.jpg";
                    //}
                }
                return u != null;
            }
        }
        public bool IsAdminUser
        {
            get
            {
                bool Status = false;
                User u = SiteUser;
                if (u != null)
                {
                    if (u.UserTypeId == 2)
                    {
                        Status = true;
                    }
                }
                return Status;
            }
        }
        public int ActiveUserId
        {
            get
            {
                User user = new User();
                user = System.Web.HttpContext.Current.Session["ActiveUser"] as User;
                int UserID = 0;
                if (user != null)
                {
                    UserID = user.Id;
                }
                return UserID;
            }
        }

        public bool UserHavePermission(String Role)
        {
            bool IsPer = false;
            try
            {
                List<string> rights = UserPermissions;

                if (rights.Any(x => x.Equals(Role)))
                {
                    IsPer = true;
                }
            }
            catch
            { }
            return IsPer;
        }

        public List<AvailablePermission> GetUserPermissionsObject(long UserID)
        {
            List<AvailablePermission> FinalList = new List<AvailablePermission>();

            try
            {

                List<AssignedPermission> Rights = db.AssignedPermissions.Where(x => x.UserId == UserID).ToList();

                List<AvailablePermission> role = db.AvailablePermissions.ToList();

                foreach (AvailablePermission r in role)
                {
                    foreach (AssignedPermission ur in Rights)
                    {
                        if (r.Id == ur.PermissionId)
                        {
                            FinalList.Add(r);
                        }
                    }
                }
            }
            catch
            { }
            return FinalList;
        }

    }
}