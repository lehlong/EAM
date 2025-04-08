using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_FLOC")]
    public class TblMdFloc : SoftDeleteEntity
    {
        [Key]
        [Column("TPLNR")]
        [MaxLength(30)]
        public string Tplnr { get; set; } = null!;

        [Column("IWERK")]
        [MaxLength(4)]
        public string? Iwerk { get; set; }

        [Column("INGRP")]
        [MaxLength(3)]
        public string? Ingrp { get; set; }

        [Column("DESCRIPT")]
        [MaxLength(50)]
        public string? Descript { get; set; }

        [Column("SUPFLOC")]
        [MaxLength(30)]
        public string? Supfloc { get; set; }

        [Column("ARBPL")]
        [MaxLength(8)]
        public string? Arbpl { get; set; }

        [Column("START_UPDATE")]
        public DateTime? StartUpdate { get; set; }

        [Column("TXT30")]
        [MaxLength(30)]
        public string? Txt30 { get; set; }

    }
}
