using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class EquipDocDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Equnr { get; set; }
        public string Doctype { get; set; }
        public string Filetype { get; set; }
        public int? Filesize { get; set; }
        public string Path { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdEquipDoc, EquipDocDto>().ReverseMap();
        }
    }
} 