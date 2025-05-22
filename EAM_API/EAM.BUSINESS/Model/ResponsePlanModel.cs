using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.BUSINESS.Model
{
    public class ResponsePlanModel
    {
        public string? Arbpl { get; set; }
        public string? Tplnr { get; set; }
        public string? Warpl { get; set; }
        public string? Name { get; set; }
        public string? Aufnr { get; set; }
        public DateTime? SchStart { get; set; }
        public bool? IsComplete { get; set; }
    }
}
