﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.TRAN
{
    [Table("EAM_TRAN_ORDER_VT")]
    public class TblTranOrderVt : SoftDeleteEntity
    {
        [Key]
        [Column("AUFNR")]
        [MaxLength(12)]
        public string? Aufnr { get; set; }

        [Column("CATEGORY")]
        [MaxLength(1)]
        public string? Category { get; set; }

        [Column("MATNR")]
        [MaxLength(18)]
        public string? Matnr { get; set; }

        [Column("MAKTX")]
        [MaxLength(255)]
        public string? Maktx { get; set; }

        [Column("WERKS")]
        [MaxLength(4)]
        public string? Werks { get; set; }

        [Column("BUDAT")]
        public DateTime? Budat { get; set; }

        [Column("MENGE")]
        public decimal? Menge { get; set; }

        [Column("MEINS")]
        [MaxLength(3)]
        public string? Meins { get; set; }

        [Column("CATEGORY2")]
        [MaxLength(1)]
        public string? Category2 { get; set; }

        [Column("LGORT")]
        [MaxLength(4)]
        public string? Lgort { get; set; }

        [Column("CHARG")]
        [MaxLength(10)]
        public string? Charg { get; set; }

        [Column("PRICE")]
        public decimal? Price { get; set; }

        [Column("DMBTR")]
        public decimal? Dmbtr { get; set; }

        [Column("WAERS")]
        [MaxLength(5)]
        public string? Waers { get; set; }

        [Column("UNAME")]
        [MaxLength(12)]
        public string? Uname { get; set; }

        [Column("UDAT")]
        public DateTime? Udat { get; set; }

        // Các trường IS_ACTIVE, CREATE_BY, etc. được kế thừa từ SoftDeleteEntity
    }
}
