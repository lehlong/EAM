using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class ClassHDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Class { get; set; } = null!;
        public string? Klart { get; set; }
        public string? Statu { get; set; }
        public string? Klagr { get; set; }
        public string? Aname { get; set; }
        public DateTime? Adatu { get; set; }
        public string? Vname { get; set; }
        public DateTime? Vdatu { get; set; }
        public DateTime? Vondt { get; set; }
        public DateTime? Bisdt { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdClassH, ClassHDto>().ReverseMap();
        }
    }
} 