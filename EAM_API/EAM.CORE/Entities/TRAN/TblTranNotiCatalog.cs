using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.TRAN
{
    [Table("EAM_TRAN_NOTI_CATALOG")]
    public class TblTranNotiCatalog : SoftDeleteEntity
    {
        [Key]
        [Column("QMNUM")]
        [MaxLength(12)]
        public string Qmnum { get; set; } = null!;

        [Column("OBJPART")]
        [MaxLength(18)]
        public string Objpart { get; set; } = null!;

        [Column("TYPECODE")]
        [MaxLength(10)]
        public string TypeCode { get; set; } = null!;

        [Column("TYPETXT")]
        [MaxLength(50)]
        public string? TypeTxt { get; set; }

        [Column("CAUSECODE")]
        [MaxLength(10)]
        public string CauseCode { get; set; } = null!;

        [Column("CAUSETXT")]
        [MaxLength(50)]
        public string? CauseTxt { get; set; }

        [Column("TASKCODE")]
        [MaxLength(10)]
        public string TaskCode { get; set; } = null!;

        [Column("TASKTXT")]
        [MaxLength(50)]
        public string? TaskTxt { get; set; }

        [Column("ACTCODE")]
        [MaxLength(10)]
        public string ActCode { get; set; } = null!;

        [Column("ACTTXT")]
        [MaxLength(50)]
        public string? ActTxt { get; set; }

        [Column("CREATBY")]
        [MaxLength(12)]
        public string? CreatBy { get; set; }

        [Column("CREATEON")]
        public DateTime? CreateOn { get; set; }

        [Column("CHANGEBY")]
        [MaxLength(12)]
        public string? ChangeBy { get; set; }

        [Column("CHANGEON")]
        public DateTime? ChangeOn { get; set; }

    }
}
