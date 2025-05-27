using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.BUSINESS.Model
{
    public class DashboardModel
    {
        public List<Dashboard> ChartDonut { get; set; } = new List<Dashboard>();
        public List<Dashboard> ChartBar { get; set; } = new List<Dashboard>();
        public int Order1 { get; set; }
        public int Order2 { get; set; }
        public int Order3 { get; set; }
        public int Order4 { get; set; }
        public int Noti1 { get; set; }
        public int Noti2 { get; set; }
        public int Noti3 { get; set; }
        public int Noti4 { get; set; }
    }

    public class Dashboard
    {
        public string Name { get; set; }
        public int Value { get; set; }
    }
}
