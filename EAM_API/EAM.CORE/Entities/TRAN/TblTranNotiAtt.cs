using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.TRAN
{
    [Table("EAM_TRAN_NOTI_ATT")]
    public class TblTranNotiAtt : SoftDeleteEntity
    {
        [Key]
        [Column("ID")]
        public string Id { get; set; } = null!;
        [Column("QMNUM")]
        public string Qmnum { get; set; } = null!;

        [Column("FILETYPE")]
        public string? FileType { get; set; }

        [Column("FILESIZE")]
        public int? FileSize { get; set; }

        [Column("PATH")]
        public string? Path { get; set; }
    }
}
