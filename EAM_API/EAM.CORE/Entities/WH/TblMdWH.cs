using EAM.CORE.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.CORE.Entities.WH
{
    [Table("EAM_MD_WH")]
    public class TblMdWH : SoftDeleteEntity
    {
        [Key]
        [Column("WERK")]
        public string Werk { get; set; } = null!;

        [Column("IWERK")]
        public string Iwerk { get; set; } = null!;
        [Column("WERK_TXT")]
        public string? WerkTxt { get; set; }
    }
}
