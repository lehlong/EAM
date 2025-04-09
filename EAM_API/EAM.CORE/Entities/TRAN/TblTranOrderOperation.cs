using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.TRAN
{
    [Table("EAM_TRAN_ORDER_OPERATION")]
    public class TblTranOrderOperation : SoftDeleteEntity
    {
        [Column("AUFNR")]
        [MaxLength(12)]
        public string? Aufnr { get; set; }

        [Key]
        [Column("VORNR")]
        [MaxLength(4)]
        public string? Vornr { get; set; }

        [Column("LTXA1")]
        [MaxLength(60)]
        public string? Ltxa1 { get; set; }

        [Column("ARBPL")]
        [MaxLength(8)]
        public string? Arbpl { get; set; }

        [Column("DATE_CF")]
        public DateTime? DateCf { get; set; }

        [Column("DATE_CF_TIME")]
        public TimeSpan? DateCfTime { get; set; }

        [Column("DATE_CT")]
        public DateTime? DateCt { get; set; }

        [Column("DATE_CT_TIME")]
        public TimeSpan? DateCtTime { get; set; }

        [Column("NOTE")]
        [MaxLength(255)]
        public string? Note { get; set; }

        [Column("NDXN")]
        [MaxLength(255)]
        public string? Ndxn { get; set; }

        [Column("STAFF_TH")]
        [MaxLength(10)]
        public string? StaffTh { get; set; }

        [Column("STAFF_SD")]
        [MaxLength(10)]
        public string? StaffSd { get; set; }

    }
}
