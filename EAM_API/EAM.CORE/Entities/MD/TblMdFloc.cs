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
        public string Tplnr { get; set; } = null!;

        [Column("IWERK")]
        public string? Iwerk { get; set; }

        [Column("INGRP")]
        public string? Ingrp { get; set; }

        [Column("DESCRIPT")]
        public string? Descript { get; set; }

        [Column("SUPFLOC")]
        public string? Supfloc { get; set; }

        [Column("ARBPL")]
        public string? Arbpl { get; set; }

        [Column("START_UPDATE")]
        public DateTime? StartUpdate { get; set; }

        [Column("TXT30")]
        public string? Txt30 { get; set; }
    }
}
