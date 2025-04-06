using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class WcDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Arbpl { get; set; }
        public string ArbplTxt { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdWc, WcDto>().ReverseMap();
        }
    }
}
