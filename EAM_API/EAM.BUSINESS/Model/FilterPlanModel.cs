using Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.BUSINESS.Model
{
    public class FilterPlanModel : BaseFilter
    {
        public DateTime? SchStart { get; set; }
        public string? Arbpl { get; set; }
        public string? Eqart { get; set; }
        public string? Tplnr { get; set; }
        public string? Equnr { get; set; }
        public string? Warpl { get; set; }
        public string? Mpgrp { get; set; }
    }
}
