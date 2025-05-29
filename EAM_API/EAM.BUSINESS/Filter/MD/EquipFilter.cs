using Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.BUSINESS.Filter.MD
{
    public class EquipFilter : BaseFilter
    {
        public string? Equnr { get; set; }
        public string? Tplnr { get; set; }    
        public string? Eqart { get; set; }
        public string? StatAct { get; set; }
        public string? StatusTh { get; set; }
        public string? Eqtyp { get; set; }
        public string? Arbpl { get; set; }
        public string? Iwerk { get; set; }
        //public string? EqartSub { get; set; }   
        //public string? DepartmentCode { get; set; } 
        //public string? UserCode { get; set; }     
        //public string? UsageStatus { get; set; }
    }
    
}
