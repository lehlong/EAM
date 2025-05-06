using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.BUSINESS.Dtos.MD
{
    public class FlocDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Tplnr { get; set; }
        public string Iwerk { get; set; }
        public string? Ingrp { get; set; }
        public string? Descript { get; set; }
        public string? Supfloc { get; set; }
        public string? Arbpl { get; set; }
        public DateTime StartUpdate { get; set; }
        public string? Txt30 { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdFloc, FlocDto>().ReverseMap();
        }
    }
}
