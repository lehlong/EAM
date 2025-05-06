using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_CLASS_H")]
    public class TblMdClassH : SoftDeleteEntity
    {
        [Key]
        [Column("CLASS")]
        public string Class { get; set; } = null!;

        [Column("KLART")]
        public string? Klart { get; set; }

        [Column("CLASS_TEXT")]
        public string? ClassTxt { get; set; }

        [Column("STATU")]
        public string? Statu { get; set; }

        [Column("KLAGR")]
        public string? Klagr { get; set; }

        [Column("ANAME")]
        public string? Aname { get; set; }

        [Column("ADATU")]
        public DateTime? Adatu { get; set; }

        [Column("VNAME")]
        public string? Vname { get; set; }

        [Column("VDATU")]
        public DateTime? Vdatu { get; set; }

        [Column("VONDT")]
        public DateTime? Vondt { get; set; }

        [Column("BISDT")]
        public DateTime? Bisdt { get; set; }
    }
}
