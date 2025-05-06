using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_EQ_GROUP")]
    public class TblMdEqGroup : SoftDeleteEntity
    {
        [Key]
        [Column("EQART")]
        public string Eqart { get; set; } = null!;

        [Column("EQART_TXT")]
        public string? EqartTxt { get; set; }
    }
}
