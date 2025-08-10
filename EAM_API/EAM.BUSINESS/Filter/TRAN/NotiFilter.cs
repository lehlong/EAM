using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.BUSINESS.Filter.TRAN
{
    public class NotiFilter : BaseFilter
    {
        public string? Equnr { get; set; }
        public string? Tplnr { get; set; }
        public string? Eqart { get; set; }
        public string? Ingrp { get; set; }
        public string? StatAct { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

    }
}
