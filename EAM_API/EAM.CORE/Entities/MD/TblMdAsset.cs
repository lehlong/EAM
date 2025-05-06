using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_ASSET")]
    public class TblMdAsset : SoftDeleteEntity
    {
        [Column("IWERK")]
        public string Iwerk { get; set; } = default!;

        [Key]
        [Column("ANLN1")]
        public string Anln1 { get; set; } = null!;

        [Column("ANLN2")]
        public string? Anln2 { get; set; }

        [Column("ANLKL")]
        public string? Anlkl { get; set; }

        [Column("ANLAR")]
        public string? Anlar { get; set; }

        [Column("ERNAM")]
        public string? Ernam { get; set; }

        [Column("ERDAT")]
        public DateTime? Erdat { get; set; }

        [Column("AENAM")]
        public string? Aenam { get; set; }

        [Column("AEDAT")]
        public DateTime? Aedat { get; set; }

        [Column("XLOEV")]
        public string? Xloev { get; set; }

        [Column("TXT50")]
        public string? Txt50 { get; set; }

        [Column("ANLTP")]
        public string? Anltp { get; set; }

        [Column("ZUJHR")]
        public string? Zujhr { get; set; }

        [Column("ZUPER")]
        public string? Zuper { get; set; }

        [Column("ZUGDT")]
        public DateTime? Zugdt { get; set; }

        [Column("AKTIV")]
        public DateTime? Aktiv { get; set; }

        [Column("ABGDT")]
        public DateTime? Abgdt { get; set; }

        [Column("DEAKT")]
        public DateTime? Deakt { get; set; }

        [Column("GPLAB")]
        public DateTime? Gplab { get; set; }

        [Column("BSTDT")]
        public DateTime? Bstdt { get; set; }

        [Column("ANLUE")]
        public string? Anlue { get; set; }

        [Column("LIEFE")]
        public string? Liefe { get; set; }

        [Column("HERST")]
        public string? Herst { get; set; }

        [Column("URJHR")]
        public string? Urjhr { get; set; }

        [Column("URWRT")]
        public decimal? Urwrt { get; set; }

        [Column("MEINS")]
        public string? Meins { get; set; }

        [Column("MENGE")]
        public decimal? Menge { get; set; }

        // IS_ACTIVE, CREATE_BY, etc. are inherited from SoftDeleteEntity
    }
}
