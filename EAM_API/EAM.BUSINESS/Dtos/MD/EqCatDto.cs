using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class EqCatDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Eqtyp { get; set; } = null!;
        public string? EqtypTxt { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdEqCat, EqCatDto>().ReverseMap();
        }
    }
}
