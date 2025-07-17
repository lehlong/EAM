using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.TRAN
{
    [Table("EAM_TRAN_ORDER_VT")]
    public class TblTranOrderVt : SoftDeleteEntity
    {
        [Key]
        [Column("ID")]
        public string Id { get; set; }

        [Column("AUFNR")]
        public string? Aufnr { get; set; }

        [Column("CATEGORY")]
        public string? Category { get; set; }

        [Column("MATNR")]
        public string? Matnr { get; set; }

        [Column("MAKTX")]
        public string? Maktx { get; set; }

        [Column("WERKS")]
        public string? Werks { get; set; }

        [Column("BUDAT")]
        public DateTime? Budat { get; set; }

        [Column("MENGE")]
        public decimal? Menge { get; set; }

        [Column("MEINS")]
        public string? Meins { get; set; }

        [Column("CATEGORY2")]
        public string? Category2 { get; set; }

        [Column("LGORT")]
        public string? Lgort { get; set; }

        [Column("CHARG")]
        public string? Charg { get; set; }

        [Column("PRICE")]
        public decimal? Price { get; set; }

        [Column("DMBTR")]
        public decimal? Dmbtr { get; set; }

        [Column("WAERS")]
        public string? Waers { get; set; }

        [Column("UNAME")]
        public string? Uname { get; set; }

        [Column("UDAT")]
        public DateTime? Udat { get; set; }

        [Column("INVENTORY")]
        public int? Inventory { get; set; }

    }
}
