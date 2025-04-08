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
        [MaxLength(18)]
        public string? Class { get; set; }

        [Column("KLART")]
        [MaxLength(3)]
        public string? Klart { get; set; }

        [Column("STATU")]
        [MaxLength(1)]
        public string? Statu { get; set; }

        [Column("KLAGR")]
        [MaxLength(10)]
        public string? Klagr { get; set; }

        [Column("ANAME")]
        [MaxLength(12)]
        public string? Aname { get; set; }

        [Column("ADATU")]
        public DateTime? Adatu { get; set; }

        [Column("VNAME")]
        [MaxLength(12)]
        public string? Vname { get; set; }

        [Column("VDATU")]
        public DateTime? Vdatu { get; set; }

        [Column("VONDT")]
        public DateTime? Vondt { get; set; }

        [Column("BISDT")]
        public DateTime? Bisdt { get; set; }

    }
}
