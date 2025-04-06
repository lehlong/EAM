using EAM.CORE.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_NOTI_TYPE")]
    public class TblMdNotiType : SoftDeleteEntity
    {
        [Key]
        [Column("CODE")]
        public string Code { get; set; }

        [Column("NAME")]
        public string Name { get; set; }
    }
}
