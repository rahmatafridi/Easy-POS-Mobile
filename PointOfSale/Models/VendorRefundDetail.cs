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
    
    public partial class VendorRefundDetail
    {
        public int Id { get; set; }
        public Nullable<int> VRMId { get; set; }
        public Nullable<int> RItemId { get; set; }
        public string RBarcode { get; set; }
        public Nullable<int> RUomId { get; set; }
        public Nullable<decimal> RQty { get; set; }
        public Nullable<decimal> RPrice { get; set; }
        public Nullable<decimal> RAmount { get; set; }
        public Nullable<System.Guid> UID { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
        public Nullable<System.DateTime> UpdatedOn { get; set; }
        public string CreatedByIP { get; set; }
        public string UpdatedByIP { get; set; }
    }
}
