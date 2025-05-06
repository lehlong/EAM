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
    [Table("EAM_MD_WC")]
    public class TblMdWc : SoftDeleteEntity
    {
        [Key]
        [Column("ARBPL")]
        public string Arbpl { get; set; } = null!;

        [Column("ARBPL_TXT")]
        public string? ArbplTxt { get; set; }
        
        [Column("IWERK")]
        public string? Iwerk { get; set; }
    }
}
