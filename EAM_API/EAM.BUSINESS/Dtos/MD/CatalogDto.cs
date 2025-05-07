using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class CatalogDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Id { get; set; } 
        public string? CatCode { get; set; } 
        public string? CatName { get; set; }
        public string? CatType { get; set; }
        public string? Code { get; set; }
        public string? CodeDes { get; set; }
        public string? Status { get; set; }
        public DateTime? Adatu { get; set; }
        public string? Vname { get; set; }
        public DateTime? Vdatu { get; set; }
        public DateTime? Vondt { get; set; }
        public DateTime? Bisdt { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdCatalog, CatalogDto>().ReverseMap();
        }
    }
} 