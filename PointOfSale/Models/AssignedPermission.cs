//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PointOfSale.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class AssignedPermission
    {
        public long Id { get; set; }
        public Nullable<long> UserId { get; set; }
        public Nullable<long> PermissionId { get; set; }
        public Nullable<long> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
        public Nullable<System.Guid> UID { get; set; }
    }
}
