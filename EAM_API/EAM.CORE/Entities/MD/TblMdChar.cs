using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_CHAR")]
    public class TblMdChar : SoftDeleteEntity
    {
        [Key]
        [Column("ATNAM")]
        public string Atnam { get; set; } = null!;

        [Column("ATBEZ")]
        public string? Atbez { get; set; }

        [Column("ATFOR")]
        public string? Atfor { get; set; }

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

        // Các trường IS_ACTIVE, CREATE_BY, UPDATE_BY, CREATE_DATE, UPDATE_DATE,
        // IS_DELETED, DELETE_DATE, DELETE_BY được kế thừa từ SoftDeleteEntity
    }
}
