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
        [Column("ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        [Column("EQUNR")]
        public string Equnr { get; set; } = null!;

        [Column("DOCTYPE")]
        public string? Doctype { get; set; }

        [Column("FILETYPE")]
        public string? Filetype { get; set; }

        [Column("FILESIZE")]
        public int? Filesize { get; set; }

        [Column("PATH")]
        public string? Path { get; set; }
    }
}
