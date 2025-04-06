using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class NotiTypeDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdNotiType, NotiTypeDto>().ReverseMap();
        }
    }
}
