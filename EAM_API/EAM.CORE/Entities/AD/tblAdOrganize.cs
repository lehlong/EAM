﻿using EAM.CORE.Common;
using EAM.CORE.Entities.MD;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.CORE.Entities.AD
{
    [Table("EAM_AD_ORGANIZE")]
    public class tblAdOrganize : SoftDeleteEntity
    {
        [Key]
        [Column(TypeName = "VARCHAR(50)")]
        public string Id { get; set; }

        [Column(TypeName = "NVARCHAR(50)")]
        public string Name { get; set; }

        [Column(TypeName = "VARCHAR(50)")]
        public string? PId { get; set; }

        [Column("ORDER_NUMBER")]
        public int? OrderNumber { get; set; }
    }
}
