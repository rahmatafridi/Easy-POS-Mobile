using PointOfSale.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PointOfSale.Controllers
{
    public class UserRightsController : GlobalController
    
    {
        private PointOfSaleEntities db = new PointOfSaleEntities();
        // GET: UserRights
        public ActionResult Index(Guid UID)
        {
            if (!Authenticated) { return RedirectToAction("Login", "Authentication"); }
            if (!UserHavePermission("UserManagement")) {
                if (SiteUser.UserTypeId == 1)
                {
                    return RedirectToAction("Index", "UserDashboard");
                }
                else
                {
                    return RedirectToAction("Index", "AdminDashboard");
                }
            }

            try
            {
                User u = db.Users.Single(x => x.UID == UID);
                long UserID = u.Id;
                List<AvailablePermission> RightsAssigned = GetUserPermissionsObject(UserID);
                ViewBag.Assigned = RightsAssigned;

                ViewBag.user = u;
                List<AvailablePermission> forms = db.AvailablePermissions.Where(x => x.IsActive.Value).ToList();
                ViewBag.AvForms = forms;
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "UserRightsController", "Index");
            }
            return View();
        }
        [HttpPost]
        public string Save(int[] sel, int UserID)
        {
            string status = "Error";

            try
            {
                if (UserID > 0)
                {
                    List<AssignedPermission> asigned = db.AssignedPermissions.Where(x => x.UserId == UserID).ToList();
                    db.AssignedPermissions.RemoveRange(asigned);

                    List<AssignedPermission> NewPermissions = new List<AssignedPermission>();
                    foreach (int i in sel)
                    {
                        AssignedPermission a = new AssignedPermission();
                        a.CreatedBy = ActiveUserId;
                        a.CreatedOn = DateTime.Now;
                        a.PermissionId = i;
                        a.UserId = UserID;
                        a.UID = Guid.NewGuid();
                        NewPermissions.Add(a);
                    }
                    db.AssignedPermissions.AddRange(NewPermissions);
                    if (db.SaveChanges() > 0)
                    {
                        status = "Success";
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationExceptionLogging(ex.ToString(), ex.StackTrace, "UserRightsController", "Save");


            }
            return status;
        }


    }
}