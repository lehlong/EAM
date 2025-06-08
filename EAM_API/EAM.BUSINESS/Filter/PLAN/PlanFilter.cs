using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.BUSINESS.Filter.PLAN
{
    public class PlanFilter : BaseFilter
    {
        public int? SchStart { get; set; }
        public string? Arbpl {  get; set; }
        public string? Eqart {  get; set; }
        public string? Tplnr { get; set; }
        public string?  Mtgrp { get; set; }
        public string? Ingrp { get; set; }
    }
}
