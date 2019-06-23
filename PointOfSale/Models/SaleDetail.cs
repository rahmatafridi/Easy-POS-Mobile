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
    
    public partial class SaleDetail
    {
        public int Id { get; set; }
        public Nullable<int> SMId { get; set; }
        public Nullable<int> ItemId { get; set; }
        public string Barcode { get; set; }
        public Nullable<int> UomId { get; set; }
        public Nullable<decimal> Qty { get; set; }
        public Nullable<decimal> Price { get; set; }
        public Nullable<decimal> Amount { get; set; }
        public Nullable<decimal> Discount { get; set; }
        public Nullable<decimal> AmountAfterDiscount { get; set; }
        public Nullable<System.Guid> UID { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
        public Nullable<System.DateTime> UpdatedOn { get; set; }
        public Nullable<bool> RefundStatus { get; set; }
        public Nullable<decimal> RefundQty { get; set; }
        public Nullable<decimal> CostPrice { get; set; }
    }
}