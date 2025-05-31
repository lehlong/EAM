using EAM.CORE.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_EQ_COUNTER")]
    public class TblMdEqCounter : SoftDeleteEntity
    {
        [Key]
        [Column("POINT")]
        public string Point { get; set; } = null!;
        [Column("EQUNR")]
        public string Equnr { get; set; }
        [Column("PTTXT")]
        public string? Pttxt { get; set; }
        [Column("MPTYP")]
        public string? Mptyp { get; set; }
        [Column("DVT")]
        public string? Dvt { get; set; }
        [Column("MAXCOUNT")]
        public decimal? MaxCount { get; set; }
        [Column("YEARCOUNT")]
        public decimal? YearCount { get; set; }

    }
}
