using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class EqGroupDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Eqart { get; set; } = null!;
        public string? EqartTxt { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdEqGroup, EqGroupDto>().ReverseMap();
        }
    }
}
