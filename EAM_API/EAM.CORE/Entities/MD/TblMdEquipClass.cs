using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_EQUIP_CLASS")]
    public class TblMdEquipClass : SoftDeleteEntity
    {
        [Key]
        [Column("ID")]
        public string Id { get; set; }

        [Column("EQUNR")]
        public string? Equnr { get; set; }

        [Column("CLASS_H")]
        public string? ClassH { get; set; }
        [Column("CLASS_D")]
        public string? ClassD { get; set; }

        [Column("VALUE")]
        public string? Value { get; set; }

        [Column("NOTE")]
        public string? Note { get; set; }

    }
}
