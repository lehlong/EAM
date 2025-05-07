using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class EquipPicDto : BaseMdTemDto, IMapFrom, IDto
    {
        [Key]
        public string Id { get; set; }
        public string Equnr { get; set; } = null!;
        public string? Filetype { get; set; }
        public string? Filename { get; set; }
        public int? Filesize { get; set; }
        public string? Path { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdEquipPic, EquipPicDto>().ReverseMap();
        }
    }
} 