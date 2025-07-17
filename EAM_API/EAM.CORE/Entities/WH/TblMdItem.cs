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
    [Table("EAM_MD_ITEM")]
    public class TblMdItem : SoftDeleteEntity
    {
        [Key]
        [Column("MATNR")]
        public string Matnr { get; set; } = null!;
        [Column("MAKTX")]
        public string Maktx { get; set; }
        [Column("MTART")]
        public string Mtart { get; set; }
        [Column("MATKL")]
        public string Matkl { get; set; }
        [Column("BISMT")]
        public string Bismt { get; set; }

        [Column("MEINS")]
        public string Meins { get; set; }

        [Column("MFRNR")]
        public string? Mfrnr { get; set; }

        [Column("SLED_BBD")]
        public DateTime Sledbbd { get; set; }

        [Column("MODEL")]
        public string Model { get; set; }

        [Column("WAREHOUSE_CODE")]
        public string? WarehouseCode { get; set; }

        [Column("INVENTORY")]
        public int? Inventory { get; set; }


    }
}
