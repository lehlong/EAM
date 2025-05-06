using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_CLASS_D")]
    public class TblMdClassD : SoftDeleteEntity
    {
        [Key]
        [Column("CLASS")]
        public string Class { get; set; } = null!;

        [Column("ATNAM")]
        public string? Atnam { get; set; }

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

        // IS_ACTIVE, CREATE_BY, UPDATE_BY, etc. được kế thừa từ SoftDeleteEntity
    }
}
