using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_EQUIP_PIC")]
    public class TblMdEquipPic : SoftDeleteEntity
    {
        [Key]
        [Column("EQUNR")]
        public string Equnr { get; set; } = null!;

        [Column("FILETYPE")]
        public string? Filetype { get; set; }

        [Column("FILESIZE")]
        public int? Filesize { get; set; }

        [Column("PATH")]
        public string? Path { get; set; }
    }
}
