using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.TRAN
{
    [Table("EAM_TRAN_ORDER_ATT")]
    public class TblTranOrderAtt : SoftDeleteEntity
    {
        [Key]
        [Column("ID")]
        public string Id { get; set; } = null!;
        [Column("AUFNR")]
        public string Aufnr { get; set; } = null!;

        [Column("FILETYPE")]
        public string? FileType { get; set; }

        [Column("FILESIZE")]
        public int? FileSize { get; set; }

        [Column("PATH")]
        public string? Path { get; set; }
    }
}
