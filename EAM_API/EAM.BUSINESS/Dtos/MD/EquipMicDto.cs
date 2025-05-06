using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class EquipMicDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Equnr { get; set; } = null!;
        public string? Class { get; set; }
        public string? Mic { get; set; }
        public string? MicName { get; set; }
        public decimal? StValue { get; set; }
        public decimal? LoValue { get; set; }
        public decimal? HiValue { get; set; }
        public string? ValueDt { get; set; }
        public DateTime? Adatu { get; set; }
        public string? Vname { get; set; }
        public DateTime? Vdatu { get; set; }
        public DateTime? Vondt { get; set; }
        public DateTime? Bisdt { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdEquipMic, EquipMicDto>().ReverseMap();
        }
    }
} 