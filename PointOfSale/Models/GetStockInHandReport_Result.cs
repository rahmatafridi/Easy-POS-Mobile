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
    
    public partial class GetStockInHandReport_Result
    {
        public int Id { get; set; }
        public string ItemName { get; set; }
        public string Barcode { get; set; }
        public string CategoryName { get; set; }
        public string SubCategoryName { get; set; }
        public decimal CostPrice { get; set; }
        public decimal SalePrice { get; set; }
        public Nullable<decimal> Quantity { get; set; }
        public Nullable<decimal> PurchaseQty { get; set; }
        public Nullable<decimal> SoldQty { get; set; }
    }
}