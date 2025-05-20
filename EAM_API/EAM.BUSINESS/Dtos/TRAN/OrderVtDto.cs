using AutoMapper;
using Common;
using EAM.CORE.Entities.TRAN;
using System;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.TRAN
{
    public class OrderVtDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string? Id { get; set; }
        public string? Aufnr { get; set; }
        public string? Category { get; set; }
        public string? Matnr { get; set; }
        public string? Maktx { get; set; }
        public string? Werks { get; set; }
        public DateTime? Budat { get; set; }
        public decimal? Menge { get; set; }
        public string? Meins { get; set; }
        public string? Category2 { get; set; }
        public string? Lgort { get; set; }
        public string? Charg { get; set; }
        public decimal? Price { get; set; }
        public decimal? Dmbtr { get; set; }
        public string? Waers { get; set; }
        public string? Uname { get; set; }
        public DateTime? Udat { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblTranOrderVt, OrderVtDto>().ReverseMap();
        }
    }
} 