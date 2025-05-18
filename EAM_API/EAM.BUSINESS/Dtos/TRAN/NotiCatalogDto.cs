using AutoMapper;
using Common;
using EAM.CORE.Entities.TRAN;
using System;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.TRAN
{
    public class NotiCatalogDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Id { get; set; }
        public string Qmnum { get; set; }
        public string? Objpart { get; set; }
        public string? TypeCode { get; set; } 
        public string? TypeTxt { get; set; }
        public string? CauseCode { get; set; } 
        public string? CauseTxt { get; set; }
        public string? TaskCode { get; set; } 
        public string? TaskTxt { get; set; }
        public string? ActCode { get; set; } 
        public string? ActTxt { get; set; }
        public string? CreatBy { get; set; }
        public DateTime? CreateOn { get; set; }
        public string? ChangeBy { get; set; }
        public DateTime? ChangeOn { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblTranNotiCatalog, NotiCatalogDto>().ReverseMap();
        }
    }
} 