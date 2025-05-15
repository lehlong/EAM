using EAM.CORE.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.CORE.Entities.TRAN
{
    [Table("EAM_TRAN_NOTI_REPORT")]
    public class TblTranNotiReport : SoftDeleteEntity
    {
        [Key]
        [Column("ID")]
        public string Id { get; set; } = null!;
        [Column("QMNUM")]
        public string Qmnum { get; set; } = null!;
        [Column("REPORT_TYPE")]
        public string RpType { get; set; }
        [Column("REPORT_DATE")]
        public DateTime RpDate { get; set; }
        [Column("REPORT_TIME")]
        public DateTime RpTime { get; set; }
        [Column("MG_UNIT")]
        public string MgUnit { get; set; }
        [Column("UNIT_1")]
        public string Unit1 { get; set; }
        [Column("UNIT_2")]
        public string Unit2 { get; set; }
        [Column("MG_ROLE")]
        public string MgRole { get; set; }
        [Column("UNIT_1_ROLE")]
        public string Unit1R { get; set; }
        [Column("UNIT_2_ROLE")]
        public string Unit2R { get; set; }
        [Column("CONTENT")]
        public string Content { get; set; }
        [Column("OUTPUT")]
        public string Output { get; set; }
    }
   
}
