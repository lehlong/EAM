﻿using Common;
namespace EAM.BUSINESS.Filter.MD
{
    public class AreaFilter : BaseFilter
    {
        public int? PartnerId { get; set; }
    }

    public class AreaGetAllFilter : BaseMdFilter
    {
        public int? PartnerId { get; set; }
    }
}
