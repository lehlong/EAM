using EAM.CORE.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.CORE.Entities.AD
{
    [Table("EAM_AD_CONFIG_TEMPLATE")]
    public class TblAdConfigTemplate : SoftDeleteEntity
    {
        [Key]
        [Column("CODE", TypeName = "VARCHAR(50)")]
        public string? Code { get; set; }

        [Column("NAME", TypeName = "NVARCHAR(255)")]
        public string Name { get; set; }

        [Column("HTML_SOURCE", TypeName = "NVARCHAR(2550)")]
        public string? HtmlSource { get; set; }

        [Column("TITLE", TypeName = "NVARCHAR(550)")]
        public string? Title { get; set; }

        [Column("TYPE", TypeName = "VARCHAR(255)")]
        public string? Type { get; set; }

    }
}
