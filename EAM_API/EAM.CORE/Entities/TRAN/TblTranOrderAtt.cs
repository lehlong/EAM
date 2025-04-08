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
        [Column("AUFNR")]
        [MaxLength(255)]
        public string Aufnr { get; set; } = null!;

        [Column("FILETYPE")]
        [MaxLength(255)]
        public string? FileType { get; set; }

        [Column("FILESIZE")]
        public int? FileSize { get; set; }

        [Column("PATH")]
        [MaxLength(255)]
        public string? Path { get; set; }

    }
}
