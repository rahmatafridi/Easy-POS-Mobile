using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using PointOfSale.Models;

namespace PointOfSale.Helpers
{
    public static class CustomHtmlHelpers
    {
        public static string IsSelected(this HtmlHelper html, string controller = null, string action = null)
        {
            string cssClass = "active";
            string currentAction = (string)html.ViewContext.RouteData.Values["action"];
            string currentController = (string)html.ViewContext.RouteData.Values["controller"];

            if (String.IsNullOrEmpty(controller))
                controller = currentController;

            if (String.IsNullOrEmpty(action))
                action = currentAction;

            return controller == currentController && action == currentAction ?
                cssClass : String.Empty;
        }

        public static User ActiveUserInfo(this HtmlHelper html)
        {
            User u = new User();
            try
            {
                u = HttpContext.Current.Session["ActiveUser"] as User;
            }
            catch { }
            return u;
        }

        public static bool IsUserSuperAdmin(this HtmlHelper html)
        {
            bool IsAdmin = false;

            User u = (User)HttpContext.Current.Session["ActiveUser"];

            if (u != null)
            {
                if (u.UserTypeId == 3)
                {
                    IsAdmin = true;
                }
            }
            return IsAdmin;
        }



        public static bool UserHavePermission(this HtmlHelper html, string Role)
        {
            bool IsPer = false;
            try
            {
                List<string> rights = HttpContext.Current.Session["ActiveUserPermissions"] as List<string>;
                if (rights.Any(x => x.Equals(Role)))
                {
                    IsPer = true;
                }
            }
            catch
            { }
            return IsPer;
        }
    }
}