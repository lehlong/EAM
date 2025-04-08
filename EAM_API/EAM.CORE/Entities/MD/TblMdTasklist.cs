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
        [Column("PLNNR")]
        [MaxLength(4)]
        public string Plnnr { get; set; } = null!;

        [Column("IWERKS")]
        [MaxLength(4)]
        public string Iwerks { get; set; } = null!;

        [Column("KTEXT")]
        [MaxLength(200)]
        public string? Ktext { get; set; }

        [Column("VORNR")]
        [MaxLength(4)]
        public string? Vornr { get; set; }

        [Column("VORNR_SUB")]
        public int? VornrSub { get; set; }

        [Column("LTXA1")]
        [MaxLength(200)]
        public string? Ltxa1 { get; set; }

        [Column("DURATION")]
        public decimal? Duration { get; set; }

        [Column("TIME_UNIT")]
        [MaxLength(4)]
        public string? TimeUnit { get; set; }

    }
}
