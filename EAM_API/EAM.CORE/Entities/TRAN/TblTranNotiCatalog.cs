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
        public string Qmnum { get; set; } = null!;

        [Column("OBJPART")]
        public string? Objpart { get; set; }

        [Column("TYPECODE")]
        public string? TypeCode { get; set; }

        [Column("TYPETXT")]
        public string? TypeTxt { get; set; }

        [Column("CAUSECODE")]
        public string? CauseCode { get; set; }

        [Column("CAUSETXT")]
        public string? CauseTxt { get; set; }

        [Column("TASKCODE")]
        public string? TaskCode { get; set; }

        [Column("TASKTXT")]
        public string? TaskTxt { get; set; }

        [Column("ACTCODE")]
        public string? ActCode { get; set; }

        [Column("ACTTXT")]
        public string? ActTxt { get; set; }

        [Column("CREATBY")]
        public string? CreatBy { get; set; }

        [Column("CREATEON")]
        public DateTime? CreateOn { get; set; }

        [Column("CHANGEBY")]
        public string? ChangeBy { get; set; }

        [Column("CHANGEON")]
        public DateTime? ChangeOn { get; set; }
    }
}
