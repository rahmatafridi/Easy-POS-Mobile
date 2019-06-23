using PointOfSale.Libraries;
using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
//using WebixoftEHFramework;

namespace PointOfSale.Controllers
{
    public class AuthenticationController : GlobalController
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Login()
        {
            Session.Clear();
            return View();
        }

        public ActionResult Logout()
        {
            Session.Clear();
            return RedirectToActionPermanent("Login");
        }

        public ActionResult UserLogin(string username, string password)
        {
            SiteUser = null;
            try
            {
                password = ApplicationSecurity.Encrypt(password);
                
                User u = db.Users.Where(b => b.UserName == username && b.Password == password && b.IsActive == true).FirstOrDefault();

                if (u != null) 
                {
                    SiteUser = u;
                    UserPermissions = db.GetUserPermissions(u.Id).ToList();
                    if (u.UserTypeId == 1) // 1 For Regular User; 2 For Admin; 3 For Super Admin
                    {
                        return RedirectToAction("Index", "UserDashboard");
                    }
                    else
                    {
                        return RedirectToAction("Index", "AdminDashboard");
                    }
                }
            }
            catch (Exception ex)
            {                
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "AuthenticationController", "UserLogin");
            }
            return RedirectToAction("Login");
        }
    }
}