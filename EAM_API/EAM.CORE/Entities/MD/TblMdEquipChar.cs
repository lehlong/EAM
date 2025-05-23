using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_EQUIP_CHAR")]
    public class TblMdEquipChar : SoftDeleteEntity
    {
        [Key]
        [Column("ID")]
        public string Id { get; set; }
        [Column("EQUNR")]
        public string? Equnr { get; set; }
        [Column("MANUF")]
        public string? Manuf { get; set; }
        [Column("COO")]
        public string? Coo { get; set; }
        [Column("YOM")]
        public string? Yom { get; set; }
        [Column("MODL")]
        public string? Modl { get; set; }
        [Column("SERL")]
        public string? Serl { get; set; }
        [Column("USED")]
        public string? Used { get; set; }
        [Column("CLASS")]
        public string? Class { get; set; }

        [Column("ATNAM")]
        public string? Atnam { get; set; }

        [Column("VALUE")]
        public string? Value { get; set; }

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
