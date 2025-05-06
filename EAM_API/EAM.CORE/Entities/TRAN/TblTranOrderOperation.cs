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
        public string? Aufnr { get; set; }

        [Key]
        [Column("VORNR")]
        public string Vornr { get; set; } = null!;

        [Column("LTXA1")]
        public string? Ltxa1 { get; set; }

        [Column("ARBPL")]
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
        public string? Note { get; set; }

        [Column("NDXN")]
        public string? Ndxn { get; set; }

        [Column("STAFF_TH")]
        public string? StaffTh { get; set; }

        [Column("STAFF_SD")]
        public string? StaffSd { get; set; }
    }
}
