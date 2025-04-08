using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_EQUIP_DOC")]
    public class TblMdEquipDoc : SoftDeleteEntity
    {
        [Key]
        [Column("EQUNR")]
        [MaxLength(18)]
        public string? Equnr { get; set; }

        [Column("DOCTYPE")]
        [MaxLength(30)]
        public string? Doctype { get; set; }

        [Column("FILETYPE")]
        [MaxLength(4)]
        public string? Filetype { get; set; }

        [Column("FILESIZE")]
        public int? Filesize { get; set; }

        [Column("PATH")]
        [MaxLength(200)]
        public string? Path { get; set; }

    }
}
