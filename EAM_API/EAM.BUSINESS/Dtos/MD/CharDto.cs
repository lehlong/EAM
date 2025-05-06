using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class CharDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Atnam { get; set; } = null!;
        public string? Atbez { get; set; }
        public string? Atfor { get; set; }
        public string? Aname { get; set; }
        public DateTime? Adatu { get; set; }
        public string? Vname { get; set; }
        public DateTime? Vdatu { get; set; }
        public DateTime? Vondt { get; set; }
        public DateTime? Bisdt { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdChar, CharDto>().ReverseMap();
        }
    }
} 