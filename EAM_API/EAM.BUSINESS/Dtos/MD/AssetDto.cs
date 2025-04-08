using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class AssetDto : BaseMdDto, IMapFrom, IDto
    {
        public string Iwerk { get; set; }
        
        [Key]
        public string Anln1 { get; set; }
        public string Anln2 { get; set; }
        public string Anlkl { get; set; }
        public string Anlar { get; set; }
        public string Ernam { get; set; }
        public DateTime? Erdat { get; set; }
        public string Aenam { get; set; }
        public DateTime? Aedat { get; set; }
        public string Xloev { get; set; }
        public string Txt50 { get; set; }
        public string Anltp { get; set; }
        public string Zujhr { get; set; }
        public string Zuper { get; set; }
        public DateTime? Zugdt { get; set; }
        public DateTime? Aktiv { get; set; }
        public DateTime? Abgdt { get; set; }
        public DateTime? Deakt { get; set; }
        public DateTime? Gplab { get; set; }
        public DateTime? Bstdt { get; set; }
        public string Anlue { get; set; }
        public string Liefe { get; set; }
        public string Herst { get; set; }
        public string Urjhr { get; set; }
        public decimal? Urwrt { get; set; }
        public string Meins { get; set; }
        public decimal? Menge { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdAsset, AssetDto>().ReverseMap();
        }
    }
} 