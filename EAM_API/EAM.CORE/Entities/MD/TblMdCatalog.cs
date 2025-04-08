using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_CATALOG")]
    public class TblMdCatalog : SoftDeleteEntity
    {
        [Key]
        [Column("CATCODE")]
        [MaxLength(8)]
        public string? CatCode { get; set; }

        [Column("CATNAME")]
        [MaxLength(40)]
        public string? CatName { get; set; }

        [Column("CATTYPE")]
        [MaxLength(1)]
        public string? CatType { get; set; }

        [Column("CODE")]
        [MaxLength(8)]
        public string? Code { get; set; }

        [Column("CODE_DES")]
        [MaxLength(40)]
        public string? CodeDes { get; set; }

        [Column("STATUS")]
        [MaxLength(10)]
        public string? Status { get; set; }

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
