using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace EAM.BUSINESS.Dtos.MD
{
    public class EqCounterDto : BaseMdDto, IDto, IMapFrom
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã điểm đo")]
        public string Point { get; set; } = null!;
        [Description("Mã thiết bị")]
        public string Equnr { get; set; } = null!;
        [Description("Tên điểm đo")]
        public string? Pttxt { get; set; }
        [Description("Loại điểm đo")]
        public string? Mptyp { get; set; }
        [Description("Đơn vị đo")]
        public string? Dvt { get; set; }
        [Description("Giá trị đo max của điểm đếm")]
        public decimal? MaxCount { get; set; }
        [Description("Tổng chỉ số ước tính trên năm")]
        public decimal? YearCount { get; set; }
        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdEqCounter, EqCounterDto>().ReverseMap();
        }
    }
}
