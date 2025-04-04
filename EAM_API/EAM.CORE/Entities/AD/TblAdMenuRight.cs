using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.CORE.Entities.AD
{
    [Table("EAM_AD_MENU_RIGHT")]
    public class TblAdMenuRight
    {
        public string MenuId { get; set; }

        [ForeignKey("MenuId")]
        public virtual TblAdMenu Menu { get; set; }

        public string RightId { get; set; }

        [ForeignKey("RightId")]
        public virtual TblAdRight Right { get; set; }
    }
}
