using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.PLAN
{
    [Table("EAM_PLAN_ORDER")]
    public class TblPlanOrder : SoftDeleteEntity
    {
        [Key]
        [Column("ID")]
        public string Id { get; set; }

        [Column("IWERK")]
        public string? Iwerk { get; set; }
        [Column("NAME")]
        public string? Name { get; set; }

        [Column("WARPL")]
        public string? Warpl { get; set; }

        [Column("EQUNR")]
        public string? Equnr { get; set; }
        [Column("PLNNR")]
        public string? Plnnr { get; set; }

        [Column("TPLNR")]
        public string? Tplnr { get; set; }

        [Column("CYCTYPE")]
        public string? Cyctype { get; set; }

        [Column("CYCUNIT")]
        public string? Cycunit { get; set; }

        [Column("CYCLE")]
        public int? Cycle { get; set; }

        [Column("MEASURE")]
        public string? Measure { get; set; }

        [Column("MEASVALUE")]
        public decimal? Measvalue { get; set; }
        [Column("READING")]
        public decimal? Reading { get; set; }

        [Column("AUFNR")]
        public string? Aufnr { get; set; }

        [Column("SCHSTART")]
        public DateTime? Schstart { get; set; }

        [Column("SCHEND")]
        public DateTime? Schend { get; set; }

        [Column("ISCOMPLED")]
        public bool? Iscompled { get; set; }
    }
} 