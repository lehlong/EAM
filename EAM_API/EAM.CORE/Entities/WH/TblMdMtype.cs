using EAM.CORE.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.CORE.Entities.WH
{
    [Table("EAM_MD_MTYPE")]
    public class TblMdMType : SoftDeleteEntity
    {

        [Key]
        [Column("CODE")]
        public string Code { get; set; } = null!;

        [Column("NAME")]
        public string? Name { get; set; }
    }
}
