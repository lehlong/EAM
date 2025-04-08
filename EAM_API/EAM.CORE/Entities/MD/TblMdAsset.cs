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
        [MaxLength(4)]
        public string Iwerk { get; set; } = default!; // Unchecked = NOT NULL

        [Key]
        [Column("ANLN1")]
        [MaxLength(12)]
        public string? Anln1 { get; set; }

        [Column("ANLN2")]
        [MaxLength(4)]
        public string? Anln2 { get; set; }

        [Column("ANLKL")]
        [MaxLength(8)]
        public string? Anlkl { get; set; }

        [Column("ANLAR")]
        [MaxLength(5)]
        public string? Anlar { get; set; }

        [Column("ERNAM")]
        [MaxLength(12)]
        public string? Ernam { get; set; }

        [Column("ERDAT")]
        public DateTime? Erdat { get; set; }

        [Column("AENAM")]
        [MaxLength(12)]
        public string? Aenam { get; set; }

        [Column("AEDAT")]
        public DateTime? Aedat { get; set; }

        [Column("XLOEV")]
        [MaxLength(1)]
        public string? Xloev { get; set; }

        [Column("TXT50")]
        [MaxLength(100)]
        public string? Txt50 { get; set; }

        [Column("ANLTP")]
        [MaxLength(1)]
        public string? Anltp { get; set; }

        [Column("ZUJHR")]
        [MaxLength(4)]
        public string? Zujhr { get; set; }

        [Column("ZUPER")]
        [MaxLength(3)]
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
        [MaxLength(12)]
        public string? Anlue { get; set; }

        [Column("LIEFE")]
        [MaxLength(30)]
        public string? Liefe { get; set; }

        [Column("HERST")]
        [MaxLength(30)]
        public string? Herst { get; set; }

        [Column("URJHR")]
        [MaxLength(4)]
        public string? Urjhr { get; set; }

        [Column("URWRT", TypeName = "decimal(23,2)")]
        public decimal? Urwrt { get; set; }

        [Column("MEINS")]
        [MaxLength(3)]
        public string? Meins { get; set; }

        [Column("MENGE", TypeName = "decimal(13,2)")]
        public decimal? Menge { get; set; }

        // IS_ACTIVE, CREATE_BY, etc. are inherited from SoftDeleteEntity
    }
}
