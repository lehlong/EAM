using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class PlantDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Iwerk { get; set; } = null!;
        public string? IwerkTxt { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdPlant, PlantDto>().ReverseMap();
        }
    }
}
