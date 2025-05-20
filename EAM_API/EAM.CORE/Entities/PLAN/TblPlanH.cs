using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.PLAN
{
    [Table("EAM_PLAN_H")]
    public class TblPlanH : SoftDeleteEntity
    {
        [Key]
        [Column("WARPL")]
        public string Warpl { get; set; }

        [Column("IWERK")]
        public string? Iwerk { get; set; }

        [Column("WPTXT")]
        public string? Wptxt { get; set; }

        [Column("MPTYP")]
        public string? Mptyp { get; set; }

        [Column("MPGRP")]
        public string? Mpgrp { get; set; }

        [Column("CYCTYPE")]
        public string? Cyctype { get; set; }

        [Column("CYCUNIT")]
        public string? Cycunit { get; set; }

        [Column("CYCLE")]
        public decimal? Cycle { get; set; }

        [Column("CYCEF")]
        public decimal? Cycef { get; set; }

        [Column("STDATE")]
        public DateTime? Stdate { get; set; }

        [Column("MEASURE")]
        public string? Measure { get; set; }

        [Column("MEASVALUE")]
        public decimal? Measvalue { get; set; }

        [Column("MIX")]
        public string? Mix { get; set; }

        [Column("TPLNR")]
        public string? Tplnr { get; set; }

        [Column("EQUNR")]
        public string? Equnr { get; set; }

        [Column("PLNNR")]
        public string? Plnnr { get; set; }

        [Column("INGRP")]
        public string? Ingrp { get; set; }

        [Column("ARBPL")]
        public string? Arbpl { get; set; }

        [Column("AUART")]
        public string? Auart { get; set; }
    }
} 