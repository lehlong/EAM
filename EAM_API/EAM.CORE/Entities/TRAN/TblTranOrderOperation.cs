using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.TRAN
{
    [Table("EAM_TRAN_ORDER_OPERATION")]
    public class TblTranOrderOperation : SoftDeleteEntity
    {

        [Key]
        [Column("ID")]
        public string Id { get; set; }
        [Column("AUFNR")]
        public string? Aufnr { get; set; }

        [Column("VORNR")]
        public string? Vornr { get; set; } = null!;

        [Column("LTXA1")]
        public string? Ltxa1 { get; set; }

        [Column("ARBPL")]
        public string? Arbpl { get; set; }

        [Column("IS_CONFIRM")]
        public string? IsConfirm { get; set; }

        [Column("STATUS")]
        public string? Status { get; set; }

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
        [Column("IS_WORK")]
        public bool? IsWork { get; set; }

        [Column("INVENTORY")]
        public int? Inventory { get; set; }
    }
}
