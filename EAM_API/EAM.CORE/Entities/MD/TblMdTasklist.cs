using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_TASKLIST")]
    public class TblMdTasklist : SoftDeleteEntity
    {
        [Key]
        [Column("ID")]
        public string Id { get; set; } = null!;

        [Column("PLNNR")]
        public string? Plnnr { get; set; }

        [Column("IWERKS")]
        public string? Iwerks { get; set; }

        [Column("KTEXT")]
        public string? Ktext { get; set; }

        [Column("VORNR")]
        public string? Vornr { get; set; }

        [Column("VORNR_SUB")]
        public int? VornrSub { get; set; }

        [Column("LTXA1")]
        public string? Ltxa1 { get; set; }

        [Column("DURATION")]
        public decimal? Duration { get; set; }

        [Column("TIME_UNIT")]
        public string? TimeUnit { get; set; }
    }
}
